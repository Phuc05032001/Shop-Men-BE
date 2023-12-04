const router = require("express").Router();

const cartController = require("../controllers/cart.controller");
const auth = require("../middleware/authorization");

router.post("/carts", auth, cartController.createCart);
router.get("/all-carts", auth, cartController.getAllCarts);
router.get("/carts", auth, cartController.getCarts);
router.get("/carts/:id", auth, cartController.getCart);
router.put("/carts/:id", auth, cartController.updateCart);
router.delete("/carts/:id", auth, cartController.deleteCart);

module.exports = router;
