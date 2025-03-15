import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkLoggedIn = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
          setIsAuthenticated(true);
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
  };

  // Update user profile
  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
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
