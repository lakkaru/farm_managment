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
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  TrendingUp as TrendingUpIcon,
  CloudQueue as CloudIcon,
  Assessment as AssessmentIcon,
  PersonAdd as SignUpIcon,
  AccountCircle as RegisterIcon,
  Business as FarmIcon,
  Schedule as PlanIcon,
  Grass as VarietyIcon,
  Analytics as TrackIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import AppProviders from '../providers/AppProviders';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';
import LanguageSwitcher from '../components/LanguageSwitcher/LanguageSwitcher';

const LandingPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const steps = [
    {
      icon: <RegisterIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.step1Title'),
      description: t('landing.step1Description'),
    },
    {
      icon: <FarmIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.step2Title'),
      description: t('landing.step2Description'),
    },
    {
      icon: <PlanIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.step3Title'),
      description: t('landing.step3Description'),
    },
    {
      icon: <VarietyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.step4Title'),
      description: t('landing.step4Description'),
    },
    {
      icon: <TrackIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.step5Title'),
      description: t('landing.step5Description'),
    },
  ];

  const features = [
    {
      icon: <AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.feature1Title'),
      description: t('landing.feature1Description'),
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.feature2Title'),
      description: t('landing.feature2Description'),
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.feature3Title'),
      description: t('landing.feature3Description'),
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('landing.feature4Title'),
      description: t('landing.feature4Description'),
    },
  ];

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <AgricultureIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary', 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              {t('landing.title')}
            </Typography>
          </Box>
          <Box sx={{ ml: 2 }}>
            <LanguageSwitcher variant="compact" />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
          color: 'white',
          py: 16,
          mt: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                {t('landing.title')}
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9, mb: 3 }}>
                {t('landing.subtitle')}
              </Typography>
              <Typography variant="body1" paragraph sx={{ opacity: 0.8, mb: 4 }}>
                {t('landing.description')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                startIcon={<SignUpIcon />}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {t('landing.getStarted')}
              </Button>
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

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          {t('landing.howItWorks')}
        </Typography>
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={2.4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box 
                    sx={{ 
                      mb: 2,
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto'
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {index + 1}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.9rem' }}>
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            {t('landing.featuresTitle')}
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
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          {t('landing.whyChooseTitle')}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                {t('landing.benefit1Title')}
              </Typography>
              <Typography variant="body1">
                {t('landing.benefit1Description')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                {t('landing.benefit2Title')}
              </Typography>
              <Typography variant="body1">
                {t('landing.benefit2Description')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                {t('landing.benefit3Title')}
              </Typography>
              <Typography variant="body1">
                {t('landing.benefit3Description')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
            {t('landing.ctaTitle')}
          </Typography>
          <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
            {t('landing.ctaDescription')}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              startIcon={<SignUpIcon />}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              {t('landing.getStarted')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="body2">
                © 2025 {t('landing.title')}. {t('landing.footer')}.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Button
                variant="outlined"
                onClick={handleGetStarted}
                startIcon={<SignUpIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                {t('landing.getStarted')}
              </Button>
            </Grid>
          </Grid>
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
