const mongoose = require("mongoose");

const cellSchema = new mongoose.Schema(
  {
    letter: { type: String, enum: ["S", "O", ""], default: "" },
    player: { type: String, default: null },
  },
  { _id: false } // Prevents automatic _id creation for each cell
);

const gameSchema = new mongoose.Schema({
  _id: String,
  players: [String],
  board: [[cellSchema]], // 2D array of cell objects
  currentTurn: String,
  scores: {
    type: Map,
    of: Number,
    default: {},
  },
  winner: String
});

module.exports = mongoose.model("Game", gameSchema);
