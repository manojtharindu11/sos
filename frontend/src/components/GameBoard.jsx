import React from "react";
import { Grid, Button } from "@chakra-ui/react";

const GameBoard = ({
  board,
  userId,
  onCellClick,
  currentTurn,
  totalWinningCells,
}) => (
  <Grid templateColumns="repeat(3, 50px)" gap={2}>
    {board.map((row, i) =>
      row.map((cell, j) => {
        const isCellFilled = cell && cell.letter;
        return (
          <Button
            key={`${i}-${j}`}
            width="50px"
            height="50px"
            onClick={() => onCellClick(i, j)}
            disabled={isCellFilled || !currentTurn}
          >
            {isCellFilled ? cell.letter : ""}
          </Button>
        );
      })
    )}
  </Grid>
);

export default GameBoard;
