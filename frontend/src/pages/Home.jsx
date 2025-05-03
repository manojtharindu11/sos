// src/pages/Home.jsx
import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../components/homeHeader";

function Home() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="container.lg">
        <HomeHeader />

        <VStack spacing={6} align="start">
          <Heading size="2xl" color="gray.700">
            Welcome to the SOS Game!
          </Heading>
          <Text fontSize="lg" color="gray.600">
            SOS is a fun and simple word game played on a 3x3 grid...
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
            onClick={() => navigate("/game")}
          >
            Get Started
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

export default Home;
