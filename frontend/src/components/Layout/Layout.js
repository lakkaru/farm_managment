import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import PWAInstallPrompt from '../PWAInstallPrompt';
import PWAHead from '../PWAHead';
import { registerServiceWorker } from '../../utils/pwa';

const Layout = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Register service worker for PWA functionality
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="textSecondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // If not authenticated and not loading, return children without layout
  if (!isAuthenticated) {
    return (
      <>
        <PWAHead />
        {children}
      </>
    );
  }

  // If authenticated, render full layout with sidebar and header
  return (
    <>
      <PWAHead />
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <Sidebar />
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minWidth: 0, // Prevents flex item from overflowing
          width: '100%',
        }}>
          <Header />
          <Box
            component="main"
            sx={{
              flex: 1,
              p: 3,
              overflow: 'auto',
              backgroundColor: 'grey.50',
              minHeight: 'calc(100vh - 64px)', // Account for header height
            }}
          >
            {children}
          </Box>
        </Box>
        <PWAInstallPrompt />
      </Box>
    </>
  );
};

export default Layout;
