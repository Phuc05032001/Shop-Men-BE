const router = require("express").Router();

const userController = require("../controllers/user.controller");
const auth = require("../middleware/authorization");

router.get("/users", auth, userController.getUsers);
router.get("/users/:id", auth, userController.getUser);
router.put("/users/:id", auth, userController.updateUser);
router.delete("/users/:id", auth, userController.deleteUser);

module.exports = router;
