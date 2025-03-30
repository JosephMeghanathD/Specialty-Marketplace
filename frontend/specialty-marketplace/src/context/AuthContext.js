import React, { createContext, useState, useEffect } from 'react';
import authServiceInstance from '../service/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authServiceInstance.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await authServiceInstance.login(username, password);
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authServiceInstance.logout();
    setCurrentUser(null);
  };

  const register = async (username, email, password, firstName, lastName) => {
    return authServiceInstance.register(username, email, password, firstName, lastName);
  };

  const hasRole = (role) => {
    return currentUser?.roles?.includes(role) || false;
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    hasRole,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};