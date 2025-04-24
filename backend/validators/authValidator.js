const { body } = require("express-validator");

exports.validateSignup = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 }),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.validateLogin = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

