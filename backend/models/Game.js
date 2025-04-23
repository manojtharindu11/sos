const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  _id: String,
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
