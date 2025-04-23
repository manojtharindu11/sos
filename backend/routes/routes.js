const router = require("express").Router();
const authController = require("../controller/authController");

router.post("/auth/login", authController.login);
router.post("/auth/signup", authController.signup);

module.exports = router;
