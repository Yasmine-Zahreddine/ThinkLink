import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatInterface from '../ChatInterface/ChatInterface';
import './videoPlayer.css';

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const video = location.state?.video;

  if (!video) {
    return navigate('/');
  }

  return (
    <div className="video-player-container">
      <div className="content-wrapper">
        <div className="video-section">
          <h1 className="video-player-title">{video.title}</h1>
          <p className="video-player-instructor-name">Instructor: {video.instructor_name}</p>
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_url.split('/').pop().split('?')[0]}`}
              title={video.title}
              frameBorder="0"
              allowFullScreen
              className="video-frame"
            />
          </div>
          <div className="video-player-description">
            <h2 className='description-title'>Description</h2>
            <p>{video.description}</p>
          </div>
        </div>
        <ChatInterface className="bot_interface"/>
      </div>
    </div>
  );
};

export default VideoPlayer;