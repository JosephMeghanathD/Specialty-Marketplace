import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaUserCircle } from 'react-icons/fa';
import authServiceInstance from '../../service/authService';

const RegisterForm = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }
    
    if (form.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return false;
    }
    
    if (form.username.length < 3) {
      setMessage('Username must be at least 3 characters');
      return false;
    }
    
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await authServiceInstance.register(
        form.username,
        form.email,
        form.password,
        form.firstName,
        form.lastName
      );

      setMessage(response.data.message);
      setSuccessful(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      setMessage(resMessage);
      setSuccessful(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container register-container">
      <div className="auth-form-header">
        <h2>Create Account</h2>
        <p>Join our marketplace today</p>
        
        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Account</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Profile</span>
          </div>
        </div>
      </div>

      <form className="auth-form">
        {step === 1 && !successful && (
          <div className="form-step">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength="3"
                  maxLength="20"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  maxLength="40"
                />
              </div>
              <div className="password-strength">
                <div className={`strength-meter ${form.password.length >= 6 ? 'good' : 'weak'}`}></div>
                <span className="strength-text">
                  {form.password.length === 0 ? '' : form.password.length < 6 ? 'Weak' : 'Good'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <button 
                className="auth-button"
                onClick={handleNextStep}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && !successful && (
          <div className="form-step">
            <div className="profile-avatar">
              <FaUserCircle className="avatar-icon" />
              <button type="button" className="avatar-upload-btn">Upload Photo</button>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="terms-agreement">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <div className="form-navigation">
              <button 
                type="button" 
                className="back-button"
                onClick={handlePrevStep}
              >
                Back
              </button>
              
              <button 
                type="submit" 
                className="auth-button" 
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <FaUserPlus className="button-icon" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="form-group">
            <div
              className={
                successful ? "auth-alert alert-success" : "auth-alert alert-danger"
              }
            >
              {message}
            </div>
          </div>
        )}
        
        {successful && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Registration Successful!</h3>
            <p>Redirecting to login page...</p>
          </div>
        )}
        
        <div className="auth-redirect">
          <p>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;