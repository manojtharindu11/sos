import React, { useState } from "react";
import {
  Flex,
  Heading,
  HStack,
  Button,
  Spacer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../api/auth";

function HomeHeader() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogOut = () => {
    logout();
    navigate("/login");
  };

  const handleButtonView = () => {
    return !isAuthenticated() ? (
      <>
        {loginButton} {signupButton}
      </>
    ) : (
      { logoutButton }
    );
  };

  const logoutButtonStyle = {
    backgroundColor: isHovered ? "white" : "#f56565",
    color: isHovered ? "#f56565" : "white",
    border: "1px solid",
    borderColor: isHovered ? "#f56565" : "transparent",
    transition: "all 0.2s ease-in-out",
    transform: isHovered ? "scale(1.03)" : "scale(1)",
  };

  const loginButton = (
    <Button
      colorScheme="blue"
      variant="outline"
      _hover={{
        bg: "blue.500",
        color: "white",
        borderColor: "blue.500",
        transform: "scale(1.03)",
      }}
      transition="all 0.2s ease-in-out"
      onClick={() => navigate("/login")}
    >
      Log In
    </Button>
  );

  const signupButton = (
    <Button
      colorScheme="blue"
      bg="blue.500"
      color="white"
      _hover={{
        bg: "blue.600",
        transform: "scale(1.03)",
      }}
      transition="all 0.2s ease-in-out"
      onClick={() => navigate("/signup")}
    >
      Sign Up
    </Button>
  );

  const logoutButton = (
    <Button
      style={logoutButtonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleLogOut}
    >
      Log Out
    </Button>
  );

  return (
    <>
      <Breadcrumb mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink href="#"></BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">home</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex align="center" mb={10}>
        <Heading size="lg" color="blue.600">
          SOS Game
        </Heading>
        <Spacer />
        <HStack spacing={4}>{handleButtonView()}</HStack>
      </Flex>
    </>
  );
}

export default HomeHeader;
