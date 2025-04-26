const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  players: [String],
  board: [[String]],
  currentTurn: String,
  scores: {
    type: Map,
    of: Number,
    default: {},
  },
});

module.exports = mongoose.model("Game", gameSchema);
