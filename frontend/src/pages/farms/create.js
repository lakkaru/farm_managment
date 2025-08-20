import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { navigate } from 'gatsby';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { farmAPI } from '../../services/api';
import { toast } from 'react-toastify';

const CreateFarmContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    farmType: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'Sri Lanka',
      zipCode: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    area: {
      total: '',
      cultivated: '',
      unit: 'acres'
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.farmType || !formData.location.city) {
        setError('Please fill in all required fields');
        return;
      }

      // Transform form data to match backend model
      const farmData = {
        name: formData.name,
        description: formData.description,
        farmType: formData.farmType,
        location: {
          address: formData.location.address || formData.location.city, // Use city as address if address is empty
          city: formData.location.city,
          state: formData.location.state || 'N/A', // Provide default if empty
          country: formData.location.country,
          zipCode: formData.location.zipCode || '00000', // Provide default if empty
          coordinates: {
            latitude: formData.location.coordinates.latitude ? parseFloat(formData.location.coordinates.latitude) : undefined,
            longitude: formData.location.coordinates.longitude ? parseFloat(formData.location.coordinates.longitude) : undefined
          }
        },
        totalArea: {
          value: formData.area.total ? parseFloat(formData.area.total) : 0,
          unit: formData.area.unit
        }
      };

      // Remove undefined coordinates if not provided
      if (!farmData.location.coordinates.latitude || !farmData.location.coordinates.longitude) {
        delete farmData.location.coordinates;
      }

      await farmAPI.createFarm(farmData);
      toast.success('Farm created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Farm creation error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      let message = 'Failed to create farm';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          message = 'Please log in again. Your session may have expired.';
        } else if (err.response.status === 403) {
          if (err.response.data?.message?.includes('role undefined')) {
            message = 'Account setup incomplete. Please log out and log in again.';
          } else {
            message = 'You do not have permission to create farms. Please contact your administrator.';
          }
        } else if (err.response.data?.message) {
          message = err.response.data.message;
        }
      } else if (err.request) {
        // Network error - no response received
        message = 'Network error. Please check your connection and try again.';
        console.error('Network error - no response received');
      } else {
        // Other error
        message = err.message || 'An unexpected error occurred';
      }
      
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Create New Farm
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Add a new farm to your management system
      </Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Farm Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Farm Type *</InputLabel>
                <Select
                  name="farmType"
                  value={formData.farmType}
                  onChange={handleChange}
                  label="Farm Type *"
                  required
                >
                  <MenuItem value="crop">Crop Farm</MenuItem>
                  <MenuItem value="livestock">Livestock Farm</MenuItem>
                  <MenuItem value="mixed">Mixed Farm</MenuItem>
                  <MenuItem value="organic">Organic Farm</MenuItem>
                  <MenuItem value="dairy">Dairy Farm</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Location
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City *"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State/Province"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude (Optional)"
                name="location.coordinates.latitude"
                type="number"
                value={formData.location.coordinates.latitude}
                onChange={handleChange}
                placeholder="e.g., 6.9271"
                inputProps={{ step: "any" }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude (Optional)"
                name="location.coordinates.longitude"
                type="number"
                value={formData.location.coordinates.longitude}
                onChange={handleChange}
                placeholder="e.g., 79.8612"
                inputProps={{ step: "any" }}
              />
            </Grid>

            {/* Area Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Area Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Area"
                name="area.total"
                type="number"
                value={formData.area.total}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cultivated Area"
                name="area.cultivated"
                type="number"
                value={formData.area.cultivated}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="area.unit"
                  value={formData.area.unit}
                  onChange={handleChange}
                  label="Unit"
                >
                  <MenuItem value="acres">Acres</MenuItem>
                  <MenuItem value="hectares">Hectares</MenuItem>
                  <MenuItem value="square_meters">Square Meters</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Creating...' : 'Create Farm'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

const CreateFarm = () => {
  return (
    <AppProviders>
      <Layout>
        <CreateFarmContent />
      </Layout>
    </AppProviders>
  );
};

export default CreateFarm;
