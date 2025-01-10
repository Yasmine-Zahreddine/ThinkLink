import { createContext, useState, useContext } from 'react';

const VerificationContext = createContext();

export const VerificationProvider = ({ children }) => {
  const [verificationEmail, setVerificationEmail] = useState('');

  return (
    <VerificationContext.Provider value={{ verificationEmail, setVerificationEmail }}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => useContext(VerificationContext); 