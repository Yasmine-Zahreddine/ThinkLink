import React from "react";
import { useNavigate } from "react-router-dom";
import "./successful.css";

const Successful = () => {
  const navigate = useNavigate(); // Use the navigate hook for navigation

  const handleDashboardClick = () => {
    navigate("/"); // Navigate to the dashboard route
  };

  return (
    <div className="signip_successful_container">
 <div className="animated-tick">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="tick-svg"
  >
    <circle className="tick-circle" cx="50" cy="50" r="48" fill="none" />
    <path
  className="tick-path"
  d="M20 50 L45 75 L80 30"
  fill="none"
  stroke="#4caf50"
  strokeWidth="6"

/>

  </svg>
</div>


      <h1 className="gradient_text">Sign-Up Successful</h1>
      <h4>Welcome aboard! We're excited to have you join us on this journey.</h4>
      <h4>You’re all set! Explore your dashboard to get started.</h4>
      <button onClick={handleDashboardClick} className="button_home">
        Go to Home
      </button>
    </div>
  );
};

export default Successful;
