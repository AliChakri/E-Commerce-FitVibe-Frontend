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
  Bookmark
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
// import { useContext } from 'react';
// import { ApiContext } from '../Contexts';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import NotificationClient from './NotificationClient';
import ThemeToggle from './ThemeToggle';
import CartApi from '../context/cartApi';

function NavBar() {
  const { t } = useTranslation();
  
  // ✅ FIXED: Use new auth context structure
  const { user, loading, logout, isAdmin } = useAuth();
  // const { cart } = useContext(ApiContext);

  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [carts, setCarts] = useState(null)

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

  // Loading state
  if (loading) return (
    <div className="w-full h-20 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  return (
    <nav className='w-full bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300 fixed top-0 z-50 ltr'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* SIDEBAR SMALL SCREEN */}
          <div className="relative flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img src={menu} 
                className='w-8 h-8 cursor-pointer'
                alt="Show SideBar" />
            </button>
            
            {/* Mobile dropdown */}
            <ul className={`${isOpen ? "flex" : "hidden"} absolute ltr:top-12 ltr:left-0 rtl:top-12 rtl:right-0  flex-col items-start justify-center p-4 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all z-50 rounded-lg border border-gray-200 dark:border-gray-700 min-w-48`}>
              <li className='p-2 text-md hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer w-full rounded transition-colors'>
                <NavLink 
                  to="/collection"
                  onClick={() => setIsOpen(false)}
                  className="block w-full"
                >
                  {t("collections")}
                </NavLink> 
              </li>
              <li className='p-2 text-md hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer w-full rounded transition-colors'>
                <NavLink 
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="block w-full"
                >
                  {t("aboutUs")}
                </NavLink> 
              </li>
              <li className='p-2 text-md hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer w-full rounded transition-colors'>
                <NavLink 
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full"
                >
                  {t("contact")}
                </NavLink> 
              </li>
              
              {/* Mobile user menu items */}
              {/* {user && (
                <>
                  <hr className="w-full border-gray-200 dark:border-gray-700 my-2" />
                  <li className='p-2 text-md hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer w-full rounded transition-colors'>
                    <NavLink 
                      to="/collection"
                      onClick={() => setIsOpen(false)}
                      className="block w-full"
                    >
                      {t("collections")}
                    </NavLink> 
                  </li>
                  {user?.role === 'admin' && (
                    <li className='p-2 text-md hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer w-full rounded transition-colors'>
                      <NavLink 
                        to="/admin/dashboard/main"
                        onClick={() => setIsOpen(false)}
                        className="block w-full"
                      >
                        {t("adminPanel")}
                      </NavLink> 
                    </li>
                  )}
                </>
              )} */}
            </ul>
          </div>

          {/* Desktop Navigation */}
          <ul className={`hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-300 transition-all z-40`}>
            <li className='p-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors'>
              <NavLink 
                to="/collection"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' : ''
                }
              >
                {t("collections")}
              </NavLink> 
            </li>
            <li className='p-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors'>
              <NavLink 
                to="/about"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' : ''
                }
              >
                {t("aboutUs")}
              </NavLink> 
            </li>
            <li className='p-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors'>
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

          {/* Logo */}
          <div className='hidden sm:flex flex-col lg:flex-row items-center space-x-2'>
            <Link to='/home' className="flex flex-col lg:flex-row items-center space-x-2">
              <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t("fitvibe")}
              </div>
              <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t("fashion")}
              </div>
            </Link>
          </div>

          {/* Right side actions */}
          <div className='flex items-center gap-x-4 relative'>
            
            {/* Cart */}
            <div className='relative'>
              <NavLink to='/carts' className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white  transition-colors">
                <ShoppingBag className='w-6 h-6 text-slate-600 dark:text-slate-300 cursor-pointer' />
                  <span className='absolute ltr:top-6 ltr:right-0 rtl:top-6 rtl:left-0 bg-cyan-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium'>    
                    {carts && carts?.items?.length > 0 ? carts?.items?.length : 0}
                  </span>
              </NavLink>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            {user && <NotificationClient userId={user?.id || user?._id} />}

            {/* Dark/Light Mode Toggle */}
            <ThemeToggle/>

            {/* Search Icon */}
        {/* Search Icon */}
        <div className='relative search-menu'>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Search size={20} />
          </button>

          {/* Search dropdown */}
          {showSearch && <SearchDropdown onClose={() => setShowSearch(false)} />}
        </div>

            {/* User Authentication */}
            {user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {user?.avatar ? (
                    <div className="w-9 h-9 p-0.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <img className='w-full h-full rounded-full object-cover' src={user.avatar} alt={user.firstName || user.name} />
                    </div>
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <UserRound size={16} className="text-white" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium max-w-20 truncate">
                    {/* ✅ FIXED: Use firstName from new model */}
                    {user.firstName || user.name?.split(' ')[0] || t("user")}
                  </span>
                  <ChevronDown size={12} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      {/* ✅ FIXED: Use fullName or firstName + lastName */}
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.firstNamename || user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      {/* ✅ FIXED: Check role instead of isAdmin */}
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
                      
                      {/* ✅ FIXED: Use isAdmin from context */}
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
              // Login link
              <NavLink 
                to='/login'
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <UserRound size={16} />
                <span>{t("login")}</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function SearchDropdown({ onClose }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}&lang=${i18n.language}`);
      onClose(); // close dropdown
    }
  };

  return (
    <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-80 bg-white dark:bg-gray-800 
      rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">

      <div className="flex items-center space-x-2">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder={t("searchForClothesBrandsStyles")}
          className="flex-1 bg-transparent border-none outline-none 
            text-gray-900 dark:text-white placeholder-gray-400 text-sm"
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