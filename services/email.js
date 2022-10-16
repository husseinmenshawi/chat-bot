const { config } = require("../config/index");
const { transporter } = require("../config/email");

async function sendEmail({ recipients, subject, html }) {
  const emailResponse = await transporter.sendMail({
    from: config.productPurchaseEmailSender,
    to: recipients,
    subject,
    html,
  });
  return emailResponse;
}

module.exports = {
  sendEmail,
};
