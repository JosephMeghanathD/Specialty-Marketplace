import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import '../../styles/Navbar.css';

const Navbar = () => {
    const { itemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();


    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
         if (isMenuOpen) { // Close menu if opening search on mobile
            setIsMenuOpen(false);
        }
    }

    const closeMobileMenu = () => setIsMenuOpen(false);

    // Close menu and search
    const closeAllOverlays = () => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    }

    const handleSearchSubmit = () => {
      if (!searchQuery.trim()) return;
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" onClick={closeAllOverlays}><h1>Specialty Market</h1></Link>
                </div>

                {/* --- Mobile Icons --- */}
                <div className="navbar-mobile-icons">
                    <button className="mobile-icon-btn search-icon-mobile" onClick={toggleSearch} aria-label="Toggle Search">
                        <FaSearch />
                    </button>
                    <Link to="/cart" className="mobile-icon-btn cart-icon-mobile" aria-label="View Cart" onClick={closeAllOverlays}>
                        <FaShoppingCart />
                        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                    </Link>
                    <button className="mobile-icon-btn menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* --- Desktop Center Links --- */}
                <div className={`navbar-center ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="navbar-links">
                        <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
                        <li><Link to="/products" onClick={closeMobileMenu}>Products</Link></li>
                        <li><Link to="/categories" onClick={closeMobileMenu}>Categories</Link></li>
                        <li><Link to="/about" onClick={closeMobileMenu}>About Us</Link></li>
                        {/* Add other links like Contact if needed */}
                    </ul>
                </div>

                {/* --- Desktop Right Side Actions --- */}
                <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
                    <div className={`search-container`}>
                       <form className={`search-container`} onSubmit={handleSearchSubmit}>
                        <input type="text" placeholder="Search products..." className="search-input" onChange={(e) => setSearchQuery(e.target.value)}/>
                        <button className="search-button" aria-label="Search" type="submit"><FaSearch /></button>
                       </form>
                    </div>
                    <div className="navbar-buttons">
                        <Link to="/account" className="desktop-icon-btn user-icon" onClick={closeMobileMenu} aria-label="My Profile"><FaUser /></Link>
                        <Link to="/cart" className="desktop-icon-btn cart-icon" onClick={closeMobileMenu} aria-label="Shopping Cart">
                            <FaShoppingCart />
                            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- Mobile Search Overlay --- */}
            {isSearchOpen && (
                <div className="search-overlay" onClick={toggleSearch}> {/* Close on overlay click */}
                    <div className="search-overlay-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="search-overlay-input"
                            autoFocus
                        />
                        {/* You might add a search button here */}
                        <button className="search-overlay-close" onClick={toggleSearch} aria-label="Close Search">
                            <FaTimes />
                        </button>
                    </div>
                </div>
             )}
        </nav>
    );
};

export default Navbar;