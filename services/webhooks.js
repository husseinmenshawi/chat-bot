const axios = require("axios");
const moment = require("moment");

const { config } = require("../config/index");
const { facebookGraphBaseUrl, pageId, pageToken, initialBotGreetings } = config;
const { acceptedCommandsObject } = require("../constants/webhooks");

const { fetchProductsByParams } = require("./products");
const { sendEmail } = require("./email");

async function handleChatBotGreeting({ payload }) {
  const isValidated = _validateWebhookPayload(payload);
  if (!isValidated) {
    return;
  }

  const senderId = payload.entry[0].messaging[0].sender.id;
  const { id: conversationId } = await fetchConversation({
    senderId,
  });

  const messages = await fetchMessagesByConversationId(conversationId);
  if (messages && messages.length == 0) {
    console.log(`Conversation ${conversationId} has no messages`);
    return;
  }

  const sendOutAutoGreeting = _autoGreetingEligibility({ messages });
  if (!sendOutAutoGreeting) {
    console.log(`sendOutAutoGreeting is ${sendOutAutoGreeting}`);
    return false;
  }

  const randomIndex = Math.floor(Math.random() * initialBotGreetings.length);
  const targetGreeting = initialBotGreetings[randomIndex];
  const instructionMessage = `You are able to search our products by using one of the following commands followed by a product SKU:
  '/desc' - description of a product,
  '/price' - price of the product,
  '/shipping' - shipping fee when delivering a product,
  '/buy - buy a product'.
  Example - /desc 347333`;

  await sendMessageByChatBot({
    recipientId: senderId,
    message: targetGreeting,
  });
  await sendMessageByChatBot({
    recipientId: senderId,
    message: instructionMessage,
  });

  return true;
}

async function fetchConversation({ senderId }) {
  try {
    const url = `${facebookGraphBaseUrl}/${pageId}/conversations?fields=participants&access_token=${pageToken}&user_id=${senderId}`;
    const response = await axios.get(url);
    return response.data.data[0];
  } catch (error) {
    console.error("Fetch conversation API failure", error);
    throw error;
  }
}

async function fetchMessagesByConversationId(conversationId) {
  try {
    const url = `${facebookGraphBaseUrl}/${conversationId}?fields=messages{message},updated_time&access_token=${pageToken}`;
    const response = await axios.get(url);
    return response.data.messages.data;
  } catch (error) {
    console.error("Fetch conversation API failure", error);
    throw error;
  }
}

async function sendMessageByChatBot({ recipientId, message }) {
  try {
    const url = `${facebookGraphBaseUrl}/${pageId}/messages?recipient={id:${recipientId}}&message={text:"${message}"}&messaging_type=RESPONSE&access_token=${pageToken}`;
    const response = await axios.post(url);
    return response;
  } catch (error) {
    console.error("Fetch conversation API failure", error);
    throw error;
  }
}

async function handleChatBotCommands({ payload }) {
  const isValidated = _validateWebhookPayload(payload);
  if (!isValidated) {
    return;
  }

  const senderId = payload.entry[0].messaging[0].sender.id;
  const message = payload.entry[0].messaging[0].message.text;
  const words = message.split(" ");
  const acceptedCommands = acceptedCommandsObject.map((obj) => obj.command);
  const targetCommandIndex = _findAcceptedCommand(words, acceptedCommands);

  let chatBotResponse;
  if (targetCommandIndex === -1) {
    console.log("No accepted command found");
    chatBotResponse = `I don't quite understand what you're looking for.`;
    await sendMessageByChatBot({
      recipientId: senderId,
      message: chatBotResponse,
    });
    return false;
  }

  const targetCommand = words[targetCommandIndex];
  const targetColumnObject = acceptedCommandsObject.find((obj) => {
    return obj.command === targetCommand;
  });
  // Assuming following word is product SKU/ID
  const productSKU = words[targetCommandIndex + 1];

  if (isNaN(productSKU)) {
    console.log(`${productSKU} is not a number`);
    chatBotResponse = `Opps! sorry, but I couldn't find the product you're looking for.`;
    await sendMessageByChatBot({
      recipientId: senderId,
      message: chatBotResponse,
    });
    return false;
  }

  const params = {
    sku: Number(productSKU),
  };
  const targetProduct = await fetchProductsByParams(params);

  if (!targetProduct || targetProduct.length == 0) {
    console.log(`Product (${productSKU}) not found`);
    chatBotResponse = `Opps! sorry, but I couldn't find the product you're looking for.`;
    await sendMessageByChatBot({
      recipientId: senderId,
      message: chatBotResponse,
    });

    return false;
  }

  if (targetCommand == "/buy") {
    const { sku, name, price, description, shipping, model } = targetProduct[0];
    const recipients = [config.productPurchaseEmailRecipient];
    const subject = "Product Purchase";
    const emailBody = `
    <p>Dear Business Owner,</p>

    <p>The following product was purchased by a customer:</p>
    <p>SKU: ${sku}</p>
    <p>Name: ${name}</p>
    <p>Description: ${description}</p>
    <p>Model: ${model}</p>
    <p>Price: ${price}</p>
    <p>Shipping Fee: ${shipping}</p>

    <p>Regards,</p>
    <p>Respond.io chatBot v1.0</p>
    `;
    sendEmail({ recipients, subject, html: emailBody });

    chatBotResponse =
      "We have notified the business owner regarding your purchase!";
    await sendMessageByChatBot({
      recipientId: senderId,
      message: chatBotResponse,
    });
  } else {
    chatBotResponse = targetProduct[0][targetColumnObject.column];
    await sendMessageByChatBot({
      recipientId: senderId,
      message: chatBotResponse,
    });
  }

  return true;
}

function _validateWebhookPayload(payload) {
  let isValidated = false;
  // Only handle message webhooks (exluding message read event)
  if (
    payload.entry &&
    payload.entry.length > 0 &&
    payload.entry[0].messaging &&
    payload.entry[0].messaging.length > 0 &&
    payload.entry[0].messaging[0].message
  ) {
    isValidated = true;
  }

  // Ignore echo messages
  if (
    payload.entry &&
    payload.entry.length > 0 &&
    payload.entry[0].messaging &&
    payload.entry[0].messaging.length > 0 &&
    payload.entry[0].messaging[0].message &&
    payload.entry[0].messaging[0].message.is_echo
  ) {
    isValidated = false;
  }

  return isValidated;
}

// greetingFrequencyInHours defaulted to -1 which will only send greeting on first ever message
function _autoGreetingEligibility({ messages, greetingFrequencyInHours = -1 }) {
  let sendOutAutoGreeting = false;
  if (messages.length == 1) {
    sendOutAutoGreeting = true;
  } else if (messages.length > 1 && greetingFrequencyInHours != -1) {
    // Fetching index 1 because last message was already sent before this function is hit.
    const lastMessageSentId = messages[1].id;
    // TODO: Get created_time of message from /<message_id> API and check if greetingFrequencyInHours has passed
  }
  return sendOutAutoGreeting;
}

function _findAcceptedCommand(words, acceptedCommands) {
  let i = 0;
  let targetCommandIndex = -1;
  while (i < words.length) {
    const word = words[i];
    const isAcceptedCommand = acceptedCommands.includes(word);
    if (!isAcceptedCommand) {
      i++;
      continue;
    } else {
      targetCommandIndex = i;
      break;
    }
  }

  return targetCommandIndex;
}

module.exports = {
  handleChatBotGreeting,
  fetchConversation,
  sendMessageByChatBot,
  handleChatBotCommands,
};
