import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BarChart2, LineChart, Boxes, PlusCircle, ClipboardList, User, Flag,
  Menu, X, LogOut, Bell, Search, ChevronDown, ChevronRight, Shield, Settings, Package
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import NotificationClient from '../components/NotificationClient';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const AdminLayout = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, loading, logout, isAdmin } = useAuth();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false); // Keep expanded on mobile for better UX
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
      if (!event.target.closest('.search-menu')) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      
      {/* Mobile Overlay */}
      {showMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setShowMobile(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col h-screen
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          shadow-2xl lg:shadow-none
          ${showMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'w-72'}
        `}
      >
        {/* Logo Section - Fixed */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('fitvibe')}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('adminPanel')}</p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isCollapsed ? <Menu size={20} /> : <ChevronRight size={20} />}
            </button>
            
            <button
              onClick={() => setShowMobile(false)}
              className="lg:hidden p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">

            <li>
              <NavLink
                to="/admin/dashboard/main"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                <BarChart2 size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{t('dashboard')}</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/admin/dashboard/analytics'
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                <LineChart size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{t('analytics')}</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/admin/products/all'
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                <Boxes size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{t('products')}</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/admin/products/new'
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                <PlusCircle size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{t('addProduct')}</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                <ClipboardList size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{t('orders')}</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                <User size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{t('users')}</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                <Flag size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{t('reports')}</span>}
              </NavLink>
            </li>

          </ul>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <NavLink
            to="/logout"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span>{t('logout')}</span>}
          </NavLink>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Top Navbar - Fixed */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 z-30 shadow-sm">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
            
            {/* Left: Mobile Menu & Search */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button
                onClick={() => setShowMobile(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors flex-shrink-0"
              >
                <Menu size={20} />
              </button>

              {/* Search Bar */}
              {/* <div className="relative search-menu hidden sm:block flex-1 max-w-md">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-full flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Search size={18} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{t('search')}</span>
                </button>

                {showSearch && (
                  <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <div className="flex items-center gap-2">
                      <Search size={16} className="text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder={t('searchOrdersProducts')}
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </div> */}

            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              
              {/* Search Icon for Mobile */}
              {/* <button 
                onClick={() => setShowSearch(!showSearch)}
                className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Search size={20} />
              </button> */}

              <ThemeToggle />
              <LanguageSwitcher />
              {user && <NotificationClient userId={user?.id || user?._id} />}

              {/* User Profile Dropdown */}
              {user && (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-2 transition-colors"
                  >
                    {user?.avatar ? (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 p-0.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <img 
                          className="w-full h-full rounded-full object-cover" 
                          src={user.avatar} 
                          alt={user.firstName || user.name} 
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {(user.firstName || user.name || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div className="hidden md:block text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                        {user.firstName || user.name?.split(' ')[0] || t('admin')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {isAdmin ? t('admin') : ''}
                      </p>
                    </div>
                    
                    <ChevronDown size={16} className="text-gray-500 hidden sm:block flex-shrink-0" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mt-1">
                            <Shield size={12} className="mr-1" />
                            {t('admin')}
                          </span>
                        )}
                      </div>
                      
                      <div className="py-1">
                        <NavLink
                          to="/users/me/personal"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} />
                          <span>{t('myProfile')}</span>
                        </NavLink>
                        
                        <NavLink
                          to="/users/me/my-orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} />
                          <span>{t('myOrders')}</span>
                        </NavLink>

                        <NavLink
                          to="/home"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package size={16} />
                          <span>{t('visitStore')}</span>
                        </NavLink>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                        >
                          <LogOut size={16} />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;