import { useState, useEffect } from "react";
import { signup } from "../../../api/signup.js";
import "./signup.css";
import Card from "../../components/card/Card";
import { NavLink, useNavigate } from "react-router-dom";
import Loadingspinner from "../../components/loading-spinner/Loadingspinner.jsx";
import Button from "../../components/button/button.jsx";
import Error from "../../components/error/Error.jsx";
import { useVerification } from '../../context/VerificationContext';
import Cookies from "js-cookie";
import { useAuth } from '../../context/AuthProvider.jsx';

const Signup = () => {
  const redirect = useNavigate();
  const { setVerificationEmail } = useVerification();
  const { isLoggedIn,setIsLoggedIn } = useAuth();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!termsAgreed) {
        setError("Please agree to the Terms of Use and Privacy Policy");
        return;
    }
    setError("");
    setLoading(true);

    try {
        const data = await signup(formData);
        
        if (data.success) {
            setVerificationEmail(formData.email);
            redirect("/verification", { state: { verificationType: "signup"} });
        }
    } catch (err) {
        console.error("Signup error:", err);
        setError(err.message || "Failed to create account. Please try again.");
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {loading && (
        <Loadingspinner/>
      )}
      <div className={` ${isSmallScreen ? "smallScreen" : "SignUp_Container"}`}>
        <div className="welcome">
          {isSmallScreen ? (
            <div className="card-content1">
              <h1 className="gradient_text">Join us today!</h1>
            </div>
          ) : (
            <div className="smallBox">
              <Card
                title="Join us today!"
                content="Start your academic journey with us! By creating an account, you'll gain access to exclusive study materials, expert insights, and a community dedicated to your success."
              />
            </div>
          )}
        </div>
        <div className="Box">
          <h1>Sign up and start learning</h1>
          {error && <Error message={error}/>}
          <form className="form_signup" onSubmit={handleSubmit}>
            <div className="flname">
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                className="first_name_input"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                className="last_name_input"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="email textinputs"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="password textinputs"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="checkboxContainer">
              <input
                type="checkbox"
                className="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                required
              />
              <p className="policyAgree">
                I agree to the <NavLink to="/terms">Terms of Use</NavLink> and{' '}
                <NavLink to="/terms">Privacy Policy</NavLink>
              </p>
            </div>
            <Button content="Sign Up"/>
          </form>
          <div className="login">
            <p>
              Already have an account? <NavLink to="/signin">Sign in</NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
