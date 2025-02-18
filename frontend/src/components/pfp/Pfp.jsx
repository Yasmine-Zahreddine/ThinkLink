import React, { useEffect, useState, useRef } from 'react';
import './pfp.css';
import user from '../../assets/logos/user.png'; // Dark mode default
import profile from "../../assets/logos/userLight.png"; // Light mode default
import classNames from 'classnames';
import cookie from "js-cookie";
import getuserdata from "../../../api/getuserdata";
import { NavLink, useNavigate } from 'react-router-dom';
import Loadingspinner from "../loading-spinner/Loadingspinner";
import { useAuth } from '../../context/AuthProvider';

const Pfp = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoutSpinner, setLogoutSpinner] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  
  // Profile Picture States
  const [pfp1, setPfp1] = useState(user); // Dark Mode Profile Pic
  const [pfp2, setPfp2] = useState(profile); // Light Mode Profile Pic

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const userId = cookie.get("userId");
      if (!userId) throw new Error("User not authenticated");

      const data = await getuserdata(userId);
      setUserData(data);

      // Format names
      const formattedFirstName = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1);
      const formattedLastName = data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1);
      cookie.set("fullName", `${formattedFirstName} ${formattedLastName}`, { path: "/" });

      // Check if pfp_url exists and is not empty
      if (data.pfp_url !== '') {
        setPfp1(`${data.pfp_url}?t=${Date.now()}`);
        setPfp2(`${data.pfp_url}?t=${Date.now()}`);
        cookie.set("pfp_url", data.pfp_url, { path: "/" });
      } else {
        // If empty, use default images
        setPfp1(user);
        setPfp2(profile);
      }

      setError(null);
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

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle profile click animation
  const handleClick = (event) => {
    event.stopPropagation();
    if (isClicked) {
      closeProfile();
    } else {
      setIsClicked(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Close profile dropdown
  const closeProfile = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsClicked(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  // Navigate to profile settings
  const handleProfileNav = () => {
    cookie.set('isActive', "Profile", { path: "/" });
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsClicked(false);
      setIsAnimatingOut(false);
      navigate('/editaccount');
    }, 300);
  };

  // Navigate to Help & Support
  const handleHelp = () => {
    cookie.set('isActive', "Help & Support", { path: "/" });
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsClicked(false);
      setIsAnimatingOut(false);
      navigate('/help');
    }, 300);
  };

  // Remove all cookies dynamically
  const removeAllCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "") // Trim spaces
        .replace(/=.*/, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"); // Expire cookie
    });

    // Remove via js-cookie as well
    Object.keys(cookie.get()).forEach((key) => {
      cookie.remove(key, { path: "/" });
    });
  };

  // Handle logout function
  const handleLogout = () => {
    setLogoutSpinner(true);
    closeProfile();

    setTimeout(() => {
      removeAllCookies(); // Remove all cookies
      setIsLoggedIn(false);
      navigate('/signin');
      setLogoutSpinner(false);
    }, 1000);
  };

  // Handle clicking outside the profile dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        closeProfile();
      }
    };

    const handleScroll = () => {
      closeProfile();
    };

    if (isClicked) {
      document.addEventListener('click', handleOutsideClick);
      window.addEventListener('scroll', handleScroll);
    } else {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClicked]);

  return (
    <div className="pfp-wrapper">
      {logoutSpinner && <Loadingspinner />}

      <img
        src={pfp1}
        className="user-pfp"
        onClick={handleClick}
        tabIndex="0"
        role="button"
        alt="User Avatar"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick(e);
        }}
      />

      {(isClicked || isAnimatingOut) && userData && (
        <div
          ref={profileRef}
          className={classNames('profile-container', {
            'animate-up': isAnimating,
            'animate-down': isAnimatingOut
          })}
        >
          <div className="profile-content">
            <div className="profile-header">
              <img src={pfp2} className="pfp_pic" alt="Profile Light Mode" />
              <div className="profile-info">
                <h3 className="profile-name">
                  {userData.first_name.charAt(0).toUpperCase() + userData.first_name.slice(1)}{' '}
                  {userData.last_name.charAt(0).toUpperCase() + userData.last_name.slice(1)}
                </h3>
                <pre className="profile-email">{userData.email.toLowerCase()}</pre>
              </div>
            </div>

            <div className="profile-actions">
              <NavLink className="profile-button" onClick={handleProfileNav}>Account Settings</NavLink>
              <NavLink className="profile-button" onClick={handleProfileNav}>Edit Profile</NavLink>
              <NavLink className="profile-button" onClick={handleHelp}>Help & Support</NavLink>
              <NavLink className="profile-button" onClick={handleLogout}>Logout</NavLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pfp;
