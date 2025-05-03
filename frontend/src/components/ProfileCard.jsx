import React, { useContext } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  Spacer,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { UserContext } from "../context/userContext";
import { NavLink } from "react-router-dom"; // Import NavLink for navigation

function ProfileCard() {
  const { user } = useContext(UserContext);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const strongTextColor = useColorModeValue("gray.700", "white");

  if (!user) return null;

  return (
    <Box
      as="header"
      width="100%"
      bg={bg}
      px={{ base: 4, md: 6 }}
      py={4}
      shadow="sm"
      borderBottom="1px solid"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
        flexWrap="wrap"
        gap={4}
      >
        <Flex align="center" minW="0">
          <Avatar
            size="md"
            name={user.username}
            src={user.avatarUrl || ""}
            mr={3}
          />
          <Box minW="0">
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={strongTextColor}
              isTruncated
            >
              {user.username}
            </Text>
            <Text fontSize="sm" color={textColor}>
              Rank:{" "}
              <Badge colorScheme="blue" ml={1}>
                {user.rank || "Unranked"}
              </Badge>
            </Text>
          </Box>
        </Flex>

        <Flex align="center" gap={6}>
          <Box textAlign="right">
            <Text fontSize="sm" color={textColor}>
              Current Score
            </Text>
            <Text fontWeight="semibold" textAlign="center" fontSize="lg">
              <Badge colorScheme="green" fontSize="1em">
                {user.score || 0}
              </Badge>
            </Text>
          </Box>
        </Flex>

        <Flex
          justify="center"
          align="center"
          gap={8}
          fontSize="lg"
          color={textColor}
        >
          <Button variant="link" as={NavLink} to="/home">
            Home
          </Button>
          <Button variant="link" as={NavLink} to="/profile">
            Profile
          </Button>
          <Button variant="link" as={NavLink} to="/leaderboard">
            Leaderboard
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default ProfileCard;
