const Products = require("../models/product.model");
const CartItems = require("../models/cart-item.model");

const getProductRelation = async (productId) => {
  try {
    return await Products.findById(productId);
  } catch (error) {
    message;
    console.log(error.message);
  }
};

const getItemRelation = async (id) => {
  try {
    return await CartItems.findById(id);
  } catch (error) {
    message;
    console.log(error.message);
  }
};

module.exports = { getProductRelation, getItemRelation };
