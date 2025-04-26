import React, { useState, useContext, useEffect, use } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import useGameSocket from "../hooks/useGameSocket";
import GameBoard from "../components/GameBoard";
import LetterSelector from "../components/LetterSelector";
import { UserContext } from "../context/userContext";

function Game() {
  const { user } = useContext(UserContext);
  const [letter, setLetter] = useState("S");
  const [player] = useState(user?.id);
  const [gameId] = useState("sos-123");

  useEffect(() => {
    console.log(user);
  }, []);

  const { board, makeMove, score } = useGameSocket({ gameId, player });
  return (
    <Box p={4}>
      <Heading mb={4}>SOS Game</Heading>
      <LetterSelector letter={letter} setLetter={setLetter} />
      <GameBoard
        board={board}
        onCellClick={(row, col) => makeMove(row, col, letter)}
      />
      <Text mt={4}>My Score: {score.Player1}</Text>
      <Text mt={4}>other Score: {score.Player2}</Text>
    </Box>
  );
}

export default Game;
