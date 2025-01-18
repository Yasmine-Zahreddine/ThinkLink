import React, { useState } from 'react';
import './pfp.css';
import user from '../../assets/logos/user.png';
import classNames from 'classnames';

const Pfp = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleClick = () => {
    if (!isClicked && !isAnimatingOut) {
      setIsClicked(true);
      setIsAnimating(true);
      setIsAnimatingOut(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    } else if (isClicked && !isAnimating) {
      setIsAnimating(false);
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
        alt="user"
        className="user-pfp"
        onClick={handleClick}
      />
      {(isClicked || isAnimatingOut) && (
        <div
          className={classNames('profile-container', {
            'animate-up': isAnimating,
            'animate-down': isAnimatingOut,
          })}
        >
        </div>
      )}
    </div>
  );
};

export default Pfp;
