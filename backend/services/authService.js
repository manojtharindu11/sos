const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwtUtils");

exports.handleLogin = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const payload = { id: user.id, username: user.username, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

exports.handleSignup = async (username, email, password) => {
  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return newUser.id;
  } catch (error) {
    throw error;
  }
};

exports.handleRefreshToken = async (token) => {
  try {
    const userData = verifyRefreshToken(token);
    if (!userData) {
      throw new Error("Token is not valid");
    }
    const payload = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };

    const newAccessToken = generateAccessToken(payload);

    const user = await User.findById(userData.id);
    user.accessToken = newAccessToken;

    await user.save();
    return newAccessToken;
  } catch (error) {
    throw error;
  }
};
