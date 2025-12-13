
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

const GuestOnly = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // If user is logged in, redirect to appropriate page
  if (user) {
    // Admin goes to admin dashboard
    if (isAdmin) {
      return <Navigate to="/admin/dashboard/main" replace />;
    }
    // Regular user goes to home
    return <Navigate to="/home" replace />;
  }

  // Not logged in, show auth pages
  return <Outlet />;
};

export default GuestOnly;