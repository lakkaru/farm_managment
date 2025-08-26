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
  Grass as PaddyIcon,
  Schedule as PlanSeasonIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  BugReport as DiseaseIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import Layout from '../components/Layout/Layout';
import PrivateRoute from '../components/PrivateRoute';
import PhaseNotification from '../components/PhaseNotification';
import AppProviders from '../providers/AppProviders';
import { useAuth } from '../contexts/AuthContext';
import { farmAPI, seasonPlanAPI, paddyVarietyAPI } from '../services/api';

const DashboardContent = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    farms: 0,
    seasonPlans: 0,
    paddyVarieties: 0,
    activeSeasons: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch paddy-focused data from APIs
      const [farmsRes, seasonPlansRes, paddyVarietiesRes] = await Promise.allSettled([
        farmAPI.getFarms(),
        seasonPlanAPI.getSeasonPlans(),
        paddyVarietyAPI.getPaddyVarieties(),
      ]);

      // Extract successful results
      const farms = farmsRes.status === 'fulfilled' ? farmsRes.value.data.data || [] : [];
      const seasonPlans = seasonPlansRes.status === 'fulfilled' ? seasonPlansRes.value.data.data || [] : [];
      const paddyVarieties = paddyVarietiesRes.status === 'fulfilled' ? paddyVarietiesRes.value.data.data || [] : [];

      // Count active seasons (current or future seasons)
      const now = new Date();
      const activeSeasons = seasonPlans.filter(plan => 
        new Date(plan.expectedHarvest?.date || plan.cultivationDate) >= now
      );

      setStats({
        farms: farms.length,
        seasonPlans: seasonPlans.length,
        paddyVarieties: paddyVarieties.length,
        activeSeasons: activeSeasons.length,
      });

      // Generate recent activity focused on paddy cultivation
      const activities = [];
      
      if (farms.length > 0) {
        activities.push({
          icon: <AgricultureIcon color="success" />,
          text: `You have ${farms.length} farm${farms.length !== 1 ? 's' : ''} registered for paddy cultivation`,
          time: 'Active',
        });
      }

      if (activeSeasons.length > 0) {
        activities.push({
          icon: <PaddyIcon color="primary" />,
          text: `${activeSeasons.length} active paddy season${activeSeasons.length !== 1 ? 's' : ''} in progress`,
          time: 'Current Season',
        });
      }

      if (seasonPlans.length > 0) {
        activities.push({
          icon: <PlanSeasonIcon color="info" />,
          text: `${seasonPlans.length} total season plan${seasonPlans.length !== 1 ? 's' : ''} created`,
          time: 'Historical',
        });
      }

      if (paddyVarieties.length > 0) {
        activities.push({
          icon: <TrendingUpIcon color="secondary" />,
          text: `${paddyVarieties.length} paddy varietie${paddyVarieties.length !== 1 ? 's' : ''} available for selection`,
          time: 'Database',
        });
      }

      // Add welcome message if no data
      if (activities.length === 0) {
        activities.push(
          {
            icon: <PaddyIcon color="primary" />,
            text: 'Welcome to your paddy farm management system!',
            time: 'Getting started',
          },
          {
            icon: <AddIcon color="action" />,
            text: 'Create your first farm and start planning your paddy seasons',
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
      setStats({ farms: 0, seasonPlans: 0, paddyVarieties: 0, activeSeasons: 0 });
      setRecentActivity([
        {
          icon: <PaddyIcon color="primary" />,
          text: 'Welcome to your paddy farm management system!',
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
    navigate('/paddy/season-plans/create');
  };

  const handleCardClick = (cardType) => {
    switch (cardType) {
      case 'farms':
        navigate('/farms');
        break;
      case 'seasonPlans':
        navigate('/paddy/season-plans');
        break;
      case 'activeSeasons':
        navigate('/paddy/season-plans?status=active');
        break;
      case 'paddyVarieties':
        navigate('/paddy/varieties');
        break;
      default:
        break;
    }
  };

  const statCards = [
    {
      title: 'Total Farms',
      value: stats.farms,
      color: theme.palette.success.main,
      icon: <AgricultureIcon sx={{ fontSize: 40 }} />,
      type: 'farms',
      subtitle: stats.farms === 0 ? 'Create your first farm' : `${stats.farms} farm${stats.farms !== 1 ? 's' : ''} registered`,
    },
    {
      title: 'Season Plans',
      value: stats.seasonPlans,
      color: theme.palette.primary.main,
      icon: <PlanSeasonIcon sx={{ fontSize: 40 }} />,
      type: 'seasonPlans',
      subtitle: stats.seasonPlans === 0 ? 'Plan your first season' : `${stats.seasonPlans} plan${stats.seasonPlans !== 1 ? 's' : ''} created`,
    },
    {
      title: 'Active Seasons',
      value: stats.activeSeasons,
      color: theme.palette.warning.main,
      icon: <PaddyIcon sx={{ fontSize: 40 }} />,
      type: 'activeSeasons',
      subtitle: stats.activeSeasons === 0 ? 'No active seasons' : `${stats.activeSeasons} season${stats.activeSeasons !== 1 ? 's' : ''} ongoing`,
    },
    {
      title: 'Paddy Varieties',
      value: stats.paddyVarieties,
      color: theme.palette.secondary.main,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      type: 'paddyVarieties',
      subtitle: stats.paddyVarieties === 0 ? 'No varieties available' : `${stats.paddyVarieties} varietie${stats.paddyVarieties !== 1 ? 's' : ''} available`,
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
          Here's an overview of your paddy cultivation operations
        </Typography>
      </Box>

      <PhaseNotification />

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
              onClick={() => handleCardClick(stat.type)}
              sx={{ 
                borderLeft: `4px solid ${stat.color}`,
                height: '100%',
                cursor: 'pointer',
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
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ mt: 0.5 }}
                  >
                    {stat.subtitle}
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
                startIcon={<PlanSeasonIcon />}
                onClick={handlePlanSeason}
                fullWidth
              >
                Plan Paddy Season
              </Button>
              <Button
                variant="outlined"
                startIcon={<PaddyIcon />}
                onClick={() => navigate('/paddy/varieties')}
                fullWidth
              >
                View Paddy Varieties
              </Button>
              <Button
                variant="outlined"
                startIcon={<DiseaseIcon />}
                onClick={() => navigate('/paddy/disease-detection')}
                fullWidth
                color="warning"
              >
                Plant Disease Detection
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUpIcon />}
                onClick={() => navigate('/paddy/season-plans')}
                fullWidth
              >
                View Season Plans
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
