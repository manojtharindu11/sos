import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Text,
  Container,
} from "@chakra-ui/react";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", form);
    // You can send this to your backend
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
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                />
              </FormControl>

              <Button colorScheme="blue" type="submit" width="full">
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
