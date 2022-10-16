const express = require("express");
const router = express.Router();

const { fetchProducts } = require("../controllers/products");

router.get("/", fetchProducts);

module.exports = router;
