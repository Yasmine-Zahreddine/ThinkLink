import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './verificationCode.css';
import Card from '../card/Card';
import Loadingspinner from "../../components/loading-spinner/Loadingspinner.jsx";
import { verifyCode } from '../../../api/verify';
import { useVerification } from '../../context/VerificationContext';
import { useNavigate } from 'react-router-dom';
import Error from '../error/Error';

const VerificationCode = () => {
  const redirect = useNavigate();
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
        const response = await verifyCode({ 
          verification_code: parseInt(newCode.join('')),
          email: verificationEmail 
        });
        if (response.success) {
          setError('');
          setVerificationEmail('');
          redirect("/signup/successful");
        }
      } catch (err) {
        setError(err.message || 'Verification failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
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
          const response = await verifyCode({ 
            verification_code: parseInt(pastedData),
            email: verificationEmail 
          });
          if (response.success) {
            setError('');
            setVerificationEmail('');
          redirect("/signup/successful");
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
    <div className='verfification_container'>
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
  email: PropTypes.string.isRequired
};

export default VerificationCode; 