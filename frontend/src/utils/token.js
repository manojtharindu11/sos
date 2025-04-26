import { jwtDecode } from "jwt-decode";

export const decodedToken = () => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.log("Invalid token");
      return null;
    }
  }
  return null;
};
