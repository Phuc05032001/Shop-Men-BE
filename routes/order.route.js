const router = require("express").Router();

const orderController = require("../controllers/orders.controller");
const auth = require("../middleware/authorization");

router.post("/orders", auth, orderController.createOrder);
router.get("/orders", auth, orderController.getOrders);
router.get("/orders/:id", auth, orderController.getOrder);
router.delete("/orders/:id", auth, orderController.deleteOrder);

module.exports = router;
