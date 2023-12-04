const Carts = require("../models/cart.model");
const Products = require("../models/product.model");
const Users = require("../models/user.model");
const Cart_Item = require("../models/cart-item.model");

const cartController = {
  createCart: async (req, res) => {
    try {
      const userId = req.user._id.toString();
      console.log("🚀 ~ file: cart.controller.js:10 ~ createCart: ~ userId:", userId)

      const product = await Products.findById(req.body._id);

      if (!req.body.color && !req.body.size && !req.body.quantity) {
        req.body.color = product.color[0];
        req.body.size = product.size[0];
        req.body.quantity = 1;
      }

      const { _id, color, size, quantity } = req.body;
      console.log("🚀 ~ file: cart.controller.js:20 ~ createCart: ~ _id:", _id)

      const user = await Users.findById(userId);

      if (!user) {
        return res.status(400).json({ message: "User does not exist!" });
      }

      const checkCartExist = await Carts.findOne({ userId });
      console.log("🚀 ~ file: cart.controller.js:29 ~ createCart: ~ checkCartExist:", checkCartExist)

      if (checkCartExist === null) {
        const newCart = await Carts.create({ userId });
        console.log("🚀 ~ file: cart.controller.js:33 ~ createCart: ~ newCart:", newCart)

        let price = product.price;

        const newCartItem = await Cart_Item.create({
          cartId: newCart._id,
          productId: product._id,
          color: color,
          size: size,
          quantity: quantity ? quantity : "1",
          cart_item_price: quantity ? quantity * price : price,
        });
        console.log("🚀 ~ file: cart.controller.js:45 ~ createCart: ~ newCartItem:", newCartItem)

        return res.json({
          message: "Success",
          newCartItem,
        });
      } else {
        if (!product) res.json({ message: "Product not exist" });

        const ItemCartSimilarProduct = await Cart_Item.find({
          productId: product._id,
          cartId: checkCartExist._id,
        }).exec();
        console.log("🚀 ~ file: cart.controller.js:58 ~ createCart: ~ ItemCartSimilarProduct:", ItemCartSimilarProduct)

        if (ItemCartSimilarProduct.length > 0) {
          try {
            for (const item of ItemCartSimilarProduct) {
              if (item.color === color && item.size === size) {
                const total = item.quantity + parseInt(quantity);

                let updateCartItem = await Cart_Item.findByIdAndUpdate(
                  { _id: item._id },
                  { quantity: total, cart_item_price: product.price * total }
                );

                return res.json({
                  message: "Success",
                  updateCartItem,
                });
              }
            }
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
        }

        let price = product.price;

        const newCartItem = await Cart_Item.create({
          cartId: checkCartExist._id,
          productId: _id,
          color: color,
          size: size,
          quantity: quantity,
          cart_item_price: quantity * price,
        });
        console.log("🚀 ~ file: cart.controller.js:92 ~ createCart: ~ newCartItem:", newCartItem)

        return res.json({
          message: "Success",
          newCartItem,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getAllCarts: async (req, res) => {
    try {
      const carts = await Carts.find();
      console.log(
        "🚀 ~ file: cart.controller.js:104 ~ getAllCarts: ~ carts:",
        carts
      );

      res.json({ message: "Success", carts });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCarts: async (req, res) => {
    const { _id } = req.user;

    try {
      const user = await Users.findById(_id);

      const carts = await Carts.find({ userId: user._id });

      const allCartItem = await Cart_Item.find({ cartId: carts }).populate(
        "productId"
      );

      res.json({ message: "Success", allCartItem });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCart: async (req, res) => {
    try {
      const cart = await Carts.findById(req.params.id);
      if (!cart)
        return res.status(400).json({ message: "Cart does not exist!" });

      res.json({ message: "Success", cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      const idCartItem = req.params.id;
      const { userId, _id, color, size, quantity } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User id is not provided" });
      }

      const user = await Users.findById(userId);

      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const cartItem = await Cart_Item.findById(idCartItem).populate(
        "productId"
      );

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      const updatedCartItem = await Cart_Item.findByIdAndUpdate(
        idCartItem,
        {
          quantity: quantity,
          cart_item_price: cartItem.productId.price * quantity,
          color: color,
          size: size,
        },
        { new: true } // Returns the updated document
      );

      return res.json({
        message: "Success",
        updatedCartItem,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteCart: async (req, res) => {
    try {
      const user = await Carts.findById(req.params.id);
      if (!user) {
        return res.status(400).json({ message: "Cart dose not exits" });
      }
      await Carts.findOneAndRemove({ _id: req.params.id });

      res.json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = cartController;
