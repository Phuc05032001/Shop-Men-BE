const Carts = require("../models/cart.model");
const CartItems = require("../models/cart-item.model");

const cartItemController = {
  createCartItem: async (req, res) => {
    try {
      const { cartId, quantity } = req.body;
      if (!cartId) {
        return res.status(400).json({ message: "CartId is dose not empty" });
      }

      const cart = await Carts.findById(cartId);
      if (!cart) {
        return res.status(400).json({ message: "Cart does not exist!" });
      }

      if (!quantity) {
        return res
          .status(400)
          .json({ message: "Please enter quantity of product" });
      }

      const newCartItem = new CartItems({
        cartId,
        quantity,
      });

      await newCartItem.save();

      res.json({
        message: "Success",
        cart_item: newCartItem,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCartItems: async (req, res) => {
    try {
      const cart_items = await CartItems.find().limit(10);

      res.json({ message: "Success", cart_items });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCartItem: async (req, res) => {
    try {
      const cart_item = await CartItems.findById(req.params.id).populate(
        "productId"
      );

      //từ cartItem => productID => product => price
      // price * quantity in cartItem

      if (!cart_item) {
        return res.status(400).json({ message: "Cart does not exist!" });
      }
      res.json({ message: "Success", cart_item });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateCartItem: async (req, res) => {
    try {
      const { quantity, cart_item_price, color, size } = req.body;

      const cartItem = await CartItems.findById(req.params.id);
      if (!cartItem) {
        return res
          .status(400)
          .json({ message: "This cart item dose not exits" });
      }

      const update = await CartItems.findByIdAndUpdate(
        { _id: req.params.id },
        { quantity, cart_item_price, color, size }
      );

      res.json({ message: "Update successfully!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteCartItem: async (req, res) => {
    try {
      const user = await CartItems.findById(req.params.id);
      if (!user) {
        return res.status(400).json({ message: "Cart item dose not exits" });
      }
      await CartItems.findOneAndRemove({ _id: req.params.id });

      res.json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = cartItemController;
