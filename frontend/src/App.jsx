import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
// import Game from "./pages/Game";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/game" element={<Game />} /> */}
          {/* <Route path="/game/:id" element={<Game />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
