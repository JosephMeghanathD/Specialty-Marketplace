import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3 className="footer-heading">Specialty Market</h3>
            <p className="footer-description">
              Curated collection of handpicked items from artisans around the world.
              Our mission is to connect skilled craftspeople with customers who appreciate quality.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest"><FaPinterest /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Shop</h3>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/categories/food">Food & Beverages</Link></li>
              <li><Link to="/categories/accessories">Accessories</Link></li>
              <li><Link to="/categories/home">Home & Decor</Link></li>
              <li><Link to="/categories/wellness">Health & Wellness</Link></li>
              <li><Link to="/categories/art">Art & Crafts</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Customer Service</h3>
            <ul className="footer-links">
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt />
                <span>123 Artisan Street, Craft City, CC 12345</span>
              </li>
              <li>
                <FaPhone />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <FaEnvelope />
                <span>support@specialtymarket.com</span>
              </li>
            </ul>
            <div className="footer-newsletter">
              <h4>Subscribe to our newsletter</h4>
              <div className="newsletter-form-footer">
                <input type="email" placeholder="Your email address" />
                <button type="submit">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {currentYear} Specialty Market. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;