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
import { AuthProvider } from "./Contexts/Authprovider";
import VerificationCode from "./components/verificationCode/VerificationCode";
import { VerificationProvider } from './context/VerificationContext';

function App() {
  return (
    <VerificationProvider>
      <AuthProvider>
    <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup/successful" element={<Successful/>}/>
            <Route path="/signup/verification" element={<VerificationCode />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </Router>
      </div>
      </AuthProvider>
    </VerificationProvider>
    
  );
}

export default App;
