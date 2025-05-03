import React, { useRef, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import AuthDrawer from "../components/authDrawer";

function Signup() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  useEffect(() => {
    onOpen(); // Open drawer immediately on signup route
  }, []);

  return (
    <>
      <button ref={btnRef} style={{ display: "none" }} onClick={onOpen}>
        Hidden Trigger
      </button>
      <AuthDrawer
        type="signup"
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
      />
    </>
  );
}

export default Signup;
