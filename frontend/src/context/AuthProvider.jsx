import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('isLoggedIn') ? true : false);
  const [isActive,setIsActive] = useState(Cookies.get('isActive'));
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn , isActive, setIsActive}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
