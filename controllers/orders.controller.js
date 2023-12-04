const Orders = require("../models/order.model");
const CartItems = require("../models/cart-item.model");
const Products = require("../models/product.model");
const Users = require("../models/user.model");
const Carts = require("../models/cart.model");

const { generateRandomString } = require("../helper/generalCode");
const {  getItemRelation, getProductRelation } = require("../helper/filterproducts");

const orderController = {
  createOrder: async (req, res) => {
    const userId = req.user._id.toString();
    const { cartItemIds } = req.body;

    try {
      if (!userId) {
        return res.status(400).json({ message: "User is dose not empty" });
      }

      const user = await Users.findById(userId);

      if (!user) {
        return res.status(400).json({ message: "User does not exist!" });
      }

      if (!cartItemIds)
        return res.status(400).json({ message: "cart Item is dose not empty" });

      const newOrder = new Orders({
        userId,
        code: generateRandomString(),
      });

      await newOrder.save();

      cartItemIds?.forEach(async (id) => {
        const item = await CartItems.findByIdAndUpdate(id, {
          orderId: newOrder,
        });

        if (!item) {
          return res.status(400).json({ message: "User does not exist!" });
        }
      });

      await Orders.findByIdAndUpdate(newOrder._id, { cart_items: cartItemIds });

      const order = await Orders.findById(newOrder._id).populate("cart_items");
      console.log("🚀 ~ file: orders.controller.js:48 ~ createOrder: ~ order:", order)

      const cartId = order.cart_items[0].cartId;

      console.log("🚀 ~ file: orders.controller.js:51 ~ createOrder: ~ cartId:", cartId)

      const cartDeleted = await Carts.findByIdAndDelete(cartId);  await Carts.findOneAndRemove({ _id: cartId});
      console.log("🚀 ~ file: orders.controller.js:53 ~ createOrder: ~ cartDeleted:", cartDeleted)


      res.json({
        message: "Success",
        order: order,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await Orders.find()
        .populate("userId")
        .populate("cart_items");

      res.json({ message: "Success", orders });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getOrder: async (req, res) => {
    try {
      const order = await Orders.findById(req.params.id)
        .populate("userId")
        .populate({
          path: "cart_items",
          populate: {
            path: "productId",
            model: "product",
          },
        });

      res.json({ message: "Success", data: order });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const user = await Orders.findById(req.params.id);
      if (!user) {
        return res.status(400).json({ message: "Order dose not exits" });
      }
      await Orders.findOneAndRemove({ _id: req.params.id });

      res.json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = orderController;
