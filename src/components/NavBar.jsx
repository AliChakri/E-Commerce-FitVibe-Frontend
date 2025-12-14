import React, { useState, useEffect } from 'react';
import menu from '../assets/menu.svg';
import { 
  Search, 
  UserRound, 
  Settings, 
  Shield, 
  Sun, 
  Moon,
  ChevronDown,
  User,
  LogOut,
  Package,
  ShoppingBag,
  Bookmark,
  X
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import NotificationClient from './NotificationClient';
import ThemeToggle from './ThemeToggle';
import CartApi from '../context/cartApi';

function NavBar() {
  const { t } = useTranslation();
  
  const { user, loading, logout, isAdmin } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [carts, setCarts] = useState(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await CartApi.get('/', { withCredentials: true });
        
        if (res.data.success) {
          setCarts(res?.data?.cart);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    } 
    fetchCart();
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

  // Close mobile menu when screen is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Loading state
  if (loading) return (
    <div className="w-full h-16 sm:h-20 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  return (
    <>
      <nav className='w-full bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300 fixed top-0 z-50 ltr'>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                <img src={menu} className='w-6 h-6 sm:w-7 sm:h-7' alt="Menu" />
              </button>

              {/* Logo - visible on all screens */}
              <Link to='/home' className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent whitespace-nowrap">
                  {t("fitvibe")}
                </div>
                <div className="hidden xs:block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                  {t("fashion")}
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-4 lg:gap-6 text-gray-700 dark:text-gray-300">
              <li className='p-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors whitespace-nowrap'>
                <NavLink 
                  to="/collection"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' : ''
                  }
                >
                  {t("collections")}
                </NavLink> 
              </li>
              <li className='p-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors whitespace-nowrap'>
                <NavLink 
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' : ''
                  }
                >
                  {t("aboutUs")}
                </NavLink> 
              </li>
              <li className='p-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors whitespace-nowrap'>
                <NavLink 
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' : ''
                  }
                >
                  {t("contact")}
                </NavLink> 
              </li>
            </ul>

            {/* Right: Action Icons */}
            <div className='flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0'>
              
              {/* Cart */}
              <NavLink 
                to='/carts' 
                className="relative p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className='w-5 h-5 sm:w-6 sm:h-6' />
                <span className='absolute -top-1 -right-1 sm:top-0 sm:right-0 bg-cyan-500 text-white rounded-full text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium'>    
                  {carts && carts?.items?.length > 0 ? carts?.items?.length : 0}
                </span>
              </NavLink>

              {/* Language Switcher - hidden on smallest screens */}
              <div className="hidden xs:block">
                <LanguageSwitcher />
              </div>

              {/* Notifications - hidden on small screens */}
              {user && (
                <div className="hidden sm:block">
                  <NotificationClient userId={user?.id || user?._id} />
                </div>
              )}

              {/* Theme Toggle - hidden on smallest screens */}
              <div className="hidden xs:block">
                <ThemeToggle />
              </div>

              <div className="hidden xs:block">
                <ThemeToggle />
              </div>

              <div className="hidden xs:block">
                <LanguageSwitcher />
              </div>

              {/* Search Icon */}
              <div className='relative search-menu'>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Search"
                >
                  <Search className='w-5 h-5 sm:w-6 sm:h-6' />
                </button>

                {showSearch && <SearchDropdown onClose={() => setShowSearch(false)} />}
              </div>

              {/* User Authentication */}
              {user ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="User menu"
                  >
                    {user?.avatar ? (
                      <div className="w-7 h-7 sm:w-9 sm:h-9 p-0.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <img className='w-full h-full rounded-full object-cover' src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} alt={user.firstName || user.name} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserRound size={14} className="text-white sm:w-4 sm:h-4" />
                      </div>
                    )}
                    <span className="hidden lg:block text-sm font-medium max-w-20 truncate">
                      {user.firstName || user.name?.split(' ')[0] || t("user")}
                    </span>
                    <ChevronDown size={12} className="hidden sm:block" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
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
                          <Package size={16} />
                          <span>{t("myOrders")}</span>
                        </NavLink>
                        
                        <NavLink
                          to="/users/me/wishlist"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Bookmark size={16} />
                          <span>{t("wishlist")}</span>
                        </NavLink>
                        
                        {isAdmin && (
                          <NavLink
                            to="/admin/dashboard/main"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Shield size={16} />
                            <span>{t("adminPanel")}</span>
                          </NavLink>
                        )}
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
              ) : (
                // Login button - responsive
                <NavLink 
                  to='/login'
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  <UserRound size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{t("login")}</span>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 ltr:left-0 rtl:right-0 h-full w-64 sm:w-72 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t("fitvibe")}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              <li>
                <NavLink 
                  to="/collection"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block p-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {t("collections")}
                </NavLink> 
              </li>
              <li>
                <NavLink 
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block p-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {t("aboutUs")}
                </NavLink> 
              </li>
              <li>
                <NavLink 
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block p-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {t("contact")}
                </NavLink> 
              </li>
            </ul>

            {/* Mobile-only options */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {/* Show hidden items on mobile */}
              <div className="xs:hidden space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("language")}</span>
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("theme")}</span>
                  <ThemeToggle />
                </div>
              </div>

              {user && (
                <div className="sm:hidden">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("notifications")}</span>
                    <NotificationClient userId={user?.id || user?._id} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchDropdown({ onClose }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}&lang=${i18n.language}`);
      onClose();
    }
  };

  return (
    <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 
      rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 z-50">

      <div className="flex items-center space-x-2">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder={t("searchForClothesBrandsStyles")}
          className="flex-1 bg-transparent border-none outline-none 
            text-gray-900 dark:text-white placeholder-gray-400 text-sm min-w-0"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {t("popular")}: {t("shirts")}, {t("jackets")}, {t("shoes")}
      </div>
    </div>
  );
}

export default NavBar;