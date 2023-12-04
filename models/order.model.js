const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    cart_items: [{ type: mongoose.Types.ObjectId, ref: "cart_item" }],
    userId: { type: mongoose.Types.ObjectId, ref: "user" },
    status: {
      type: String,
      default: "unpaid",
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("order", orderItemSchema);
