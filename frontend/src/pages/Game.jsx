import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  Container,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import useGameSocket from "../hooks/useGameSocket";
import GameBoard from "../components/GameBoard";
import LetterSelector from "../components/LetterSelector";
import { UserContext } from "../context/userContext";
import ProfileCard from "../components/ProfileCard";
import Timer from "../components/Timer";
import GameOver from "../components/GameOver";
import BreadcrumbNav from "../components/breadcrumbNav";
import StartGameButton from "../components/startGameButton";
import ActivePlayers from "../components/activePlayers";

function Game() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) || {};
  const [letter, setLetter] = useState("S");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const {
    gameId,
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
  } = useGameSocket({ player: user?.id });

  useEffect(() => {
    if (board.every((row) => row.every((cell) => cell.player != null))) {
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
    }
    return "draw";
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

  useEffect(() => {
    if (opponentUser.username) {
      navigate(`/game/${gameId}`);
    } else {
      navigate(`/game`);
    }
  }, [opponentUser, gameId, navigate]);

  const handleOnCellClick = (row, col) => {
    if (!currentTurn) return;
    makeMove(row, col, letter);
  };

  const LoadingMessage = () => (
    <Center h="full" flexDirection="column">
      <Spinner size="xl" color="teal.500" mb={4} />
      <Text fontSize="xl" color="gray.600">
        Loading opponent...
      </Text>
    </Center>
  );

  const StartedGame = () => (
    <VStack spacing={1} h="calc(100vh - 300px)">
      <Heading
        size="lg"
        bgGradient="linear(to-r, teal.500, blue.500)"
        bgClip="text"
        fontWeight="extrabold"
        letterSpacing="wide"
        textAlign="center"
      >
        SOS Game
      </Heading>
      {!isGameOver ? (
        <>
          <Timer currentTurn={currentTurn} timeLeft={timeLeft} />
          <LetterSelector letter={letter} setLetter={setLetter} />
          <GameBoard
            board={board}
            userId={user?.id}
            currentTurn={currentTurn}
            player1={user?.id}
            onCellClick={handleOnCellClick}
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
        <Text>
          {user?.username} Score: {score.Player1}
        </Text>
        <Text>
          {opponentUser?.username} Score: {score.Player2}
        </Text>
      </Flex>
    </VStack>
  );

  return (
    <Box minH="100vh" maxH="100vh" bg="gray.50" py={12}>
      <Container maxW="container.lg">
        <BreadcrumbNav />
        <Flex direction="column" align="center" justify="center" py={4}>
          <ProfileCard winner={winner} />
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={8}
            width="100%"
            my={6}
            justify="space-between"
          >
            <Box
              flex="1"
              bg="white"
              p={4}
              rounded="md"
              shadow="md"
              minW="280px"
              maxH="calc(100vh - 200px)"
              overflowY="auto"
            >
              <ActivePlayers activeUsers={activeUsers} />
            </Box>

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
                <StartGameButton
                  onStartGame={handleStartGame}
                  isDisable={activeUsers.length === 0}
                />
              ) : opponentUser.username !== "" ? (
                <StartedGame />
              ) : (
                <LoadingMessage />
              )}
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Game;
