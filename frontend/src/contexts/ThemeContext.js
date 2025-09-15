import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  light: {
    colors: {
      primary: '#4caf50',
      primaryLight: '#81c784',
      primaryDark: '#2e7d32',
      secondary: '#ff9800',
      secondaryLight: '#ffb74d',
      secondaryDark: '#f57c00',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      background: '#f8f9fa',
      surface: '#ffffff',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
      large: '1200px',
    },
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  dark: {
    colors: {
      primary: '#66bb6a',
      primaryLight: '#98ee99',
      primaryDark: '#338a3e',
      secondary: '#ffa726',
      secondaryLight: '#ffd95b',
      secondaryDark: '#c77800',
      success: '#66bb6a',
      warning: '#ffa726',
      error: '#ef5350',
      info: '#42a5f5',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      border: '#333333',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
      large: '1200px',
    },
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
  };

  const theme = darkMode ? themes.dark : themes.light;

  const contextValue = {
    theme,
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
