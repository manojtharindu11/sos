import { Box, Text } from "@chakra-ui/react";

const MobileBlocker = () => {
  const displayText = (
    <Text fontSize="lg" color="gray.700" fontWeight="semibold">
      🚫 This application is only available on desktop devices.
      <br />
      Please use a larger screen to access it.
    </Text>
  );

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
      textAlign="center"
      bg="gray.50"
    >
      {displayText}
    </Box>
  );
};

export default MobileBlocker;
