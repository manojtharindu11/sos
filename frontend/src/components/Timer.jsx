import React from "react";
import { Text } from "@chakra-ui/react";

function Timer({ currentTurn, timeLeft }) {
  return (
    <>
      {currentTurn && (
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={timeLeft <= 3 ? "red.500" : "green.500"}
        >
          ⏳ Time Left: {timeLeft}s
        </Text>
      )}
    </>
  );
}

export default Timer;
