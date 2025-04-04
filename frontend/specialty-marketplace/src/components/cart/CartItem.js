import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import '../../styles/CartItem.css'; // Create or use this CSS file

const CartItem = ({ item }) => {
    const { updateItemQuantity, removeItem } = useCart();

    if (!item || !item.id) { // Basic check for valid item
        console.warn("CartItem rendered with invalid item:", item);
        return null; // Don't render if item is invalid
    }

    const handleQuantityChange = (change) => {
        const newQuantity = item.quantity + change;
        // Prevent quantity from going below 1
        if (newQuantity >= 1) {
             // Optional: Check against item.stockQuantity if it's passed in the item object
             if (item.stockQuantity && newQuantity > item.stockQuantity) {
                alert(`Cannot add more than available stock (${item.stockQuantity}).`); // Simple feedback
                return; // Don't update if exceeding stock
             }
            updateItemQuantity(item.id, newQuantity);
        }
    };

    const handleRemove = () => {
        removeItem(item.id);
    };

    // Helper to format currency
    const formatCurrency = (amount) => `$${(Number(amount) || 0).toFixed(2)}`;

    // Calculate prices safely, defaulting to 0 if invalid
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const currentPrice = price * (1 - discount / 100);
    const subtotal = currentPrice * item.quantity;

    return (
        <li className="cart-item-card">
            {/* Item Image */}
            <div className="cart-item-image-container">
                <Link to={`/products/${item.id}`}>
                    <img
                        src={item.imageUrl || 'https://via.placeholder.com/100?text=No+Image'}
                        alt={item.name || 'Product'}
                        className="cart-item-image"
                    />
                </Link>
            </div>

            {/* Item Details */}
            <div className="cart-item-details">
                <Link to={`/products/${item.id}`} className="cart-item-name">
                    {item.name || 'Unknown Item'}
                </Link>
                 {/* Display discount info if applicable */}
                {discount > 0 && (
                     <span className="cart-item-discount-tag">{discount}% off</span>
                 )}
                 {/* Optional: Display other info like color/size if available */}
                 {/* <p className="cart-item-variant">Color: Red</p> */}
            </div>

            {/* Price Per Item */}
            <div className="cart-item-price-each">
                <p>{formatCurrency(currentPrice)}</p>
                {/* Show original price if discounted */}
                {discount > 0 && (
                    <span className="cart-item-original-price">{formatCurrency(price)}</span>
                 )}
            </div>

            {/* Quantity Selector */}
            <div className="cart-item-quantity">
                 <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                    className="quantity-btn"
                 >
                    <FaMinus />
                 </button>
                 <span className="quantity-value">{item.quantity}</span>
                 <button
                    onClick={() => handleQuantityChange(1)}
                    aria-label="Increase quantity"
                    className="quantity-btn"
                    // Disable if stock limit is reached
                    disabled={item.stockQuantity && item.quantity >= item.stockQuantity}
                >
                    <FaPlus />
                 </button>
            </div>

            {/* Subtotal */}
            <div className="cart-item-subtotal">
                <strong>{formatCurrency(subtotal)}</strong>
            </div>

            {/* Remove Button */}
            <div className="cart-item-remove">
                 <button
                    onClick={handleRemove}
                    aria-label={`Remove ${item.name || 'item'} from cart`}
                    className="remove-item-btn"
                >
                    <FaTrashAlt />
                 </button>
            </div>
        </li>
    );
};

export default CartItem;