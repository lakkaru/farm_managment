import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  DarkModeOutlined,
  LightModeOutlined,
  NotificationsOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = () => {
    if (!user?.profile) return 'U';
    const { firstName, lastName } = user.profile;
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1} 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: '100%',
      }}
    >
      <Toolbar>
        {/* Search Section */}
        {!isMobile && (
          <Box sx={{ flex: 1, maxWidth: 500, mr: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search farms, crops, livestock..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'background.default',
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Action Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>

          <IconButton color="inherit" title="Notifications">
            <NotificationsOutlined />
          </IconButton>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { backgroundColor: 'action.hover' } }}>
            {!isMobile && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" fontWeight="600">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                  {user?.role?.replace('_', ' ')}
                </Typography>
              </Box>
            )}
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: 'primary.main',
                fontSize: '0.875rem',
              }}
            >
              {getUserInitials()}
            </Avatar>
          </Box>

          <IconButton onClick={handleLogout} color="inherit" title="Logout">
            <LogoutOutlined />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
