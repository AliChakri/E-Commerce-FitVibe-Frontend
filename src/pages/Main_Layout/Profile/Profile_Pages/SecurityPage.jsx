import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../../../../context/apiAuth';
import { toast } from 'react-toastify';
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
  Key,
  Info
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthProvider';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const SecurityPage = () => {

  const { lang } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleNewPasswordChange = (e) => {
    const pwd = e.target.value;
    setFormData(prev => ({ ...prev, newPassword: pwd }));
    setErrors(prev => ({ ...prev, newPassword: '' }));

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

    const clientErrors = {};

    if (!formData.oldPassword) {
      clientErrors.oldPassword = t('currentPasswordRequired');
    }

    if (formData.newPassword.length < 8) {
      clientErrors.newPassword = t('passwordAtLeast8');
    }

    if (!Object.values(passwordStrength).every(v => v)) {
      clientErrors.newPassword = t('passwordMeetRequirements');
    }

    if (formData.newPassword !== formData.confirmPassword) {
      clientErrors.confirmPassword = t('passwordsDoNotMatch');
    }

    if (formData.oldPassword === formData.newPassword) {
      clientErrors.newPassword = t('newPasswordDifferent');
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await AuthApi.post(
        '/change-password',
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSuccess(true);
        toast.success('Password changed successfully! Redirecting to login...');

        setTimeout(() => {
          logout();
        }, 3000);
      }
    } catch (err) {
      const res = err.response?.data;

      if (res?.errors) {
        const backendErrors = {};
        Object.keys(res.errors).forEach(key => {
          backendErrors[key] = res.errors[key];
        });
        setErrors(backendErrors);
        toast.error(Object.values(res.errors)[0]);
      } else {
        const errorMsg = res?.message || 'Failed to change password';

        if (errorMsg.includes('Incorrect') || errorMsg.includes('incorrect')) {
          setErrors({ oldPassword: 'Current password is incorrect' });
        } else if (errorMsg.includes('same') || errorMsg.includes('different')) {
          setErrors({ newPassword: 'New password must be different from old password' });
        } else {
          setErrors({ general: errorMsg });
        }

        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const isPasswordStrong = Object.values(passwordStrength).every(v => v);

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className='min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-8 
        bg-gradient-to-br from-green-50 via-white to-blue-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>

        <div className='w-full max-w-md'>
          <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700'>
            
            <div className='flex flex-col items-center gap-4 mb-6'>
              <div className='relative'>
                <div className='absolute inset-0 bg-green-200 dark:bg-green-900 rounded-full animate-pulse'></div>
                <div className='relative bg-green-500 dark:bg-green-600 p-4 rounded-full shadow-lg'>
                  <CheckCircle2 className='w-12 h-12 text-white' />
                </div>
              </div>

              <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  {t('passwordChanged')}
                </h2>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  {t('passwordUpdatedSuccessfully')}
                </p>
              </div>
            </div>

            <div className='bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <Info className='w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5' />
                <div className='space-y-2 text-sm text-blue-800 dark:text-blue-300'>
                  <p className='font-semibold'>For security reasons:</p>
                  <ul className='list-disc list-inside space-y-1 text-xs'>
                    <li>You've been logged out from all devices</li>
                    <li>Please log in again with your new password</li>
                    <li>Redirecting to login page...</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-center gap-2 mt-6 text-gray-600 dark:text-gray-300'>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span className='text-sm'>Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORM SCREEN
  return (
    <div className='min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-8 bg-transparent'>

      <div className='w-full max-w-2xl'>
        
        <div className='flex flex-col items-center gap-3 mb-8'>
          <div className='bg-blue-100 dark:bg-blue-900 p-3 rounded-full'>
            <Key size={32} className='text-blue-600 dark:text-blue-300' />
          </div>
          <h1 className='text-3xl text-black dark:text-white font-bold text-center'>
            {t('changePassword')}
          </h1>
          <p className='text-sm text-gray-600 dark:text-gray-300 text-center max-w-md'>
            {t('updatePasswordInfo')}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700'>

          <div className='mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg'>
            <div className='flex items-start gap-3'>
              <Shield className='w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5' />
              <div className='text-sm text-amber-800 dark:text-amber-300'>
                <p className='font-semibold mb-1'>{t('securityNotice')}</p>
                <p className='text-xs'>
                  {t('securityNoticeDescription')}
                </p>
              </div>
            </div>
          </div>

          {errors.general && (
            <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg'>
              <div className='flex items-start gap-2'>
                <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 mt-0.5' />
                <p className='text-sm text-red-800 dark:text-red-300'>{t(String(errors.general).toLocaleLowerCase())}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>

            {/* CURRENT PASSWORD */}
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('currentPassword')} <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="oldPassword"
                  type={showPasswords.old ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, oldPassword: e.target.value }));
                    setErrors(prev => ({ ...prev, oldPassword: '' }));
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-white transition-all 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${errors.oldPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder={t('enterCurrentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                   dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {errors.oldPassword && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <AlertCircle className='w-3 h-3' /> {t(String(errors.oldPassword).replace(" ", ""))}
                </p>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('newPassword')} <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleNewPasswordChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.newPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder={t('createStrongPassword')}
                />

                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Strength */}
              {formData.newPassword && (
                <div className='mt-3 space-y-2'>
                  <div className='flex items-center justify-between text-xs text-gray-600 dark:text-gray-300'>
                    <span>{t('passwordStrength')}:</span>
                    <span className={isPasswordStrong ? 'text-green-600 dark:text-green-400' : 'text-orange-600'}>
                      {isPasswordStrong ? `${t('strong')} ✓` : t('weak')}
                    </span>
                  </div>

                  <div className='grid grid-cols-2 gap-2 text-xs'>
                    {[
                      ['8+ characters', passwordStrength.length],
                      ['Uppercase', passwordStrength.uppercase],
                      ['Lowercase', passwordStrength.lowercase],
                      ['Number', passwordStrength.number],
                      ['Special char', passwordStrength.special]
                    ].map(([label, ok], idx) => (
                      <div key={idx} className={`flex items-center gap-1 ${ok ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {ok ? <Check className='w-3 h-3' /> : <X className='w-3 h-3' />}
                        <span>{t(String(label).toLocaleLowerCase())}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.newPassword && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <AlertCircle className='w-3 h-3' /> {t(String(errors.newPassword).replace(" ", ""))}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('confirmNewPassword')} <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />

                <input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder={t('reenterNewPassword')}
                />

                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <AlertCircle className='w-3 h-3' /> {t(String(errors.confirmPassword).replace(" ", ""))}
                </p>
              )}

              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <p className='text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1'>
                  <CheckCircle2 className='w-3 h-3' /> {t('passwordsMatch')}  
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <div className='pt-4'>
              <button
                type="submit"
                disabled={loading}
                className='w-full flex items-center justify-center gap-2
                  bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 
                  text-white py-3.5 rounded-lg font-medium
                  hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  shadow-lg hover:shadow-xl transition-all disabled:opacity-50'
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('changingPassword')}...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    {t('changePasswordButton')}
                  </>
                )}
              </button>
            </div>

            {/* INFO */}
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
              <div className='flex items-start gap-2'>
                <Info className='w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5' />
                <p className='text-xs text-gray-600 dark:text-gray-300'>
                  {t('passwordTip')}
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
