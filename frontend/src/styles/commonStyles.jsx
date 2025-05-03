export const getLogoutButtonStyle = (isHovered) => ({
  backgroundColor: isHovered ? "white" : "#f56565",
  color: isHovered ? "#f56565" : "white",
  border: "1px solid",
  borderColor: isHovered ? "#f56565" : "transparent",
  transition: "all 0.2s ease-in-out",
  transform: isHovered ? "scale(1.03)" : "scale(1)",
});

export const cancelButtonStyle = {
  variant: "outline",
  colorScheme: "blue",
  _hover: {
    bg: "blue.500",
    color: "white",
    borderColor: "blue.500",
    transform: "scale(1.03)",
  },
};

export const submitButtonStyle = {
  colorScheme: "blue",
  _hover: {
    bg: "blue.600",
    transform: "scale(1.03)",
  },
};
