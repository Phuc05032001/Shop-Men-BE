const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 25,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbbkids.vn%2Fthoi-trang-tre-em-bbkids.php%3FspID%3D17291%26age%3D2%26weight%3D38&psig=AOvVaw00ahAvKcpzuv-AltyHI-BZ&ust=1699448309464000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJjUsbj4sYIDFQAAAAAdAAAAABAE",
      required: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    size: {
      type: [String], // Chuyển "size" thành một mảng các String
      default: ["S", "M", "L", "XL"], // Mặc định là một mảng rỗng
    },
    subDescription: {
      type: String,
      default: "",
      maxlength: 200,
    },
    color: {
      type: [String],
      default: ["WHITE", "BLACK", "RED", "YELLOW", "BLUE"], // Mặc định là một mảng rỗng
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("product", productSchema);
