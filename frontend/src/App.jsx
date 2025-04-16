import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Game from "./pages/Game";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
