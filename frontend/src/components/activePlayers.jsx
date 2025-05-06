import React from "react";
import {
  Box,
  Text,
  Avatar,
  VStack,
  Icon,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";

function ActivePlayers({ activeUsers }) {
  const onlineCount = activeUsers.length;

  return (
    <Box h="calc(100vh - 300px)" overflowY="auto">
      <Heading
        size="md"
        mb={4}
        position="sticky"
        top="0"
        bg="white"
        zIndex="1"
        textAlign="center"
        py={2}
        borderBottom="1px solid #E2E8F0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Text as="span">Online {onlineCount > 0 && `(${onlineCount})`}</Text>
      </Heading>

      <VStack align="stretch" spacing={3}>
        {onlineCount > 0 ? (
          activeUsers.map((user) => (
            <Flex
              key={user.socketId}
              align="center"
              p={3}
              rounded="md"
              bg="gray.100"
              boxShadow="sm"
              _hover={{ bg: "gray.200" }}
              transition="background 0.2s"
            >
              <Avatar
                size="sm"
                name={user.username}
                icon={<Icon as={FaUserCircle} boxSize={4} />}
                mr={3}
              />
              <Text fontWeight="semibold" isTruncated maxW="60%">
                {user.username}
              </Text>
              <Box ml="auto" w={2} h={2} bg="green.400" rounded="full" />
            </Flex>
          ))
        ) : (
          <Box py={4} textAlign="center">
            <Text color="gray.500" fontStyle="italic">
              🚫 No warriors in the arena right now...
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default ActivePlayers;
