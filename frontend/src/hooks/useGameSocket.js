import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL); // <-- FIXED!

const useGameSocket = ({ gameId, player }) => {
  const boardSize = 3;
  const [board, setBoard] = useState(() =>
    Array.from({ length: boardSize }, () => Array(boardSize).fill(""))
  );
  const [score, setScore] = useState({ Player1: 0, Player2: 0 });

  useEffect(() => {
    socket.emit("join_game", { gameId, player });

    socket.on("make_move", ({ row, col, letter }) => {
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard.map((r) => [...r])];
        newBoard[row][col] = letter;
        return newBoard;
      });
    });

    return () => {
      socket.off("make_move");
    };
  }, [gameId, player]);

  const makeMove = (row, col, letter) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard.map((r) => [...r])];
      newBoard[row][col] = letter;
      return newBoard;
    });
    socket.emit("make_move", { gameId, row, col, letter, player });
  };

  return { board, makeMove, score };
};

export default useGameSocket;
