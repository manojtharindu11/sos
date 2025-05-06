const User = require("../models/User");

exports.handleGetCurrentScore = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    return user.finalScore;
  } catch (error) {
    throw new Error("Failed to get currentScore");
  }
};
