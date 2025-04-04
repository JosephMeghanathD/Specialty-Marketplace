import React from 'react';
import RegisterForm from '../components/user/RegisterForm';
import { FaShoppingCart } from 'react-icons/fa';

const RegisterPage = () => {
    return (
        <div className="auth-page register-page">
            <div className="auth-container">
                <div className="auth-brand">
                    <FaShoppingCart className="brand-icon" />
                    <h1>Specialty Marketplace</h1>
                </div>

                <div className="auth-content">
                    <div className="auth-welcome">
                        <h2>Join Our Community</h2>
                        <p>Create an account to start shopping for specialty products</p>
                    </div>

                    <RegisterForm />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;