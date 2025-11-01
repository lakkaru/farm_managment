import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { navigate } from 'gatsby';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Helper to get initial state from localStorage if available
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      // If we have a token, start as authenticated (will verify via loadUser)
      // This prevents redirect loops when navigating between pages
      return {
        user: null,
        token: token,
        isAuthenticated: true, // Optimistically set to true
        isLoading: true, // Still loading user data
        error: null,
      };
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false, // Not loading if no token
    error: null,
  };
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());
  const [isLoadingUser, setIsLoadingUser] = React.useState(false);

  // Load user on app start if we have a token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isLoadingUser && !state.user) {
      loadUser();
    } else if (!token && state.isAuthenticated) {
      // Token was removed but state thinks we're authenticated - clear it
      dispatch({ type: 'AUTH_ERROR', payload: 'No token found' });
    }
  }, []); // Run once on mount

  // Load user profile
  const loadUser = async () => {
    if (isLoadingUser) {
      console.log('Already loading user, skipping...');
      return;
    }
    
    try {
      setIsLoadingUser(true);
      const response = await authAPI.getProfile();
      dispatch({ type: 'LOAD_USER', payload: response.data.data });
    } catch (error) {
      console.error('AuthContext: Failed to load user:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message || 'Failed to load user' });
      localStorage.removeItem('token');
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      console.log('AuthContext: Attempting login with API URL:', process.env.GATSBY_API_URL);
      
      const response = await authAPI.login(credentials);
      console.log('AuthContext: Login successful, storing token');
      
      localStorage.setItem('token', response.data.data.token);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: response.data.data, 
          token: response.data.data.token 
        }
      });
      
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      console.error('AuthContext: Error response:', error.response);
      console.error('AuthContext: API URL:', process.env.GATSBY_API_URL);
      
      let message = 'Login failed';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message === 'Network Error') {
        message = 'Network error. Please check your connection and API server.';
      } else if (error.code === 'ECONNREFUSED') {
        message = 'Cannot connect to server. Please try again later.';
      } else if (error.response?.status === 0) {
        message = 'Network error: Unable to reach the server. Please check if the API server is running.';
      } else if (!error.response) {
        message = 'Network error: No response from server. Please check your internet connection.';
      }
      
      dispatch({ type: 'LOGIN_FAIL', payload: message });
      toast.error(message);
      throw error;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      const response = await authAPI.register(userData);
      
      localStorage.setItem('token', response.data.data.token);
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: { 
          user: response.data.data, 
          token: response.data.data.token 
        }
      });
      
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL', payload: message });
      toast.error(message);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    // Clear local storage first
    localStorage.removeItem('token');
    
    // Update state immediately to prevent any redirects to login
    dispatch({ type: 'LOGOUT' });
    
    // Navigate to home page
    if (typeof window !== 'undefined') {
      navigate('/');
    }
    
    // Show success message after a short delay
    setTimeout(() => {
      toast.success('Logged out successfully!');
    }, 500);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      dispatch({ type: 'LOAD_USER', payload: response.data.data });
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
