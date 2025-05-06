import { createContext, useEffect, useState } from "react";
import { decodedToken } from "../utils/token";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const decoded = decodedToken();
    if (decoded) {
      // Only set user if the token is decoded properly
      setUser(decoded);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
