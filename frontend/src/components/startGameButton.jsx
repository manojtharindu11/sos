import React from "react";
import {
  Button,
  Heading,
  Box,
  useBreakpointValue,
  Image,
  Text,
} from "@chakra-ui/react";
import { FaPlayCircle } from "react-icons/fa";

function StartGameButton({ onStartGame, isDisable }) {
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <Box
      textAlign="center"
      bg="teal.50"
      p={8}
      rounded="lg"
      shadow="md"
      mx={0}
      borderWidth="1px"
      borderColor="teal.100"
    >
      <Box mb={4}>
        <Image
          src="sos-logo.png"
          alt="Game Logo"
          boxSize="130px"
          objectFit="cover"
          mx="auto"
        />
        <Heading
          size={headingSize}
          mt={4}
          letterSpacing="wide"
          color="teal.600"
        >
          SOS Game Awaits!
        </Heading>
      </Box>

      <Text fontSize="lg" color="gray.700" mb={6}>
        A fun and challenging game where you play with friends to form words and
        score points. Ready to play?
      </Text>

      <Button
        colorScheme="teal"
        size={buttonSize}
        onClick={onStartGame}
        aria-label="Start the game"
        leftIcon={<FaPlayCircle />}
        _hover={{
          bg: "teal.500",
          transform: "scale(1.1)",
          boxShadow: "lg",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        transition="all 0.3s ease"
        px={6}
        fontSize={{ base: "lg", md: "xl" }}
        isDisabled={isDisable}
      >
        Start Game
      </Button>
    </Box>
  );
}

export default StartGameButton;
