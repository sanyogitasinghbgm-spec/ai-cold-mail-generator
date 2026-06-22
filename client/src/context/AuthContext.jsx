import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const registerUser = async (name, email, password) => {
    const response = await API.post('/api/auth/register', { name, email, password });
    return response.data;
  };

  const verifyOtpCode = async (email, otp) => {
    const response = await API.post('/api/auth/verify-otp', { email, otp });
    if (response.data.success && response.data.token) {
      login(response.data.token, response.data.user);
    }
    return response.data;
  };

  const loginUser = async (email, password) => {
    const response = await API.post('/api/auth/login', { email, password });
    if (response.data.success && response.data.token) {
      login(response.data.token, response.data.user);
    }
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        registerUser,
        verifyOtpCode,
        loginUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
