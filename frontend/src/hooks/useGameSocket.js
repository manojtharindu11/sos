import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const useGameSocket = ({ gameId, player }) => {
  const [board, setBoard] = useState(() => Array.from({ length: 3 }, () => Array(3).fill("")));
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
