const Game = require("../models/Game");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

module.exports = function (io) {
  const userSocketMap = [];
  const gameRooms = {}; // { roomId: [socketId1, socketId2] }

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          userSocketMap.push({
            userId: userId,
            socketId: socket.id,
            username: user.username,
          });
          console.log(
            `✅ User connected: ${userId}, Username: ${user.username}, Socket ID: ${socket.id}`
          );

          io.emit("active_users", userSocketMap);
        } else {
          console.log(`❌ User not found with ID: ${userId}`);
        }
      } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
      }

      socket.on("get_active_users", () => {
        socket.emit("active_users", userSocketMap);
      });

      // 🕹 Handle game start
      socket.on("game_started", async () => {
        console.log("🎮 Game started for:", socket.id);

        // 1. Try to find a room with only one player
        let joinedRoomId = null;
        for (const [roomId, players] of Object.entries(gameRooms)) {
          if (players.length === 1) {
            players.push(socket.id);
            joinedRoomId = roomId;
            break;
          }
        }

        // 2. If no available room, create a new one
        if (!joinedRoomId) {
          const newRoomId = `room-sos-${uuidv4()}`;
          gameRooms[newRoomId] = [socket.id];
          joinedRoomId = newRoomId;
        }

        // 3. Join the socket to the room (Socket.IO feature)
        socket.join(joinedRoomId);
        console.log(`🔗 ${socket.id} joined ${joinedRoomId}`);

        // 4. Notify the player of the assigned room
        socket.emit("room_assigned", joinedRoomId);

        // 5. If room has two players, notify both players the game is ready
        if (gameRooms[joinedRoomId].length === 2) {
          const [player1, player2] = gameRooms[joinedRoomId];
          const player1Username = userSocketMap.find(
            (user) => user.socketId === player1
          ).username;
          const player2Username = userSocketMap.find(
            (user) => user.socketId === player2
          ).username;

          const player1UserId = userSocketMap.find(
            (user) => user.socketId === player1
          ).userId;
          const player2UserId = userSocketMap.find(
            (user) => user.socketId === player2
          ).userId;

          try {
            const newGame = new Game({
              _id: joinedRoomId,
              players: [player1UserId, player2UserId],
              currentTurn: player1UserId,
              scores: {
                [player1UserId]: 0,
                [player2UserId]: 0,
              },
              board: Array(3).fill(null).map(() => Array(3).fill(null)), // <-- Add this!
            });

            await newGame.save(); // Don't forget to save the game to MongoDB
            console.log("Game successfully stored:", newGame._id);
          } catch (error) {
            console.log("Error storing game", error);
          }
          io.to(player1).emit("game_ready", player2Username);
          io.to(player2).emit("game_ready", player1Username);
        }
      });

      socket.on("make_move", async ({ gameId, row, col, letter, player }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game) {
            console.error(`❌ Game not found: ${gameId}`);
            return;
          }

          // Ensure it's the player's turn
          if (game.currentTurn !== player) {
            console.warn(`⛔ Not ${player}'s turn`);
            return;
          }

          const board = game.board;
          if (!board[row][col]) {
            board[row][col] = letter;
            // Optional: score logic can go here
            // if (letter forms SOS) { game.scores.set(player, (game.scores.get(player) || 0) + 1); }

            // Change turn to other player
            const otherPlayer = game.players.find((p) => p !== player);
            game.currentTurn = otherPlayer;

            // Save updated game
            await game.save();

            io.to(game._id).emit("update_board", {
              board: game.board,
              currentTurn: game.currentTurn,
              scores: Object.fromEntries(game.scores),
            });

            console.log(`✅ Move updated: ${player} at (${row}, ${col})`);
          } else {
            console.warn(`⚠️ Cell already occupied: (${row}, ${col})`);
          }
        } catch (err) {
          console.error("💥 Error handling make_move:", err);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);

        // Remove from user list
        const index = userSocketMap.findIndex(
          (user) => user.socketId === socket.id
        );
        if (index !== -1) {
          console.log(
            `User ${userSocketMap[index].username} removed from active users.`
          );
          userSocketMap.splice(index, 1);
          io.emit("active_users", userSocketMap);
        }

        // Also remove from any game room
        for (const [roomId, players] of Object.entries(gameRooms)) {
          const i = players.indexOf(socket.id);
          if (i !== -1) {
            players.splice(i, 1);
            console.log(`🚪 ${socket.id} left ${roomId}`);
            if (players.length === 0) {
              delete gameRooms[roomId];
            }
            break;
          }
        }
      });
    }
  });
};
