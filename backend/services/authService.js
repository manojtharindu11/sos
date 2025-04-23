const { json } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.handleLogin = (data) => {
  console.log(data);
};

exports.handleSignup = async (data) => {
  try {
    const { userName, email, password } = data;

    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return json({
      message: "User created successful",
      userId: newUser.id,
    });
  } catch (error) {
    throw error;
  }
};
