import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  Divider,
} from "@chakra-ui/react";
import useGameSocket from "../hooks/useGameSocket";
import GameBoard from "../components/GameBoard";
import LetterSelector from "../components/LetterSelector";
import { UserContext } from "../context/userContext";
import AllPlayers from "../components/AllPlayers";
import ProfileCard from "../components/ProfileCard";
import Timer from "../components/Timer";

function Game() {
  const { user } = useContext(UserContext);
  const [letter, setLetter] = useState("S");
  const [player, setPlayer] = useState(user?.id);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    setPlayer(user?.id);
  }, [user]);

  const {
    startGame,
    board,
    makeMove,
    score,
    activeUsers,
    opponentUser,
    currentTurn,
    timeLeft,
    totalWinningCells,
  } = useGameSocket({
    player,
  });

  const handleStartGame = () => {
    startGame();
    setIsGameStarted(true);
  };

  return (
    <Flex
      minHeight="100vh"
      p={6}
      bg="gray.50"
      direction="column"
      align="center"
    >
      <Box mb={8}>
        <ProfileCard />
      </Box>

      <Flex width="100%" maxW="1200px" gap={8}>
        {/* Left Side - Active Players */}
        <Box flex="1" bg="white" p={4} rounded="md" shadow="md">
          <Heading size="md" mb={4}>
            Active Players
          </Heading>
          <AllPlayers activeUsers={activeUsers} />
        </Box>

        {/* Right Side - Game */}
        <Box
          flex="2"
          bg="white"
          p={6}
          rounded="md"
          shadow="md"
          textAlign="center"
        >
          {!isGameStarted ? (
            <>
              <Heading size="lg" mb={6}>
                Welcome to the SOS Game!
              </Heading>
              <Button colorScheme="teal" size="lg" onClick={handleStartGame}>
                Start Playing
              </Button>
            </>
          ) : opponentUser.username !== "" ? (
            <VStack spacing={6}>
              <Heading size="lg">SOS Game</Heading>
              <Timer currentTurn={currentTurn} timeLeft={timeLeft} />
              <LetterSelector letter={letter} setLetter={setLetter} />
              <GameBoard
                board={board}
                userId={player}
                currentTurn={currentTurn}
                player1={player}
                onCellClick={(row, col) => {
                  if (!currentTurn) {
                    return;
                  }
                  makeMove(row, col, letter);
                }}
                totalWinningCells={totalWinningCells}
              />
              <Flex justifyContent="space-around" width="100%" mt={4}>
                <Text fontWeight="bold">My Score: {score.Player1}</Text>
                <Text fontWeight="bold">
                  {opponentUser.username} Score: {score.Player2}
                </Text>
              </Flex>
            </VStack>
          ) : (
            <Text>Loading opponent...</Text>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}

export default Game;
