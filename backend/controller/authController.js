const authService = require("../services/authService");

exports.login = (req, res) => {
  authService.handleLogin(req);
  res.status(200).json({
    message: "Login successful",
  });
};

exports.signup = (req, res) => {
  const response = authService.handleSignup(req);
  if (response)
    res.status(200).json(response);
};
