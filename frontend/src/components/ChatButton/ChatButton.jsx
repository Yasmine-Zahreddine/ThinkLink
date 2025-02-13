import React, { useState } from 'react';
import logo from '../../assets/logos/logo.png';
import ChatInterface from '../ChatInterface/ChatInterface';
import './chatButton.css';

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <button className="chat-float-button" onClick={toggleChat}>
        <img src={logo} alt="Chat" className="chat-float-logo" />
      </button>
      
      {isChatOpen && (
        <div className="chat-float-container">
          <ChatInterface />
          <button className="chat-close-button" onClick={toggleChat}>
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default ChatButton;