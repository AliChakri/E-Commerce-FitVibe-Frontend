import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthApi from '../../context/apiAuth';
import { 
  BadgeCheck, 
  BadgeX, 
  Loader2, 
  Mail, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

const VerifyEmail = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // ✅ FIXED: Changed POST to GET and :id to :token
        const res = await AuthApi.get(`/verify-email/${params.id}`);
        
        if (res.data.success) {
          setMsg(res.data.message);
          setSuccess(true);
          
          // ✅ Auto redirect to login after 5 seconds
          setTimeout(() => {
            navigate('/login');
          }, 5000);
        } else {
          setSuccess(false);
          setMsg(res.data.message || "Verification failed");
        }
      } catch (error) {
        setSuccess(false);
        const errorMsg = error.response?.data?.message || error.message || "Verification failed";
        setMsg(errorMsg);
        console.error('Verification error:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [params.id, navigate]);

  // ✅ NEW: Resend verification email function
  const handleResendVerification = async () => {
    setResending(true);
    try {
      // This requires the user to be logged in
      // If not logged in, redirect to login
      const res = await AuthApi.post('/resend-verification');
      
      if (res.data.success) {
        setMsg("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to resend email";
      setMsg(errorMsg);
      
      // If not authenticated, redirect to login
      if (error.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setResending(false);
    }
  };

  // ========================================
  // 🔄 LOADING STATE
  // ========================================
  if (loading) {
    return (
      <section className='w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4'>
        <div className='bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full'>
          <div className='flex flex-col items-center gap-6'>
            <div className='relative'>
              <div className='absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75'></div>
              <div className='relative bg-blue-100 p-6 rounded-full'>
                <Mail className='w-16 h-16 text-blue-600 animate-pulse' />
              </div>
            </div>
            
            <div className='flex items-center gap-2 text-gray-700'>
              <Loader2 className='w-5 h-5 animate-spin' />
              <p className='text-xl font-semibold'>Verifying your email...</p>
            </div>
            
            <p className='text-sm text-gray-500 text-center'>
              Please wait while we verify your email address
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ========================================
  // ✅ SUCCESS STATE
  // ========================================
  if (success) {
    return (
      <section className='w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4'>
        <div className='bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full'>
          <div className='flex flex-col items-center gap-6'>
            
            {/* Success Icon with Animation */}
            <div className='relative'>
              <div className='absolute inset-0 bg-green-100 rounded-full animate-pulse'></div>
              <div className='relative bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-full shadow-lg'>
                <BadgeCheck className='w-24 h-24 text-white' strokeWidth={2.5} />
              </div>
            </div>

            {/* Success Message */}
            <div className='text-center space-y-3'>
              <h1 className='text-4xl font-bold text-gray-900'>
                Email Verified! 🎉
              </h1>
              <p className='text-lg text-gray-600 max-w-md'>
                {msg || "Your email has been successfully verified. You can now log in to your account."}
              </p>
            </div>

            {/* Benefits Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6'>
              <div className='bg-blue-50 p-4 rounded-xl text-center'>
                <ShieldCheck className='w-8 h-8 text-blue-600 mx-auto mb-2' />
                <p className='text-sm font-medium text-gray-700'>Secure Account</p>
              </div>
              <div className='bg-purple-50 p-4 rounded-xl text-center'>
                <Mail className='w-8 h-8 text-purple-600 mx-auto mb-2' />
                <p className='text-sm font-medium text-gray-700'>Email Updates</p>
              </div>
              <div className='bg-green-50 p-4 rounded-xl text-center'>
                <BadgeCheck className='w-8 h-8 text-green-600 mx-auto mb-2' />
                <p className='text-sm font-medium text-gray-700'>Full Access</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 w-full mt-6'>
              <Link 
                to="/login" 
                className='flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl'
              >
                Continue to Login
                <ArrowRight className='w-5 h-5' />
              </Link>
            </div>

            {/* Auto redirect notice */}
            <p className='text-sm text-gray-500 text-center mt-4'>
              You will be redirected to login in 5 seconds...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ========================================
  // ❌ FAILURE STATE
  // ========================================
  return (
    <section className='w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4'>
      <div className='bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full'>
        <div className='flex flex-col items-center gap-6'>
          
          {/* Error Icon */}
          <div className='relative'>
            <div className='absolute inset-0 bg-red-100 rounded-full animate-pulse'></div>
            <div className='relative bg-gradient-to-br from-red-400 to-red-600 p-6 rounded-full shadow-lg'>
              <BadgeX className='w-24 h-24 text-white' strokeWidth={2.5} />
            </div>
          </div>

          {/* Error Message */}
          <div className='text-center space-y-3'>
            <h1 className='text-4xl font-bold text-gray-900'>
              Verification Failed
            </h1>
            <p className='text-lg text-gray-600 max-w-md'>
              {msg || "We couldn't verify your email address. The link may have expired or is invalid."}
            </p>
          </div>

          {/* Common Issues */}
          <div className='bg-amber-50 border border-amber-200 rounded-xl p-6 w-full mt-4'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5' />
              <div className='space-y-2'>
                <p className='font-semibold text-amber-900'>Common Issues:</p>
                <ul className='text-sm text-amber-800 space-y-1 list-disc list-inside'>
                  <li>Verification link expired (valid for 24 hours)</li>
                  <li>Link has already been used</li>
                  <li>Email address was changed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 w-full mt-6'>
            <button
              onClick={handleResendVerification}
              disabled={resending}
              className='flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {resending ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className='w-5 h-5' />
                  Resend Verification Email
                </>
              )}
            </button>
            
            <Link 
              to="/login" 
              className='flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all'
            >
              Back to Login
            </Link>
          </div>

          {/* Support Link */}
          <div className='text-center mt-4'>
            <p className='text-sm text-gray-500'>
              Still having issues?{" "}
              <Link to="/contact" className='text-blue-600 hover:underline font-medium'>
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;