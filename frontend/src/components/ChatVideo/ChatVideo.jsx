import React, { useState, useRef, useEffect } from 'react';
import './chatvideo.css';
import logo from '../../assets/logos/logo_lighttheme_thinklink.png'

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRolling, setIsRolling] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inputMessage.trim().toLowerCase() === 'do a barrel roll') {
      setIsRolling(true);
      setInputMessage('');
      setTimeout(() => setIsRolling(false), 1000);
      return;
    }
    
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      const messagesContainer = document.querySelector('.messages-container');
      messagesContainer?.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
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
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll anchor */}
      </div>

      <form 
        className="chat-input-form" 
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(e);
        }}
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
          placeholder="Ask a question..."
          className="chat-input"
        />
        <button 
          type="submit" 
          className="send-button"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;