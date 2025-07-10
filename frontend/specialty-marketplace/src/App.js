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
import './index.css';
import './styles/auth.css';
import './styles/auth-pages.css';

// Loading screen component using Tailwind CSS
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-50">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
    <p className="mt-4 text-lg text-gray-700">Connecting to services...</p>
    <p className="mt-1 text-sm text-gray-500">This may take a moment while services start up.</p>
  </div>
);

// Error screen component using Tailwind CSS
const ErrorScreen = () => (
  <div className="flex items-center justify-center h-screen w-full bg-red-50">
    <div className="p-6 text-center bg-white border border-red-300 rounded-lg shadow-md">
       <p className="text-xl font-semibold text-red-700">Connection Failed</p>
       <p className="mt-2 text-gray-600">Could not connect to backend services after several attempts. Please try again later.</p>
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
    let isMounted = true; // Flag to prevent state updates if the component unmounts

    const serviceUrls = [
      'https://product-service-826904415366.us-central1.run.app/api/products/health',
      'https://user-service-826904415366.us-central1.run.app/api/auth/health'
    ];
    
    const retryDelay = 1000; // 3 seconds between retries
    const maxRetries = 15;   // Maximum number of attempts
    let attemptCount = 0;

    const pollServices = async () => {
      attemptCount++;
      console.log(`Attempt ${attemptCount}: Checking service health...`);

      try {
        const responses = await Promise.all(
          serviceUrls.map(url => fetch(url))
        );

        const allServicesOk = responses.every(res => res.ok);

        if (allServicesOk) {
          console.log("All services are healthy. Starting application.");
          if (isMounted) {
            setIsLoading(false); // Success! Render the app.
          }
        } else {
          throw new Error('One or more services are not ready.');
        }
      } catch (error) {
        console.warn(`Attempt ${attemptCount} failed: ${error.message}`);
        
        if (isMounted) {
          if (attemptCount >= maxRetries) {
            console.error("Max retries reached. Services are unavailable.");
            setIsError(true);
            setIsLoading(false);
          } else {
            // Wait for the delay then try again
            setTimeout(pollServices, retryDelay);
          }
        }
      }
    };

    // Start the polling process
    pollServices();

    // Cleanup function to run when the component unmounts
    return () => {
      isMounted = false;
    };
    
  }, []); // Empty dependency array ensures this effect runs only once

  // Render loading screen while polling services
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render an error screen if polling fails after all retries
  if (isError) {
    return <ErrorScreen />;
  }

  // Render the main application once services are confirmed to be up
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