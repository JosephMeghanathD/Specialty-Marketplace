import React, { useEffect, useRef } from 'react';
import LoginForm from '../components/user/LoginForm';
import { FaShoppingCart } from 'react-icons/fa';

const LoginPage = () => {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Mouse parallax effect
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };

      // Get all particles
      const particles = document.querySelectorAll('.particle');

      // Apply parallax movement to each particle
      particles.forEach((particle, index) => {
        const speed = 1 + index * 0.5;
        const x = mouseRef.current.x * 20 * speed - 10 * speed;
        const y = mouseRef.current.y * 20 * speed - 10 * speed;

        particle.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Particle styles based on index

  return (
    <div className="auth-page login-page">
     <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

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
