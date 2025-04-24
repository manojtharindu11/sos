const router = require("express").Router();
const authController = require("../controller/authController");
const {
  validateSignup,
  validateLogin,
} = require("../validators/authValidator");

router.post("/auth/login", validateLogin, authController.login);
router.post("/auth/signup", validateSignup, authController.signup);

module.exports = router;
