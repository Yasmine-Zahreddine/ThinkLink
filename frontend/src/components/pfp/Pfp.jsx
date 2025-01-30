import React, { useState } from 'react';
import './pfp.css';
import user from '../../assets/logos/user.png';
import classNames from 'classnames';
import cookie from "js-cookie";
import getuserdata from "../../../api/getuserdata";
import profile from "../../assets/logos/userLight.png";
import { useNavigate } from 'react-router-dom';
import Loadingspinner from "../loading-spinner/Loadingspinner";
import { useAuth } from '../../context/AuthProvider';

const Pfp = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // No loading on page load
  const [error, setError] = useState(null);
  const [logoutSpinner, setLogoutSpinner] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const userId = cookie.get("userId");
      if (!userId) throw new Error("User not authenticated");

      const data = await getuserdata(userId);
      setUserData(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!isClicked && !isAnimatingOut) {
      setIsClicked(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      // Fetch user data only when profile is clicked
      if (!userData) {
        fetchUserData();
      }
    } else {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsClicked(false);
        setIsAnimatingOut(false);
      }, 300);
    }
  };

  const handleLogout = () => {
    setLogoutSpinner(true);
    setIsAnimatingOut(true);

    setTimeout(() => {
      cookie.remove("userId");
      cookie.remove("isLoggedIn");
      cookie.remove("userData");
      setIsLoggedIn(false);
      navigate('/signin');
      setLogoutSpinner(false);
    }, 1000);
  };

  return (
    <div className="pfp-wrapper">
      {logoutSpinner && <Loadingspinner />}
      
      <img
        src={user}
        alt="User avatar"
        className="user-pfp"
        onClick={handleClick}
        tabIndex="0"
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick();
        }}
      />

      {(isClicked || isAnimatingOut) && (
        <div className={classNames('profile-container', {
          'animate-up': isAnimating,
          'animate-down': isAnimatingOut
        })}>
          {isLoading ? (
            <div className="loading-spinner">
            </div>
          ) : error ? (
            <div className="profile-error">⚠️ {error}</div>
          ) : userData ? (
            <div className="profile-content">
              <div className="profile-header">
                <img 
                  src={profile} 
                  alt="Profile" 
                  className="pfp_pic"
                />
                <div className="profile-info">
                  <h3 className="profile-name">
                    {userData.first_name.charAt(0).toUpperCase() + userData.first_name.slice(1)}{' '}
                    {userData.last_name.charAt(0).toUpperCase() + userData.last_name.slice(1)}
                  </h3>
                  <pre className="profile-email">{userData.email.toLowerCase()}</pre>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="profile-button">Account Settings</button>
                <button className="profile-button">Edit Profile</button>
                <button className="profile-button">Help & Support</button>
                <button className="profile-button logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-message">No user data available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pfp;
