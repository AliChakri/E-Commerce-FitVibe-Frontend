import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthApi from '../../context/apiAuth';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Shield,
  Check,
  X,
  Key
} from 'lucide-react';

const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Check password strength as user types
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setErrors(prev => ({ ...prev, password: "" }));

    setPasswordStrength({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const clientErrors = {};

    if (password.length < 8) {
      clientErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      clientErrors.confirmPassword = "Passwords do not match";
    }

    if (!Object.values(passwordStrength).every(v => v)) {
      clientErrors.password = "Password must meet all requirements";
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED: Use :token instead of :id
      const res = await AuthApi.post(
        `/reset-password/${params.id}`, // Your route uses :id param
        { password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Password reset successful! You can now log in.");
        navigate('/login');
      }
    } catch (err) {
      const res = err.response?.data;
      
      if (res?.errors) {
        // Handle validation errors
        const backendErrors = {};
        Object.keys(res.errors).forEach(key => {
          backendErrors[key] = res.errors[key];
        });
        setErrors(backendErrors);
        toast.error(Object.values(res.errors)[0]);
      } else {
        const errorMsg = res?.message || "Failed to reset password. The link may have expired.";
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
      }
      
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordStrong = Object.values(passwordStrength).every(v => v);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='flex flex-col items-center gap-3 mb-8'>
          <div className='bg-blue-100 p-3 rounded-full'>
            <Key size={32} className='text-blue-600' />
          </div>
          <h1 className='text-3xl text-black font-bold text-center'>
            Reset Your Password
          </h1>
          <p className='text-sm text-gray-600 text-center'>
            Create a new strong password for your account
          </p>
        </div>

        {/* Card */}
        <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
          
          {/* General Error */}
          {errors.general && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-start gap-2'>
                <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <p className='text-sm text-red-800 font-medium'>Reset Failed</p>
                  <p className='text-xs text-red-600 mt-1'>{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className='mt-3 space-y-2'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-gray-600'>Password strength:</span>
                    <span className={`font-medium ${isPasswordStrong ? 'text-green-600' : 'text-orange-600'}`}>
                      {isPasswordStrong ? 'Strong' : 'Weak'}
                    </span>
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-xs'>
                    <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.length ? <Check className='w-3 h-3' /> : <X className='w-3 h-3' />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.uppercase ? <Check className='w-3 h-3' /> : <X className='w-3 h-3' />}
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.lowercase ? <Check className='w-3 h-3' /> : <X className='w-3 h-3' />}
                      <span>Lowercase</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.number ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.number ? <Check className='w-3 h-3' /> : <X className='w-3 h-3' />}
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.special ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.special ? <Check className='w-3 h-3' /> : <X className='w-3 h-3' />}
                      <span>Special char</span>
                    </div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <AlertCircle className='w-3 h-3' /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors(prev => ({ ...prev, confirmPassword: "" }));
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Re-enter your new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <AlertCircle className='w-3 h-3' /> {errors.confirmPassword}
                </p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className='text-green-600 text-xs mt-1 flex items-center gap-1'>
                  <CheckCircle2 className='w-3 h-3' /> Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Reset Password
                </>
              )}
            </button>

            {/* Security Note */}
            <div className='bg-blue-50 rounded-lg p-4'>
              <div className='flex items-start gap-2'>
                <Shield className='w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5' />
                <p className='text-xs text-blue-800'>
                  After resetting, you'll be logged out from all devices for security.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Back to login */}
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

export default ResetPassword;