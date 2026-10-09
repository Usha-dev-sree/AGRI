import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agrivalue_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize session or default demo farmer
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('agrivalue_token');
      const savedUser = localStorage.getItem('agrivalue_user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse saved user:', e);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);

      // Background health ping to wake up free-tier Render backend instantly
      try {
        authAPI.getMe().catch(() => {});
      } catch (err) {}
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('agrivalue_token', res.token);
        localStorage.setItem('agrivalue_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('agrivalue_token', res.token);
        localStorage.setItem('agrivalue_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrivalue_token');
    localStorage.removeItem('agrivalue_user');
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isFarmer: user?.role === 'farmer',
        isProcessor: user?.role === 'processor',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
