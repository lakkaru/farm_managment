import React, { useState, useEffect, useCallback } from 'react';
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
  Build as MachineryIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout/Layout';
import PrivateRoute from '../components/PrivateRoute';
import PhaseNotification from '../components/PhaseNotification';
import AppProviders from '../providers/AppProviders';
import { useAuth } from '../contexts/AuthContext';
import { farmAPI, seasonPlanAPI, paddyVarietyAPI, machineryAPI } from '../services/api';

const DashboardContent = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    farms: 0,
    seasonPlans: 0,
    paddyVarieties: 0,
    activeSeasons: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    // Check in roles array (new multi-role system)
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.includes(role);
    }
    // Fallback to single role (backward compatibility)
    return user.role === role;
  };

  // Check if user has farm-related roles
  const isFarmer = hasRole('farm_owner') || hasRole('farm_manager') || hasRole('worker');
  // Check if user has machinery role
  const isMachineryOperator = hasRole('machinery_operator');

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build API calls based on user roles
      const apiCalls = [
        farmAPI.getFarms(),
        seasonPlanAPI.getSeasonPlans(),
        paddyVarietyAPI.getPaddyVarieties(),
      ];

      // Only fetch machinery data if user is a machinery operator
      if (isMachineryOperator) {
        apiCalls.push(machineryAPI.getMyMachinery());
        apiCalls.push(machineryAPI.getMyRequests ? machineryAPI.getMyRequests() : Promise.resolve({ data: { data: [] } }));
      }

      const results = await Promise.allSettled(apiCalls);

      // Extract successful results
      const farms = results[0]?.status === 'fulfilled' ? results[0].value.data.data || [] : [];
      const seasonPlans = results[1]?.status === 'fulfilled' ? results[1].value.data.data || [] : [];
      const paddyVarieties = results[2]?.status === 'fulfilled' ? results[2].value.data.data || [] : [];
      
      // Extract machinery data only if user is a machinery operator
      let machinery = [];
      let requests = [];
      if (isMachineryOperator) {
        machinery = results[3]?.status === 'fulfilled' ? results[3].value.data.data || [] : [];
        requests = results[4]?.status === 'fulfilled' ? results[4].value.data.data || [] : [];
      }

      // Count active seasons (current or future seasons)
      // const now = new Date();
      // console.log('seasonPlans:', seasonPlans);
      // const activeSeasons = seasonPlans.filter(plan => 
      //   new Date(plan.expectedHarvest?.date || plan.cultivationDate) >= now
      // );
     
      // console.log('seasonPlans:', seasonPlans);
      const activeSeasons = seasonPlans.filter(plan => 
        plan.status === 'active'
      );

      // Count request statuses
      const pendingRequests = requests.filter(r => r.status === 'Pending').length;
      const completedServices = requests.filter(r => r.status === 'Completed').length;
      const activeRequests = requests.filter(r => ['Accepted', 'In Progress'].includes(r.status)).length;

      // Set combined stats
      setStats({
        farms: farms.length,
        seasonPlans: seasonPlans.length,
        paddyVarieties: paddyVarieties.length,
        activeSeasons: activeSeasons.length,
        machinery: machinery.length,
        totalRequests: requests.length,
        pendingRequests,
        completedServices,
        activeRequests,
      });

      // Generate recent activity combining both farms and machinery
      const activities = [];
      
      // Farm activities
      if (farms.length > 0) {
        activities.push({
          icon: <AgricultureIcon color="success" />,
          text: t('dashboard.farmsRegisteredActivity', { count: farms.length, plural: farms.length !== 1 ? 's' : '' }),
          time: 'Active',
        });
      }

      if (activeSeasons.length > 0) {
        activities.push({
          icon: <PaddyIcon color="primary" />,
          text: t('dashboard.activeSeasonsActivity', { count: activeSeasons.length, plural: activeSeasons.length !== 1 ? 's' : '' }),
          time: 'Current Season',
        });
      }

      // Machinery activities
      if (machinery.length > 0) {
        activities.push({
          icon: <MachineryIcon color="primary" />,
          text: `${machinery.length} machinery ${machinery.length !== 1 ? 'items' : 'item'} listed`,
          time: 'Available',
        });
      }

      if (pendingRequests > 0) {
        activities.push({
          icon: <PendingIcon color="warning" />,
          text: `${pendingRequests} pending service request${pendingRequests !== 1 ? 's' : ''}`,
          time: 'Needs attention',
        });
      }

      // Add welcome message if no data at all
      if (activities.length === 0) {
        activities.push(
          {
            icon: <PaddyIcon color="primary" />,
            text: t('dashboard.welcomeMessage'),
            time: t('dashboard.gettingStarted'),
          },
          {
            icon: <AddIcon color="action" />,
            text: 'Start by creating a farm or listing your machinery',
            time: 'Get Started',
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
  }, [t, isMachineryOperator]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
      case 'machinery':
        navigate('/machinery/my-machinery');
        break;
      case 'pendingRequests':
      case 'activeRequests':
      case 'completedServices':
        navigate('/machinery/my-requests');
        break;
      default:
        break;
    }
  };

  // Build stat cards dynamically based on user's selected roles
  const statCards = [];
  
  // Show farm cards if user is a farmer (has farm-related role)
  if (isFarmer) {
    statCards.push(
      {
        title: t('dashboard.totalFarms'),
        value: stats.farms,
        color: theme.palette.success.main,
        icon: <AgricultureIcon sx={{ fontSize: 40 }} />,
        type: 'farms',
      },
      {
        title: t('dashboard.activeSeasons'),
        value: stats.activeSeasons,
        color: theme.palette.warning.main,
        icon: <PaddyIcon sx={{ fontSize: 40 }} />,
        type: 'activeSeasons',
      },
      {
        title: t('dashboard.activeSeasonPlans'),
        value: stats.seasonPlans,
        color: theme.palette.primary.main,
        icon: <PlanSeasonIcon sx={{ fontSize: 40 }} />,
        type: 'seasonPlans',
      },
      {
        title: t('dashboard.paddyVarieties'),
        value: stats.paddyVarieties,
        color: theme.palette.secondary.main,
        icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
        type: 'paddyVarieties',
      }
    );
  }
  
  // Show machinery cards if user is a machinery operator (has machinery role)
  if (isMachineryOperator) {
    statCards.push(
      {
        title: 'My Machinery',
        value: stats.machinery || 0,
        color: theme.palette.primary.main,
        icon: <MachineryIcon sx={{ fontSize: 40 }} />,
        type: 'machinery',
      },
      {
        title: 'Pending Requests',
        value: stats.pendingRequests || 0,
        color: theme.palette.warning.main,
        icon: <PendingIcon sx={{ fontSize: 40 }} />,
        type: 'pendingRequests',
      },
      {
        title: 'Active Services',
        value: stats.activeRequests || 0,
        color: theme.palette.info.main,
        icon: <AgricultureIcon sx={{ fontSize: 40 }} />,
        type: 'activeRequests',
      },
      {
        title: 'Completed Services',
        value: stats.completedServices || 0,
        color: theme.palette.success.main,
        icon: <CompletedIcon sx={{ fontSize: 40 }} />,
        type: 'completedServices',
      }
    );
  }
  
  // If user has no roles selected, show welcome message cards
  if (statCards.length === 0) {
    statCards.push(
      {
        title: t('dashboard.totalFarms'),
        value: 0,
        color: theme.palette.success.main,
        icon: <AgricultureIcon sx={{ fontSize: 40 }} />,
        type: 'farms',
      },
      {
        title: 'My Machinery',
        value: 0,
        color: theme.palette.primary.main,
        icon: <MachineryIcon sx={{ fontSize: 40 }} />,
        type: 'machinery',
      }
    );
  }

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
          {t('auth.welcome')}, {user?.profile?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('dashboard.paddyCultivationOverview')}
        </Typography>
      </Box>

      {/* <PhaseNotification /> */}

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
              {t('dashboard.recentActivity')}
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
                {t('dashboard.noRecentActivity')}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              {t('dashboard.quickActions')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Farm Management Actions - Show if user is a farmer */}
              {isFarmer && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<AgricultureIcon />}
                    onClick={handleCreateFarm}
                    fullWidth
                  >
                    {t('dashboard.createFarm')}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<TrendingUpIcon />}
                    onClick={handlePlanSeason}
                    fullWidth
                  >
                    {t('dashboard.planPaddySeason')}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DiseaseIcon />}
                    onClick={() => navigate('/paddy/disease-detection')}
                    fullWidth
                    color="error"
                  >
                    Rice Plant Diseases
                  </Button>
                </>
              )}
              
              {/* Machinery Actions - Show if user is a machinery operator */}
              {isMachineryOperator && (
                <>
                  <Button
                    variant={isFarmer ? "outlined" : "contained"}
                    startIcon={<MachineryIcon />}
                    onClick={() => navigate('/machinery/my-machinery')}
                    fullWidth
                  >
                    Manage Machinery
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PendingIcon />}
                    onClick={() => navigate('/machinery/my-requests')}
                    fullWidth
                  >
                    View Service Requests
                  </Button>
                </>
              )}
              
              {/* If user has no roles, show getting started message */}
              {!isFarmer && !isMachineryOperator && (
                <Alert severity="info">
                  Welcome! Start by creating a farm or listing your machinery.
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const Dashboard = () => {
  const isBrowser = typeof window !== "undefined"
   if (!isBrowser) {
    // Render nothing (or a loading spinner) during SSR
    return null
  }
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
