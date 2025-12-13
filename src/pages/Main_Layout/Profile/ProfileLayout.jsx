import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Lock, LogOut, Package, User, X, Menu, ChevronRight, Trash2Icon, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import UserApi from '../../../context/userApi';

const ProfileLayout = () => {
  const [showMobile, setShowMobile] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      icon: User, 
      path: '/users/me/personal', 
      label: t("personal"), 
      desc: t("manageProfile"),
      color: 'blue'
    },
    { 
      icon: Package, 
      path: '/users/me/my-orders', 
      label: t("myOrders"), 
      desc: t("viewOrderHistory"),
      color: 'purple'
    },
    { 
      icon: Heart, 
      path: '/users/me/wishlist', 
      label: t("wishlist"), 
      desc: t("savedItems"),
      color: 'pink'
    },
    { 
      icon: Lock, 
      path: '/users/me/security-page', 
      label: t('security'), 
      desc: t("accountSecurity"),
      color: 'green'
    },
  ];

  const DeleteMyAccount = async () => {
    setLoading(true)
    try {
      const res = await UserApi.delete(`/delete/${user._id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        await logout();
      }
    } catch (error) {
      console.log(error?.data?.message || error.message);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobile(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobile]);

  const getColorClasses = (color, active) => {
    const colors = {
      blue: active 
        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' 
        : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:border-blue-100 dark:hover:border-blue-900/50',
      purple: active 
        ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300' 
        : 'hover:bg-purple-50/50 dark:hover:bg-purple-900/10 hover:border-purple-100 dark:hover:border-purple-900/50',
      pink: active 
        ? 'bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300' 
        : 'hover:bg-pink-50/50 dark:hover:bg-pink-900/10 hover:border-pink-100 dark:hover:border-pink-900/50',
      green: active 
        ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
        : 'hover:bg-green-50/50 dark:hover:bg-green-900/10 hover:border-green-100 dark:hover:border-green-900/50',
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color, active) => {
    const colors = {
      blue: active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400',
      purple: active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400',
      pink: active ? 'text-pink-600 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400',
      green: active ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      
      {/* Mobile Overlay */}
      {showMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowMobile(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-20 left-0 
          w-80 h-[calc(100vh-5rem)]
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          shadow-2xl z-40
          overflow-y-auto
          transition-transform duration-300 ease-out
          ${showMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("myAccount")}
              </h2>
              <button
                onClick={() => setShowMobile(false)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 p-0.5 shadow-lg">
                    <img
                      src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                      alt={user?.name}
                      className="w-full h-full rounded-full object-cover bg-white"
                    />
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${
                      user?.isActive ? 'bg-green-500' : 'bg-gray-400'
                    } rounded-full border-2 border-white dark:border-gray-900 shadow-sm`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                {t("navigation")}
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      group w-full flex items-center gap-3 p-4 rounded-xl 
                      border transition-all duration-200
                      ${active 
                        ? getColorClasses(item.color, true) + ' shadow-sm'
                        : 'border-transparent ' + getColorClasses(item.color, false)
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg transition-colors
                      ${active 
                        ? `bg-white dark:bg-gray-800 shadow-sm` 
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-750'
                      }
                    `}>
                      <Icon
                        size={20}
                        className={`transition-colors ${getIconColor(item.color, active)}`}
                      />
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className={`
                        text-sm font-semibold transition-colors
                        ${active 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                        }
                      `}>
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.desc}
                      </div>
                    </div>

                    {active && (
                      <ChevronRight 
                        size={18} 
                        className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout Button - Sticky at bottom */}
          <div className="sticky bottom-0 p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => setDeleteModal(true)}
              className="group w-full flex items-center gap-3 p-4 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-100 dark:hover:border-red-900/50 transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                <Trash2Icon
                  size={20}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
              <span className="text-sm font-semibold">{t("deleteMyAccount")}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {!showMobile && (
        <button
          onClick={() => setShowMobile(true)}
          className="fixed bottom-6 left-6 lg:hidden z-30 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-white" />
        </button>
      )}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-11/12 max-w-md p-6 animate-scaleUp">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {t("deleteMyAccount")}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setDeleteModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("warningNoteDelete")}
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => setDeleteModal(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition"
                onClick={() => {
                  DeleteMyAccount();
                  setDeleteModal(false);
                }}
              >
                {/* <Trash2 size={16} /> {t("delete")} */}
                {loading ? (
                  <span className='flex items-center gap-4'>
                    <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div> {t("deleting")}
                  </span>
                ): (
                    <span className='flex items-center gap-4'>
                      <Trash2 size={16} /> {t("delete")}
                    </span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) }

      {/* Main Content Area */}
      <main className="lg:ml-80 min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProfileLayout;