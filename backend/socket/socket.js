const Game = require("../models/Game");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_game", async ({ gameId, player }) => {
      socket.join(gameId);
      console.log(`${player} joined game ${gameId}`);

      // Update the game in the database
      try {
        await Game.findByIdAndUpdate(
          gameId,
          { $push: { players: player } },
          { new: true }
        );
      } catch (err) {
        console.error("Error updating game:", err);
      }

      io.to(gameId).emit("player_joined", { player });
    });

    socket.on("make_move", async ({ gameId, row, col, letter, player }) => {
      io.to(gameId).emit("move_made", { row, col, letter, player });
      try {
        await Game.findByIdAndUpdate(
          gameId,
          { $push: { moves: { row, col, letter, player } } },
          { new: true }
        );
      } catch (err) {
        console.error("Error saving move:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
