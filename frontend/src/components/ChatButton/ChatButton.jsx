import React, { useState } from 'react';
import logo from '../../assets/logos/logo.png';
import ChatInterface from '../ChatInterface/ChatInterface';
import cookie from "js-cookie";

import './chatButton.css';

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);


  const userId = cookie.get("userId");
  const toggleChat = () => {
    if (isChatOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
      }, 300); 
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <>
      <button className="chat-float-button" onClick={toggleChat}>
        <img src={logo} alt="Chat" className="chat-float-logo" />
      </button>

      {isChatOpen && (
        <div className={`chat-float-container ${isClosing ? 'close' : 'open'}`}>
          <ChatInterface userId={userId} />
          <button className="chat-close-button" onClick={toggleChat}>
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default ChatButton;