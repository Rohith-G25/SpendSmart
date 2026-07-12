import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

// Map currency codes to their visual symbols
export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  KRW: '₩'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Get active currency symbol helper
  const getCurrencySymbol = () => {
    if (!user || !user.preferredCurrency) return '₹';
    return CURRENCY_SYMBOLS[user.preferredCurrency] || user.preferredCurrency;
  };

  // Fetch current user details if token is found on load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
          console.error('Failed to load user session', error);
          // Token expired or invalid
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register Handler
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const data = res.data;
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          preferredCurrency: data.preferredCurrency
        });
        return { success: true, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Wait, registration failed! Try again bestie 💀'
      };
    }
  };

  // Login Handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          preferredCurrency: data.preferredCurrency
        });
        return { success: true, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials bestie, double check 💀'
      };
    }
  };

  // Logout Handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update preferred currency
  const updateCurrency = async (preferredCurrency) => {
    try {
      const res = await api.put('/settings/currency', { preferredCurrency });
      if (res.data.success) {
        setUser((prev) => ({
          ...prev,
          preferredCurrency: res.data.data.preferredCurrency
        }));
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not update currency preference 💀'
      };
    }
  };

  // Update profile handler (name, email, passwords)
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/settings/profile', profileData);
      if (res.data.success) {
        setUser((prev) => ({
          ...prev,
          name: res.data.data.name,
          email: res.data.data.email
        }));
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile 💀'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        updateCurrency,
        updateProfile,
        currencySymbol: getCurrencySymbol(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
