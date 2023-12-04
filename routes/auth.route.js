const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/authorization");

router.get("/auth/get_me", auth, authController.getMe);
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.post("/auth/refresh_token", authController.refreshToken);

module.exports = router;
