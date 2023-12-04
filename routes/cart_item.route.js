const router = require("express").Router();

const cartItemController = require("../controllers/cart_item.controller");
const auth = require("../middleware/authorization");

router.post("/cart-item", auth, cartItemController.createCartItem);
router.get("/cart-item", auth, cartItemController.getCartItems);
router.get("/cart-item/:id", auth, cartItemController.getCartItem);
router.patch("/cart-item/:id", auth, cartItemController.updateCartItem);
router.delete("/cart-item/:id", cartItemController.deleteCartItem);

module.exports = router;
