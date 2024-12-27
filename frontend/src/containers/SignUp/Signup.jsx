import { useEffect, useState } from "react";
import "./signup.css";
import Card from "../../components/card/Card";
import { NavLink } from "react-router-dom";

const Signup = () => {
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
              title="Join us today!"
              content="Start your academic journey with us! By creating an account, you'll gain access to exclusive study materials, expert insights, and a community dedicated to your success."
            />
          </div>
        )}
      </div>
      <div className="Box">
        <h1>Sign up and start learning</h1>
        <form className="form_signup">
          <div className="flname">
            <input
              type="text"
              placeholder="First name"
              className="first_name_input"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              className="last_name_input"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Email"
            className="email textinputs"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="password textinputs"
            required
          />
          <div className="checkboxContainer">
            <input type="checkbox" className="checkbox" required />
            <p>
              Send me special offers, personalized recommendations, and learning
              tips.
            </p>
          </div>
          <button className="buttonCreateAccount">Sign up</button>
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
  );
};

export default Signup;
