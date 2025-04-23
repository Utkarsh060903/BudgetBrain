import React, { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {  // Changed from userProvider to UserProvider
  const [user, setUser] = useState(null);

  const updateUser = (user) => {
    setUser(user);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;  // Changed from userProvider to UserProvider