const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  finalScore: {
    type: Number,
    default: 0,
  },
  numberOfContest: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
