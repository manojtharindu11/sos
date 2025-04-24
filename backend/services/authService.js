const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.handleLogin = (data) => {
  console.log(data);
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

    return newUser.id
  } catch (error) {
    throw error;
  }
};
