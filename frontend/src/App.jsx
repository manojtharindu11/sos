import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./context/userContext";
import MobileBlocker from "./components/mobileBlocker";
import { useMediaQuery } from "@chakra-ui/react";
import AppRoutes from "./routes/appRoutes";

function App() {
  const [isMobile] = useMediaQuery("(max-width: 1100px)");

  const displayContent = isMobile ? <MobileBlocker /> : <AppRoutes />;

  return (
    <ChakraProvider>
      <UserProvider>{displayContent}</UserProvider>
    </ChakraProvider>
  );
}

export default App;
