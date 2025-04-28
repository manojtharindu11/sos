import { createContext, useEffect, useState } from "react";
import { decodedToken } from "../utils/token";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const decoded = decodedToken();
    if (decoded) {
      // Only set user if the token is decoded properly
      setUser(decoded);
    }
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
