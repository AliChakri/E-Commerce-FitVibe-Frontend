import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, LogOut, Settings,
  ChevronDown, ChevronRight, BarChart2, LineChart,
  PlusCircle, Boxes, ClipboardList, User, Flag, Menu, X,
  Bell, Search, Sun, Moon, UserRound, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import NotificationClient from '../components/NotificationClient';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

// Sidebar item component with collapsible sub-items
const SidebarItem = ({ icon: Icon, title, children, isCollapsed }) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    if (children) setOpen(!open);
  };

  return (
    <li>
      <div
        onClick={toggleOpen}
        className={`flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 group ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <div className={`flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <Icon size={20} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          {!isCollapsed && <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</span>}
        </div>
        {!isCollapsed && children && (
          <span className="text-gray-500">
            {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        )}
      </div>

      {!isCollapsed && open && children && (
        <ul className="ml-8 mt-1 space-y-1">
          {children.map(({ label, icon: SubIcon, path }, index) => (
            <li key={index}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 pl-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                <SubIcon size={16} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const AdminLayout = () => {

  const { t } = useTranslation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Use your auth context
  const { user, loading, logout, isAdmin } = useAuth();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Handle responsive collapse
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setIsCollapsed(true);
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

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      
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
          fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
          z-50 overflow-y-auto p-4 transition-all duration-300 shadow-xl lg:shadow-none
          ${showMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'w-64'}
        `}
      >
        {/* Logo Section */}
        <div className={`h-16 flex items-center border-b border-gray-200 dark:border-gray-700 px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {t("fitvibe")}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("adminPanel")}</p>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:block p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden lg:block p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setShowMobile(false)}
            className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {/* <SidebarItem
              icon={LayoutDashboard}
              title="Dashboard"
              isCollapsed={isCollapsed}
              children={[
                { label: 'Main', icon: BarChart2, path: '/admin/dashboard/main' },
                { label: 'Analytics', icon: LineChart, path: '/admin/dashboard/analytics' },
              ]}
            /> */}

            <li>
              <NavLink
                to="/admin/dashboard/main"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <BarChart2 size={20} />
                {!isCollapsed && t("dashboard")}
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/admin/dashboard/analytics'
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <LineChart size={20} />
                {!isCollapsed && t("analytics")}
              </NavLink>
            </li>
                       
            {/* <SidebarItem
              icon={Package}
              title="Products"
              isCollapsed={isCollapsed}
              children={[
                { label: 'All Products', icon: Boxes, path: '/admin/products/all' },
                { label: 'Add Product', icon: PlusCircle, path: '/admin/products/new' },
              ]}
            /> */}

            <li>
              <NavLink
                to='/admin/products/all'
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <Boxes size={20} />
                {!isCollapsed && t("products")}
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/admin/products/new'
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <PlusCircle size={20} />
                {!isCollapsed && t("addProduct")}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <ClipboardList size={20} />
                {!isCollapsed && t("orders")}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <User size={20} />
                {!isCollapsed && t("users")}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <Flag size={20} />
                {!isCollapsed && t("reports")}
              </NavLink>
            </li>

            {/* <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <Settings size={20} />
                {!isCollapsed && 'Settings'}
              </NavLink>
            </li> */}
          </ul>

          {/* Logout Button */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <NavLink
              to="/logout"
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut size={20} />
              {!isCollapsed && t("logout")}
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between">
            
            {/* Left: Mobile Menu & Search */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobile(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>

              {/* Search Bar */}
              <div className="relative search-menu">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 w-80 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Search size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t("search")}</span>
                </button>

                {/* Search Dropdown */}
                {showSearch && (
                  <div className="absolute ltr:left-0 rtl:right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <div className="flex items-center space-x-2">
                      <Search size={16} className="text-gray-400" />
                      <input
                        type="text"
                        placeholder={t("searchOrdersProducts")}
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                        autoFocus
                      />
                    </div>
                    {/* <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      {t("searchOrdersProducts")}
                    </div> */}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              
              {/* Dark Mode Toggle */}
              <ThemeToggle />
              
              {/* LANGUAGE BUTTON */}
              <LanguageSwitcher />

              {/* Notifications */}
              {user && <NotificationClient userId={user?.id || user?._id} />}

              {/* User Profile Dropdown */}
              {user && (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                  >
                    {user?.avatar ? (
                      <div className="w-8 h-8 p-0.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <img 
                          className="w-full h-full rounded-full object-cover" 
                          src={user.avatar} 
                          alt={user.firstName || user.name} 
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {(user.firstName || user.name || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {user.firstName || user.name?.split(' ')[0] || t("admin")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isAdmin ? t("admin") : ''}
                      </p>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mt-1">
                            <Shield size={12} className="mr-1" />
                            {t("admin")}
                          </span>
                        )}
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <NavLink
                          to="/users/me/personal"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} />
                          <span>{t("myProfile")}</span>
                        </NavLink>
                        
                        <NavLink
                          to="/users/me/my-orders"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} />
                          <span>{t("myOrders")}</span>
                        </NavLink>

                        <NavLink
                          to="/home"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package size={16} />
                          <span>{t("visitStore")}</span>
                        </NavLink>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors text-left"
                        >
                          <LogOut size={16} />
                          <span>{t("logout")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;