import React from "react";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

const GameOver = ({ winner, onRestart }) => {
  return (
    <Box p={6} borderRadius="md" bg="gray.100" textAlign="center">
      <VStack spacing={4}>
        <Heading>🎉 Game Over!</Heading>
        <Text fontSize="xl">
          {winner === "draw"
            ? "It's a draw!"
            : `🏆 ${winner} is the winner!`}
        </Text>
        <Button colorScheme="teal" onClick={onRestart}>
          Play Again
        </Button>
      </VStack>
    </Box>
  );
};

export default GameOver;
