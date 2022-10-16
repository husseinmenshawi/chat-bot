const express = require("express");
const router = express.Router();

const { handleWebhook, verifyWebhook } = require("../controllers/webhooks");

router.post("/webhook", handleWebhook);
router.get("/webhook", verifyWebhook);

module.exports = router;
