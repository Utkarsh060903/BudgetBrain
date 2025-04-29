// import React, { useState } from "react";
// import { createContext } from "react";

// export const UserContext = createContext();

// const UserProvider = ({ children }) => {  // Changed from userProvider to UserProvider
//   const [user, setUser] = useState(null);

//   const [dashboardData, setDashboardData] = useState(null)

//   const updateUser = (user) => {
//     setUser(user);
//   };

//   const clearUser = () => {
//     setUser(null);
//   };

//   return (
//     <UserContext.Provider value={{ user, updateUser, clearUser, dashboardData, setDashboardData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;  // Changed from userProvider to UserProvider

import React, { useState, useEffect } from "react";
import { createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = (user) => {
    setUser(user);
  };

  const clearUser = () => {
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("https://budgetbrain-server.onrender.com/api/v1/auth/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalid
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      updateUser, 
      clearUser, 
      dashboardData, 
      setDashboardData,
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;