import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  TrendingUp as TrendingUpIcon,
  CloudQueue as CloudIcon,
  Assessment as AssessmentIcon,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import AppProviders from '../providers/AppProviders';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';

const LandingPage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Paddy Management',
      description: 'Comprehensive paddy cultivation management from variety selection to harvest tracking.',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Sri Lankan Focus',
      description: 'Built specifically for Sri Lankan agriculture with local climate zones and farming practices.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Yield Optimization',
      description: 'Maximize your paddy yield with zone-based fertilizer recommendations and growth tracking.',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Season Planning',
      description: 'Plan your paddy seasons with variety selection, fertilizer scheduling, and harvest forecasting.',
    },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/login'); // Same page handles both login and signup
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                Paddy Farm Management System
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
                A specialized solution for managing your paddy cultivation operations with modern technology and Sri Lankan agricultural expertise.
              </Typography>
              <Typography variant="body1" paragraph sx={{ opacity: 0.8 }}>
                Plan your paddy seasons, track growth stages, manage fertilizer applications, and get expert recommendations - all in one platform designed for Sri Lankan farmers.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLogin}
                  startIcon={<LoginIcon />}
                  sx={{
                    mr: 2,
                    mb: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleSignUp}
                  startIcon={<SignUpIcon />}
                  sx={{
                    mb: 2,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <AgricultureIcon sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Powerful Features for Modern Paddy Farming
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Sri Lankan Agriculture Focus
                </Typography>
                <Typography variant="body1">
                  Specifically designed for Sri Lankan farming practices with local climate zones, 
                  paddy varieties, and agriculture department recommendations.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Data-Driven Decisions
                </Typography>
                <Typography variant="body1">
                  Make informed decisions with comprehensive analytics, yield tracking, 
                  and performance insights to maximize your farm's productivity.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Easy to Use
                </Typography>
                <Typography variant="body1">
                  Modern, intuitive interface that works on all devices. 
                  No technical expertise required - focus on farming, not software.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Ready to Transform Your Farm Management?
          </Typography>
          <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
            Join thousands of farmers who are already using our platform to improve their operations.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSignUp}
              startIcon={<SignUpIcon />}
              sx={{
                mr: 2,
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleLogin}
              startIcon={<LoginIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2025 Farm Management System. Built for Sri Lankan Agriculture.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

const IndexPage = () => {
  return (
    <AppProviders>
      <AuthWrapper />
    </AppProviders>
  );
};

const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (isAuthenticated) {
    // If user is authenticated, redirect to dashboard
    if (typeof window !== 'undefined') {
      navigate('/dashboard');
    }
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5">Redirecting to dashboard...</Typography>
        </Box>
      </Layout>
    );
  }

  return <LandingPage />;
};

export default IndexPage;
