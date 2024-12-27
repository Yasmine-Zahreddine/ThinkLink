import { useEffect, useState } from "react";
import "./signin.css";
import Card from "../../components/card/Card";
import { NavLink } from "react-router-dom";

const Signin = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

        <input
          type="text"
          placeholder="Email"
          className="email textinputs_signin"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="password textinputs_signin"
          required
        />
        <div className="checkboxContainer_signin">
          <input type="checkbox" className="checkbox_signin" required />
          <p>Remember me</p>
        </div>
        <button className="buttonSignin">Sign in</button>
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
