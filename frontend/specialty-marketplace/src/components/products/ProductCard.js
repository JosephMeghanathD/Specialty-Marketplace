import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import '../../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const { addItem } = useCart();

    if (!product) {
        return null;
    }

    const {
        id,
        name = 'Unnamed Product',
        price = 0,
        imageUrl = 'https://via.placeholder.com/300x200?text=No+Image',
        category,
        rating = null,
        discount = 0,
        stockQuantity = 0
    } = product;

    const currentPrice = price * (1 - discount / 100);
    const hasDiscount = discount > 0;
    const averageRating = rating || (4 + Math.random()).toFixed(1);
    const isInStock = stockQuantity > 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!isInStock) return;
        const productToAdd = { id, name, price, imageUrl, discount, stockQuantity };
        addItem(productToAdd, 1);
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        console.log(`Adding ${name} (ID: ${id}) to wishlist`);
        // Wishlist logic here
    };


    return (
        <div className={`product-card-item ${!isInStock ? 'out-of-stock-card' : ''}`}>
            <Link to={`/products/${id}`} className="product-link-wrapper">
                <div className="product-image-container">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="product-image"
                        loading="lazy"
                    />
                    {hasDiscount && (
                        <span className="product-badge discount-badge">-{discount}%</span>
                    )}
                    {!isInStock && (
                         <span className="product-badge out-of-stock-badge">Out of Stock</span>
                     )}

                    <div className="product-actions-overlay">
                         <button
                            className="action-btn"
                            aria-label="Add to Wishlist"
                            onClick={handleAddToWishlist}
                        >
                            <FaHeart />
                        </button>
                        <button
                            className={`action-btn ${!isInStock ? 'disabled' : ''}`}
                            aria-label="Add to Cart"
                            onClick={handleAddToCart}
                            disabled={!isInStock}
                        >
                            <FaShoppingCart />
                        </button>
                         <span className="action-btn view-quick" aria-label="Quick View">
                            <FaEye />
                        </span>
                    </div>
                </div>

                <div className="product-info">
                     {category && <span className="product-category">{category.name || 'General'}</span>}
                    <h3 className="product-name">{name}</h3>

                    <div className="product-meta">
                        <div className="product-price">
                            {hasDiscount && (
                                <span className="original-price">${price.toFixed(2)}</span>
                            )}
                            <span className="current-price">${currentPrice.toFixed(2)}</span>
                        </div>
                        <div className="product-rating">
                            <FaStar className="star-icon"/>
                            <span>{averageRating}</span>
                        </div>
                    </div>
                </div>
             </Link>
        </div>
    );
};

export default ProductCard;