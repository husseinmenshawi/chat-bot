const { mongoConnection } = require("./db");
const path = require("path");

const initialBotGreetings =
  process.env.INIITAL_BOT_GREETINGS || '["How are you?"]';

const config = {
  rootPath: path.normalize(__dirname + "/.."),
  verifyToken: process.env.VERIFY_TOKEN,
  appSecret: process.env.APP_SECRET,
  pageId: process.env.PAGE_ID,
  pageToken: process.env.PAGE_TOKEN,
  facebookGraphBaseUrl:
    process.env.FACEBOOK_GRAPH_BASE_URL || "https://graph.facebook.com/v14.0",
  initialBotGreetings: JSON.parse(initialBotGreetings),
  productPurchaseEmailRecipient: process.env.PRODUCT_PURCHASE_EMAIL_RECIPIENT,
  productPurchaseEmailSender: process.env.PRODUCT_PURCHASE_EMAIL_SENDER,
};

module.exports = {
  config,
  mongoConnection,
};
