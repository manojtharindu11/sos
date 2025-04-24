import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  VStack,
  Text,
  Container,
  useToast,
} from "@chakra-ui/react";
import { login_async } from "../api/auth";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const validateLoginData = (formData) => {
    const newErrors = {};

    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password || formData.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const validateSingleField = (name, value) => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.trim().length < 3)
          return "Username must be at least 3 characters";
        break;
      case "password":
        if (!value.trim()) return "Password is required";
        break;
      default:
        break;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    const fieldError = validateSingleField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError || undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginData(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await login_async(form);
      console.log("Login successful", response);
      toast({
        title: "Login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      // Redirect or store token if needed
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: error?.response?.data?.message || "Invalid username or password",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md" bg="white" p={8} borderRadius="xl" boxShadow="lg">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" size="lg" color="blue.600">
            Log In
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.username} isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <Button
                colorScheme="blue"
                type="submit"
                width="full"
                isLoading={loading}
              >
                Log In
              </Button>
            </VStack>
          </form>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Don’t have an account?{" "}
            <strong
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </strong>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default Login;
