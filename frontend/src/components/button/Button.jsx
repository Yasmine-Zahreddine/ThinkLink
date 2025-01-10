import React from 'react'
import "./button.css"
const Button = (props) => {
  return (
    <button className="buttonS" type="submit">{props.content}</button>
  )
}

export default Button
