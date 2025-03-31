import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <h1>Specialty Market</h1>
          </Link>
        </div>
        
        <div className="navbar-mobile-icons">
          <button className="search-icon-mobile" onClick={toggleSearch}>
            <FaSearch />
          </button>
          <Link to="/cart" className="cart-icon-mobile">
            <FaShoppingCart />
            <span className="cart-badge">3</span>
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <div className={`navbar-center ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
            <li><Link to="/categories" onClick={() => setIsMenuOpen(false)}>Categories</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          </ul>
        </div>
        
        <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
          <div className={`search-container ${isSearchOpen ? 'active' : ''}`}>
            <input type="text" placeholder="Search products..." className="search-input" />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
          <div className="navbar-buttons">
            <Link to="/account" className="user-icon" onClick={() => setIsMenuOpen(false)}>
              <FaUser />
            </Link>
            <Link to="/cart" className="cart-icon" onClick={() => setIsMenuOpen(false)}>
              <FaShoppingCart />
              <span className="cart-badge">3</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-overlay-content">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="search-overlay-input" 
              autoFocus
            />
            <button className="search-overlay-close" onClick={toggleSearch}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;