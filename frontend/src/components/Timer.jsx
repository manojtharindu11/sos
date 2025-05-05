import React, { useEffect, useRef } from "react";
import { Text, useToast } from "@chakra-ui/react";

function Timer({ currentTurn, timeLeft }) {
  const toast = useToast();
  const lastToastTime = useRef(null);

  useEffect(() => {
    if (
      currentTurn &&
      timeLeft <= 3 &&
      timeLeft > 0 &&
      lastToastTime.current !== timeLeft
    ) {
      toast({
        title: `⏳ Hurry up!`,
        description: `Only ${timeLeft} second${
          timeLeft === 1 ? "" : "s"
        } left.`,
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
      lastToastTime.current = timeLeft;
    }
  }, [timeLeft, toast]);

  return (
    <>
      {currentTurn && (
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={timeLeft <= 3 ? "red.500" : "green.500"}
          position="absolute"
          top="1rem"
          right="1rem"
          zIndex="10"
        >
          ⏱️ Time Left: {timeLeft}s
        </Text>
      )}
    </>
  );
}

export default Timer;
