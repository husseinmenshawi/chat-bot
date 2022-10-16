const { fetchProductsByParams } = require("../services/products");

const fetchProducts = async (req, res) => {
  try {
    const queryStrings = req.query;
    const products = await fetchProductsByParams(queryStrings);
    res.status(200);
    res.json({
      message: `A number of (${products.length}) products found`,
      products,
    });
  } catch (error) {
    res.status(error.statusCode).send("Something went wrong");
  }
};

module.exports = {
  fetchProducts,
};
