import { createContext, useEffect, useState } from "react";
import { decodedToken } from "../utils/token";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const decoded = decodedToken();
    if (decoded) {
      setUser(decoded);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
