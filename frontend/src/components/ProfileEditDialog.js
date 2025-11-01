import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  IconButton,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .nullable(),
  bio: Yup.string()
    .max(500, 'Bio cannot exceed 500 characters'),
  phone: Yup.string()
    .matches(/^[\+]?[0-9]{9,15}$/, 'Invalid phone number format')
    .required('Phone number is required'),
  street: Yup.string()
    .max(100, 'Street address cannot exceed 100 characters'),
  city: Yup.string()
    .max(50, 'City cannot exceed 50 characters'),
  state: Yup.string()
    .max(50, 'State cannot exceed 50 characters'),
  country: Yup.string()
    .max(50, 'Country cannot exceed 50 characters'),
  zipCode: Yup.string()
    .max(20, 'ZIP code cannot exceed 20 characters'),
  currentPassword: Yup.string()
    .when('email', {
      is: (email, schema) => {
        // Require current password if email is being changed and both old and new email exist
        const originalEmail = schema.parent.originalEmail;
        return originalEmail && email && email !== originalEmail;
      },
      then: () => Yup.string().required('Current password is required to change email'),
      otherwise: () => Yup.string(),
    }),
});

const ProfileEditDialog = ({ open, onClose, user, onUpdate }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    // Initialize selected roles from user data
    if (user) {
      if (user.roles && Array.isArray(user.roles)) {
        setSelectedRoles(user.roles);
      } else if (user.role) {
        setSelectedRoles([user.role]);
      }
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
      originalEmail: user?.email || '',
      bio: user?.profile?.bio || '',
      dateOfBirth: user?.profile?.dateOfBirth ? dayjs(user.profile.dateOfBirth) : null,
      gender: user?.profile?.gender || '',
      phone: user?.contact?.phone || '',
      street: user?.contact?.address?.street || '',
      city: user?.contact?.address?.city || '',
      state: user?.contact?.address?.state || '',
      country: user?.contact?.address?.country || '',
      zipCode: user?.contact?.address?.zipCode || '',
      currentPassword: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Prepare update data
        const updateData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email || null,
          roles: selectedRoles, // Add roles to update data
          profile: {
            firstName: values.firstName,
            lastName: values.lastName,
            bio: values.bio,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null,
            gender: values.gender || null,
            role: selectedRoles.length > 0 ? selectedRoles[0] : 'farm_owner', // Set primary role
          },
          contact: {
            phone: values.phone,
            address: {
              street: values.street || null,
              city: values.city || null,
              state: values.state || null,
              country: values.country || null,
              zipCode: values.zipCode || null,
            },
          },
        };

        // Add current password if email is being changed (both old and new email exist)
        if (values.originalEmail && values.email && values.email !== values.originalEmail) {
          updateData.currentPassword = values.currentPassword;
        }

        const response = await authAPI.updateProfile(updateData);
        
        // Update the auth context
        await onUpdate(response.data.data);
        
        toast.success('Profile updated successfully!');
        onClose();
      } catch (error) {
        console.error('Profile update error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update profile';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setSelectedRoles(user?.roles || (user?.role ? [user.role] : []));
    onClose();
  };

  const handleRoleToggle = (role) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const requiresPassword = formik.values.originalEmail && formik.values.email && formik.values.email !== formik.values.originalEmail;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '70vh' },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('profile.editDialog.title')}</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('profile.editDialog.personalInformation')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label={t('profile.editDialog.firstName')}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label={t('profile.editDialog.lastName')}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label={t('profile.editDialog.emailAddress')}
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={t('profile.dateOfBirth')}
                  value={formik.values.dateOfBirth}
                  onChange={(newValue) => formik.setFieldValue('dateOfBirth', newValue)}
                  maxDate={dayjs().subtract(13, 'year')} // Minimum age 13
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                      helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('profile.gender')}</InputLabel>
                  <Select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    label={t('profile.gender')}
                  >
                    <MenuItem value="">{t('profile.notSpecified')}</MenuItem>
                    <MenuItem value="male">{t('profile.genderOptions.male')}</MenuItem>
                    <MenuItem value="female">{t('profile.genderOptions.female')}</MenuItem>
                    <MenuItem value="other">{t('profile.genderOptions.other')}</MenuItem>
                    <MenuItem value="prefer_not_to_say">{t('profile.genderOptions.prefer_not_to_say')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="bio"
                  label={t('profile.editDialog.bio')}
                  multiline
                  rows={3}
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.bio && Boolean(formik.errors.bio)}
                  helperText={formik.touched.bio && formik.errors.bio}
                  placeholder={t('profile.editDialog.bioPlaceholder')}
                />
              </Grid>

              {/* Roles Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {t('profile.editDialog.yourRoles')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1, color: 'text.primary' }}>
                    {t('profile.editDialog.selectYourRoles')}
                  </FormLabel>
                  <FormHelperText sx={{ mt: 0, mb: 1 }}>
                    {t('profile.editDialog.multipleRolesHelper')}
                  </FormHelperText>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRoles.includes('farm_owner')}
                          onChange={() => handleRoleToggle('farm_owner')}
                          color="primary"
                        />
                      }
                      label={t('auth.farmOwner')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRoles.includes('farm_manager')}
                          onChange={() => handleRoleToggle('farm_manager')}
                          color="primary"
                        />
                      }
                      label={t('auth.farmManager')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRoles.includes('machinery_operator')}
                          onChange={() => handleRoleToggle('machinery_operator')}
                          color="primary"
                        />
                      }
                      label={t('auth.machineryOperator')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRoles.includes('worker')}
                          onChange={() => handleRoleToggle('worker')}
                          color="primary"
                        />
                      }
                      label={t('auth.worker')}
                    />
                  </FormGroup>
                  {selectedRoles.length === 0 && (
                    <FormHelperText error>
                      {t('profile.editDialog.selectAtLeastOneRole')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {t('profile.editDialog.contactInformation')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label={t('profile.editDialog.phoneNumber')}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  placeholder={t('profile.editDialog.phonePlaceholder')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="street"
                  label={t('profile.editDialog.streetAddress')}
                  value={formik.values.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.street && Boolean(formik.errors.street)}
                  helperText={formik.touched.street && formik.errors.street}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="city"
                  label={t('profile.editDialog.city')}
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="state"
                  label={t('profile.editDialog.stateProvince')}
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="country"
                  label={t('profile.editDialog.country')}
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.country && Boolean(formik.errors.country)}
                  helperText={formik.touched.country && formik.errors.country}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="zipCode"
                  label={t('profile.editDialog.zipPostalCode')}
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                  helperText={formik.touched.zipCode && formik.errors.zipCode}
                />
              </Grid>

              {/* Password Confirmation (if email changed) */}
              {requiresPassword && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      {t('profile.editDialog.securityVerification')}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {t('profile.editDialog.currentPasswordRequired')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="currentPassword"
                      label={t('profile.editDialog.currentPassword')}
                      type={showPassword ? 'text' : 'password'}
                      value={formik.values.currentPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                      helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                      required={requiresPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={loading}>
              {t('profile.editDialog.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formik.isValid || selectedRoles.length === 0}
            >
              {loading ? t('profile.editDialog.updating') : t('profile.editDialog.updateProfile')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ProfileEditDialog;
