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
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Visibility as ViewIcon,
  EventNote as SeasonPlanIcon,
  Business as FarmIcon,
  BugReport as DiseaseIcon,
  Build as MachineryIcon,
  Search as SearchIcon,
  ListAlt as RequestsIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useFarm } from '../../contexts/FarmContext';
import { farmAPI } from '../../services/api';

const drawerWidth = 260;

const Sidebar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  // Make useMediaQuery SSR-safe by providing a default value
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: false, // Default to false during SSR
    ssrMatchMedia: (query) => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    }),
  });

  // Auth and farm context
  const { user } = useAuth();
  const { selectedFarm, setSelectedFarm } = useFarm();

  // Local UI state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [farms, setFarms] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [paddyMenuOpen, setPaddyMenuOpen] = useState(false);
  const [farmsMenuOpen, setFarmsMenuOpen] = useState(false);
  const [machineryMenuOpen, setMachineryMenuOpen] = useState(false);

  // Load farms list when user is available
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
  }, [user]);

  // Update current path for navigation highlighting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Helper to check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.includes(role);
    }
    return user.role === role;
  };

  const navigationItems = [
    { id: 'dashboard', path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') },
    // Farms menu - Available to all users
    { 
      id: 'farms',
      path: '/farms', 
      icon: FarmIcon, 
      label: t('navigation.farms'),
      hasSubmenu: true,
      submenu: [
        { path: '/farms', icon: ViewIcon, label: t('navigation.viewAllFarms') },
        { path: '/farms/create', icon: AddIcon, label: t('navigation.createFarm') },
        // Paddy links - Only visible to machinery operators
        ...(hasRole('machinery_operator') ? [
          { path: '/paddy/varieties', icon: PaddyIcon, label: t('navigation.paddyVarieties') },
          { path: '/paddy/season-plans', icon: SeasonPlanIcon, label: t('navigation.seasonPlans') },
        ] : []),
      ]
    },
    // Machinery Section - Dynamic submenu based on user roles
    { 
      id: 'machinery',
      path: '/machinery', 
      icon: MachineryIcon, 
      label: t('navigation.machinery'),
      hasSubmenu: true,
      submenu: (() => {
        const isFarmer = hasRole('farm_owner') || hasRole('farm_manager') || hasRole('worker');
        const isMachineryOperator = hasRole('machinery_operator');

        // If user has both roles, show all menu items
        if (isFarmer && isMachineryOperator) {
          return [
            { path: '/machinery/search', icon: SearchIcon, label: t('navigation.searchMachinery') },
            { path: '/machinery/my-machinery', icon: MachineryIcon, label: t('navigation.myMachinery') },
            { path: '/machinery/my-requests', icon: RequestsIcon, label: t('navigation.myRequests') },
          ];
        }
        // Pure farmer - only search and their requests
        else if (isFarmer && !isMachineryOperator) {
          return [
            { path: '/machinery/search', icon: SearchIcon, label: t('navigation.searchMachinery') },
            { path: '/machinery/my-requests', icon: RequestsIcon, label: t('navigation.myRequests') },
          ];
        }
        // Pure machinery operator - their machinery and service requests
        else if (isMachineryOperator && !isFarmer) {
          return [
            { path: '/machinery/my-machinery', icon: MachineryIcon, label: t('navigation.myMachinery') },
            { path: '/machinery/my-requests', icon: RequestsIcon, label: t('navigation.serviceRequests') },
          ];
        }
        // Default - show all
        else {
          return [
            { path: '/machinery/search', icon: SearchIcon, label: t('navigation.searchMachinery') },
            { path: '/machinery/my-machinery', icon: MachineryIcon, label: t('navigation.myMachinery') },
            { path: '/machinery/my-requests', icon: RequestsIcon, label: t('navigation.myRequests') },
          ];
        }
      })()
    },
    // Admin Section - Only visible to admin and expert users
    ...(user && ['admin', 'expert'].includes(user.role) ? [
      { 
        id: 'admin',
        path: '/admin', 
        icon: SettingsIcon, 
        label: t('navigation.admin'),
        hasSubmenu: true,
        submenu: [
          { path: '/admin/disease-references', icon: DiseaseIcon, label: t('admin.diseaseReferences') },
          { path: '/admin/users', icon: ViewIcon, label: t('admin.userManagement') },
        ]
      },
    ] : []),
    // Disabled for Phase 1 - Paddy Only Implementation
    // { path: '/livestock', icon: PetsIcon, label: 'Livestock' },
    // { path: '/inventory', icon: InventoryIcon, label: 'Inventory' },
    // { path: '/reports', icon: BarChartIcon, label: 'Reports' },
    // { path: '/settings', icon: SettingsIcon, label: 'Settings' },
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
    } else if (menuType === 'admin') {
      setAdminMenuOpen(!adminMenuOpen);
    } else if (menuType === 'machinery') {
      setMachineryMenuOpen(!machineryMenuOpen);
    }
  };

  const getMenuState = (item) => {
    if (item.id === 'paddy') return paddyMenuOpen;
    if (item.id === 'farms') return farmsMenuOpen;
    if (item.id === 'admin') return adminMenuOpen;
    if (item.id === 'machinery') return machineryMenuOpen;
    return false;
  };

  const getMenuType = (item) => {
    if (item.id === 'paddy') return 'paddy';
    if (item.id === 'farms') return 'farms';
    if (item.id === 'admin') return 'admin';
    if (item.id === 'machinery') return 'machinery';
    return item.id || null;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFarmChange = (event) => {
    const farmId = event.target.value;
    
    // Handle "All Farms" selection (empty string means all farms)
    if (farmId === '') {
      setSelectedFarm(null);
      const pathname = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
      // If on season-plans page, stay there to show all farms' plans
      if (pathname.startsWith('/paddy/season-plans')) {
        setCurrentPath(pathname);
      }
      // close drawer on mobile after selection
      if (isMobile) handleDrawerToggle();
      return;
    }
    
    const farm = farms.find(f => f._id === farmId);
    setSelectedFarm(farm || null);
    
    // Navigate to farm detail page when a farm is selected, except when
    // the user is currently viewing the season-plans list. In that case
    // we only set the selected farm so the season-plans page can filter.
    if (farmId && farm) {
      const pathname = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
      if (!pathname.startsWith('/paddy/season-plans')) {
        navigate(`/farms/${farmId}`);
        setCurrentPath(`/farms/${farmId}`);
      } else {
        // stay on the season-plans page so it can react to selectedFarm
        setCurrentPath(pathname);
      }
      // close drawer on mobile after selection
      if (isMobile) handleDrawerToggle();
    }
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
      // If user has multiple roles, show all of them
      if (user.roles.length === 1) {
        return t(`roles.${user.roles[0]}`, user.roles[0]?.replace('_', ' '));
      } else {
        // Show multiple roles on separate lines
        return user.roles.map(role => 
          t(`roles.${role}`, role?.replace('_', ' '))
        ).join(', ');
      }
    }
    
    // Fallback to single role (backward compatibility)
    return t(`roles.${user.role}`, user.role?.replace('_', ' '));
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

      {/* Farm Selector - Available to all users */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
          {t('farms.farmsCount')} ({farms.length})
        </Typography>
        {farms.length > 0 ? (
          <FormControl fullWidth size="small">
            <Select
              value={selectedFarm?._id || ''}
              onChange={handleFarmChange}
              displayEmpty
            >
              <MenuItem value="">
                <Typography variant="body2">
                  {t('farms.allFarms', { defaultValue: 'All Farms' })}
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
            {t('farms.noFarmsFound')}
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
                    <React.Fragment key={subItem.path || subItem.label}>
                      {subItem.isSubmenuGroup ? (
                        /* Nested submenu group (like Paddy) */
                        <>
                          <ListItem disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                              onClick={() => setPaddyMenuOpen(!paddyMenuOpen)}
                              sx={{
                                pl: 4,
                                borderRadius: 2,
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                },
                              }}
                            >
                              <ListItemIcon>
                                <subItem.icon />
                              </ListItemIcon>
                              <ListItemText primary={subItem.label} />
                              {paddyMenuOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                          </ListItem>
                          
                          <Collapse in={paddyMenuOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {subItem.submenu.map((nestedItem) => (
                                <ListItem key={nestedItem.path} disablePadding sx={{ mb: 0.5 }}>
                                  <ListItemButton
                                    onClick={() => handleNavigation(nestedItem.path)}
                                    selected={currentPath === nestedItem.path}
                                    sx={{
                                      pl: 6,
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
                                        color: currentPath === nestedItem.path ? 'primary.contrastText' : 'inherit',
                                      }}
                                    >
                                      <nestedItem.icon />
                                    </ListItemIcon>
                                    <ListItemText primary={nestedItem.label} />
                                  </ListItemButton>
                                </ListItem>
                              ))}
                            </List>
                          </Collapse>
                        </>
                      ) : (
                        /* Regular submenu item */
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
                      )}
                    </React.Fragment>
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
              <Typography variant="caption" color="textSecondary" sx={{ 
                display: 'block',
                lineHeight: 1.3,
              }}>
                {getUserRoleDisplay()}
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
