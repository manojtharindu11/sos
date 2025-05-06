const router = require("express").Router();
const authController = require("../controller/authController");
const gameController = require("../controller/gameController");
const {
  validateSignup,
  validateLogin,
} = require("../validators/authValidator");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/auth/login", validateLogin, authController.login);
router.post("/auth/signup", validateSignup, authController.signup);
router.post("/auth/refresh", authController.refreshToken);
router.get("/auth/protected", authMiddleware, authController.protected);
router.get(
  "/game/get-current-score",
  authMiddleware,
  gameController.getCurrentScore
);

module.exports = router;
