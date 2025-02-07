import Navbar from "./components/navbar/Navbar";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Footer from "./components/footer/Footer";
import Header from "./containers/Header/Header";
import Signup from "./containers/SignUp/Signup";
import Signin from "./containers/Signin/SignIn";
import Successful from "./containers/Successful/Successful";
import { AuthProvider } from "./context/AuthProvider";
import VerificationCode from "./components/verificationCode/VerificationCode";
import { VerificationProvider } from './context/VerificationContext';
import ForgotPassword from "./containers/ForgotPassword/ForgotPassword";

function App() {
  return (
    <AuthProvider>
    <VerificationProvider>
      
    <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup/successful" element={<Successful title="Account Created Successfully!" content="Welcome aboard! We&apos;re excited to have you join us on this journey."/>}/>
            <Route path="/verification" element={<VerificationCode />} />
            <Route path="/signin/forgotpassword" element={<ForgotPassword/>} />
            <Route path="/password_updated" element={<Successful title="Password Updated Successfully!" content="You can now sign in with your new password."/>}/>
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
