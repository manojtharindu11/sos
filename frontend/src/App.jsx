import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./context/userContext";
import AppRoutes from "./routes/AppRoutes";
import MobileBlocker from "./components/mobileBlocker";
import { useMediaQuery } from "@chakra-ui/react";

function App() {
  const [isMobile] = useMediaQuery("(max-width: 700px)");

  const displayContent = isMobile ? <MobileBlocker /> : <AppRoutes />;

  return (
    <ChakraProvider>
      <UserProvider>{displayContent}</UserProvider>
    </ChakraProvider>
  );
}

export default App;
