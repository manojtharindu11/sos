import React from "react";
import { Grid, Button } from "@chakra-ui/react";

const GameBoard = ({ board, onCellClick, currentTurn }) => (
  <Grid templateColumns="repeat(3, 50px)" gap={2}>
    {board.map((row, i) =>
      row.map((cell, j) => (
        <Button
          key={`${i}-${j}`}
          width="50px"
          height="50px"
          onClick={() => onCellClick(i, j)}
          disabled={!!cell || !currentTurn} // Disable if cell is filled OR not user's turn
        >
          {cell}
        </Button>
      ))
    )}
  </Grid>
);

export default GameBoard;
