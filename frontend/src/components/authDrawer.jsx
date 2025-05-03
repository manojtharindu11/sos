import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  useToast,
  Heading,
  Text,
  Link,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { login_async, signup_async, logout } from "../api/auth";
import {
  cancelButtonStyle,
  getLogoutButtonStyle,
  submitButtonStyle,
} from "../styles/commonStyles";

function AuthDrawer({ type = "login", isOpen, onClose, btnRef }) {
  const navigate = useNavigate();
  const toast = useToast();
  const isLogin = type === "login";
  const isSignup = type === "signup";
  const isLogout = type === "logout";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const logoutButtonStyle = getLogoutButtonStyle(isHovered);

  const validateData = (data) => {
    const errs = {};
    if (!data.username || data.username.trim().length < 3) {
      errs.username = "Username must be at least 3 characters";
    }
    if (!data.password || data.password.trim().length < 4) {
      errs.password = "Password must be at least 4 characters";
    }
    if (isSignup && (!data.email || !data.email.includes("@"))) {
      errs.email = "Valid email is required";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const setToast = (title, status) => {
    toast({
      title: title,
      status: status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateData(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = isLogin ? await login_async(form) : await signup_async(form);
      const title = isLogin ? "Login successful" : "Signup successful";
      const status = "success";
      setToast(title, status);
      navigate("/home");
      onClose();
    } catch (err) {
      const title =
        err?.response?.data?.message ||
        `Failed to ${isLogin ? "login" : "signup"}`;
      const status = "error";
      setToast(title, status);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = () => {
    logout();
    const title = "Logged out successfully";
    const status = "success";
    setToast(title, status);
    navigate("/login");
    onClose();
  };

  const handleOnClose = () => {
    navigate("/home");
    onClose();
  };

  const toggleAuthLink = isLogin ? "/home/signup" : "/home/login";
  const toggleText = isLogin
    ? "Don't have an account? "
    : "Already have an account? ";
  const toggleLinkText = isLogin ? "Sign up" : "Log in";

  const drawerHeaderTitle = isLogout
    ? "Log Out"
    : isLogin
    ? "Log In"
    : "Sign Up";

  const drawerHeaderDescription = !isLogout && (
    <Text textAlign="left" fontSize="sm" color="gray.500" px={2} pt={4} mt={2}>
      {isLogin
        ? "Access your dashboard and continue your SOS game journey. Challenge friends and track your high scores!"
        : "Join us to enjoy the classic SOS game online. Compete, improve your strategy, and climb the leaderboard!"}
    </Text>
  );

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={handleOnClose}
      finalFocusRef={btnRef}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent borderRadius="md" boxShadow="xl" py={2} pt={12} px={2}>
        <DrawerCloseButton color="gray.700" _hover={{ color: "white" }} />
        <DrawerHeader>
          <Heading size="lg" textAlign="center" color="blue.600">
            {drawerHeaderTitle}
          </Heading>
          {drawerHeaderDescription}
        </DrawerHeader>

        <DrawerBody>
          {isLogout ? (
            <Text
              textAlign="left"
              fontSize="sm"
              color="gray.500"
              px={2}
              pt={4}
              mt={2}
            >
              Are you sure you want to log out? You will need to log in again to continue
              playing.
            </Text>
          ) : (
            <Box px={2}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.username} isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>

                  {isSignup && (
                    <FormControl isInvalid={!!errors.email} isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                  )}

                  <FormControl isInvalid={!!errors.password} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                </VStack>

                <Box textAlign="center" mt={6}>
                  <Text fontSize="sm">
                    {toggleText}
                    <Link
                      color="blue.500"
                      onClick={() => {
                        onClose();
                        navigate(toggleAuthLink);
                      }}
                    >
                      {toggleLinkText}
                    </Link>
                  </Text>
                </Box>
              </form>
            </Box>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Flex justify="end" w="full" gap={3}>
            <Button onClick={handleOnClose} {...cancelButtonStyle}>
              Cancel
            </Button>
            {isLogout ? (
              <Button
                style={logoutButtonStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleLogOut}
              >
                Log Out
              </Button>
            ) : (
              <Button
                isLoading={loading}
                onClick={handleSubmit}
                {...submitButtonStyle}
              >
                {isLogin ? "Log In" : "Sign Up"}
              </Button>
            )}
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AuthDrawer;
