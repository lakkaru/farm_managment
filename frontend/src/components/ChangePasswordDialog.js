import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, label: 'Very Weak', color: 'error' };
    
    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[@$!%*?&]/.test(pwd)) score += 1;
    
    const levels = [
      { score: 0, label: 'Very Weak', color: 'error' },
      { score: 1, label: 'Weak', color: 'error' },
      { score: 2, label: 'Fair', color: 'warning' },
      { score: 3, label: 'Good', color: 'info' },
      { score: 4, label: 'Strong', color: 'success' },
      { score: 5, label: 'Very Strong', color: 'success' },
      { score: 6, label: 'Excellent', color: 'success' },
    ];
    
    return levels.find(level => score <= level.score) || levels[levels.length - 1];
  };

  const strength = getStrength(password);
  const progress = (strength.score / 6) * 100;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="caption" color="textSecondary">
          Password Strength
        </Typography>
        <Typography variant="caption" color={`${strength.color}.main`} fontWeight="medium">
          {strength.label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        color={strength.color}
        sx={{ height: 4, borderRadius: 2 }}
      />
    </Box>
  );
};

const ChangePasswordDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        console.log('Attempting to change password:', {
          hasCurrentPassword: !!values.currentPassword,
          hasNewPassword: !!values.newPassword,
          currentPasswordLength: values.currentPassword?.length,
          newPasswordLength: values.newPassword?.length
        });
        
        await authAPI.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        
        toast.success('Password changed successfully!');
        handleClose();
      } catch (error) {
        console.error('Password change error:', error);
        console.error('Error response:', error.response);
        const errorMessage = error.response?.data?.message || 'Failed to change password';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Change Password</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Choose a strong password that includes uppercase and lowercase letters, numbers, and special characters.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Current Password */}
            <TextField
              fullWidth
              name="currentPassword"
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
              helperText={formik.touched.currentPassword && formik.errors.currentPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* New Password */}
            <Box>
              <TextField
                fullWidth
                name="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                helperText={formik.touched.newPassword && formik.errors.newPassword}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <PasswordStrengthIndicator password={formik.values.newPassword} />
            </Box>

            {/* Confirm Password */}
            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Password Requirements */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Password requirements:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <Typography component="li" variant="body2" color="textSecondary">
                At least 8 characters long
              </Typography>
              <Typography component="li" variant="body2" color="textSecondary">
                Contains uppercase and lowercase letters
              </Typography>
              <Typography component="li" variant="body2" color="textSecondary">
                Contains at least one number
              </Typography>
              <Typography component="li" variant="body2" color="textSecondary">
                Contains at least one special character (@$!%*?&)
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formik.isValid}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordDialog;
