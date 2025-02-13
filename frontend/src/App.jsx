import React from 'react';
import Navbar from "./components/navbar/Navbar";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Footer from "./components/footer/Footer";
import Home from "./containers/Home/Home";
import Signup from "./containers/SignUp/Signup";
import Signin from "./containers/SignIn/SignIn";
import Successful from "./containers/Successful/Successful";
import { AuthProvider } from "./context/AuthProvider";
import VerificationCode from "./components/verificationCode/VerificationCode";
import { VerificationProvider } from './context/VerificationContext';
import Editaccount from "./containers/EditAccount/Editaccount";
import ForgotPassword from "./containers/ForgotPassword/ForgotPassword";
import VideoPlayer from "./components/videoPlayer/VideoPlayer";
import ChatButton from "./components/ChatButton/ChatButton";
import Cookie from 'js-cookie'; // Add this import

// Create a wrapper component that uses useLocation
const AppContent = () => {
  const location = useLocation();
  const excludedPaths = ['/signin', '/signup', '/video-player'];
  const isLoggedIn = Cookie.get("isLoggedIn");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/successful" element={<Successful  />}/>
        <Route path="/verification" element={<VerificationCode />} />
        <Route path="/signin/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/video-player" element={<VideoPlayer />} />
        <Route path="/editaccount" element={<Editaccount/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!excludedPaths.includes(location.pathname) && isLoggedIn && <ChatButton />}
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <VerificationProvider>
        <div className="App">
          <Router>
            <AppContent />
          </Router>
        </div>
      </VerificationProvider>
    </AuthProvider>
  );
}

export default App;
