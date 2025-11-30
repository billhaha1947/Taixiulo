import React, { createContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);

          // Verify token by fetching profile
          try {
            const response = await userAPI.getProfile();
            setUser(response.data.data);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
          } catch (error) {
            // Token invalid, clear everything
            logout();
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register
  const register = async (username, password) => {
    try {
      const response = await authAPI.register(username, password);
      const { user: userData, token: userToken } = response.data.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, userToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Đăng ký thất bại'
      };
    }
  };

  // Login
  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { user: userData, token: userToken } = response.data.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, userToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Đăng nhập thất bại'
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user balance
  const updateBalance = (newBalance) => {
    setUser(prev => {
      const updated = { ...prev, coins: newBalance };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => {
      const updated = { ...prev, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateBalance,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
