import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Spacer,
  Container,
  Flex,
} from "@chakra-ui/react";

function Home() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="container.lg">
        {/* Header */}
        <Flex align="center" mb={10}>
          <Heading size="lg" color="blue.600">
            SOS Game
          </Heading>
          <Spacer />
          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              variant="outline"
              _hover={{
                bg: "blue.500",
                color: "white",
                borderColor: "blue.500",
              }}
              transition="all 0.2s ease-in-out"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button
              colorScheme="blue"
              bg="blue.500"
              color="white"
              _hover={{
                bg: "white",
                color: "white.500",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              transition="all 0.2s ease-in-out"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </HStack>
        </Flex>

        {/* Body Content */}
        <VStack spacing={6} align="start">
          <Heading size="2xl" color="gray.700">
            Welcome to the SOS Game!
          </Heading>
          <Text fontSize="lg" color="gray.600">
            SOS is a fun and simple word game played on a 3x3 grid. Players take
            turns placing an "S" or an "O" in any empty cell. The goal is to
            form the sequence "SOS" in any direction—horizontally, vertically,
            or diagonally.
          </Text>
          <Text fontSize="md" color="gray.500">
            Challenge your friends, track your score, and climb the leaderboard!
          </Text>

          <Button
            mt={4}
            size="lg"
            colorScheme="blue"
            bg="blue.500"
            color="white"
            _hover={{
              bg: "blue.600",
              transform: "scale(1.03)",
            }}
            transition="all 0.2s ease-in-out"
          >
            Get Started
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

export default Home;
