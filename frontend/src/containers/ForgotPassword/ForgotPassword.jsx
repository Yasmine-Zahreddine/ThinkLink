import { useState } from "react";
import Button from "../../components/button/button";
import Card from "../../components/card/Card";
import Loadingspinner from "../../components/loading-spinner/Loadingspinner.jsx";
import Error from "../../components/error/Error";
import { forgotpassword } from '../../../api/forgot_password'; 
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import "./ForgotPassword.css";

function ForgotPassword() {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    confirmPassword: "" 
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setVerificationEmail } = useVerification();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setError("");

    try {
      setLoading(true);
      const { confirmPassword, ...submitData } = formData; 
      const data = await forgotpassword(submitData);
      if (data.success) {
        setVerificationEmail(formData.email);
        navigate("/verification", { state: { verificationType: "forgotpassword"} });
      } else {
        throw new Error(data.message || "Updating password failed");
      }
    } catch (err) {
      console.error("Error:", err.message?.data?.message || err.message);
      setError(err.message?.data?.message || "Something went wrong");
    }finally {
      setLoading(false);
    }
  };

  return (<>
    {loading && (
        <Loadingspinner/>
      )}
    <div className="ForgotPass">
      <div className="ForgotPass-Card">
        <Card className="ForgotPass-Card_card" title="Forgot Password?" content="No worries, we'll help you reset it in no time."/>
      </div>
      <div className="Box_forgotpass">
        <h2>Change your password and continue!</h2>
        {error && <Error message={error}/>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="email textinputs"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            className="password textinputs"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            className="password textinputs"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button content="Change Password"/>
        </form>
      </div>
    </div></>
  )
}

export default ForgotPassword;