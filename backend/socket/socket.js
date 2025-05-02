const Game = require("../models/Game");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

module.exports = function (io) {
  const userSocketMap = [];
  const gameRooms = {}; // { roomId: [socketId1, socketId2] }
  const activeTimers = {}; // { gameId: { intervalId, timeLeft } }

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
              board: Array(3)
                .fill(null)
                .map(() => Array(3).fill({ letter: "", player: null })),
            });

            await newGame.save();
            startTurnTimer(io, newGame, newGame._id);

            console.log("Game successfully stored:", newGame._id);
          } catch (error) {
            console.log("Error storing game", error);
          }

          io.to(player1).emit(
            "game_ready",
            {
              username: player2Username,
              userId: player2UserId,
            },
            player1UserId
          );
          io.to(player2).emit(
            "game_ready",
            {
              username: player1Username,
              userId: player1UserId,
            },
            player1UserId
          );
        }
      });

      socket.on(
        "make_move",
        async ({ gameId, row, col, letter, player, timeLeft }) => {
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

            // Validate cell and prevent overwrite
            if (!board[row][col].letter) {
              // Update cell with move
              board[row][col] = {
                letter,
                player,
              };

              // TODO: Optional - update score based on SOS logic here
              // Check for valid SOS and get the points earned
              let { totalPoints, winningCells } = checkSOS(
                board,
                row,
                col,
                timeLeft
              );

              winningCells = winningCells.map((prev) => ({
                ...prev,
                player: game.currentTurn,
              }));

              // Update the score if SOS is found
              if (totalPoints) {
                updateScore(game, player, totalPoints);
              }

              // Change turn to the other player
              const otherPlayer = game.players.find((p) => p !== player);
              game.currentTurn = otherPlayer;

              // Save updated game
              await game.save();

              // Emit updated game state to players
              io.to(gameId).emit("update_board", {
                board: game.board,
                currentTurn: game.currentTurn,
                scores: Object.fromEntries(game.scores),
                timeLeft: 15,
                winningCells,
              });

              // Restart the timer for the next player
              const updatedGame = await Game.findById(gameId);
              startTurnTimer(io, updatedGame, gameId);

              console.log(`✅ Move updated: ${player} at (${row}, ${col})`);
            } else {
              console.warn(`⚠️ Cell already occupied: (${row}, ${col})`);
            }
          } catch (err) {
            console.error("💥 Error handling make_move:", err);
          }
        }
      );

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
              clearInterval(activeTimers[roomId]?.intervalId);
              delete activeTimers[roomId];
            }
            break;
          }
        }
      });
    }
  });

  // Timer function inside the module
  function startTurnTimer(io, game, gameId) {
    let timeLeft = 15;

    // Clear any existing timer for this game
    if (activeTimers[gameId]) {
      clearInterval(activeTimers[gameId].intervalId);
    }

    // Start the timer when the current player is expected to make a move
    const intervalId = setInterval(async () => {
      timeLeft--;

      // Emit the current time left to players
      io.to(gameId).emit("timer_tick", timeLeft);

      // If time runs out
      if (timeLeft <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    activeTimers[gameId] = {
      intervalId,
      timeLeft,
    };
  }
};

// Helper function to check for SOS sequences and calculate points
const checkSOS = (board, row, col, timeLeft) => {
  const winningCellsSet = new Set();
  let basePoints = 0;

  const directions = [
    { dr: 0, dc: 1 }, // Horizontal
    { dr: 1, dc: 0 }, // Vertical
    { dr: 1, dc: 1 }, // Diagonal (down-right)
    { dr: 1, dc: -1 }, // Diagonal (down-left)
  ];

  console.log(
    `🔍 Checking SOS from cell (${row}, ${col}) with timeLeft: ${timeLeft}`
  );

  directions.forEach(({ dr, dc }) => {
    for (let i = -2; i <= 0; i++) {
      const sequence = [
        { r: row + i * dr, c: col + i * dc },
        { r: row + (i + 1) * dr, c: col + (i + 1) * dc },
        { r: row + (i + 2) * dr, c: col + (i + 2) * dc },
      ];

      if (
        sequence.every(
          ({ r, c }) =>
            r >= 0 && r < board.length && c >= 0 && c < board[0].length
        )
      ) {
        const letters = sequence.map(({ r, c }) => board[r][c].letter);
        const formed = letters.join("");

        if (formed === "SOS") {
          basePoints += 1;
          console.log(
            `✅ Found SOS at (${sequence[0].r}, ${sequence[0].c}) → (${sequence[2].r}, ${sequence[2].c})`
          );
          sequence.forEach(({ r, c }) => {
            winningCellsSet.add(`${r},${c}`);
          });
        }
      }
    }
  });

  // Calculate time bonus
  let timeBonus = 0;
  if (basePoints > 0) {
    if (timeLeft >= 14) timeBonus = 5;
    else if (timeLeft >= 12) timeBonus = 4;
    else if (timeLeft >= 9) timeBonus = 3;
    else if (timeLeft >= 6) timeBonus = 2;
    else if (timeLeft >= 3) timeBonus = 1;
  }

  const totalPoints = basePoints > 0 ? basePoints + timeBonus : 0;

  console.log(
    `🎯 Base Points: ${basePoints}, Time Bonus: ${timeBonus}, Total: ${totalPoints}`
  );

  // Convert set back to array of {r, c} objects
  const winningCells = Array.from(winningCellsSet).map((str) => {
    const [r, c] = str.split(",").map(Number);
    return { r, c };
  });

  return { totalPoints, winningCells };
};

// Helper function to update the player's score
const updateScore = (game, player, points) => {
  // Update the score of the player
  const currentScore = game.scores.get(player) || 0;
  game.scores.set(player, currentScore + points);
};
