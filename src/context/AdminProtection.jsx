import React from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProtection = () => {
  const { user, loading, isAdmin } = useAuth(); // ✅ Use isAdmin from context
  const location = useLocation();

  // ✅ Modern loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-100 rounded-full animate-pulse"></div>
              <div className="relative bg-purple-100 p-4 rounded-full">
                <Shield className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-700 font-medium">Verifying admin access...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ✅ If logged in but not admin, show access denied page
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            {/* Error Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-400 to-red-600 p-4 rounded-full shadow-lg">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
              <p className="text-gray-600">
                You don't have administrator privileges to access this area.
              </p>
            </div>

            {/* Info Box */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Administrator Access Required</p>
                  <p className="text-xs">
                    This section is restricted to administrators only. If you believe this is an error, please contact support.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <Link
                to="/home"
                className="flex-1 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Go to Home
              </Link>
              <Link
                to="/contact"
                className="flex-1 text-center bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ User is admin, render admin routes
  return <Outlet />;
};

export default AdminProtection;
