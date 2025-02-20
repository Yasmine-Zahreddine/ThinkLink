import React from 'react';
import './errorDisplay.css';
import { FaExclamationCircle } from 'react-icons/fa';
import Loadingspinner from '../loading-spinner/Loadingspinner';

const ErrorDisplay = ({ message, onRetry, isRetrying }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <FaExclamationCircle className="error-icon" />
        <h2>Oops! Something went wrong</h2>
        <p>{message}</p>
        {isRetrying ? (
          <Loadingspinner />
        ) : (
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;