const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

let gameState = {
  players: [],
  board: Array(3).fill(null).map(() => Array(3).fill("")),
  scores: {},
  currentPlayer: 0,
};

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("joinGame", (playerName) => {
    if (gameState.players.length >= 2) return;

    gameState.players.push({ id: socket.id, name: playerName });
    gameState.scores[playerName] = 0;

    io.emit("gameUpdate", gameState);
    console.log(`${playerName} joined the game`);

    if (gameState.players.length === 2) {
      io.emit("startGame", gameState);
    }
  });

  socket.on("makeMove", ({ row, col, symbol }) => {
    if (!gameState.board[row][col]) {
      gameState.board[row][col] = symbol;
      // Example logic: if move was valid, give point
      const currentPlayerName = gameState.players[gameState.currentPlayer].name;
      gameState.scores[currentPlayerName] += 1; // Add actual scoring logic here

      gameState.currentPlayer = (gameState.currentPlayer + 1) % 2;
      io.emit("gameUpdate", gameState);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    gameState = {
      players: [],
      board: Array(3).fill(null).map(() => Array(3).fill("")),
      scores: {},
      currentPlayer: 0,
    };
    io.emit("resetGame");
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
