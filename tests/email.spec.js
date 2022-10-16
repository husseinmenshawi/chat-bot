require("dotenv").config();
const { config } = require("../config/index");
const { sendEmail } = require("../services/email");

beforeEach(() => {
  jest.setTimeout(60000);
});

test("Send Test Email", async () => {
  const recipients = [config.productPurchaseEmailRecipient];
  const subject = "Test Email";
  const emailBody = `<b>Hello Test Email</b>`;
  const response = await sendEmail({ recipients, subject, html: emailBody });
  expect(response).toBeTruthy();
});
