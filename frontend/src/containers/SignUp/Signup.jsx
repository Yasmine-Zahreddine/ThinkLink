import { useState, useEffect } from "react";
import { signup } from "../../../api/signup.js";
import "./signup.css";
import Card from "../../components/card/Card";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const redirect = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setMessage("");
    setError("");

    try { 
      setLoading(true); 
      const data = await signup(formData);
      setMessage(data.message);
      if (data.success) {
          setLoading(false);
          redirect("/signup/successful");
      }
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(err.errors || err.message || "Something went wrong");
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
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
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
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
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
              <input type="checkbox" className="checkbox" required />
              <p>
                Send me special offers, personalized recommendations, and
                learning tips.
              </p>
            </div>
            <button className="buttonCreateAccount" type="submit">
              Sign up
            </button>
          </form>
          <div className="policyContainer">
            <p className="policyAgree">
              By signing up, you agree to our <a href="/">Terms of Use</a> and{" "}
              <a href="/">Privacy Policy</a>.
            </p>
          </div>
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
