import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

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
      });

      socket.on("game_ready", (opponentUser, currentTurn) => {
        setOpponentUser(opponentUser);
        setCurrentTurn(currentTurn == player ? true : false);
      });

      socket.on(
        "update_board",
        ({ board, currentTurn, scores, timeLeft, winningCells }) => {
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
        socket = null;
        console.log("❌ Socket disconnected.");
      }
    };
  }, [player]);

  const makeMove = (row, col, letter) => {
    const makeMove = (row, col, letter, player) => {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => r.map((cell) => ({ ...cell })));
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
    socket.emit("game_started", { player });
  };

  const gameOver = (winner) => {
    if (opponentUser.username == winner) {
      console.log(gameId, winner);
      const scores = [
        { player: player, score: score.Player1 },
        { player: opponentUser.userId, score: score.Player2 },
      ];
      socket.emit("game_over", { gameId, winner, scores });
    }
  };

  const restartGame = () => {
    setBoard(
      Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ({ letter: "", player: null }))
      )
    );
    setOpponentUser({
      username: "",
      userId: "",
    });
    setTotalWinningCells([]);
    setTimeLeft(15);
    setScore({ Player1: 0, Player2: 0 });
  };

  return {
    gameId,
    startGame,
    gameOver,
    restartGame,
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
