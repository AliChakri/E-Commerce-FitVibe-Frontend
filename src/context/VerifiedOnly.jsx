
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Mail, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthApi from './apiAuth';

const VerifiedOnly = () => {
  const { user, loading, isVerified } = useAuth();
  const [resending, setResending] = React.useState(false);

  // If still loading
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // If not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If already verified, allow access
  if (isVerified) {
    return <Outlet />;
  }

  // Resend verification email
  const handleResendVerification = async () => {
    setResending(true);
    try {
      const res = await AuthApi.post('/resend-verification');
      if (res.data.success) {
        toast.success('Verification email sent! Check your inbox.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  // If not verified, show verification required page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-full shadow-lg">
              <Mail className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Email Verification Required</h2>
            <p className="text-gray-600 text-sm">
              Please verify your email address to access this feature.
            </p>
          </div>

          {/* Email Info */}
          <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              Verification email sent to:<br />
              <span className="font-semibold">{user.email}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full mt-4">
            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 shadow-lg"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Resend Verification Email
                </>
              )}
            </button>

            <Link
              to="/home"
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Help */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Didn't receive the email?{' '}
              <Link to="/contact" className="text-blue-600 hover:underline">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedOnly;