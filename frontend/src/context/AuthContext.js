import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup axios interceptors with the current token
  const setupAxiosInterceptors = (token) => {
    // Remove any existing interceptors
    axios.interceptors.request.handlers = [];
    
    // Add the interceptor with the current token
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  };

  useEffect(() => {
    // Check if user is logged in on page load
    const checkLoggedIn = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Setup axios with the token
          if (parsedUser.token) {
            setupAxiosInterceptors(parsedUser.token);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('/api/users/login', { email, password });
      
      setUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Setup axios with the new token
      setupAxiosInterceptors(data.token);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Login failed. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password, role = 'parent') => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('/api/users/signup', { 
        name, 
        email, 
        password,
        role 
      });
      
      setUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Setup axios with the new token
      setupAxiosInterceptors(data.token);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Registration failed. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear token from axios interceptors
    setupAxiosInterceptors(null);
  };

  // Update user profile
  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    
    // Update axios with the token in case it changed
    if (updatedUser.token) {
      setupAxiosInterceptors(updatedUser.token);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
