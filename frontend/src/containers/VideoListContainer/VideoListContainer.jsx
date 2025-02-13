import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VideoCard from '../../components/videoCard/VideoCard';
import './videoListContainer.css';

const VideoListContainer = ({ category, videos = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const filteredVideos = videos.filter((video) => video.category === category);
  const initialDisplay = 4; // Number of videos to show initially

  // Move this inside the component to ensure it updates when showAll changes
  const visibleVideos = showAll ? filteredVideos : filteredVideos.slice(0, initialDisplay);
  const hasMoreVideos = filteredVideos.length > initialDisplay;

  return (
    <div className="video-list-container">
      <div className="category-header">
        <h2 className="category-title">{category}</h2>
        {hasMoreVideos && (
          <button 
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
      <div className={`video-cards-container ${showAll ? 'expanded' : ''}`}>
        {visibleVideos.map((video) => (
          
          <div key={video.id}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </div>
  );
};

VideoListContainer.propTypes = {
  category: PropTypes.string.isRequired,
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      youtube_url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      instructor_name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      transcript: PropTypes.string,
    })
  ).isRequired,
};

export default VideoListContainer;
