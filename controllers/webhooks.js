const { config } = require("../config/index");

const {
  handleChatBotGreeting,
  handleChatBotCommands,
} = require("../services/webhooks");

/*
Sample Payload Webhook
{
  object: 'page',
  entry: [
    {
      id: '217136822308193',
      time: 1665910382177,
      messaging: [
        {
          sender: { id: '4430820363709737' },
          recipient: { id: '217136822308193' },
          timestamp: 1665910381944,
          message: {
            mid: 'm_BwdRiZhTUOSwQ0QHxY46_o9Gt8u78L8RDTuBjFmBftQPIdpitFHnqWeZRzAuuxeYi3LgsXJG0ltB5bJZe86BtA',
            text: 'Test'
          }
        }
      ]
    }
  ]
}
*/
const handleWebhook = async (req, res) => {
  let body = req.body;

  if (body.object == "page") {
    console.log(`Received webhook:`);
    console.dir(body, { depth: null });

    const isGreetingSentOut = await handleChatBotGreeting({ payload: body });
    if (!isGreetingSentOut) {
      await handleChatBotCommands({ payload: body });
    }

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
};

const verifyWebhook = (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === config.verifyToken) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

module.exports = {
  handleWebhook,
  verifyWebhook,
};
