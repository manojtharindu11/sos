import React, { useState } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import useGameSocket from "../hooks/useGameSocket";
import GameBoard from "../components/GameBoard";
import LetterSelector from "../components/LetterSelector";

function Game() {
  const [letter, setLetter] = useState("S");
  const [player] = useState("Player1");
  const [gameId] = useState("sos-123");

  const { board, makeMove, score } = useGameSocket({ gameId, player });
  return (
    <Box p={4}>
      <Heading mb={4}>SOS Game</Heading>
      <LetterSelector letter={letter} setLetter={setLetter} />
      <GameBoard
        board={board}
        onCellClick={(row, col) => makeMove(row, col, letter)}
      />
      <Text mt={4}>Score: {score.Player1}</Text>
    </Box>
  );
}

export default Game;
