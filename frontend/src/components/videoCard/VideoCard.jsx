import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './videoCard.css';
import Cookie from 'js-cookie';
const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (Cookie.get("isLoggedIn")) {
      window.scrollTo(0, 0); 
      navigate('/video-player', { state: { video } });
    } else {
      window.scrollTo(0, 0); // Scrolls to the top before navigating
      navigate('/signin');
    }
  };
  

  return (
    <div className="video-card" onClick={handleCardClick}>
      <img
        src={`https://img.youtube.com/vi/${video.youtube_url.split('/').pop().split('?')[0]}/hqdefault.jpg`}
        alt={video.title}
        className="video-thumbnail"
      />
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-instructor">{video.instructor_name}</p>
        <button className="arrow-button">
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

VideoCard.propTypes = {
  video: PropTypes.shape({
    youtube_url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    instructor_name: PropTypes.string.isRequired,
    category: PropTypes.string,
    transcript: PropTypes.string
  }).isRequired
};

export default VideoCard;
