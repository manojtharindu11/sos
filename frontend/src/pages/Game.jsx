import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  Container,
} from "@chakra-ui/react";
import useGameSocket from "../hooks/useGameSocket";
import GameBoard from "../components/gameBoard";
import LetterSelector from "../components/letterSelector";
import { UserContext } from "../context/userContext";
import AllPlayers from "../components/allPlayers";
import ProfileCard from "../components/profileCard";
import Timer from "../components/timer";
import GameOver from "../components/gameOver";
import BreadcrumbNav from "../components/breadcrumbNav";

function Game() {
  const { user } = useContext(UserContext);
  const [letter, setLetter] = useState("S");
  const [player, setPlayer] = useState(user?.id);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    setPlayer(user?.id);
  }, [user]);

  const {
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
  } = useGameSocket({
    player,
  });

  useEffect(() => {
    const allFilled = board.every((row) =>
      row.every((cell) => cell.player != null)
    );

    if (allFilled) {
      setIsGameOver(true);
      setWinner(findWinner());
    }
  }, [board]);

  useEffect(() => {
    if (winner != null) {
      gameOver(winner);
    }
  }, [winner]);

  const findWinner = () => {
    if (score.Player1 > score.Player2) {
      return user.username;
    } else if (score.Player1 < score.Player2) {
      return opponentUser.username;
    } else {
      return "draw";
    }
  };

  const handleStartGame = () => {
    startGame();
    setIsGameStarted(true);
  };

  const handleRestart = () => {
    restartGame();
    setIsGameOver(false);
    setIsGameStarted(false);
    setWinner(null);
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="container.lg">
      <BreadcrumbNav />
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={4}
        >
          <ProfileCard />
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={8}
            width="100%"
            my={6}
            justify="space-between"
          >
            {/* Left Side - Active Players */}
            <Box
              flex="1"
              bg="white"
              p={4}
              rounded="md"
              shadow="md"
              minW="280px"
            >
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
              minW="300px"
            >
              {!isGameStarted ? (
                <>
                  <Heading size="lg" mb={6}>
                    Welcome to the SOS Game!
                  </Heading>
                  <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={handleStartGame}
                    _hover={{ bg: "teal.500", transform: "scale(1.05)" }}
                    transition="all 0.3s ease"
                  >
                    Start Playing
                  </Button>
                </>
              ) : opponentUser.username !== "" ? (
                <VStack spacing={6}>
                  <Heading size="lg">SOS Game</Heading>
                  {!isGameOver ? (
                    <>
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
                    </>
                  ) : (
                    <GameOver winner={winner} onRestart={handleRestart} />
                  )}
                  <Flex
                    justifyContent="space-between"
                    width="100%"
                    mt={4}
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    <Text>My Score: {score.Player1}</Text>
                    <Text>
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
      </Container>
    </Box>
  );
}

export default Game;
