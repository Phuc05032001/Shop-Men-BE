const Products = require("../models/product.model");

const productController = {
  createProduct: async (req, res) => {
    try {
      const {
        name,
        price,
        image,
        description,
        size,
        color,
        subDescription,
        category,
      } = req.body;

      const newProduct = new Products({
        name,
        price,
        image,
        description,
        size,
        color,
        subDescription,
        category,
      });

      await newProduct.save();
      const product = await Products.findById(newProduct.id);

      res.json({
        message: "Success",
        product: product,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await Products.find();

      res.json({ message: "Success", products });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      if (!product)
        return res.status(400).json({ message: "Product does not exist!" });

      res.json({ message: "Success", product });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const {
        name,
        price,
        description,
        size,
        color,
        subDescription,
        category,
      } = req.body;
      const product = await Products.findById(req.params.id);
      if (!product)
        return res.status(400).json({ message: "This product dose not exits" });

      if (!name) return res.status(400).json({ message: "Please enter name." });

      if (!price)
        return res.status(400).json({ message: "Please enter  name." });

      await Products.findByIdAndUpdate(
        { _id: req.params.id },
        { name, price, description, size, color, subDescription, category }
      );
      res.json({ message: "Update successfully!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const user = await Products.findById(req.params.id);
      if (!user) {
        return res.status(400).json({ message: "Product dose not exits" });
      }
      await Products.findOneAndRemove({ _id: req.params.id });

      res.json({ message: "Deleted success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = productController;
