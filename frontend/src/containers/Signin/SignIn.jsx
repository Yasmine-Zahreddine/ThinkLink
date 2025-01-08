import { useEffect, useState } from "react";
import { signin } from "../../../api/signin.js";
import "./signin.css";
import Card from "../../components/card/Card";
import { NavLink, redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const redirect = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await signin(formData);
      setMessage(data.message);
      if(data.success){
      redirect('/');
    }
    } catch (err) {
      setError(err.errors || err.message || "Something went wrong");
    }
  };

  return (
    <div
      className={` ${
        isSmallScreen ? "smallScreen_signin" : "SignIn_Container"
      }`}
    >
      <div className="welcome_signin">
        {isSmallScreen ? (
          <div className="card-content1">
            <h1 className="gradient_text">Join us today!</h1>
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
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
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
            <input type="checkbox" className="checkbox_signin" />
            <p>Remember me</p>
          </div>
          <button className="buttonSignin" type="submit">Sign in</button>
        </form>
        <a href="" className="link">
          forgot password?
        </a>
        <div className="signup">
          <p>
            Dont have an account? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
