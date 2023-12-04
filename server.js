require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const cartRoutes = require("./routes/cart.route");
const cartItemRoutes = require("./routes/cart_item.route");
const orderRoutes = require("./routes/order.route");
const authRoutes = require("./routes/auth.route");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", cartItemRoutes);
app.use("/api", orderRoutes);
app.use("/api", authRoutes);

const URI = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(
  URI,
  {
    dbName: `devplus-db`,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) throw error;
    console.log("connected to mongo DB");
  }
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running on port", port);
});
