import React, { useState } from "react";
import { Flex, Heading, HStack, Button, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";
import BreadcrumbNav from "./breadcrumbNav";
import {
  cancelButtonStyle,
  getLogoutButtonStyle,
  submitButtonStyle,
} from "../styles/commonStyles";

function HomeHeader() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const logoutButtonStyle = getLogoutButtonStyle(isHovered);

  const handleLogOut = () => {
    navigate("/home/logout");
  };

  const handleButtonView = () => {
    return !isAuthenticated() ? (
      <>
        {loginButton} {signupButton}
      </>
    ) : (
      logoutButton
    );
  };

  const loginButton = (
    <Button {...cancelButtonStyle} onClick={() => navigate("/home/login")}>
      Log In
    </Button>
  );

  const signupButton = (
    <Button {...submitButtonStyle} onClick={() => navigate("/home/signup")}>
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
      <BreadcrumbNav />
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
