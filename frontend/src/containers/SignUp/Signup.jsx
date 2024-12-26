import { useEffect, useState } from "react";
import "./signup.css";
import Card from "../../components/card/Card";

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
        <input
          type="text"
          placeholder="Full Name"
          className="full_name_input textinputs"
        />
        <input type="text" placeholder="Email" className="email textinputs" />
        <input
          type="password"
          placeholder="Password"
          className="password textinputs"
        />
        <div className="checkboxContainer">
          <input type="checkbox" className="checkbox" />
          <p>
            Send me special offers, personalized recommendations, and learning
            tips.
          </p>
        </div>
        <button className="buttonCreateAccount">Sign up</button>
        <div className="policyContainer">
          <p className="policyAgree">
            By signing up, you agree to our <a href="/">Terms of Use</a> and{" "}
            <a href="/">Privacy Policy</a>.
          </p>
        </div>
        <div className="login">
          <p>
            Already have an account? <a href="/">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
