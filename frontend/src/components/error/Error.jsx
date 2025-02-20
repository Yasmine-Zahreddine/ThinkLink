import error from "../../assets/logos/error.png"
import "./error.css";
const Error = (props) => {
  return (
    <div className='error-box'>
      <img src={error} alt='error' className='error-image'/>
      <p>{props.message}</p>
    </div>
  )
}

export default Error
