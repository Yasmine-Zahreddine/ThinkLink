import "./button.css"
import PropTypes from 'prop-types'

const Button = (props) => {
  return (
    <button className="buttonS" type="submit">{props.content}</button>
  )
}

Button.propTypes = {
  content: PropTypes.string.isRequired
}

export default Button
