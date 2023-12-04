const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 25,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 25,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
      unique: true,
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
