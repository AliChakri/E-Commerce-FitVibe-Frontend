import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthApi from '../../context/apiAuth';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Shield, 
  AlertCircle, 
  EyeOff, 
  Eye, 
  Lock, 
  Loader2,
  LogIn,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    rememberMe: false 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await AuthApi.post("/login", form, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        setUser(res.data.user);
        
        // Show personalized welcome message
        const userName = res.data.user.firstName || res.data.user.email;
        const welcomeMsg = res.data.user.role === "admin" 
          ? "Welcome back, Admin! 👑" 
          : `Welcome back, ${userName}! 🎉`;
        
        toast.success(welcomeMsg);

        // Navigate based on role
        const destination = res.data.user.role === "admin" ? "/admin-dash" : "/home";
        navigate(destination);
      }
    } catch (err) {
      const res = err.response?.data;
      console.error('Login error:', err);

      // Handle different error types
      if (res?.errors) {
        // Backend validation errors
        const backendErrors = {};
        Object.keys(res.errors).forEach(key => {
          backendErrors[key] = res.errors[key];
        });
        setErrors(backendErrors);
        toast.error(Object.values(res.errors)[0]);
      } else if (res?.message) {
        // Handle specific error messages from backend
        const errorMsg = res.message;

        // Check for specific error types
        if (errorMsg.includes('locked') || errorMsg.includes('too many')) {
          toast.error(errorMsg, { autoClose: 5000 });
          setErrors({ general: errorMsg });
        } else if (errorMsg.includes('banned')) {
          toast.error(errorMsg, { autoClose: false });
          setErrors({ general: errorMsg });
        } else if (errorMsg.includes('verify')) {
          toast.error('Please verify your email before logging in. Check your inbox!');
          setErrors({ general: 'Email not verified. Please check your inbox.' });
        } else if (errorMsg.includes('Invalid') || errorMsg.includes('credentials')) {
          toast.error('Invalid email or password');
          setErrors({ 
            email: 'Invalid email or password',
            password: 'Invalid email or password'
          });
        } else {
          toast.error(errorMsg);
          setErrors({ general: errorMsg });
        }
      } else {
        // Generic error
        toast.error('Login failed. Please try again.');
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='flex flex-col items-center gap-3 mb-8'>
          <div className='bg-blue-100 p-3 rounded-full'>
            <Shield size={32} className='text-blue-600' />
          </div>
          <h1 className='text-3xl text-black font-bold text-center'>Welcome Back</h1>
          <p className='text-sm text-gray-600 text-center'>
            Sign in to continue your shopping journey
          </p>
        </div>

        {/* Card */}
        <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
          
          {/* Demo Credentials - More Prominent */}
          <div className='p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl mb-6'>
            <div className='flex items-start gap-3'>
              <UserCheck className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
              <div className='space-y-2'>
                <h6 className='text-sm font-semibold text-blue-900'>Quick Demo Access:</h6>
                <div className='space-y-1.5 text-xs text-blue-700'>
                  <div className='flex items-center gap-2'>
                    <div className='bg-blue-200 px-2 py-0.5 rounded text-[10px] font-medium'>ADMIN</div>
                    <code className='bg-white px-2 py-0.5 rounded'>admin@google.com</code>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='bg-purple-200 px-2 py-0.5 rounded text-[10px] font-medium'>USER</div>
                    <code className='bg-white px-2 py-0.5 rounded'>user@test.com</code>
                  </div>
                  <p className='text-[10px] text-blue-600 mt-1'>Password: Same as username before @</p>
                </div>
              </div>
            </div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-start gap-2'>
                <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <p className='text-sm text-red-800 font-medium'>Login Failed</p>
                  <p className='text-xs text-red-600 mt-1'>{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            
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
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <AlertCircle className='w-3 h-3' /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <AlertCircle className='w-3 h-3' /> {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  disabled={loading}
                />
                <span className='select-none'>Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className='text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign in to your account
                </>
              )}
            </button>

            {/* Benefits of logging in */}
            <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
              <p className='text-xs font-semibold text-gray-700'>Why sign in?</p>
              <div className='space-y-1.5'>
                <div className='flex items-center gap-2 text-xs text-gray-600'>
                  <CheckCircle2 className='w-3.5 h-3.5 text-green-600' />
                  <span>Track your orders</span>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-600'>
                  <CheckCircle2 className='w-3.5 h-3.5 text-green-600' />
                  <span>Save items to wishlist</span>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-600'>
                  <CheckCircle2 className='w-3.5 h-3.5 text-green-600' />
                  <span>Get exclusive offers</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                className='flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-50'
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                disabled={loading}
                className='flex items-center justify-center gap-2 bg-[#1877f2] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#165ecf] focus:outline-none focus:ring-2 focus:ring-[#1877f2] transition-all disabled:opacity-50'
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Security Badge */}
        <div className='flex items-center justify-center gap-2 mt-6 text-xs text-gray-500'>
          <Shield className='w-4 h-4' />
          <span>Secure login with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Login;