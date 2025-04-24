const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
