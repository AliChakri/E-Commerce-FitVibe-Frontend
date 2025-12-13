import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ Modern loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-medium">Loading...</p>
            <p className="text-sm text-gray-500">Checking authentication</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ If not logged in, redirect to login and save intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ✅ User is authenticated, render child routes
  return <Outlet />;
};

export default ProtectRoutes;