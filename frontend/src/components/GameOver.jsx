import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { FaRedo, FaTrophy } from "react-icons/fa";

const GameOver = ({ winner, onRestart }) => {
  const isDraw = winner === "draw";
  return (
    <Box
      p={8}
      borderRadius="xl"
      bg="gray.50"
      boxShadow="lg"
      textAlign="center"
      maxW="sm"
      mx="auto"
    >
      <VStack spacing={4}>
        <HStack justify="center" spacing={3}>
          <Icon
            as={FaTrophy}
            color={isDraw ? "gray.400" : "yellow.400"}
            boxSize={8}
          />
          <Heading size="lg" color="teal.700">
            Game Over
          </Heading>
        </HStack>
        <Text fontSize="md" fontWeight="semibold" color="gray.700">
          {isDraw
            ? "🤝 It's a draw! Well played!"
            : `🏆 Congratulations, ${winner}!`}
        </Text>
        <Button
          leftIcon={<FaRedo />}
          colorScheme="teal"
          size="lg"
          onClick={onRestart}
          px={8}
        >
          Play Again
        </Button>
      </VStack>
    </Box>
  );
};

export default GameOver;
