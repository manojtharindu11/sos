const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

require('dotenv').config();

// Corrected MongoDB URI connection string options
mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true, // Corrected option name
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.get("/", (req, res) => {
  res.send("Welcome to the Escape Room Game API!");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
