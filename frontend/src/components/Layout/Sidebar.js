import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import {
  Home as HomeIcon,
  Agriculture as AgricultureIcon,
  Pets as PetsIcon,
  Inventory as InventoryIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Grass as PaddyIcon,
  Schedule as PlanSeasonIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Visibility as ViewIcon,
  Business as FarmIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { useAuth } from '../../contexts/AuthContext';
import { useFarm } from '../../contexts/FarmContext';
import { farmAPI } from '../../services/api';

const drawerWidth = 260;

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { farms, selectedFarm, setSelectedFarm, setFarms } = useFarm();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paddyMenuOpen, setPaddyMenuOpen] = useState(false);
  const [farmsMenuOpen, setFarmsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/dashboard');

  // Load farms when component mounts
  useEffect(() => {
    const loadFarms = async () => {
      try {
        const response = await farmAPI.getFarms();
        setFarms(response.data.data || []);
      } catch (error) {
        console.error('Error loading farms:', error);
        setFarms([]);
      }
    };

    if (user) {
      loadFarms();
    }
  }, [user]); // Removed setFarms from dependencies to prevent infinite loop

  // Update current path for navigation highlighting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const navigationItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { 
      path: '/farms', 
      icon: FarmIcon, 
      label: 'Farms',
      hasSubmenu: true,
      submenu: [
        { path: '/farms', icon: ViewIcon, label: 'View All Farms' },
        { path: '/farms/create', icon: AddIcon, label: 'Create Farm' },
      ]
    },
    { path: '/crops', icon: AgricultureIcon, label: 'Crops' },
    { 
      path: '/paddy', 
      icon: PaddyIcon, 
      label: 'Paddy',
      hasSubmenu: true,
      submenu: [
        { path: '/paddy/plan-season', icon: PlanSeasonIcon, label: 'Plan Season' },
      ]
    },
    { path: '/livestock', icon: PetsIcon, label: 'Livestock' },
    { path: '/inventory', icon: InventoryIcon, label: 'Inventory' },
    { path: '/reports', icon: BarChartIcon, label: 'Reports' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setCurrentPath(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const handleMenuToggle = (menuType) => {
    if (menuType === 'paddy') {
      setPaddyMenuOpen(!paddyMenuOpen);
    } else if (menuType === 'farms') {
      setFarmsMenuOpen(!farmsMenuOpen);
    }
  };

  const getMenuState = (item) => {
    if (item.label === 'Paddy') return paddyMenuOpen;
    if (item.label === 'Farms') return farmsMenuOpen;
    return false;
  };

  const getMenuType = (item) => {
    if (item.label === 'Paddy') return 'paddy';
    if (item.label === 'Farms') return 'farms';
    return null;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFarmChange = (event) => {
    const farmId = event.target.value;
    const farm = farms.find(f => f._id === farmId);
    setSelectedFarm(farm || null);
  };

  const getUserInitials = () => {
    if (!user?.profile) return 'U';
    const { firstName, lastName } = user.profile;
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Farm MS
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Farm Selector */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
          Farms ({farms.length})
        </Typography>
        {farms.length > 0 ? (
          <FormControl fullWidth size="small">
            <Select
              value={selectedFarm?._id || ''}
              onChange={handleFarmChange}
              displayEmpty
            >
              <MenuItem value="">
                <Typography variant="body2" color="textSecondary">
                  Select a farm
                </Typography>
              </MenuItem>
              {farms.map(farm => (
                <MenuItem key={farm._id} value={farm._id}>
                  {farm.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 1 }}>
            No farms found. Create a farm first.
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1 }}>
        {navigationItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={!item.hasSubmenu && currentPath === item.path}
                onClick={item.hasSubmenu ? () => handleMenuToggle(getMenuType(item)) : () => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: (!item.hasSubmenu && currentPath === item.path) ? 'primary.contrastText' : 'inherit',
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.hasSubmenu && (getMenuState(item) ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            
            {/* Submenu */}
            {item.hasSubmenu && (
              <Collapse in={getMenuState(item)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((subItem) => (
                    <ListItem key={subItem.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => handleNavigation(subItem.path)}
                        selected={currentPath === subItem.path}
                        sx={{
                          pl: 4,
                          borderRadius: 2,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                            },
                          },
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: currentPath === subItem.path ? 'primary.contrastText' : 'inherit',
                          }}
                        >
                          <subItem.icon />
                        </ListItemIcon>
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider />

      {/* User Info */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              backgroundColor: 'grey.100',
              borderRadius: 2,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'primary.main',
                mr: 1.5,
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="600">
                {user.profile?.firstName} {user.profile?.lastName}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                {user.role?.replace('_', ' ')}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
