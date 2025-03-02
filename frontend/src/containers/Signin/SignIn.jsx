import { useEffect, useState } from "react";
import { signin } from "../../../api/signin.js";
import "./signin.css";
import Card from "../../components/card/Card";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loadingspinner from "../../components/loading-spinner/Loadingspinner.jsx";
import Button from "../../components/button/button.jsx";
import Error from "../../components/error/Error.jsx";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthProvider.jsx";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const redirect = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      setLoading(true);
      const data = await signin(formData);
      setMessage(data.message);
      if (data.success) {
        Cookies.remove("isLoggedIn");
        Cookies.remove("userId");

        if (rememberMe) {
          Cookies.set("isLoggedIn", true, { expires: 7 });
          Cookies.set("userId", data.user_id, { expires: 7 });
        } else {
          Cookies.set("isLoggedIn", true);
          Cookies.set("userId", data.user_id);
        }

        setIsLoggedIn(true);
        redirect("/");
      } else {
        setError(data.message || "Sign in failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Signin error:", err);

      setError(
        typeof err.errors === "string"
          ? err.errors
          : err.errors?.message || err.message || "Something went wrong"
      );

      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loadingspinner />}
      <div className={isSmallScreen ? "smallScreen_signin" : "SignIn_Container"}>
        <div className="welcome_signin">
          {isSmallScreen ? (
            <div className="card-content1">
              <h1 className="gradient_text">Welcome Back!</h1>
            </div>
          ) : (
            <div className="smallBox_signin">
              <Card title="Welcome Back!" content="Sign in to continue your learning journey" />
            </div>
          )}
        </div>
        <div className="Box_signin">
          <h1>Sign in and continue learning</h1>
          {error && <Error message={error} />}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
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
              <input
                type="checkbox"
                className="checkbox_signin"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <p>Remember me</p>
            </div>
            <Button content="Sign In" />
          </form>
          <NavLink to="/signin/forgotpassword" className="forgot">
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
