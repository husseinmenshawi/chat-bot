const mongoose = require("mongoose");
const { mongoConnection } = require("../config/index");

const productSchema =new mongoose.Schema({
  _id: mongoose.ObjectId,
  sku: Number,
  name: String,
  type: String,
  price: Number,
  upc: String,
  category: Array,
  shipping: Number,
  description: String,
  manufacturer: String,
  model: String,
  url: String,
  image: String,
});

module.exports = mongoConnection.model("Products", productSchema);
