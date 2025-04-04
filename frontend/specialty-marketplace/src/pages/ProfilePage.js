import React, { useState, useEffect, useMemo, useContext } from 'react'; // Added useMemo
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaSignOutAlt, FaShoppingBag, FaSpinner, FaExclamationCircle, FaFilter, FaCalendarAlt } from 'react-icons/fa'; // Added FaFilter, FaTimes
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { AuthContext } from '../context/AuthContext';
import OrderService from '../service/OrdersSerice'; // Adjust filename if needed
import '../styles/ProfilePage.css'; // Ensure styles are imported
import '../styles/auth.css'; // Re-use some auth styles if needed

// Define possible order statuses (match backend exactly, case-insensitively if needed)
const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const ProfilePage = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]); // Raw orders from API
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' or one of ORDER_STATUSES
    const navigate = useNavigate();

    // Fetch initial data
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
                console.log("Fetching user orders...");
                const userOrders = await OrderService.getCurrentUserOrders();
                console.log("Orders fetched:", userOrders);
                setOrders(userOrders || []); // Ensure orders is always an array
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
                setError("Could not load your order history. Please try again later.");
                setOrders([]); // Reset orders on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [currentUser]); // Re-fetch if user changes (e.g., re-login)

    // --- Derived State for Displayed Orders (Sorted and Filtered) ---
    // useMemo will recalculate only when `orders` or `filterStatus` changes
    const displayOrders = useMemo(() => {
        console.log(`Recalculating displayOrders. Filter: ${filterStatus}, Orders Count: ${orders.length}`);

        // 1. Sort orders by date (latest first) - Create a shallow copy first!
        const sortedOrders = [...orders].sort((a, b) => {
            // Handle potentially null or invalid dates gracefully
            const dateA = a.orderDate ? new Date(a.orderDate) : 0;
            const dateB = b.orderDate ? new Date(b.orderDate) : 0;
            // Compare timestamps (descending)
            return (dateB.getTime ? dateB.getTime() : 0) - (dateA.getTime ? dateA.getTime() : 0);
        });

        // 2. Filter orders by status
        if (filterStatus === 'all') {
            console.log("Filtered Result (all):", sortedOrders.length);
            return sortedOrders; // Return all sorted orders
        } else {
            const filtered = sortedOrders.filter(order =>
                // Case-insensitive comparison is safer
                order.status && order.status.toUpperCase() === filterStatus.toUpperCase()
            );
            console.log(`Filtered Result (${filterStatus}):`, filtered.length);
            return filtered;
        }
    }, [orders, filterStatus]); // Dependencies for recalculation


    // --- Event Handlers ---
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleFilterChange = (status) => {
        console.log("Setting filter status to:", status);
        setFilterStatus(status); // Update the filter state
    };

    // --- Helper Functions ---
    const formatOrderDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusClassName = (status) => {
        return status ? status.toLowerCase() : 'unknown';
    };


    // --- Render Logic ---

    // Handle cases before rendering main content
     if (!currentUser && !isLoading) {
         return (
             <div className="page-container profile-page">
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
                    {/* --- Profile Information Card (Left Side) --- */}
                    <section className="profile-card">
                        <div className="profile-card-header">
                            <FaUserCircle className="profile-avatar" />
                            {/* Display loading state for user info if needed, or assume currentUser is ready */}
                            <h2>{currentUser?.username || 'Loading...'}</h2>
                            <p>{currentUser?.email || 'Loading...'}</p>
                        </div>
                        <div className="profile-details">
                            <div className="detail-item"><strong>First Name:</strong><span>{currentUser?.firstName || 'Not Set'}</span></div>
                            <div className="detail-item"><strong>Last Name:</strong><span>{currentUser?.lastName || 'Not Set'}</span></div>
                            <div className="detail-item"><strong>Roles:</strong><span>{currentUser?.roles?.join(', ').replace(/ROLE_/g, '') || 'User'}</span></div>
                        </div>
                        <div className="profile-actions">
                            {/* Link to a future edit profile page */}
                            {/* <Link to="/profile/edit" className="edit-profile-btn"><FaEdit /> Edit Profile</Link> */}
                             <button className="edit-profile-btn" onClick={() => alert('Edit Profile clicked - feature pending!')}>
                                <FaEdit /> Edit Profile
                            </button>
                            <button className="logout-btn" onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    </section>

                    {/* --- Order History Section (Right Side) --- */}
                    <section className="order-history-section">
                        <header className="order-history-header">
                             <h2><FaShoppingBag /> Order History</h2>
                             {/* Add Filter Controls */}
                             <div className="order-filters">
                                 <span className="filter-label"><FaFilter /> Filter by Status:</span>
                                 <button
                                     onClick={() => handleFilterChange('all')}
                                     className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
                                 >
                                     All
                                 </button>
                                 {ORDER_STATUSES.map(status => (
                                     <button
                                         key={status}
                                         onClick={() => handleFilterChange(status)}
                                         className={`filter-button ${filterStatus === status ? 'active' : ''} status-${getStatusClassName(status)}`}
                                     >
                                         {status.charAt(0) + status.slice(1).toLowerCase()} {/* Capitalize */}
                                     </button>
                                 ))}
                             </div>
                        </header>

                        {/* Display Loading Indicator */}
                        {isLoading && (
                            <div className="loading-indicator">
                                <FaSpinner className="spinner" /> Loading orders...
                            </div>
                        )}

                        {/* Display Error Message */}
                        {error && !isLoading && (
                            <div className="error-message">
                                <FaExclamationCircle /> {error}
                            </div>
                        )}

                        {/* Display Orders or No Orders Message */}
                        {!isLoading && !error && (
                            displayOrders.length === 0 ? (
                                <p className="no-orders-message">
                                    {filterStatus === 'all'
                                        ? "You haven't placed any orders yet."
                                        : `No orders found with status "${filterStatus}".`}
                                </p>
                            ) : (
                                <ul className="order-list">
                                    {displayOrders.map(order => (
                                        <li key={order.id} className="order-card">
                                            <div className="order-card-header">
                                                <h3>Order #{order.id}</h3>
                                                <span className={`order-status ${getStatusClassName(order.status)}`}>
                                                    {order.status || 'UNKNOWN'}
                                                </span>
                                            </div>
                                            <div className="order-card-details">
                                                <p><strong><FaCalendarAlt /> Date:</strong> {formatOrderDate(order.orderDate)}</p>
                                                <p><strong>Total:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</p>
                                                <p><strong>Items:</strong> {order.items?.length || 0}</p>
                                            </div>
                                            <div className="order-card-actions">
                                                <Link to={`/orders/${order.id}`} className="view-order-details-btn">
                                                    View Details
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                             )
                        )}
                    </section> {/* End Order History Section */}
                </div> {/* End Profile Layout */}
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;