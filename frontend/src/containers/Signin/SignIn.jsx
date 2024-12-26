import { useEffect, useState } from "react";
import "./signin.css";
import Card from "../../components/card/Card";

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
    <div className={` ${isSmallScreen ? "smallScreen" : "SignUp_Container"}`}>
      <div className="welcome">
        {isSmallScreen ? (
          <div className="card-content1">
            <h1 className="gradient_text">Join us today!</h1>
          </div>
        ) : (
          <div className="smallBox">
            <Card
              title="Welcome Back!"
              content="Sign in to continue your learning journey"
            />
          </div>
        )}
      </div>
      <div className="Box">
        <h1>Sign in and continue learning</h1>

        <input type="text" placeholder="Email" className="email textinputs" />
        <input
          type="password"
          placeholder="Password"
          className="password textinputs"
        />
        <div className="checkboxContainer">
          <input type="checkbox" className="checkbox" />
          <p>Remember me</p>
        </div>
        <button className="buttonCreateAccount">Sign in</button>
        <a href="" className="link">
          forget password?
        </a>
        <div className="login">
          <p>
            Dont have an account? <a href="/">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
