import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  IconButton,
  Divider,
  Alert,
  Fab,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { navigate } from 'gatsby';
import BackButton from '../components/BackButton';
import Layout from '../components/Layout/Layout';
import PrivateRoute from '../components/PrivateRoute';
import ProfileEditDialog from '../components/ProfileEditDialog';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import NotificationSettings from '../components/NotificationSettings';
import LanguageSwitcher from '../components/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const ProfileContent = () => {
  console.log('ProfileContent component rendering');
  const { user, updateProfile } = useAuth();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setAvatarUploading(true);
      const response = await authAPI.uploadAvatar(file);
      
      // Update user profile with new avatar
      await updateProfile({
        profile: {
          ...user.profile,
          avatar: response.data.data.avatar,
        },
      });

      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setAvatarUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const getAvatarUrl = () => {
    if (user?.profile?.avatar) {
      return authAPI.getAvatarUrl(user.profile.avatar);
    }
    return null;
  };

  const formatDate = (date) => {
    if (!date) return t('profile.notSpecified');
    return dayjs(date).format('MMMM D, YYYY');
  };

  const getRoleDisplay = (role) => {
    return t(`roles.${role}`, role);
  };

  const getUserRolesDisplay = () => {
    if (!user) return t('profile.notSpecified');
    
    // Handle multi-role system
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles.map(role => getRoleDisplay(role)).join(', ');
    }
    
    // Fallback to single role
    if (user.role) {
      return getRoleDisplay(user.role);
    }
    
    return t('profile.notSpecified');
  };

  const getGenderDisplay = (gender) => {
    if (!gender) return t('profile.notSpecified');
    return t(`profile.genderOptions.${gender}`, gender);
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BackButton to="/dashboard" sx={{ mr: 2 }} />
        <Typography variant="h4">
          {t('profile.title')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', position: 'relative' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Avatar Section */}
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={getAvatarUrl()}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '2rem',
                    bgcolor: 'primary.main',
                    margin: '0 auto',
                  }}
                >
                  {user.profile.firstName?.[0]}{user.profile.lastName?.[0]}
                </Avatar>
                
                {/* Avatar Upload Button */}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarUpload}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      boxShadow: 2,
                    }}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PhotoCameraIcon fontSize="small" />
                    )}
                  </IconButton>
                </label>
              </Box>

              {/* Basic Info */}
              <Typography variant="h5" gutterBottom>
                {user.profile.firstName} {user.profile.lastName}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
                {user.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
                  user.roles.map((role, index) => (
                    <Chip
                      key={index}
                      label={getRoleDisplay(role)}
                      color="primary"
                      size="small"
                    />
                  ))
                ) : (
                  <Chip
                    label={getRoleDisplay(user.role)}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {t('profile.memberSince')} {formatDate(user.createdAt)}
              </Typography>

              {user.isEmailVerified ? (
                <Chip label={t('profile.emailVerified')} color="success" size="small" />
              ) : (
                <Chip label={t('profile.emailNotVerified')} color="warning" size="small" />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Information */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Contact Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      {t('profile.contactInformation')}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => setEditDialogOpen(true)}
                    >
                      {t('profile.editProfile')}
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {t('profile.email')}
                          </Typography>
                          <Typography variant="body1">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {t('profile.phone')}
                          </Typography>
                          <Typography variant="body1">
                            {user.contact?.phone || t('profile.notProvided')}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {t('profile.dateOfBirth')}
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(user.profile?.dateOfBirth)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {t('profile.gender')}
                          </Typography>
                          <Typography variant="body1">
                            {getGenderDisplay(user.profile?.gender)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {user.contact?.address && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                          <LocationIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {t('profile.address')}
                            </Typography>
                            <Typography variant="body1">
                              {[
                                user.contact.address.street,
                                user.contact.address.city,
                                user.contact.address.state,
                                user.contact.address.country,
                                user.contact.address.zipCode,
                              ].filter(Boolean).join(', ') || t('profile.notProvided')}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Security Settings */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SecurityIcon sx={{ mr: 1 }} />
                    {t('profile.security')}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SecurityIcon />}
                    onClick={() => setPasswordDialogOpen(true)}
                    sx={{ mb: 1 }}
                  >
                    {t('profile.changePassword')}
                  </Button>

                  {user.lastLogin && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      {t('profile.lastLogin')}: {formatDate(user.lastLogin)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Notification Settings */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NotificationsIcon sx={{ mr: 1 }} />
                    {t('profile.accountSettings')}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SettingsIcon />}
                    onClick={() => setNotificationSettingsOpen(true)}
                  >
                    {t('profile.manageNotifications')}
                  </Button>

                  {user.preferences?.notifications && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Email: {user.preferences.notifications.email ? 'Enabled' : 'Disabled'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        SMS: {user.preferences.notifications.sms ? 'Enabled' : 'Disabled'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Push: {user.preferences.notifications.push ? 'Enabled' : 'Disabled'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Language Preferences */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LanguageIcon sx={{ mr: 1 }} />
                    {t('profile.languagePreferences')}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {t('profile.choosePreferredLanguage')}
                    </Typography>
                  </Box>
                  
                  <LanguageSwitcher variant="button" />
                  
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: 'info.contrastText' }}>
                      💡 {t('profile.currentLanguage')}: {i18n.language === 'si' ? 'සිංහල (Sinhala)' : 'English'}
                      <br />
                      {t('profile.changesApplyImmediately')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <ProfileEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        user={user}
        onUpdate={updateProfile}
      />

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />

      <NotificationSettings
        open={notificationSettingsOpen}
        onClose={() => setNotificationSettingsOpen(false)}
        user={user}
        onUpdate={updateProfile}
      />
    </Box>
  );
};

const ProfilePage = () => {
  return (
    <Layout>
      <PrivateRoute>
        <ProfileContent />
      </PrivateRoute>
    </Layout>
  );
};

export default ProfilePage;
