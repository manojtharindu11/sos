import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Container,
  List,
  ListItem,
  ListIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import HomeHeader from "../components/homeHeader";
import { isAuthenticated } from "../api/auth";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultIndex, setDefaultIndex] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      setDefaultIndex(2);
    } else {
      setDefaultIndex(0);
    }
  }, [location.pathname]);

  const getStartedButton = (
    <Button
      mt={6}
      ml={0}
      size="lg"
      colorScheme="blue"
      bg="blue.500"
      color="white"
      _hover={{
        bg: "blue.600",
        transform: "scale(1.05)",
        boxShadow: "lg",
      }}
      transition="all 0.2s ease-in-out"
      onClick={() => navigate("/game")}
    >
      Get Started
    </Button>
  );

  const howToPlayList = (
    <Text fontSize="md" color="gray.600" lineHeight="1.8">
      1. The game board is a 3x3 grid.
      <br />
      2. Each player takes turns selecting a cell and choosing either "S" or
      "O".
      <br />
      3. A point is scored when a player forms "SOS" in any direction.
      <br />
      4. The game continues until all cells are filled.
      <br />
      5. The player with the most points wins!
    </Text>
  );

  const whyYouWillLoveItList = (
    <List spacing={4} color="gray.600">
      {[
        "Fast-paced and strategic gameplay",
        "Great for players of all ages",
        "Challenge your friends online",
        "Track your performance and improve over time",
      ].map((item, idx) => (
        <ListItem key={idx}>
          <ListIcon as={FaCheckCircle} color="blue.500" />
          {item}
        </ListItem>
      ))}
    </List>
  );

  const tabView = [
    {
      tab: "How to Play",
      tabPanel: howToPlayList,
    },
    {
      tab: "Why You'll Love It",
      tabPanel: whyYouWillLoveItList,
    },
    {
      tab: "Let's Get Started",
      tabPanel: getStartedButton,
    },
  ];

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="container.lg">
        <HomeHeader />

        <VStack spacing={10} align="start">
          <Heading size="2xl" color="gray.700">
            Welcome to the SOS Game!
          </Heading>
          <Text fontSize="lg" color="gray.600">
            SOS is a classic two-player game where players take turns placing an
            "S" or an "O" on a 3x3 grid. The goal is to form the word "SOS"
            horizontally, vertically, or diagonally.
          </Text>

          <Tabs
            variant="enclosed"
            index={defaultIndex}
            onChange={(index) => setDefaultIndex(index)}
          >
            <TabList>
              {tabView.map((tabItem, idx) => (
                <Tab
                  key={idx}
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  _selected={{
                    color: "gray.700",
                    borderBottom: "2px solid #3182ce",
                  }}
                  _hover={{ color: "white" }}
                >
                  {tabItem.tab}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {tabView.map((tabItem, idx) => (
                <TabPanel key={idx}>{tabItem.tabPanel}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}

export default Home;
