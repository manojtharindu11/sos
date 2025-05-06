require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const routes = require("./routes/routes");

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.VITE_FRONTEND_URLS.split(","),
    methods: ["GET", "POST"]
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB Error:", err));

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes); // API routes

// Socket logic
require("./socket/socket")(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
