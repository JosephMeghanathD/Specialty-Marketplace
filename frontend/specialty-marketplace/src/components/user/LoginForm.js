import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import authServiceInstance from '../../service/authService';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await authServiceInstance.login(username, password);
      navigate('/profile');
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      setLoading(false);
      setMessage(resMessage);
    }
  };

  return (
    <div className="auth-form-container login-container">
      <div className="auth-form-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue to your account</p>
      </div>
      
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <div className="input-icon-wrapper">
            <FaUser className="input-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-options">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
        </div>

        <div className="form-group">
          <button className="auth-button" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <FaSignInAlt className="button-icon" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </div>

        {message && (
          <div className="form-group">
            <div className="auth-alert alert-danger">
              {message}
            </div>
          </div>
        )}
        
        <div className="auth-redirect">
          <p>
            New to our platform? <a href="/register">Create an account</a>
          </p>
        </div>

        <div className="social-login">
          <p className="social-divider"><span>Or sign in with</span></p>
          <div className="social-buttons">
            <button type="button" className="social-button google">Google</button>
            <button type="button" className="social-button facebook">Facebook</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;