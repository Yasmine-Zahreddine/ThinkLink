import { useEffect, useState } from "react";
import { signin } from "../../../api/signin.js";
import "./signin.css";
import Card from "../../components/card/Card";
import { NavLink, useNavigate } from "react-router-dom";
import Loadingspinner from "../../components/loading-spinner/Loadingspinner.jsx";
import Button from "../../components/button/button.jsx";
import Error from "../../components/error/Error.jsx";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthProvider.jsx";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "" 
  });
  const [error, setError] = useState("");
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const data = await signin(formData);
      
      if (data.success) {
        Cookies.set("isLoggedIn", true, { expires: 7, path: '/' });
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setError(data.message || "Sign in failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loadingspinner />}
      <div className={`${isSmallScreen ? "smallScreen_signin" : "SignIn_Container"}`}>
        <div className="welcome_signin">
          {isSmallScreen ? (
            <div className="card-content1">
              <h1 className="gradient_text">Welcome Back!</h1>
            </div>
          ) : (
            <div className="smallBox_signin">
              <Card
                title="Welcome Back!"
                content="Sign in to continue your learning journey"
              />
            </div>
          )}
        </div>
        <div className="Box_signin">
          <h1>Sign in and continue learning</h1>
          {error && <Error message={error} />}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="email textinputs_signin"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="password textinputs_signin"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="checkboxContainer_signin">
              <input type="checkbox" className="checkbox_signin" />
              <p>Remember me</p>
            </div>
            <Button content="Sign In" type="submit" />
          </form>
          <NavLink to="/forgot-password" className="link">
            Forgot password?
          </NavLink>
          <div className="signup">
            <p>
              Don't have an account? <NavLink to="/signup">Sign up</NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;