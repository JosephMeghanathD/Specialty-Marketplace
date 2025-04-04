import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartItem from '../components/cart/CartItem';
import { FaShoppingCart, FaTrashAlt, FaCreditCard, FaArrowRight, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import '../styles/CartPage.css';
import { useCart } from '../context/CartContext';
import orderServiceInstance from '../service/OrdersSerice';

const CartPage = () => {
    const { cartItems, cartTotal, clearCartItems, itemCount } = useCart();
    const navigate = useNavigate();
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);

    const formatCurrency = (amount) => `$${(Number(amount) || 0).toFixed(2)}`;

    // Placeholder values for shipping/tax
    const shippingCost = cartTotal > 50 || cartTotal === 0 ? 0 : 7.99; // Free shipping over $50
    const taxRate = 0.08; // Example 8% tax rate
    const estimatedTax = cartTotal * taxRate;
    const finalTotal = cartTotal + shippingCost + estimatedTax;

    // --- Handle Order Creation ---
    // NOTE: This is simplified. Real checkout needs shipping, payment, etc.
    const handleProceedToCheckout = async () => {
        if (itemCount === 0) return; // Don't proceed if cart is empty

        setIsProcessingOrder(true);
        setOrderError(null);

        // 1. Format Order Data (example structure, adjust to your backend)
        const orderData = {
            // userId will be extracted from token on backend
            shippingAddress: "123 Placeholder St, Anytown, USA 12345", // Get from user input in real checkout
            paymentMethod: "Simulated Card", // Get from payment gateway in real checkout
            // deliveryDate: null, // Backend might set this
            // trackingNumber: null, // Set upon shipping
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                // Backend should fetch price/name/image based on productId to ensure accuracy
                // Sending them can be okay but might be overridden by backend logic
                // productName: item.name,
                // price: item.price,
                // productImageUrl: item.imageUrl
            })),
             // totalAmount: cartTotal, // Backend should recalculate total based on current prices
        };

        console.log("Attempting to create order with data:", orderData);

        try {
            // 2. Call Backend Service
            const createdOrder = await orderServiceInstance.createOrder(orderData);
            console.log("Order created successfully:", createdOrder);

            // 3. Clear Cart on Success
            clearCartItems();

            // 4. Redirect to Order Confirmation / Profile page
            // navigate(`/orders/${createdOrder.id}`); // Navigate to the new order's detail page
            navigate('/profile'); // Or navigate back to profile/order history

        } catch (error) {
            console.error("Failed to create order:", error);
            setOrderError(error.response?.data?.message || "An error occurred during checkout. Please try again.");
            // Keep items in cart on failure
        } finally {
            setIsProcessingOrder(false);
        }
    };

    return (
        <div className="page-container cart-page">
            <Navbar />
            <main className="cart-content-area">
                <header className="cart-header">
                    <h1><FaShoppingCart /> Your Shopping Cart</h1>
                    {itemCount > 0 && (
                        <button onClick={clearCartItems} className="clear-cart-button">
                            <FaTrashAlt /> Clear Cart
                        </button>
                    )}
                </header>

                {itemCount === 0 ? (
                    <div className="cart-empty-message">
                        <FaShoppingCart size={50} />
                        <p>Your cart is currently empty.</p>
                        <Link to="/products" className="browse-products-link">
                            Start Shopping <FaArrowRight />
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* --- Cart Items List --- */}
                        <section className="cart-items-list">
                            <h2>Items ({itemCount})</h2>
                            <ul>
                                {cartItems.map(item => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </ul>
                        </section>

                        {/* --- Order Summary --- */}
                        <section className="cart-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Est. Shipping</span>
                                    <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Est. Tax</span>
                                    <span>{formatCurrency(estimatedTax)}</span>
                                </div>
                                <div className="summary-total">
                                    <span>Estimated Total</span>
                                    <span>{formatCurrency(finalTotal)}</span>
                                </div>
                            </div>
                            {orderError && (
                                <div className="checkout-error-message">
                                    <FaExclamationCircle /> {orderError}
                                </div>
                            )}
                            <button
                                className="checkout-button"
                                onClick={handleProceedToCheckout}
                                disabled={isProcessingOrder}
                            >
                                {isProcessingOrder ? (
                                    <>
                                        <FaSpinner className="spinner-icon" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaCreditCard /> Proceed to Checkout
                                    </>
                                )}
                            </button>
                             <p className="checkout-note">
                                This is a simulation. Clicking checkout will attempt to create an order with placeholder details.
                            </p>
                        </section>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;