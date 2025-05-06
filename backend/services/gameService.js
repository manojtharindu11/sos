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

exports.handleGetCurrentRank = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const numberOfContest = user.numberOfContest;

    if (numberOfContest === 0) {
      return { username, rank: "Unranked" };
    }

    const score = user.finalScore;
    const userPerformance = score / numberOfContest;

    // Fetch all users to calculate ranks
    const allUsers = await User.find();

    // Create an array of performance scores
    const performances = allUsers.map(u => ({
      username: u.username,
      performance: u.finalScore / (u.numberOfContest || 1),
    }));

    // Sort descending by performance
    performances.sort((a, b) => b.performance - a.performance);

    // Find rank (index + 1)
    const rank = performances.findIndex(p => p.username === username) + 1;

    return { username, rank, totalUsers: performances.length };
  } catch (error) {
    throw new Error("Failed to get currentRank");
  }
};

