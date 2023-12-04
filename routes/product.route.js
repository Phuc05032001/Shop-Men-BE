const router = require("express").Router();

const productController = require("../controllers/product.controller");
const auth = require("../middleware/authorization");

router.post("/products", auth, productController.createProduct);
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProduct);
router.put("/products/:id", auth, productController.updateProduct);
router.delete("/products/:id", auth, productController.deleteProduct);

module.exports = router;
