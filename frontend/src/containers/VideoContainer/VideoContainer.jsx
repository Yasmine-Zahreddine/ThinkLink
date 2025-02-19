import React, { useEffect, useState } from 'react';
import VideoListContainer from '../VideoListContainer/VideoListContainer';
import Loadingspinner from '../../components/loading-spinner/Loadingspinner';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/videos'); // Changed from /get_videos to /videos
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        setVideos(data.data); // Assuming the data is in the 'data' field
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err.message);
      }
    };

    fetchVideos();
  }, []);

  // Get unique categories from the video data
  const categories = [...new Set(videos.map((video) => video.category))];

  return (
    <div>
      {error ? (
        <ErrorDisplay message="" />
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
