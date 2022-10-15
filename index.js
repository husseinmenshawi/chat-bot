require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());
const { config } = require("./config/index");

app.get("/", (req, res) => {
  res.send("Hello Word");
});

app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object == "page") {
    console.log(`Received webhook:`);
    console.dir(body, { depth: null });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === config.verifyToken) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
