import React from 'react';
import { useNavigate } from 'react-router-dom';
import './terms.css';
import { FaLinkedin, FaGithub, FaArrowLeft } from 'react-icons/fa';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <button 
        className="back-button" 
        onClick={() => navigate('/signup')}
        aria-label="Back to Sign Up"
      >
        <FaArrowLeft /> <span>Back to Sign Up</span>
      </button>
      <h1 className="terms-title">Terms of Use & Privacy Policy</h1>
      
      <section className="terms-section">
        <h2>🤓 The Serious Stuff (Kind of)</h2>
        <p>By using ThinkLink, you agree to:</p>
        <ul>
          <li>Not fall asleep during video lectures (we can't enforce this, but we trust you)</li>
          <li>Keep your learning enthusiasm above 9000</li>
          <li>Share cool stuff you learn with at least one person (your cat counts)</li>
          <li>Promise to have fun while learning (this is mandatory)</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>🔒 Privacy Policy (We're Cool About It)</h2>
        <ul>
          <li>We collect your data but only the important stuff (no, we don't care what you had for breakfast)</li>
          <li>Your passwords are encrypted (not even we can see them, seriously)</li>
          <li>We promise not to sell your data (we're not that kind of platform)</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>👩‍💻 Meet the Awesome Developers</h2>
        <div className="dev-team">
          <div className="dev-card">
            <h3>Yasmine Zahreddine</h3>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/yasmine-zd" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="social-icon" />
              </a>
              <a href="https://github.com/Yasmine-Zahreddine" target="_blank" rel="noopener noreferrer">
                <FaGithub className="social-icon" />
              </a>
            </div>
          </div>
          <div className="dev-card">
            <h3>Moussa Farhat</h3>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/moussa-farhat" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="social-icon" />
              </a>
              <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer">
                <FaGithub className="social-icon" />
              </a>
            </div>
          </div>
          <div className="dev-card">
            <h3>Majed Shmait</h3>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/majed-shmait" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="social-icon" />
              </a>
              <a href="https://github.com/majed29c" target="_blank" rel="noopener noreferrer">
                <FaGithub className="social-icon" />
              </a>
            </div>
          </div>
          {/* Add more dev cards as needed */}
        </div>
      </section>

      <section className="terms-section">
        <h2>🎮 Easter Eggs</h2>
        <p>There might be some hidden features in our platform. If you find them, pretend to be surprised!</p>
      </section>
    </div>
  );
};

export default Terms;