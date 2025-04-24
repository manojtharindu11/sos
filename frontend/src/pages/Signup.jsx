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
import { signup_async } from "../api/auth";

function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateSignupData = (formData) => {
    const newErrors = {};

    if (!formData.username || formData.username.trim() === "") {
      newErrors.username = "Username is required";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (!formData.password || formData.password.trim() === "") {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const validateSingleField = (name, value) => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Email is not valid";
        break;
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
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

    const validationErrors = validateSignupData(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await signup_async(form);
      toast({
        title: "Signup successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Signup failed",
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
            Create an Account
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.username} isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
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
                Sign Up
              </Button>
            </VStack>
          </form>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Already have an account?{" "}
            <strong
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Log In
            </strong>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default Signup;
