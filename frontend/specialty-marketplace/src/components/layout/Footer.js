import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import "../../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3 className="footer-heading">Specialty Market</h3>
            <p className="footer-description">
              Curated collection of handpicked items from artisans around the
              world. Our mission is to connect skilled craftspeople with
              customers who appreciate quality.
            </p>
            <div className="footer-social">
              <a
                href="https://github.com/JosephMeghanathD"
                target="_blank"
                rel="noreferrer"
                aria-label="github"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.instagram.com/joe_hit_hard/"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/joseph-meghanath-9880ba149/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Shop</h3>
            <ul className="footer-links">
              <li>
                <Link to="/products">All Products</Link>
              </li>
              <li>
                <Link to="/categories/food">Food & Beverages</Link>
              </li>
              <li>
                <Link to="/categories/accessories">Accessories</Link>
              </li>
              <li>
                <Link to="/categories/home">Home & Decor</Link>
              </li>
              <li>
                <Link to="/categories/wellness">Health & Wellness</Link>
              </li>
              <li>
                <Link to="/categories/art">Art & Crafts</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Customer Service</h3>
            <ul className="footer-links">
              <li>
                <Link to="/account">My Account</Link>
              </li>
              <li>
                <Link to="/account">Order Tracking</Link>
              </li>
              <li>
                <Link to="/wishlist">Wishlist</Link>
              </li>
              <li>
                <Link to="/shipping">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
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
                <span>+1 (913) 208-8818</span>
              </li>
              <li>
                <FaEnvelope />
                <span>josephmeghanath@gmail.com</span>
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
