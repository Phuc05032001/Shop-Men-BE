const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: false,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    cart_item_price: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("cart_item", cartItemSchema);
