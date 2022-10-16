require("dotenv").config();
const {
  fetchConversation,
  sendMessageByChatBot,
  handleChatBotCommands,
} = require("../services/webhooks");

beforeEach(() => {
  jest.setTimeout(60000);
});

test("Fetch conversation by sender id", async () => {
  const response = await fetchConversation({ senderId: "4430820363709737" });
  expect(response).toBeTruthy();
});

test("Send an initial greeting by chat bot", async () => {
  const response = await sendMessageByChatBot({
    recipientId: "4430820363709737",
  });
  expect(response).toBeTruthy();
});

test("Handle chat bot commands (Successfuly Scenario #1)", async () => {
  const payload = {
    object: "page",
    entry: [
      {
        id: "217136822308193",
        time: 1665910382177,
        messaging: [
          {
            sender: { id: "4430820363709737" },
            recipient: { id: "217136822308193" },
            timestamp: 1665910381944,
            message: {
              mid: "m_BwdRiZhTUOSwQ0QHxY46_o9Gt8u78L8RDTuBjFmBftQPIdpitFHnqWeZRzAuuxeYi3LgsXJG0ltB5bJZe86BtA",
              text: "/desc 43900",
            },
          },
        ],
      },
    ],
  };
  const response = await handleChatBotCommands({ payload });
  expect(response).toStrictEqual(true);
});

test("Handle chat bot commands (Successfuly Scenario #2)", async () => {
  const payload = {
    object: "page",
    entry: [
      {
        id: "217136822308193",
        time: 1665910382177,
        messaging: [
          {
            sender: { id: "4430820363709737" },
            recipient: { id: "217136822308193" },
            timestamp: 1665910381944,
            message: {
              mid: "m_BwdRiZhTUOSwQ0QHxY46_o9Gt8u78L8RDTuBjFmBftQPIdpitFHnqWeZRzAuuxeYi3LgsXJG0ltB5bJZe86BtA",
              text: "/price 43900",
            },
          },
        ],
      },
    ],
  };
  const response = await handleChatBotCommands({ payload });
  expect(response).toStrictEqual(true);
});

test("Handle chat bot commands (Successfuly Scenario #3)", async () => {
  const payload = {
    object: "page",
    entry: [
      {
        id: "217136822308193",
        time: 1665910382177,
        messaging: [
          {
            sender: { id: "4430820363709737" },
            recipient: { id: "217136822308193" },
            timestamp: 1665910381944,
            message: {
              mid: "m_BwdRiZhTUOSwQ0QHxY46_o9Gt8u78L8RDTuBjFmBftQPIdpitFHnqWeZRzAuuxeYi3LgsXJG0ltB5bJZe86BtA",
              text: "/shipping 43900",
            },
          },
        ],
      },
    ],
  };
  const response = await handleChatBotCommands({ payload });
  expect(response).toStrictEqual(true);
});

test("Handle chat bot commands (Failed Scenario #1 - Command not found)", async () => {
  const payload = {
    object: "page",
    entry: [
      {
        id: "217136822308193",
        time: 1665910382177,
        messaging: [
          {
            sender: { id: "4430820363709737" },
            recipient: { id: "217136822308193" },
            timestamp: 1665910381944,
            message: {
              mid: "m_BwdRiZhTUOSwQ0QHxY46_o9Gt8u78L8RDTuBjFmBftQPIdpitFHnqWeZRzAuuxeYi3LgsXJG0ltB5bJZe86BtA",
              text: "/description 43900",
            },
          },
        ],
      },
    ],
  };
  const response = await handleChatBotCommands({ payload });
  expect(response).toStrictEqual(false);
});

test("Handle chat bot commands (Failed Scenario #2 - Product SKU not found)", async () => {
  const payload = {
    object: "page",
    entry: [
      {
        id: "217136822308193",
        time: 1665910382177,
        messaging: [
          {
            sender: { id: "4430820363709737" },
            recipient: { id: "217136822308193" },
            timestamp: 1665910381944,
            message: {
              mid: "m_BwdRiZhTUOSwQ0QHxY46_o9Gt8u78L8RDTuBjFmBftQPIdpitFHnqWeZRzAuuxeYi3LgsXJG0ltB5bJZe86BtA",
              text: "/desc 4390A",
            },
          },
        ],
      },
    ],
  };
  const response = await handleChatBotCommands({ payload });
  expect(response).toStrictEqual(false);
});
