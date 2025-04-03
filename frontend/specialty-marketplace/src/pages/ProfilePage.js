import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaSignOutAlt, FaShoppingBag, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { AuthContext } from '../context/AuthContext';
// NOTE: Check if your OrderService file is actually named OrdersSerice.js or OrderService.js
import OrderService from '../service/OrdersSerice'; // <-- Adjust filename if needed
import '../styles/ProfilePage.css';
import '../styles/auth.css'; // Re-use some auth styles if needed

const ProfilePage = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!currentUser) {
                setError("User data not found. Please log in again.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Fetch user's orders
                // NOTE: Ensure your service method matches what's needed.
                // getCurrentUserOrders might be sufficient if it uses the token implicitly.
                const userOrders = await OrderService.getCurrentUserOrders();
                setOrders(userOrders || []);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
                setError("Could not load your profile data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [currentUser]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatOrderDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusClassName = (status) => {
        return status ? status.toLowerCase() : 'unknown';
    };

    if (!currentUser && !isLoading) {
         return (
             <div className="page-container">
                <Navbar />
                <main className="profile-container profile-error-container">
                     <FaExclamationCircle className="error-icon" />
                     <h2>Not Logged In</h2>
                     <p>Please log in to view your profile.</p>
                     <Link to="/login" className="auth-button">Go to Login</Link>
                </main>
                <Footer />
            </div>
         );
    }

    return (
        <div className="page-container profile-page">
            <Navbar />
            <main className="profile-container">
                <h1>My Profile</h1>
                <div className="profile-layout">
                    {/* Profile Information Card */}
                    <section className="profile-card">
                        <div className="profile-card-header">
                            <FaUserCircle className="profile-avatar" />
                            <h2>{currentUser?.username || 'Username'}</h2>
                            <p>{currentUser?.email || 'Email Address'}</p>
                        </div>
                        <div className="profile-details">
                            <div className="detail-item">
                                <strong>First Name:</strong>
                                <span>{currentUser?.firstName || 'Not Set'}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Last Name:</strong>
                                <span>{currentUser?.lastName || 'Not Set'}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Roles:</strong>
                                <span>{currentUser?.roles?.join(', ').replace('ROLE_', '') || 'User'}</span>
                            </div>
                        </div>
                        <div className="profile-actions">
                            <button className="edit-profile-btn">
                                <FaEdit /> Edit Profile
                            </button>
                            <button className="logout-btn" onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    </section>

                    {/* Order History Section */}
                    <section className="order-history-section">
                        <h2><FaShoppingBag /> Order History</h2>
                        {isLoading && (
                            <div className="loading-indicator">
                                <FaSpinner className="spinner" /> Loading orders...
                            </div>
                        )}
                        {error && !isLoading && (
                            <div className="error-message">
                                <FaExclamationCircle /> {error}
                            </div>
                        )}
                        {!isLoading && !error && orders.length === 0 && (
                            <p className="no-orders-message">You haven't placed any orders yet.</p>
                        )}
                        {!isLoading && !error && orders.length > 0 && (
                            <ul className="order-list">
                                {orders.map(order => (
                                    <li key={order.id} className="order-card">
                                        <div className="order-card-header">
                                            <h3>Order #{order.id}</h3>
                                            <span className={`order-status ${getStatusClassName(order.status)}`}>
                                                {order.status || 'UNKNOWN'}
                                            </span>
                                        </div>
                                        <div className="order-card-details">
                                            <p><strong>Date:</strong> {formatOrderDate(order.orderDate)}</p>
                                            <p><strong>Total:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</p>
                                            <p><strong>Items:</strong> {order.items?.length || 0}</p>
                                        </div>
                                        <div className="order-card-actions">
                                            {/* Link to a future detailed order page */}
                                            <Link to={`/orders/${order.id}`} className="view-order-details-btn">
                                                View Details
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;