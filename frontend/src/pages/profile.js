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
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import Layout from '../components/Layout/Layout';
import PrivateRoute from '../components/PrivateRoute';
import ProfileEditDialog from '../components/ProfileEditDialog';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import NotificationSettings from '../components/NotificationSettings';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const ProfileContent = () => {
  console.log('ProfileContent component rendering');
  const { user, updateProfile } = useAuth();
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
    if (!date) return 'Not specified';
    return dayjs(date).format('MMMM D, YYYY');
  };

  const getRoleDisplay = (role) => {
    const roleLabels = {
      admin: 'Administrator',
      expert: 'Agricultural Expert',
      farm_owner: 'Farm Owner',
      farm_manager: 'Farm Manager',
      worker: 'Farm Worker',
      viewer: 'Viewer',
    };
    return roleLabels[role] || role;
  };

  const getGenderDisplay = (gender) => {
    const genderLabels = {
      male: 'Male',
      female: 'Female',
      other: 'Other',
      prefer_not_to_say: 'Prefer not to say',
    };
    return genderLabels[gender] || 'Not specified';
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">
          My Profile
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
              
              <Chip
                label={getRoleDisplay(user.role)}
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Member since {formatDate(user.createdAt)}
              </Typography>

              {user.isEmailVerified ? (
                <Chip label="Email Verified" color="success" size="small" />
              ) : (
                <Chip label="Email Not Verified" color="warning" size="small" />
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
                      Contact Information
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => setEditDialogOpen(true)}
                    >
                      Edit Profile
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Email
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
                            Phone
                          </Typography>
                          <Typography variant="body1">
                            {user.contact?.phone || 'Not provided'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Date of Birth
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
                            Gender
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
                              Address
                            </Typography>
                            <Typography variant="body1">
                              {[
                                user.contact.address.street,
                                user.contact.address.city,
                                user.contact.address.state,
                                user.contact.address.country,
                                user.contact.address.zipCode,
                              ].filter(Boolean).join(', ') || 'Not provided'}
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
                    Security
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SecurityIcon />}
                    onClick={() => setPasswordDialogOpen(true)}
                    sx={{ mb: 1 }}
                  >
                    Change Password
                  </Button>

                  {user.lastLogin && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Last login: {formatDate(user.lastLogin)}
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
                    Notifications
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SettingsIcon />}
                    onClick={() => setNotificationSettingsOpen(true)}
                  >
                    Manage Notifications
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
