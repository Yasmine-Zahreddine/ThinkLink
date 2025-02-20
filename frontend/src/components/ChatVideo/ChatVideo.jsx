import React, { useState, useRef, useEffect } from 'react';
import './chatvideo.css';
import logo from '../../assets/logos/logo_lighttheme_thinklink.png';
import { getChatResponse } from '../../../api/chatVideo';

const ChatvideoInterface = ({ videoId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleQuestionClick = async (questionType) => {
    let userQuestion = '';
    switch (questionType) {
      case 'summary':
        userQuestion = 'Summarize the video';
        break;
      case 'mainPoints':
        userQuestion = 'What are the main points of the video?';
        break;
      case 'quiz':
        userQuestion = 'Generate a quiz based on the video content';
        break;
      default:
        return;
    }

    setMessages(prev => [...prev, { text: userQuestion, sender: 'user' }]);
    setLoading(true);

    try {
      const response = await getChatResponse(questionType, videoId);
      console.log(response);
      setMessages(prev => [...prev, { 
        text: response.response, 
        sender: 'bot' 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text:  'Something went wrong. Please try again.', 
        sender: 'bot',
        isError: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatvideo-interface" onClick={e => e.stopPropagation()}>
      <div className="chatvideo-header">
        <img src={logo} alt="logo" className="chatvideo-logo" />
      </div>
      
      <div 
        className="messages-container" 
        onWheel={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
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

      <div className="chatvideo-buttons-container">
        <button 
          className="chatvideo-action-button"
          onClick={() => handleQuestionClick('summary')}
          disabled={loading}
        >
          Summarize Video
        </button>
        <button 
          className="chatvideo-action-button"
          onClick={() => handleQuestionClick('mainPoints')}
          disabled={loading}
        >
          Main Points
        </button>
        <button 
          className="chatvideo-action-button"
          onClick={() => handleQuestionClick('quiz')}
          disabled={loading}
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
};

export default ChatvideoInterface;