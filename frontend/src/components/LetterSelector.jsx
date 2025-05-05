import React from "react";
import { Button, ButtonGroup, Box, Text } from "@chakra-ui/react";

const LetterSelector = ({ letter, setLetter }) => {
  const letterButtonsText = [{ letter: "S" }, { letter: "O" }];

  const letterButton = (buttonText) => (
    <Button
      onClick={() => setLetter(buttonText.letter)}
      colorScheme={letter === buttonText.letter ? "teal" : "gray"}
      fontSize="xl"
      fontWeight="italic"
      aria-pressed={letter === buttonText.letter}
      _active={{ transform: "scale(0.95)" }}
      transition="all 0.2s"
    >
      {buttonText.letter}
    </Button>
  );

  return (
    <Box mb={6} textAlign="center">
      <Text fontSize="md" fontWeight="light" mb={3} color="gray.700">
        Select Your Letter
      </Text>
      <ButtonGroup isAttached variant="solid" size="lg">
        {letterButtonsText.map((buttonText) => letterButton(buttonText))}
      </ButtonGroup>
    </Box>
  );
};

export default LetterSelector;
