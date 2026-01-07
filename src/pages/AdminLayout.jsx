import React, { useState, useEffect } from 'react';
import {
  BarChart2, LineChart, Boxes, PlusCircle, ClipboardList, User, Flag,
  Menu, X, LogOut, Bell, Search, ChevronDown, Shield, Settings, Package
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import NotificationClient from '../components/NotificationClient';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';

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
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
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

  const navigationItems = [
    { icon: BarChart2, label: t('dashboard'), path: '/admin/dashboard/main' },
    { icon: LineChart, label: t('analytics'), path: '/admin/dashboard/analytics' },
    { icon: Boxes, label: t('products'), path: '/admin/products/all' },
    { icon: PlusCircle, label: t('addProduct'), path: '/admin/products/new' },
    { icon: ClipboardList, label: t('orders'), path: '/admin/orders' },
    { icon: User, label: t('users'), path: '/admin/users' },
    { icon: Flag, label: t('reports'), path: '/admin/reports' }
  ];

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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setShowMobile(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${showMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          shadow-xl lg:shadow-none
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t('fitvibe')}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('adminPanel')}</p>
            </div>
          )}
          
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              setShowMobile(false);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} className="lg:hidden" />}
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <button
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg
                    text-sm font-medium transition-all duration-200
                    text-gray-700 dark:text-gray-300 
                    hover:bg-blue-50 dark:hover:bg-gray-700 
                    hover:text-blue-600 dark:hover:text-blue-400
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg
              text-sm font-medium text-red-500 
              hover:bg-red-50 dark:hover:bg-red-900/20 
              transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Top Navbar - Fixed */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 z-30">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            
            {/* Left: Mobile Menu & Search */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={() => setShowMobile(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              >
                <Menu size={20} />
              </button>

              {/* Search Bar - Hidden on small screens */}
              <div className="relative search-menu hidden sm:block flex-1 max-w-md">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-full flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Search size={18} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{t('search')}</span>
                </button>

                {showSearch && (
                  <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
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
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              
              {/* Search Icon for Mobile */}
              <button className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Search size={20} />
              </button>

              {/* Dark Mode Toggle */}
              <ThemeToggle />
              
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Notifications */}
              {user && <NotificationClient />}

              {/* User Profile Dropdown */}
              {user && (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                  >
                    {user?.avatar ? (
                      <div className="w-8 h-8 p-0.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <img 
                          className="w-full h-full rounded-full object-cover" 
                          src={user.avatar} 
                          alt={user.firstName || user.name} 
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
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
                    
                    <ChevronDown size={16} className="text-gray-500 hidden md:block flex-shrink-0" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* User Info Header */}
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
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} />
                          <span>{t('myProfile')}</span>
                        </button>
                        
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} />
                          <span>{t('myOrders')}</span>
                        </button>

                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package size={16} />
                          <span>{t('visitStore')}</span>
                        </button>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors text-left"
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
            <div className="max-w-7xl mx-auto">
              {/* Your <Outlet /> goes here */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BarChart2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Content Area</h2>
                  <p className="text-gray-600 dark:text-gray-400">Replace this with <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">&lt;Outlet /&gt;</code></p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;