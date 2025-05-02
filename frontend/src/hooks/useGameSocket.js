import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket; // Keep it outside

const useGameSocket = ({ player }) => {
  const [gameId, setGameId] = useState();
  const boardSize = 3;
  const [board, setBoard] = useState(() =>
    Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => ({ letter: "", player: null }))
    )
  );

  const [score, setScore] = useState({ Player1: 0, Player2: 0 });
  const [activeUsers, setActiveUsers] = useState([]);
  const [opponentUser, setOpponentUser] = useState({
    username: "",
    userId: "",
  });
  const [currentTurn, setCurrentTurn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalWinningCells, setTotalWinningCells] = useState([]);

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

      socket.on("game_ready", (opponentUser, currentTurn) => {
        setOpponentUser(opponentUser);
        setCurrentTurn(currentTurn == player ? true : false);
        console.log(opponentUser);
      });

      socket.on(
        "update_board",
        ({ board, currentTurn, scores, timeLeft, winningCells }) => {
          console.log(board);
          setBoard(board);
          setCurrentTurn(currentTurn == player ? true : false);
          setScore({
            Player1: scores[player],
            Player2: Object.keys(scores).find((key) => key !== player)
              ? scores[Object.keys(scores).find((key) => key !== player)]
              : 0,
          });
          setTimeLeft(timeLeft);
          setTotalWinningCells((prevWinningCells) => [
            ...prevWinningCells,
            ...winningCells,
          ]);
        }
      );

      socket.on("timer_tick", (timeLeft) => {
        setTimeLeft(timeLeft);
      });
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("active_users");
        socket.off("room_assigned");
        socket.off("game_ready");
        socket.off("update_board");
        socket.off("timer_tick");
        socket.disconnect();
        socket = null; // 🔥 Important: Set it to null after disconnect
        console.log("❌ Socket disconnected.");
      }
    };
  }, [player]); // Only depend on player

  const makeMove = (row, col, letter) => {
    const makeMove = (row, col, letter, player) => {
      const timestamp = new Date().toISOString();

      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => r.map((cell) => ({ ...cell }))); // deep copy
        if (!newBoard[row][col].letter) {
          newBoard[row][col] = {
            letter,
            player,
          };
        }
        return newBoard;
      });
    };

    if (socket) {
      socket.emit("make_move", { gameId, row, col, letter, player, timeLeft });
    }
  };

  const startGame = () => {
    console.log("Game started");
    socket.emit("game_started", { player });
  };

  return {
    startGame,
    board,
    makeMove,
    score,
    activeUsers,
    opponentUser,
    currentTurn,
    timeLeft,
    totalWinningCells,
  };
};

export default useGameSocket;
