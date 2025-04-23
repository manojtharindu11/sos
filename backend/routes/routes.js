const router = require("express").Router();
const authController = require("../controller/authController");
const { validateSignup } = require("../validators/authValidator");

router.post("/auth/login", authController.login);
router.post("/auth/signup", validateSignup, authController.signup);

module.exports = router;
