import React from "react";

const CELL_SIZE = 50;
const BOARD_PADDING = 2;

// Map each user to a color
const userColors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "teal",
  "pink",
  "cyan",
];

const GameBoard = ({
  board,
  onCellClick,
  currentTurn,
  totalWinningCells = [],
}) => {
  // Normalize and group by user
  const groupWinningCellsByUser = () => {
    const grouped = {};

    totalWinningCells.forEach((cell) => {
      const { r, c, user } = cell;
      if (!grouped[user]) grouped[user] = [];
      grouped[user].push({ r, c }); // Store as {r, c} objects
    });

    return Object.entries(grouped).map(([user, cells], index) => ({
      user,
      color: userColors[index % userColors.length],
      cells,
    }));
  };

  const normalizedWinningSequences = groupWinningCellsByUser();

  const renderWinningLines = () => {
    return normalizedWinningSequences.map((sequenceObj, seqIndex) => {
      const { color = "gold", cells } = sequenceObj;

      if (!Array.isArray(cells) || cells.length < 2) return null;

      // For diagonal lines, we only need the start and end points.
      const startCell = cells[0];
      const endCell = cells[cells.length - 1];

      // Calculate the center coordinates of the start and end cells
      const x1 = startCell.c * CELL_SIZE + CELL_SIZE / 2 + BOARD_PADDING;
      const y1 = startCell.r * CELL_SIZE + CELL_SIZE / 2 + BOARD_PADDING;
      const x2 = endCell.c * CELL_SIZE + CELL_SIZE / 2 + BOARD_PADDING;
      const y2 = endCell.r * CELL_SIZE + CELL_SIZE / 2 + BOARD_PADDING;

      return (
        <line
          key={`line-${seqIndex}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${CELL_SIZE * board[0].length + BOARD_PADDING * 2}px`,
        height: `${CELL_SIZE * board.length + BOARD_PADDING * 2}px`,
        backgroundColor: "lightgray",
        padding: `${BOARD_PADDING}px`,
      }}
    >
      {/* SVG for winning lines */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        {renderWinningLines()}
      </svg>

      {/* Game cells */}
      {board.map((row, i) =>
        row.map((cell, j) => {
          const isCellFilled = cell && cell.letter;

          // Check if current cell is in any winning sequence
          const isWinningCell = totalWinningCells.some((c) => c.r === i && c.c === j);

          let color = "black";
          if (cell?.letter === "S")
            color = isWinningCell ? "darkred" : "red";
          if (cell?.letter === "O")
            color = isWinningCell ? "darkblue" : "blue";

          const cellStyle = {
            position: "absolute",
            top: `${i * CELL_SIZE + BOARD_PADDING}px`,
            left: `${j * CELL_SIZE + BOARD_PADDING}px`,
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            fontSize: "24px",
            fontWeight: "bold",
            color: color,
            backgroundColor: isWinningCell ? "lightyellow" : "white",
            border: isWinningCell ? "2px solid gold" : "1px solid gray",
            cursor: isCellFilled || !currentTurn ? "default" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          };

          const hoverStyle =
            isCellFilled || !currentTurn
              ? {}
              : { backgroundColor: "gainsboro" };

          return (
            <div
              key={`cell-${i}-${j}`}
              style={{ ...cellStyle, ...hoverStyle }}
              onClick={() => onCellClick(i, j)}
            >
              {isCellFilled ? cell.letter : ""}
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameBoard;
