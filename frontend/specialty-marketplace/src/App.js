import React, { useState, useEffect } from 'react';
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
import CartPage from './pages/CartPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css'; // This still includes your base Tailwind styles
import './styles/auth.css';
import './styles/auth-pages.css';

// Loading screen component using Tailwind CSS
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-50">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
    <p className="mt-4 text-lg text-gray-700">Loading ...</p>
  </div>
);

// Error screen component using Tailwind CSS
const ErrorScreen = () => (
  <div className="flex items-center justify-center h-screen w-full bg-red-50">
    <div className="p-6 text-center bg-white border border-red-300 rounded-lg shadow-md">
       <p className="text-xl font-semibold text-red-700">Connection Failed</p>
       <p className="mt-2 text-gray-600">Could not connect to backend services. Please try again later.</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public route component
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  if (isAuthenticated) {
     return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Function to perform health checks on backend services
    const checkServiceHealth = async () => {
      const serviceUrls = [
        'https://product-service-826904415366.us-central1.run.app/api/products/health',
        'https://user-service-826904415366.us-central1.run.app/api/auth/health'
      ];

      try {
        // Perform both fetch requests concurrently
        const responses = await Promise.all(
          serviceUrls.map(url => fetch(url))
        );

        // Check if all responses have a 2xx status code
        const allServicesOk = responses.every(res => res.ok);

        if (allServicesOk) {
          setIsLoading(false); // All good, stop loading
        } else {
          throw new Error('One or more services are not healthy.');
        }
      } catch (error) {
        console.error("Service health check failed:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    // Set a minimum loading time to avoid flashing on fast connections
    const timer = setTimeout(() => {
        checkServiceHealth();
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
    
  }, []); // Empty dependency array ensures this runs only once

  // Render loading screen while checking services
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render an error screen if health checks failed
  if (isError) {
    return <ErrorScreen />;
  }

  // Render the main application
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/about" element={<AboutUsPage />} />

              {/* --- Protected Routes --- */}
              <Route
                path="/"
                element={<ProtectedRoute><HomePage /></ProtectedRoute>}
              />
              <Route
                path="/account"
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
              />
              <Route
                path="/orders/:orderId"
                element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}
              />
              <Route
                path="/products/:productId"
                element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>}
              />
               <Route
                  path="/cart"
                  element={<ProtectedRoute><CartPage /></ProtectedRoute>}
               />
               
              {/* --- Catch-all Route --- */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;