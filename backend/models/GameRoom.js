const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const gameRoomSchema = new Schema({
  roomName: String,
  puzzles: [
    {
      question: String,
      answer: String,
      solved: Boolean,
    },
  ],
  players: [String],
  timer: { type: Number, default: 300 },
});

const GameRoom = model("GameRoom", gameRoomSchema);