import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false, 
  requireSuperAdmin = false,
  requireReviewer = false 
}) => {
  const { user, admin, loading, isAuthenticated, isAdmin, isSuperAdmin, isReviewer } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If super admin access is required but user is not super admin
  if (requireSuperAdmin && !isSuperAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If reviewer access is required but user is not reviewer
  if (requireReviewer && !isReviewer()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is authenticated but tries to access auth pages
  if (!requireAuth && isAuthenticated()) {
    const redirectTo = user ? '/dashboard' : '/admin/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;