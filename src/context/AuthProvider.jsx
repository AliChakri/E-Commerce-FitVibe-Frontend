// context/AuthProvider.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthApi from "./apiAuth";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        const res = await AuthApi.get("/me", { withCredentials: true });
        
        if (res.data.success && res.data.user) {
          console.log('✅ User authenticated:', res.data.user.email);
          setUser(res.data.user);
        } else {
          console.log('❌ No user data in response');
          setUser(null);
        }
      } catch (error) {
        console.log('❌ Auth check failed:', error.response?.data?.code);
        
        // The interceptor will handle token refresh automatically
        // If it fails, user will be redirected to login
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isAdmin = user?.role === 'admin';
  const isVerified = user?.isVerified;

  const login = (userData) => {
    console.log('✅ User logged in:', userData.email);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await AuthApi.post("/logout", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      navigate('/login');
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      isAdmin,
      isVerified,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};