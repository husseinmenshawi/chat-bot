require("dotenv");

const config = {
  verifyToken: process.env.VERIFY_TOKEN,
  appSecret: process.env.APP_SECRET,
  pageId: process.env.PAGE_ID,
  pageToken: process.env.PAGE_TOKEN,
};

module.exports = {
  config,
};
