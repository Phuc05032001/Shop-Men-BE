const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("cart", cartSchema);
