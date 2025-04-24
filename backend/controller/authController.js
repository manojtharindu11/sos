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

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(403).json({ message: "Refresh token invalid" });
  }

  try {
    const accessToken = await authService.handleRefreshToken(token);
    res.status(200).json({ newAccessToken: accessToken });
  } catch (error) {
    res.status(403).json({ message: "Token verification failed" });
  }
};

exports.protected = async (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authenticated!` });
};
