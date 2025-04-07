// src/components/GameBoard.jsx
import React, { useState, useEffect } from "react";
import socket from "../socket";

const gridSize = 5;

const GameBoard = () => {
  const [board, setBoard] = useState(
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(""))
  );
  const [currentPlayer, setCurrentPlayer] = useState("Player 1");
  const [symbol, setSymbol] = useState("S");

  const handleClick = (row, col) => {
    if (board[row][col] !== "") return;

    const newBoard = [...board.map((row) => [...row])];
    newBoard[row][col] = symbol;

    setBoard(newBoard);
    socket.emit("move", { board: newBoard, player: currentPlayer });

    // switch player
    setCurrentPlayer((prev) => (prev === "Player 1" ? "Player 2" : "Player 1"));
  };

  useEffect(() => {
    socket.on("updateBoard", ({ board }) => {
      setBoard(board);
    });

    return () => {
      socket.off("updateBoard");
    };
  }, []);

  // GameBoard.jsx (only update the return block)

  return (
    <div className="text-center">
      <h2>{currentPlayer}'s Turn</h2>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setSymbol("S")} disabled={symbol === "S"}>
          S
        </button>
        <button onClick={() => setSymbol("O")} disabled={symbol === "O"}>
          O
        </button>
      </div>
      <div
        className="grid-container"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 60px)` }}
      >
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
              className="grid-cell"
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
