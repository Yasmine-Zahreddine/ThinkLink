import React from 'react';
import './errorDisplay.css';
import { FaExclamationCircle } from 'react-icons/fa';

const ErrorDisplay = ({ message }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <FaExclamationCircle className="error-icon" />
        <h2>Oops! Something went wrong</h2>
        <p>{message}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;