import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  NotificationsOutlined,
  LogoutOutlined,
  Person,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  // Make useMediaQuery SSR-safe by providing a default value
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: false, // Default to false during SSR
    ssrMatchMedia: (query) => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    })
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    handleUserMenuClose(); // Close the menu first
    logout(); // Then logout (which will navigate to home)
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    console.log('Profile menu clicked, navigating to /profile');
    handleUserMenuClose();
    navigate('/profile');
  };

  const getUserInitials = () => {
    if (!user?.profile) return 'U';
    const { firstName, lastName } = user.profile;
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getUserRoleDisplay = () => {
    if (!user) return '';
    
    // Handle multi-role system
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      // If user has multiple roles, show the first one with a "+" indicator
      const primaryRole = user.roles[0];
      const additionalCount = user.roles.length - 1;
      const roleText = t(`roles.${primaryRole}`, primaryRole?.replace('_', ' '));
      return additionalCount > 0 ? `${roleText} +${additionalCount}` : roleText;
    }
    
    // Fallback to single role (backward compatibility)
    return t(`roles.${user.role}`, user.role?.replace('_', ' '));
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
        {/* {!isMobile && (
          <Box sx={{ flex: 1, maxWidth: 500, mr: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('common.search')}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'background.default',
                },
              }}
            />
          </Box>
        )} */}

        <Box sx={{ flexGrow: 1 }} />

        {/* Action Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Language Switcher - More Prominent */}
          <Box sx={{ 
            p: 1, 
            borderRadius: 2, 
            backgroundColor: 'primary.light', 
            border: '1px solid',
            borderColor: 'primary.main',
          }}>
            <LanguageSwitcher variant="button" />
          </Box>
          
          <IconButton color="inherit" title="Notifications">
            <NotificationsOutlined />
          </IconButton>

          {/* User Menu */}
          <Box 
            onClick={handleUserMenuOpen}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              cursor: 'pointer', 
              p: 1, 
              borderRadius: 1, 
              '&:hover': { backgroundColor: 'action.hover' } 
            }}
          >
            {!isMobile && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" fontWeight="600">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                  {getUserRoleDisplay()}
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

          {/* User Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <Person sx={{ mr: 1 }} />
              {t('navigation.profile')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutOutlined sx={{ mr: 1 }} />
              {t('navigation.logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
