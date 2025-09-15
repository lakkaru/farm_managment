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
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import AppProviders from '../providers/AppProviders';

const LoginPage = () => {
  const theme = useTheme();
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Registration form state
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

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstName' || name === 'lastName' || name === 'phone' || name === 'role') {
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

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(loginData);
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!registerData.profile.firstName || !registerData.profile.lastName || 
        !registerData.email || !registerData.profile.phone || 
        !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(registerData);
      toast.success('Registration successful! Please log in.');
      setTabValue(0); // Switch to login tab
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToHome}
        sx={{ 
          position: 'absolute', 
          top: 16, 
          left: 16,
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        Back to Home
      </Button>

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
              Farm Management System
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign in to your account or create a new one
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
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {/* Login Form */}
          {tabValue === 0 && (
            <Box component="form" onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                variant="outlined"
                margin="normal"
                required
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
                label="Password"
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
                    Signing In...
                  </>
                ) : (
                  'Sign In'
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
                  label="First Name"
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
                  label="Last Name"
                  name="lastName"
                  value={registerData.profile.lastName}
                  onChange={handleRegisterChange}
                  variant="outlined"
                  required
                />
              </Box>
              
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                variant="outlined"
                margin="normal"
                required
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
                label="Phone Number"
                name="phone"
                value={registerData.profile.phone}
                onChange={handleRegisterChange}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={registerData.profile.role}
                  onChange={handleRegisterChange}
                  label="Role"
                >
                  <MenuItem value="farm_owner">Farm Owner</MenuItem>
                  <MenuItem value="farm_manager">Farm Manager</MenuItem>
                  <MenuItem value="worker">Worker</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Password"
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
                helperText="Minimum 6 characters"
              />

              <TextField
                fullWidth
                label="Confirm Password"
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
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Box>
          )}

          <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2 }}>
            {tabValue === 0
              ? "Don't have an account? Click 'Sign Up' tab above."
              : "Already have an account? Click 'Sign In' tab above."
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
