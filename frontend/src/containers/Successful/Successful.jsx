import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import "./successful.css";
import Card from "../../components/card/Card";

const Successful = () => {
  const navigate = useNavigate(); // Use the navigate hook for navigation
  const location = useLocation();
  const { title, content, type } = location.state || { title: "Success", content: "Operation completed successfully." , type: "home"};

  const handleDashboardClick = () => {
    if(type === "home"){
      navigate("/"); // Navigate to the dashboard route
    }else if(type === "signin"){
      navigate("/signin"); // Navigate to the signin route
    }
    
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

      <Card title={title} content={content} />
      <button onClick={handleDashboardClick} className="button_home">
        {type === "home" ? "Go to Home" : "Go to Sign In"}
      </button>
    </div>
  );
};

Successful.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  type: PropTypes.string,
};

export default Successful;
