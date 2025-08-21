import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { navigate } from 'gatsby';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
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
          Verifying access...
        </Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      navigate('/login');
    }
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
        <Typography variant="h6">Redirecting to login...</Typography>
      </Box>
    );
  }

  // If authenticated, render the children
  return children;
};

export default PrivateRoute;
