const express = require("express");
const router = express.Router();

const { handleWebhook, verifyWebhook } = require("../controllers/webhooks");

router.post("/", handleWebhook);
router.get("/", verifyWebhook);

module.exports = router;
