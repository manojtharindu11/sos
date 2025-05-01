import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket; // Keep it outside

const useGameSocket = ({ player }) => {
  const [gameId, setGameId] = useState();
  const boardSize = 3;
  const [board, setBoard] = useState(() =>
    Array.from({ length: boardSize }, () => Array(boardSize).fill(""))
  );
  const [score, setScore] = useState({ Player1: 0, Player2: 0 });
  const [activeUsers, setActiveUsers] = useState([]);
  const [opponentUser, setOpponentUser] = useState();

  useEffect(() => {
    if (player !== undefined && !socket) {
      // 🔥 Prevent multiple connections
      socket = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId: player },
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected.");
      });

      socket.on("active_users", (active_users) => {
        const activeUsers = active_users.filter(
          (user) => user.userId !== player
        );
        setActiveUsers(activeUsers);
      });

      socket.on("room_assigned", (roomId) => {
        setGameId(roomId);
        console.log(roomId);
      });

      socket.on("game_ready", (opponentUser) => {
        setOpponentUser(opponentUser);
        console.log(opponentUser);
      });
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("active_users");
        socket.off("room_assigned");
        socket.off("game_ready");
        socket.disconnect();
        socket = null; // 🔥 Important: Set it to null after disconnect
        console.log("❌ Socket disconnected.");
      }
    };
  }, [player]); // Only depend on player

  const makeMove = (row, col, letter) => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((r) => [...r]);
      newBoard[row][col] = letter;
      return newBoard;
    });

    if (socket) {
      socket.emit("make_move", { gameId, row, col, letter, player });
    }
  };

  const startGame = () => {
    console.log("Game started");
    socket.emit("game_started", { player });
  };

  return { startGame, board, makeMove, score, activeUsers, opponentUser };
};

export default useGameSocket;
