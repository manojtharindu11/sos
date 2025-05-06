const gameService = require("../services/gameService");

exports.getCurrentScore = async (req, res) => {
  const username = req.user.username;
  try {
    const response = await gameService.handleGetCurrentScore(username);
    res.status(200).json({
      currentScore: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getCurrentRank = async (req, res) => {
  const username = req.user.username;
  try {
    const response = await gameService.handleGetCurrentRank(username);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
