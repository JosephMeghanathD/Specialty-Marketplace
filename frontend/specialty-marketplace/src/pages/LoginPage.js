import React from 'react';
import LoginForm from '../components/user/LoginForm';
import { FaShoppingCart } from 'react-icons/fa';
const LoginPage = () => {
  return (
    <div className="auth-page login-pag ">
      <div className="auth-container">
        <div className="auth-brand">
          <FaShoppingCart className="brand-icon" />
          <h1>Specialty Marketplace</h1>
        </div>

        <div className="auth-content">
          <div className="auth-welcome">
            <h2>Welcome to our Marketplace</h2>
            <p>The best place to find unique specialty products</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};
export default LoginPage;