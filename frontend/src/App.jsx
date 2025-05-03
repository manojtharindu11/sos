import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./context/userContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ChakraProvider>
      <UserProvider>
        <AppRoutes/>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
