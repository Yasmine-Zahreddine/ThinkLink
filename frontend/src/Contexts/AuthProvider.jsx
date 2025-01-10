import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogedIn, setIsLogedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLogedIn, setIsLogedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
