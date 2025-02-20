import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatVideo from '../ChatVideo/ChatVideo';
import './videoPlayer.css';

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const video = location.state?.video;
  const [konami, setKonami] = useState('');
  const [isMatrix, setIsMatrix] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      setKonami(prev => {
        const newKonami = prev + e.key;
        return newKonami.slice(-9); // Keep last 9 characters (length of 'thinklink')
      });
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  useEffect(() => {
    if (konami === 'thinklink') {
      setIsMatrix(true);
      // Optional: Play matrix sound effect
      new Audio('/assets/sounds/matrix.mp3').play().catch(() => {});
      setTimeout(() => {
        setIsMatrix(false);
        setKonami('');
      }, 3000);
    }
  }, [konami]);

  useEffect(() => {
    // Save current scroll position
    const scrollPos = window.scrollY;
    
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Prevent scroll events temporarily
    const preventDefault = (e) => {
      e.preventDefault();
    };
    
    window.addEventListener('scroll', preventDefault, { passive: false });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', preventDefault);
      // Restore original scroll position when component unmounts
      window.scrollTo(0, scrollPos);
    };
  }, []);

  if (!video) {
    return navigate('/');
  }

  return (
    <div className="video-player-container">
      <div className={`content-wrapper ${isMatrix ? 'matrix-mode' : ''}`}>
        <div className="video-section">
          <h1 className={`video-player-title ${isMatrix ? 'matrix-text' : ''}`}>
            {video.title}
          </h1>
          <p className={`video-player-instructor-name ${isMatrix ? 'matrix-text' : ''}`}>
            Instructor: {video.instructor_name}
          </p>
          <div className={`video-wrapper ${isMatrix ? 'matrix-glitch' : ''}`}>
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_url.split('/').pop().split('?')[0]}`}
              title={video.title}
              frameBorder="0"
              allowFullScreen
              className="video-frame"
            />
          </div>
          <div className={`video-player-description ${isMatrix ? 'matrix-text' : ''}`}>
            <h2 className='description-title'>Description</h2>
            <p>{video.description}</p>
          </div>
        </div>
        <div className="chat-interface-wrapper">
          <ChatVideo className="bot_interface"/>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;