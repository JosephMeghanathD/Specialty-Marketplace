import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutUsPage from './pages/AboutUsPage';
import CartPage from './pages/CartPage'; // <-- Import CartPage
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // <-- Ensure CartProvider is imported
import './index.css';
import './styles/auth.css';
import './styles/auth-pages.css';

// Protected route component (Checks if user is logged in)
const ProtectedRoute = ({ children }) => {
  // Basic check using localStorage, refine with context or better token validation if needed
  const isAuthenticated = localStorage.getItem('user') !== null;

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />; // Use replace to avoid adding login to history stack
  }

  return children; // Render the protected component
};

// Optional: Public route component (Redirects logged-in users away from login/register)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  if (isAuthenticated) {
     return <Navigate to="/" replace />; // Redirect to home if already logged in
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* <-- CartProvider wraps Router */}
        <Router>
          <div className="app"> {/* Optional global container */}
            <Routes>
              {/* --- Public Routes --- */}
              {/* Use PublicRoute to prevent logged-in users accessing login/register */}
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

              {/* Publicly accessible browsing pages */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/about" element={<AboutUsPage />} />

              {/* --- Protected Routes --- */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              {/* Profile page route */}
              <Route
                path="/account" // Using /account as per your original code
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              {/* Order Detail route */}
              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
              {/* Product Detail route (keeping protected as per your code) */}
              <Route
                path="/products/:productId"
                element={
                  <ProtectedRoute>
                    <ProductDetailPage />
                  </ProtectedRoute>
                }
              />
               {/* Cart Page route */}
               <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
               />
               {/* Add Checkout route when ready */}
               {/* <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} /> */}


              {/* --- Catch-all Route --- */}
              {/* Redirect any unmatched routes to the home page */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;