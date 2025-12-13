import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthApi from '../../context/apiAuth';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2,
  Key,
  Send
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await AuthApi.post('/forgot-password', { email });
      
      if (res.data.success) {
        setEmailSent(true);
        toast.success("Password reset link sent! Check your email.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send reset email. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Success state - Email sent
  if (emailSent) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        <div className='w-full max-w-md'>
          <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
            {/* Success Icon */}
            <div className='flex flex-col items-center gap-4 mb-6'>
              <div className='relative'>
                <div className='absolute inset-0 bg-green-100 rounded-full animate-pulse'></div>
                <div className='relative bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full shadow-lg'>
                  <CheckCircle2 className='w-12 h-12 text-white' />
                </div>
              </div>
              
              <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  Check Your Email
                </h2>
                <p className='text-sm text-gray-600'>
                  We've sent a password reset link to
                </p>
                <p className='text-sm font-medium text-blue-600 mt-1'>
                  {email}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
              <div className='flex items-start gap-3'>
                <Mail className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
                <div className='space-y-2 text-sm text-blue-800'>
                  <p className='font-semibold'>Next steps:</p>
                  <ol className='list-decimal list-inside space-y-1 text-xs'>
                    <li>Check your email inbox</li>
                    <li>Click the reset link (valid for 10 minutes)</li>
                    <li>Create a new strong password</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Didn't receive email */}
            <div className='text-center space-y-4'>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className='text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline'
              >
                Didn't receive the email? Try again
              </button>
              
              <div className='text-xs text-gray-500'>
                Check your spam folder or{' '}
                <Link to="/contact" className='text-blue-600 hover:underline'>
                  contact support
                </Link>
              </div>
            </div>

            {/* Back to login */}
            <div className='mt-6 pt-6 border-t border-gray-100'>
              <Link
                to='/login'
                className='flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors'
              >
                <ArrowLeft className='w-4 h-4' />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form state - Enter email
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='flex flex-col items-center gap-3 mb-8'>
          <div className='bg-blue-100 p-3 rounded-full'>
            <Key size={32} className='text-blue-600' />
          </div>
          <h1 className='text-3xl text-black font-bold text-center'>
            Forgot Password?
          </h1>
          <p className='text-sm text-gray-600 text-center'>
            No worries! Enter your email and we'll send you reset instructions
          </p>
        </div>

        {/* Card */}
        <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
          
          {/* General Error */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-start gap-2'>
                <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(""); // Clear error on input
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
              </div>
              <p className='text-xs text-gray-500 mt-2'>
                Enter the email associated with your account
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email}
              className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>

            {/* Security Note */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <div className='flex items-start gap-2'>
                <Shield className='w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5' />
                <p className='text-xs text-gray-600'>
                  For security, the reset link will expire in <span className='font-semibold'>10 minutes</span>. 
                  Check your spam folder if you don't see the email.
                </p>
              </div>
            </div>

            {/* Back to login */}
            <div className='text-center pt-4 border-t border-gray-100'>
              <Link
                to='/login'
                className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors'
              >
                <ArrowLeft className='w-4 h-4' />
                Back to login
              </Link>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <p className='text-center text-xs text-gray-500 mt-6'>
          Remember your password?{' '}
          <Link to="/login" className='text-blue-600 hover:underline font-medium'>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;