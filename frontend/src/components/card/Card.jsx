import "./card.css";
import PropTypes from "prop-types";

function Card({title, content}) {
  return (
    <div className="card section_padding" id="card">
      <div className="card-content">
        <h1 className="gradient_text">{title}</h1> 
        <p>{content}</p>
      </div>
    </div>
  );
}
Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
export default Card