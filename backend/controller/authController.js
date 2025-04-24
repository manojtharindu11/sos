const authService = require("../services/authService");
const { validationResult } = require("express-validator");

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const { accessToken, refreshToken } = await authService.handleLogin(
      username,
      password
    );
    res.status(200).json({
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const response = await authService.handleSignup(username, email, password);
    res.status(201).json({ message: "Signup successful", userId: response });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};
