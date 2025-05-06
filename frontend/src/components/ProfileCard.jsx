import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { UserContext } from "../context/userContext";
import { NavLink } from "react-router-dom"; // Import NavLink for navigation
import { decodedToken } from "../utils/token";
import { getCurrentScoreAsync, getRankAsync } from "../api/game";

function ProfileCard({ winner }) {
  const { user, setUser } = useContext(UserContext);
  const [currentScore, setCurrentScore] = useState(0);
  const [rank, setRank] = useState("Unranked");

  useEffect(() => {
    const decoded = decodedToken();
    if (decoded) {
      setUser(decoded);
    }
    getCurrentScore();
    getRank();
  }, [winner]);

  const getCurrentScore = async () => {
    try {
      const score = await getCurrentScoreAsync();
      if (score) {
        setCurrentScore(score);
      }
    } catch (error) {
      console.error("Error fetching current score:", error);
    }
  };

  const getRank = async () => {
    try {
      const rank = await getRankAsync();
      if (rank) {
        setRank(rank);
      }
    } catch (error) {
      console.error("Error fetching rank:", error);
    }
  };

  const formattedRank =
    rank !== "Unranked" ? String(rank).padStart(3, "0") : "Unranked";

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const strongTextColor = useColorModeValue("gray.700", "white");

  const navLinks = [
    {
      label: "Home",
      route: "/home",
    },
    {
      label: "Profile",
      route: "#",
    },
    {
      label: "Leaderboard",
      route: "#",
    },
  ];

  const displayNavigation = navLinks.map((link) => (
    <Button key={link.label} variant="link" as={NavLink} to={link.route}>
      {link.label}
    </Button>
  ));

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
            name={user?.username}
            src={user?.avatarUrl || ""}
            mr={3}
          />
          <Box minW="0">
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={strongTextColor}
              isTruncated
            >
              {user?.username}
            </Text>
            <Text fontSize="sm" color={textColor}>
              Rank:{" "}
              <Badge colorScheme="blue" ml={1}>
                {formattedRank}
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
                {currentScore}
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
          {displayNavigation}
        </Flex>
      </Flex>
    </Box>
  );
}

export default ProfileCard;
