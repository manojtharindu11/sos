const Game = require("../models/Game");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

module.exports = function (io) {
  const userSocketMap = [];
  const gameRooms = {};
  const activeTimers = {};

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) return;

    try {
      const user = await User.findById(userId);
      if (!user) return console.log(`❌ User not found with ID: ${userId}`);

      userSocketMap.push({
        userId: userId,
        socketId: socket.id,
        username: user.username,
      });

      console.log(`✅ Connected: ${user.username} (${userId}) [${socket.id}]`);
      io.emit("active_users", userSocketMap);
    } catch (err) {
      return console.error("Error fetching user:", err);
    }

    socket.on("get_active_users", () => {
      socket.emit("active_users", userSocketMap);
    });

    socket.on("game_started", async () => {
      console.log("🎮 Game started by:", socket.id);
      let joinedRoomId = null;

      for (const [roomId, players] of Object.entries(gameRooms)) {
        if (players.length === 1) {
          players.push(socket.id);
          joinedRoomId = roomId;
          break;
        }
      }

      if (!joinedRoomId) {
        const timestamp = new Date()
          .toISOString()
          .replace(/[-:T.]/g, "")
          .slice(0, 14); // e.g. 20240503T102311
        joinedRoomId = `room-sos-${timestamp}-${uuidv4()}`;
        gameRooms[joinedRoomId] = [socket.id];
      }

      socket.join(joinedRoomId);
      socket.emit("room_assigned", joinedRoomId);

      if (gameRooms[joinedRoomId].length === 2) {
        const [p1, p2] = gameRooms[joinedRoomId];
        const u1 = userSocketMap.find((u) => u.socketId === p1);
        const u2 = userSocketMap.find((u) => u.socketId === p2);

        try {
          const newGame = new Game({
            _id: joinedRoomId,
            players: [u1.userId, u2.userId],
            currentTurn: u1.userId,
            scores: { [u1.userId]: 0, [u2.userId]: 0 },
            board: Array(3)
              .fill(null)
              .map(() => Array(3).fill({ letter: "", player: null })),
            winner: "",
          });

          await newGame.save();
          startTurnTimer(io, newGame, newGame._id);
          console.log(`📦 Game saved: ${newGame._id}`);
        } catch (e) {
          return console.error("Error creating game:", e);
        }

        io.to(p1).emit(
          "game_ready",
          { username: u2.username, userId: u2.userId },
          u1.userId
        );
        io.to(p2).emit(
          "game_ready",
          { username: u1.username, userId: u1.userId },
          u1.userId
        );
      }
    });

    socket.on(
      "make_move",
      async ({ gameId, row, col, letter, player, timeLeft }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game || game.currentTurn !== player) return;

          const board = game.board;
          if (!board[row][col].letter) {
            board[row][col] = { letter, player };

            let { totalPoints, winningCells } = checkSOS(
              board,
              row,
              col,
              timeLeft
            );

            winningCells = winningCells.map((cell) => ({
              ...cell,
              player: game.currentTurn,
            }));

            if (totalPoints) updateScore(game, player, totalPoints);

            const nextPlayer = game.players.find((p) => p !== player);
            game.currentTurn = nextPlayer;
            await game.save();

            io.to(gameId).emit("update_board", {
              board: game.board,
              currentTurn: nextPlayer,
              scores: Object.fromEntries(game.scores),
              timeLeft: 15,
              winningCells,
            });

            const updatedGame = await Game.findById(gameId);
            startTurnTimer(io, updatedGame, gameId);
          }
        } catch (err) {
          console.error("Error in make_move:", err);
        }
      }
    );

    socket.on("game_over", async ({ gameId, winner, scores }) => {
      if (!winner) return;
      try {
        const game = await Game.findById(gameId);
        if (game) {
          game.winner = winner;
          await game.save();
          leftFromRoom(socket);
        }
        console.log("scores", scores);
        scores.map(async (p) => {
          const user = await User.findById(p.player);
          if (user) {
            user.finalScore += p.score;
            user.numberOfContest++;
            await user.save();
            console.log(
              `${p.player} final Score is updated to ${user.finalScore}`
            );
          }
        });
      } catch (e) {
        console.error("Error ending game:", e);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);

      const index = userSocketMap.findIndex((u) => u.socketId === socket.id);
      if (index !== -1) {
        const username = userSocketMap[index].username;
        userSocketMap.splice(index, 1);
        console.log(`🗑 Removed: ${username}`);
        io.emit("active_users", userSocketMap);
      }

      leftFromRoom(socket);
    });
  });

  function leftFromRoom(socket) {
    for (const [roomId, players] of Object.entries(gameRooms)) {
      const i = players.indexOf(socket.id);
      if (i !== -1) {
        players.splice(i, 1);
        console.log(`🚪 Left room ${roomId}`);
        if (players.length === 0) {
          clearInterval(activeTimers[roomId]?.intervalId);
          delete activeTimers[roomId];
          delete gameRooms[roomId];
        }
        break;
      }
    }
  }

  function startTurnTimer(io, game, gameId) {
    let timeLeft = 15;
    if (activeTimers[gameId]) clearInterval(activeTimers[gameId].intervalId);

    const intervalId = setInterval(() => {
      timeLeft--;
      io.to(gameId).emit("timer_tick", timeLeft);
      if (timeLeft <= 0) clearInterval(intervalId);
    }, 1000);

    activeTimers[gameId] = { intervalId, timeLeft };
  }
};

function checkSOS(board, row, col, timeLeft) {
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];

  const winningCellsSet = new Set();
  let basePoints = 0;

  directions.forEach(({ dr, dc }) => {
    for (let i = -2; i <= 0; i++) {
      const seq = [
        { r: row + i * dr, c: col + i * dc },
        { r: row + (i + 1) * dr, c: col + (i + 1) * dc },
        { r: row + (i + 2) * dr, c: col + (i + 2) * dc },
      ];

      if (
        seq.every(
          ({ r, c }) =>
            r >= 0 && r < board.length && c >= 0 && c < board[0].length
        )
      ) {
        const formed = seq.map(({ r, c }) => board[r][c].letter).join("");
        if (formed === "SOS") {
          basePoints++;
          seq.forEach(({ r, c }) => winningCellsSet.add(`${r},${c}`));
        }
      }
    }
  });

  let timeBonus = 0;
  if (basePoints) {
    if (timeLeft >= 14) timeBonus = 5;
    else if (timeLeft >= 12) timeBonus = 4;
    else if (timeLeft >= 9) timeBonus = 3;
    else if (timeLeft >= 6) timeBonus = 2;
    else if (timeLeft >= 3) timeBonus = 1;
  }

  const totalPoints = basePoints ? basePoints + timeBonus : 0;
  const winningCells = Array.from(winningCellsSet).map((s) => {
    const [r, c] = s.split(",").map(Number);
    return { r, c };
  });

  return { totalPoints, winningCells };
}

function updateScore(game, player, points) {
  const currentScore = game.scores.get(player) || 0;
  game.scores.set(player, currentScore + points);
}
