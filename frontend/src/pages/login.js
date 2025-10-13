import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  useTheme,
  Tab,
  Tabs,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import BackButton from '../components/BackButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import AppProviders from '../providers/AppProviders';
import LanguageSwitcher from '../components/LanguageSwitcher/LanguageSwitcher';

const LoginPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Login form state - now uses firstName instead of email
  const [loginData, setLoginData] = useState({
    firstName: '',
    password: '',
  });

  // Registration form state - email is now optional
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      role: 'farm_owner',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // Phone number formatting function
  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const numericOnly = value.replace(/\D/g, '');
    // Limit to 10 digits and format as 0XXXXXXXXX
    if (numericOnly.length <= 10) {
      return numericOnly;
    }
    return numericOnly.substring(0, 10);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number formatting
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setRegisterData({
        ...registerData,
        profile: {
          ...registerData.profile,
          [name]: formattedPhone,
        },
      });
    } else if (name === 'firstName' || name === 'lastName' || name === 'role') {
      setRegisterData({
        ...registerData,
        profile: {
          ...registerData.profile,
          [name]: value,
        },
      });
    } else {
      setRegisterData({
        ...registerData,
        [name]: value,
      });
    }
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginData.firstName || !loginData.password) {
      setError(t('auth.fillAllFields'));
      return;
    }

    try {
      console.log('Login page: Attempting login, API URL:', process.env.GATSBY_API_URL);
      await login(loginData);
      console.log('Login page: Login successful, navigating...');
      
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login page: Login error:', err);
      console.error('Login page: Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      
      let errorMessage = err.message || t('auth.loginFailed');
      
      // More specific error messages for production debugging
      if (err.response?.status === 0 || err.message === 'Network Error') {
        errorMessage = t('auth.networkError');
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check the server configuration.';
      } else if (err.response?.status >= 500) {
        errorMessage = t('auth.serverError');
      }
      
      setError(errorMessage);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation - email is now optional
    if (!registerData.profile.firstName || !registerData.profile.lastName || 
        !registerData.profile.phone || !registerData.password || !registerData.confirmPassword) {
      setError(t('auth.fillAllFields'));
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError(t('auth.passwordsNotMatch'));
      return;
    }

    if (registerData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    // Validate phone number format (should be 10 digits)
    if (registerData.profile.phone.length !== 10 || !registerData.profile.phone.startsWith('0')) {
      setError(t('auth.phoneFormat'));
      return;
    }

    try {
      // Create a clean registration object, removing empty email if not provided
      const cleanRegisterData = { ...registerData };
      if (!cleanRegisterData.email || cleanRegisterData.email.trim() === '') {
        delete cleanRegisterData.email;
      }
      
      await register(cleanRegisterData);
      toast.success(t('auth.registrationSuccessful'));
      setTabValue(0); // Switch to login tab
    } catch (err) {
      setError(err.message || t('auth.registrationFailed'));
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <BackButton
          to="/"
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        />
        <Box sx={{ 
          '& .MuiButton-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
            color: '#2e7d32 !important',
            border: '2px solid #4caf50 !important',
            fontWeight: '600 !important',
            minWidth: '80px !important',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2) !important',
            '&:hover': {
              backgroundColor: '#4caf50 !important',
              color: 'white !important',
              transform: 'translateY(-1px) !important',
            }
          }
        }}>
          <LanguageSwitcher variant="login" />
        </Box>
      </Box>

      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AgricultureIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {t('auth.welcome')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t('auth.signInToAccount')}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label={t('auth.signIn')} />
            <Tab label={t('auth.signUp')} />
          </Tabs>

          {/* Login Form */}
          {tabValue === 0 && (
            <Box component="form" onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label={t('auth.firstName')}
                name="firstName"
                type="text"
                value={loginData.firstName}
                onChange={handleLoginChange}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label={t('auth.password')}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleLoginChange}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    {t('auth.signingIn')}
                  </>
                ) : (
                  t('auth.signIn')
                )}
              </Button>
            </Box>
          )}

          {/* Registration Form */}
          {tabValue === 1 && (
            <Box component="form" onSubmit={handleRegisterSubmit}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label={t('auth.firstName')}
                  name="firstName"
                  value={registerData.profile.firstName}
                  onChange={handleRegisterChange}
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label={t('auth.lastName')}
                  name="lastName"
                  value={registerData.profile.lastName}
                  onChange={handleRegisterChange}
                  variant="outlined"
                  required
                />
              </Box>
              
              <TextField
                fullWidth
                label={t('auth.email')}
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                variant="outlined"
                margin="normal"
                helperText={t('auth.emailOptional')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label={t('auth.phoneNumber')}
                name="phone"
                value={registerData.profile.phone}
                onChange={handleRegisterChange}
                variant="outlined"
                margin="normal"
                required
                helperText={t('auth.phoneFormat')}
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>{t('auth.role')}</InputLabel>
                <Select
                  name="role"
                  value={registerData.profile.role}
                  onChange={handleRegisterChange}
                  label={t('auth.role')}
                >
                  <MenuItem value="farm_owner">{t('auth.farmOwner')}</MenuItem>
                  <MenuItem value="farm_manager">{t('auth.farmManager')}</MenuItem>
                  <MenuItem value="worker">{t('auth.worker')}</MenuItem>
                  <MenuItem value="viewer">{t('auth.viewer')}</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label={t('auth.password')}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={registerData.password}
                onChange={handleRegisterChange}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={t('auth.passwordMinLength')}
              />

              <TextField
                fullWidth
                label={t('auth.confirmPassword')}
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    {t('auth.creatingAccount')}
                  </>
                ) : (
                  t('auth.createAccount')
                )}
              </Button>
            </Box>
          )}

          <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2 }}>
            {tabValue === 0
              ? t('auth.clickSignUp')
              : t('auth.clickSignIn')
            }
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

const LoginPageWrapper = () => {
  return (
    <AppProviders>
      <LoginPage />
    </AppProviders>
  );
};

export default LoginPageWrapper;
