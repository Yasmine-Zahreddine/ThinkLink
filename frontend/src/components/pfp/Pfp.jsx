import React, { useState, useEffect } from 'react';
import './pfp.css';
import user from '../../assets/logos/user.png';
import classNames from 'classnames';
import cookie from "js-cookie";
import getuserdata from '../../../api/getuserdata';

const Pfp = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const userId = cookie.get("userId");
            if (!userId) throw new Error("User not authenticated");
            
            const data = await getuserdata(userId);
            setUserData(data);
        } catch (err) {
            if (err.response?.status === 401) {
                // Handle unauthorized
                cookie.remove("userId");
                window.location.href = '/login';
            }
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchUserData();
}, []);
  const handleClick = () => {
    console.log(userData);
    if (!isClicked && !isAnimatingOut) {
      setIsClicked(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsClicked(false);
        setIsAnimatingOut(false);
      }, 300);
    }
  };

  return (
    <div className="pfp-wrapper">
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
            <div className="profile-loading">Loading profile...</div>
          ) : error ? (
            <div className="profile-error">⚠️ {error}</div>
          ) : userData ? (
            <div className="profile-content">
              <div className="profile-header">
                <img 
                  src={user} 
                  alt="Profile" 
                  className="profile-avatar"
                />
                <div>
                  <h3 className="profile-name">
                    {userData.first_name} {userData.last_name}
                  </h3>
                  <p className="profile-email">{userData.email}</p>
                </div>
              </div>
              <div className="profile-actions">
                <button className="profile-button">Settings</button>
                <button className="profile-button logout">
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

