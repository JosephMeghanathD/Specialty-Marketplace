import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/HomePage.css';

// Import the HomePage component
import HomePageComponent from '../components/HomePageComponent';

const HomePage = () => {
  return (
    <div className="page-container">
      <Navbar />
      <main>
        <HomePageComponent />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;