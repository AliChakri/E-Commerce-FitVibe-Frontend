import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthApi from "./apiAuth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await AuthApi.get("/me");

        if (mounted && res?.data?.success && res.data.user) {
          setUser(res.data.user);
        } else if (mounted) {
          setUser(null);
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await AuthApi.post("/logout");
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAdmin: user?.role === "admin",
        isVerified: user?.isVerified,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
