import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
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
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useFarm } from '../../contexts/FarmContext';

const drawerWidth = 260;

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { farms, selectedFarm, setSelectedFarm } = useFarm();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paddyMenuOpen, setPaddyMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/farms', icon: HomeIcon, label: 'Farms' },
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
      {farms.length > 0 && (
        <Box sx={{ px: 2, pb: 2 }}>
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
        </Box>
      )}

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1 }}>
        {navigationItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={item.hasSubmenu ? 'div' : RouterLink}
                to={item.hasSubmenu ? undefined : item.path}
                selected={!item.hasSubmenu && location.pathname === item.path}
                onClick={item.hasSubmenu ? () => setPaddyMenuOpen(!paddyMenuOpen) : (isMobile ? handleDrawerToggle : undefined)}
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
                    color: (!item.hasSubmenu && location.pathname === item.path) ? 'primary.contrastText' : 'inherit',
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.hasSubmenu && (paddyMenuOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            
            {/* Submenu */}
            {item.hasSubmenu && (
              <Collapse in={paddyMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((subItem) => (
                    <ListItem key={subItem.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component={RouterLink}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        onClick={isMobile ? handleDrawerToggle : undefined}
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
                            color: location.pathname === subItem.path ? 'primary.contrastText' : 'inherit',
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
