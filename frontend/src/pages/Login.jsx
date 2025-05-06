import React, { useRef, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import AuthDrawer from "../components/authDrawer";

function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  useEffect(() => {
    onOpen(); // Open drawer immediately on login route
  }, []);

  return (
    <>
      <button ref={btnRef} style={{ display: "none" }} onClick={onOpen}>
        Hidden Trigger
      </button>
      <AuthDrawer
        type="login"
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
      />
    </>
  );
}

export default Login;
