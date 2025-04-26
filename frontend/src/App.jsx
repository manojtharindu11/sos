import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthProtectedRoute from "./guards/authGuard";
import Game from "./pages/Game";
import { UserProvider } from "./context/userContext";

function App() {
  return (
    <ChakraProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/signup"
              element={
                <AuthProtectedRoute onlyPublic={true}>
                  <Signup />
                </AuthProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthProtectedRoute onlyPublic={true}>
                  <Login />
                </AuthProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </Router>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
