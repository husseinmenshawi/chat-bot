require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());

const webhookRoutes = require("./routes/webhooks");
const productRoutes = require("./routes/products");

app.get("/", (req, res) => {
  res.send("Respond.io Chat Bot v1.0 reporting for duty!");
});

app.use("/", webhookRoutes);
app.use("/products", productRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
