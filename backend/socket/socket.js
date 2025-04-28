const Game = require("../models/Game");
const User = require("../models/User");

module.exports = function (io) {
  const userSocketMap = [];

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

          // 🔥 Send active users immediately after new user added
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

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        const index = userSocketMap.findIndex(
          (user) => user.socketId === socket.id
        );
        if (index !== -1) {
          console.log(
            `User ${userSocketMap[index].username} removed from active users.`
          );
          userSocketMap.splice(index, 1);

          // 🔥 After removing user, send updated list
          io.emit("active_users", userSocketMap);
        }
      });
    }
  });
};
