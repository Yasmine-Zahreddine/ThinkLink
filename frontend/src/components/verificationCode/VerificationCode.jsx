import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './verificationCode.css';
import Card from '../card/Card';
import Loadingspinner from "../../components/loading-spinner/Loadingspinner.jsx";
import { verifyCode } from '../../../api/verify_signup.js';
import { verifyNewPassword } from '../../../api/verify_new_password.js';
import { useVerification } from '../../context/VerificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Error from '../error/Error';
import Cookies from "js-cookie";
import { useAuth } from '../../context/AuthProvider';

const VerificationCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verificationType } = location.state || { verificationType: "signup" };
  const { setIsLoggedIn } = useAuth();
  const { verificationEmail, setVerificationEmail } = useVerification();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputs = useRef([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (element, index) => {
    if (isNaN(element.value)) return false;

    const newCode = [...code.map((d, idx) => (idx === index ? element.value : d))];
    setCode(newCode);

    if (element.value !== '' && index < 5) {
      inputs.current[index + 1].focus();
    }

    if (newCode.every(digit => digit !== '')) {
      try {
        setLoading(true);
        const verificationData = { 
          verification_code: parseInt(newCode.join('')),
          email: verificationEmail 
        };
        const response = verificationType === "signup" 
          ? await verifyCode(verificationData)
          : await verifyNewPassword(verificationData);

        if (response.success) {
          setError('');
          setVerificationEmail('');
          Cookies.set("isLoggedIn", true, { expires: 7 });
          Cookies.set("userId", response.user_id, { expires: 7, path: '/' });
          
          setIsLoggedIn(true);
          if (verificationType === 'signup') {
            navigate('/successful', { state: { title: "Account Created Successfully!", content: "Welcome aboard! We're excited to have you join us on this journey.", type: "home"} });
          } else {
            navigate('/successful', { state: { title: "Password Updated Successfully!", content: "You can now sign in with your new password.", type: "signin"} });
          }
        }
      } catch (err) {
        setError(err.message || 'Verification failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits.concat(Array(6 - digits.length).fill('')));
      
      if (digits.length === 6) {
        try {
          setLoading(true);
          const verificationData = { 
            verification_code: parseInt(pastedData),
            email: verificationEmail 
          };
          const response = verificationType === 'signup' 
            ? await verifyCode(verificationData)
            : await verifyNewPassword(verificationData);

          if (response.success) {
            setError('');
            setVerificationEmail('');
            Cookies.set("isLoggedIn", true, { expires: 7 });
            Cookies.set("userId", response.user_id, { expires: 7, path: '/' });
            
            
            if (verificationType === 'signup') {
              setIsLoggedIn(true);
              navigate('/successful', { state: { title: "Account Created Successfully!", content: "Welcome aboard! We're excited to have you join us on this journey.", type: "home"} });
            } else {
              navigate('/successful', { state: { title: "Password Updated Successfully!", content: "You can now sign in with your new password.", type: "signin"} });
            }
          }
        } catch (err) {
          setError(err.message || 'Verification failed. Please try again.');
        }
        setLoading(false);
      }
    }
  };

  return (
    <>
    {loading && (
      <Loadingspinner/>
    )}
    <div className='verification_container'>
      <div className='verification-card'>
        <Card title='Please enter verification code' content=''/>
        {error && <div className='error-message'><Error message={error}/> </div>}
      </div>
      <div className="verification-code">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            ref={(ref) => inputs.current[index] = ref}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="code-input"
          />
        ))}
      </div>
    </div>
    </>
  );
};

VerificationCode.propTypes = {
  verificationType: PropTypes.string.isRequired
};

export default VerificationCode;