import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import OrderService from '../service/OrdersSerice'; // Ensure filename is correct
import { AuthContext } from '../context/AuthContext';
import { FaInfoCircle, FaCalendarAlt, FaDollarSign, FaTruck, FaHashtag, FaMapMarkerAlt, FaArrowLeft, FaSpinner, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import '../styles/OrderDetailPage.css';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId || isNaN(parseInt(orderId))) {
                setError("Invalid Order ID provided.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            setCancelError(null);
            try {
                const data = await OrderService.getOrderById(orderId);
                // Basic authorization check (can be refined based on roles)
                // Assuming user ID is stored as 'id' in currentUser from AuthContext
                if (currentUser && data.userId !== currentUser.id && !currentUser.roles?.includes('ROLE_ADMIN')) {
                     setError("You are not authorized to view this order.");
                     setOrder(null);
                } else {
                    setOrder(data);
                }
            } catch (err) {
                console.error(`Failed to fetch order details for ID ${orderId}:`, err);
                if (err.response && err.response.status === 404) {
                    setError(`Order with ID ${orderId} not found.`);
                } else if (err.response && err.response.status === 403) {
                     setError("You are not authorized to view this order.");
                } else {
                    setError("Could not load order details. Please try again later.");
                }
                setOrder(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, currentUser]);

    const handleCancelOrder = async () => {
        if (!order || isCancelling) return;

        const confirmCancel = window.confirm("Are you sure you want to cancel this order? This action cannot be undone.");
        if (!confirmCancel) {
            return;
        }

        setIsCancelling(true);
        setCancelError(null);

        try {
            await OrderService.cancelOrder(orderId);
            console.log(`Order ${orderId} cancelled successfully.`);
            alert("Order cancelled successfully.");
            // Navigate back to profile/account page where order history is shown
            navigate('/account'); // ADJUST '/account' to '/profile' if needed

        } catch (err) {
            console.error(`Failed to cancel order ${orderId}:`, err);
            const errorMessage = err.response?.data?.message || err.message || "Could not cancel the order. It might already be processed or shipped.";
            setCancelError(errorMessage);
        } finally {
            setIsCancelling(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch (e) { return 'Invalid Date'; }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '$0.00';
        // Ensure amount is treated as a number before toFixed
        return `$${Number(amount).toFixed(2)}`;
    };

    const getStatusClassName = (status) => {
        return status ? status.toLowerCase() : 'unknown';
    };

    const renderLoading = () => (
        <div className="order-detail-message loading">
            <FaSpinner className="spinner-icon" />
            <p>Loading Order Details...</p>
        </div>
    );

    const renderError = () => (
        <div className="order-detail-message error">
            <FaExclamationTriangle />
            <p>{error}</p>
            {/* ADJUST '/account' to '/profile' if needed */}
            <Link to="/account" className="back-link">
                <FaArrowLeft /> Back to Order History
            </Link>
        </div>
    );

    const renderOrderNotFound = () => (
         <div className="order-detail-message not-found">
            <FaInfoCircle />
            <p>Order not found.</p>
             {/* ADJUST '/account' to '/profile' if needed */}
             <Link to="/account" className="back-link">
                <FaArrowLeft /> Back to Order History
            </Link>
        </div>
    );

    if (isLoading) {
        return (
             <div className="page-container order-detail-page">
                <Navbar />
                <main className="order-detail-content-area">
                     {renderLoading()}
                </main>
                <Footer />
            </div>
        );
    }

    // Handle error state *after* loading is false
    if (error) {
         return (
             <div className="page-container order-detail-page">
                <Navbar />
                <main className="order-detail-content-area">
                     {renderError()}
                 </main>
                <Footer />
            </div>
        );
    }

     // Handle not found state if loading finished, no error, but order is null
     if (!order) {
        return (
            <div className="page-container order-detail-page">
               <Navbar />
               <main className="order-detail-content-area">
                    {renderOrderNotFound()}
                </main>
               <Footer />
           </div>
       );
    }

    // Order is loaded and valid
    // Determine if order is cancellable (adjust based on your backend logic/status names)
    const isCancellable = order.status === 'PENDING' || order.status === 'PROCESSING';

    return (
        <div className="page-container order-detail-page">
            <Navbar />
            <main className="order-detail-content-area">
                <header className="order-detail-header">
                    <h1>Order Details</h1>
                    {/* ADJUST '/account' to '/profile' if needed */}
                    <Link to="/account" className="back-link">
                        <FaArrowLeft /> Back to Order History
                    </Link>
                </header>

                <section className="order-summary-card">
                    <div className="summary-header-actions">
                         <h2>Order Summary</h2>
                         {isCancellable && (
                            <button
                                className="cancel-order-button"
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                            >
                                {isCancelling ? (
                                    <><FaSpinner className="spinner-icon" /> Cancelling...</>
                                ) : (
                                    <><FaTimes /> Cancel Order</>
                                )}
                            </button>
                         )}
                    </div>
                     {cancelError && (
                        <div className="cancellation-error-message">
                             <FaExclamationTriangle /> {cancelError}
                        </div>
                     )}

                    <div className="summary-grid">
                        <div className="summary-item"><FaHashtag className="summary-icon" /><div><strong>Order ID:</strong><span>#{order.id}</span></div></div>
                        <div className="summary-item"><FaCalendarAlt className="summary-icon" /><div><strong>Date Placed:</strong><span>{formatDate(order.orderDate)}</span></div></div>
                        <div className="summary-item"><FaInfoCircle className="summary-icon" /><div><strong>Status:</strong><span className={`order-status-badge ${getStatusClassName(order.status)}`}>{order.status || 'UNKNOWN'}</span></div></div>
                        <div className="summary-item"><FaDollarSign className="summary-icon" /><div><strong>Order Total:</strong><span>{formatCurrency(order.totalAmount)}</span></div></div>
                        <div className="summary-item full-width"><FaMapMarkerAlt className="summary-icon" /><div><strong>Shipping Address:</strong><span>{order.shippingAddress || 'Not Provided'}</span></div></div>
                        {order.trackingNumber && (<div className="summary-item"><FaTruck className="summary-icon" /><div><strong>Tracking Number:</strong><span>{order.trackingNumber}</span></div></div>)}
                    </div>
                </section>

                <section className="order-items-section">
                    <h2>Items Ordered ({order.items?.length || 0})</h2>
                    {(!order.items || order.items.length === 0) ? (
                        <p>No items found for this order.</p>
                    ) : (
                        <ul className="order-items-list">
                            {order.items.map((item) => (
                                <li key={item.id || item.productId} className="order-item-card">
                                    <div className="item-image-container"><img src={item.productImageUrl || 'https://via.placeholder.com/100?text=No+Image'} alt={item.productName || 'Product Image'} className="item-image" /></div>
                                    <div className="item-details"><Link to={`/products/${item.productId}`} className="item-name">{item.productName || 'Unknown Product'}</Link><p className="item-id">Product ID: {item.productId}</p></div>
                                    <div className="item-pricing"><p className="item-price-each">{formatCurrency(item.price)} each</p></div>
                                    <div className="item-quantity"><p>Qty: {item.quantity || 1}</p></div>
                                    <div className="item-subtotal"><p>Subtotal:</p><strong>{formatCurrency((item.price || 0) * (item.quantity || 1))}</strong></div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default OrderDetailPage;