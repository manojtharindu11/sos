const Game = require("../models/Game");
const User = require("../models/User");

module.exports = function (io) {
  const userSocketMap = [];
  const gameRooms = {}; // { roomId: [socketId1, socketId2] }

  let roomCounter = 1;

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
      socket.on("game_started", () => {
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
          const newRoomId = `room-sos-counter-${roomCounter++}`;
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
          io.to(player1).emit("game_ready", player2Username);
          io.to(player2).emit("game_ready", player1Username);
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
