import React, { useEffect, useState } from 'react';
import VideoListContainer from '../VideoListContainer/VideoListContainer';
import Loadingspinner from '../../components/loading-spinner/Loadingspinner';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    // Add a slight delay before reloading to show the spinner
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 second delay
  };

  const categories = [...new Set(videos.map((video) => video.category))];

  return (
    <div>
      {error ? (
        <ErrorDisplay 
          message={error} 
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      ) : isRetrying ? (
        <Loadingspinner />
      ) : categories.length > 0 ? (
        categories.map((category) => (
          <VideoListContainer key={category} category={category} videos={videos} />
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default VideoContainer;
