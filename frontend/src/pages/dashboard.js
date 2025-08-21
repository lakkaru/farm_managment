import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Button,
  useTheme,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  Pets as PetsIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import Layout from '../components/Layout/Layout';
import PrivateRoute from '../components/PrivateRoute';
import AppProviders from '../providers/AppProviders';
import { useAuth } from '../contexts/AuthContext';
import { farmAPI, cropAPI, livestockAPI, inventoryAPI } from '../services/api';

const DashboardContent = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    farms: 0,
    crops: 0,
    livestock: 0,
    inventory: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from APIs
      const [farmsRes, cropsRes, livestockRes, inventoryRes] = await Promise.allSettled([
        farmAPI.getFarms(),
        cropAPI.getCrops(),
        livestockAPI.getLivestock(),
        inventoryAPI.getInventory(),
      ]);

      // Extract successful results
      const farms = farmsRes.status === 'fulfilled' ? farmsRes.value.data.data || [] : [];
      const crops = cropsRes.status === 'fulfilled' ? cropsRes.value.data.data || [] : [];
      const livestock = livestockRes.status === 'fulfilled' ? livestockRes.value.data.data || [] : [];
      const inventory = inventoryRes.status === 'fulfilled' ? inventoryRes.value.data.data || [] : [];

      setStats({
        farms: farms.length,
        crops: crops.length,
        livestock: livestock.length,
        inventory: inventory.length,
      });

      // Generate recent activity
      const activities = [];
      
      if (farms.length > 0) {
        activities.push({
          icon: <AgricultureIcon color="success" />,
          text: `You have ${farms.length} farm${farms.length !== 1 ? 's' : ''} registered`,
          time: 'Active',
        });
      }

      if (crops.length > 0) {
        activities.push({
          icon: <TrendingUpIcon color="primary" />,
          text: `${crops.length} crop${crops.length !== 1 ? 's' : ''} currently being tracked`,
          time: 'Active',
        });
      }

      if (livestock.length > 0) {
        activities.push({
          icon: <PetsIcon color="warning" />,
          text: `${livestock.length} livestock animal${livestock.length !== 1 ? 's' : ''} in your farms`,
          time: 'Active',
        });
      }

      if (inventory.length > 0) {
        activities.push({
          icon: <InventoryIcon color="secondary" />,
          text: `${inventory.length} inventory item${inventory.length !== 1 ? 's' : ''} tracked`,
          time: 'Active',
        });
      }

      // Add welcome message if no data
      if (activities.length === 0) {
        activities.push(
          {
            icon: <AgricultureIcon color="primary" />,
            text: 'Welcome to your farm management system!',
            time: 'Getting started',
          },
          {
            icon: <AddIcon color="action" />,
            text: 'Create your first farm to begin tracking your operations',
            time: 'Next step',
          }
        );
      }

      setRecentActivity(activities);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Some features may be limited.');
      
      // Set default values on error
      setStats({ farms: 0, crops: 0, livestock: 0, inventory: 0 });
      setRecentActivity([
        {
          icon: <AgricultureIcon color="primary" />,
          text: 'Welcome to your farm management system!',
          time: 'Getting started',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFarm = () => {
    navigate('/farms/create');
  };

  const handlePlanSeason = () => {
    navigate('/paddy/plan-season');
  };

  const statCards = [
    {
      title: 'Total Farms',
      value: stats.farms,
      color: theme.palette.success.main,
      icon: <AgricultureIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Active Crops',
      value: stats.crops,
      color: theme.palette.primary.main,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Livestock',
      value: stats.livestock,
      color: theme.palette.warning.main,
      icon: <PetsIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Inventory Items',
      value: stats.inventory,
      color: theme.palette.secondary.main,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
    }
  ];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.profile?.firstName || 'Farmer'}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's an overview of your farm operations
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={2}
              sx={{ 
                borderLeft: `4px solid ${stat.color}`,
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="overline" 
                    color="textSecondary" 
                    sx={{ 
                      fontWeight: 600,
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Recent Activity
            </Typography>
            {recentActivity.length > 0 ? (
              <List>
                {recentActivity.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivity.length - 1}>
                    <ListItemIcon>
                      {activity.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.text}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No recent activity to display.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AgricultureIcon />}
                onClick={handleCreateFarm}
                fullWidth
              >
                Create Farm
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUpIcon />}
                onClick={handlePlanSeason}
                fullWidth
              >
                Plan Season
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate('/crops/create')}
                fullWidth
              >
                Add Crop
              </Button>
              <Button
                variant="outlined"
                startIcon={<PetsIcon />}
                onClick={() => navigate('/livestock/create')}
                fullWidth
              >
                Add Livestock
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const Dashboard = () => {
  return (
    <AppProviders>
      <PrivateRoute>
        <Layout>
          <DashboardContent />
        </Layout>
      </PrivateRoute>
    </AppProviders>
  );
};

export default Dashboard;
