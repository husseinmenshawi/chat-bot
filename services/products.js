const productsModel = require("../models/products");

async function fetchProductsByParams(queryStrings) {
  const { limit = 100, type, sku, manufacturer, model } = queryStrings;
  const filter = {};
  if (type) {
    filter.type = type;
  }
  if (sku) {
    filter.sku = sku;
  }
  if (manufacturer) {
    filter.manufacturer = manufacturer;
  }
  if (model) {
    filter.model = model;
  }
  const products = await productsModel.find(filter).limit(limit);
  return products;
}

module.exports = {
    fetchProductsByParams,
};
