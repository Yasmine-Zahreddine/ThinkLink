import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './chatInterface.css';
import logo from '../../assets/logos/logo_lighttheme_thinklink.png';
import { getChatResponse } from '../../../api/chat';
import Error from '../error/Error';  // Import Error component

const ChatInterface = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Add error state
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end" 
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inputMessage.trim().toLowerCase() === 'do a barrel roll') {
      setIsRolling(true);
      setInputMessage('');
      setTimeout(() => setIsRolling(false), 1000);
      return;
    }
    
    if (inputMessage.trim()) {
      const userMessage = inputMessage.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setInputMessage('');
      setLoading(true);

      try {
        const response = await getChatResponse(userMessage, userId);
        console.log(response);
        setMessages(prev => [...prev, { 
          text: response.data.message, 
          sender: 'bot' 
        }]);
      } catch (error) {
        setMessages(prev => [...prev, { 
          text: error.message || 'Something went wrong. Please try again.',
          sender: 'bot',
          isError: true 
        }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`chat-interface ${isRolling ? 'barrel-roll' : ''}`} onClick={e => e.stopPropagation()}>
      <div className="chat-header">
        <img src={logo} alt="logo" className="chat-logo" />
      </div>
      
      <div 
        className="messages-container" 
        onWheel={handleScroll}
        onTouchMove={handleScroll}
      >
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}
                      ${message.isError ? 'error-message' : ''}`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form 
        className="chat-input-form" 
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(e);
            }
          }}
          placeholder={loading ? "Processing..." : "Ask a question..."}
          className="chat-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

// Add PropTypes validation
ChatInterface.propTypes = {
  userId: PropTypes.string.isRequired
};

export default ChatInterface;