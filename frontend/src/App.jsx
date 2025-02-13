import Navbar from "./components/navbar/Navbar";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Footer from "./components/footer/Footer";
// import Header from "./containers/Header/Header";
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

function App() {
  return (
    <AuthProvider>
    <VerificationProvider>
      
    <div className="App">
        <Router>
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
          <Footer />
        </Router>
      </div>
      </VerificationProvider>
    </AuthProvider>
    
  );
}

export default App;
