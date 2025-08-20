import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return (
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
    </Box>
  );
};

export default Layout;
