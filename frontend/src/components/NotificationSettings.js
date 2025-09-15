import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  PhoneAndroid as PhoneIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const NotificationSettings = ({ open, onClose, user, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      // General notification preferences
      emailNotifications: user?.preferences?.notifications?.email ?? true,
      smsNotifications: user?.preferences?.notifications?.sms ?? false,
      pushNotifications: user?.preferences?.notifications?.push ?? true,
      
      // Specific notification types
      farmAlerts: user?.preferences?.notifications?.farmAlerts ?? true,
      weatherUpdates: user?.preferences?.notifications?.weatherUpdates ?? true,
      taskReminders: user?.preferences?.notifications?.taskReminders ?? true,
      inventoryAlerts: user?.preferences?.notifications?.inventoryAlerts ?? true,
      systemUpdates: user?.preferences?.notifications?.systemUpdates ?? false,
      marketingEmails: user?.preferences?.notifications?.marketingEmails ?? false,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const updateData = {
          preferences: {
            ...user.preferences,
            notifications: {
              email: values.emailNotifications,
              sms: values.smsNotifications,
              push: values.pushNotifications,
              farmAlerts: values.farmAlerts,
              weatherUpdates: values.weatherUpdates,
              taskReminders: values.taskReminders,
              inventoryAlerts: values.inventoryAlerts,
              systemUpdates: values.systemUpdates,
              marketingEmails: values.marketingEmails,
            },
          },
        };

        const response = await authAPI.updateProfile(updateData);
        
        // Update the auth context
        await onUpdate(response.data.data);
        
        toast.success('Notification preferences updated successfully!');
        onClose();
      } catch (error) {
        console.error('Notification settings update error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update notification settings';
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Notification Settings</Typography>
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
              Configure how you want to receive notifications from the farm management system.
            </Typography>
          </Alert>

          {/* Delivery Methods */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Methods
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive notifications via email"
                  />
                </Box>
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.emailNotifications}
                    onChange={(e) => formik.setFieldValue('emailNotifications', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <SmsIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Receive notifications via text message"
                  />
                </Box>
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.smsNotifications}
                    onChange={(e) => formik.setFieldValue('smsNotifications', e.target.checked)}
                    color="primary"
                    disabled={!user?.contact?.phone}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive notifications in your browser"
                  />
                </Box>
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.pushNotifications}
                    onChange={(e) => formik.setFieldValue('pushNotifications', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            {!user?.contact?.phone && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Add a phone number to your profile to enable SMS notifications.
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Notification Types */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Notification Types
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Farm Alerts"
                  secondary="Critical alerts about your farms (equipment failures, security issues, etc.)"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.farmAlerts}
                    onChange={(e) => formik.setFieldValue('farmAlerts', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Weather Updates"
                  secondary="Weather alerts and forecasts for your farm locations"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.weatherUpdates}
                    onChange={(e) => formik.setFieldValue('weatherUpdates', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Task Reminders"
                  secondary="Reminders for upcoming and overdue farm tasks"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.taskReminders}
                    onChange={(e) => formik.setFieldValue('taskReminders', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Inventory Alerts"
                  secondary="Low stock alerts and inventory management notifications"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.inventoryAlerts}
                    onChange={(e) => formik.setFieldValue('inventoryAlerts', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="System Updates"
                  secondary="System maintenance notifications and feature updates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.systemUpdates}
                    onChange={(e) => formik.setFieldValue('systemUpdates', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Marketing Emails"
                  secondary="Promotional offers and product announcements"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={formik.values.marketingEmails}
                    onChange={(e) => formik.setFieldValue('marketingEmails', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Box>

          {/* Summary */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              <strong>Summary:</strong> You will receive{' '}
              {[
                formik.values.emailNotifications && 'email',
                formik.values.smsNotifications && user?.contact?.phone && 'SMS',
                formik.values.pushNotifications && 'push'
              ].filter(Boolean).join(', ') || 'no'} notifications for{' '}
              {[
                formik.values.farmAlerts && 'farm alerts',
                formik.values.weatherUpdates && 'weather updates',
                formik.values.taskReminders && 'task reminders',
                formik.values.inventoryAlerts && 'inventory alerts',
                formik.values.systemUpdates && 'system updates',
                formik.values.marketingEmails && 'marketing emails'
              ].filter(Boolean).join(', ') || 'no notification types'}.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NotificationSettings;
