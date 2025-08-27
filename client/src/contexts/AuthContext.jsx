// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI, adminAPI } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for existing auth tokens on app load
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      const adminToken = localStorage.getItem('adminToken');
      const savedUser = localStorage.getItem('user');
      const savedAdmin = localStorage.getItem('admin');

      if (userToken && savedUser) {
        // Verify user token is still valid
        try {
          const response = await userAPI.getProfile();
          if (response.success) {
            setUser(JSON.parse(savedUser));
          }
        } catch (error) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
        }
      }

      if (adminToken && savedAdmin) {
        // Verify admin token is still valid
        try {
          // You might want to add an admin profile endpoint
          setAdmin(JSON.parse(savedAdmin));
        } catch (error) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  // User authentication functions
  const registerUser = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await userAPI.register(userData);
      
      if (response.success) {
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      }
      
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (credentials) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await userAPI.login(credentials);
      
      if (response.success) {
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        // Clear admin session if switching to user
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setAdmin(null);
      }
      
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Admin authentication functions
  const registerAdmin = async (adminData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await adminAPI.register(adminData);
      
      if (response.success) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('admin', JSON.stringify(response.data));
        setAdmin(response.data);
      }
      
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Admin registration failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (credentials) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await adminAPI.login(credentials);
      
      if (response.success) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('admin', JSON.stringify(response.data));
        setAdmin(response.data);
        // Clear user session if switching to admin
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setUser(null);
      }
      
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout functions
  const logoutUser = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUser(null);
    setError('');
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
    setError('');
  };

  const logoutAll = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setUser(null);
    setAdmin(null);
    setError('');
  };

  // Update profile functions
  const updateUserProfile = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await userAPI.updateProfile(user._id, userData);
      
      if (response.success) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAdminProfile = async (adminData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await adminAPI.updateAdmin(admin._id, adminData);
      
      if (response.success) {
        const updatedAdmin = { ...admin, ...response.data };
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        setAdmin(updatedAdmin);
      }
      
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Admin profile update failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const isAuthenticated = () => {
    return !!user || !!admin;
  };

  const isUser = () => {
    return !!user;
  };

  const isAdmin = () => {
    return !!admin;
  };

  const isSuperAdmin = () => {
    return admin?.role === 'superadmin';
  };

  const isReviewer = () => {
    return user?.role === 'reviewer' || admin?.role === 'reviewer' || admin?.role === 'superadmin';
  };

  const getUserRole = () => {
    if (admin) return admin.role;
    if (user) return user.role;
    return null;
  };

  const getCurrentUser = () => {
    return user || admin;
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    // State
    user,
    admin,
    loading,
    error,
    
    // User functions
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    
    // Admin functions
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    updateAdminProfile,
    
    // General functions
    logoutAll,
    clearError,
    isAuthenticated,
    isUser,
    isAdmin,
    isSuperAdmin,
    isReviewer,
    getUserRole,
    getCurrentUser,
    
    // Setters
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};