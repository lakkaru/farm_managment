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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { farmAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { SRI_LANKAN_DISTRICTS, getZoneDescription } from '../../constants/districts';

const CreateFarmContent = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    farmType: '',
    district: '',
    cultivationZone: '',
    location: {
      address: '',
      country: 'Sri Lanka',
      zipCode: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    totalArea: {
      value: '',
      unit: 'acres'
    },
    cultivatedArea: {
      value: '',
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
      
      // Auto-populate cultivation zone when district changes
      if (name === 'district') {
        const selectedDistrict = SRI_LANKAN_DISTRICTS.find(d => d.name === value);
        if (selectedDistrict) {
          setFormData(prev => ({
            ...prev,
            cultivationZone: selectedDistrict.zone
          }));
        }
      }
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.farmType || !formData.district || !formData.totalArea.value) {
        setError('Please fill in all required fields');
        return;
      }

      // Transform form data to match backend model
      const farmData = {
        name: formData.name,
        description: formData.description,
        farmType: formData.farmType,
        district: formData.district,
        cultivationZone: formData.cultivationZone,
        location: {
          address: formData.location.address || formData.district, // Use district as address if address is empty
          country: formData.location.country,
          zipCode: formData.location.zipCode || '00000', // Provide default if empty
          coordinates: {
            latitude: formData.location.coordinates.latitude ? parseFloat(formData.location.coordinates.latitude) : undefined,
            longitude: formData.location.coordinates.longitude ? parseFloat(formData.location.coordinates.longitude) : undefined
          }
        },
        totalArea: {
          value: formData.totalArea.value ? parseFloat(formData.totalArea.value) : 0,
          unit: formData.totalArea.unit
        },
        cultivatedArea: {
          value: formData.cultivatedArea.value ? parseFloat(formData.cultivatedArea.value) : undefined,
          unit: formData.cultivatedArea.unit
        }
      };

      // Remove undefined coordinates if not provided
      if (!farmData.location.coordinates.latitude || !farmData.location.coordinates.longitude) {
        delete farmData.location.coordinates;
      }

      console.log('Sending farm data:', JSON.stringify(farmData, null, 2));
      
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
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/farms')}
          sx={{ mr: 2 }}
        >
          {t('common.back')}
        </Button>
        <Typography variant="h4" gutterBottom>
          {t('farms.createNewFarm')}
        </Typography>
      </Box>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        {t('farms.addNewFarmDescription')}
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
                {t('farms.basicInformation')}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t('farms.farmName')} *`}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{`${t('farms.farmType')} *`}</InputLabel>
                <Select
                  name="farmType"
                  value={formData.farmType}
                  onChange={handleChange}
                  label={`${t('farms.farmType')} *`}
                  required
                >
                  <MenuItem value="crop">{t('farms.farmTypes.crop')}</MenuItem>
                  <MenuItem value="livestock">{t('farms.farmTypes.livestock')}</MenuItem>
                  <MenuItem value="mixed">{t('farms.farmTypes.mixed')}</MenuItem>
                  <MenuItem value="aquaculture">{t('farms.farmTypes.aquaculture')}</MenuItem>
                  <MenuItem value="poultry">{t('farms.farmTypes.poultry')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('farms.description')}
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
                {t('farms.locationInformation')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('farms.address')}
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{`${t('farms.district')} *`}</InputLabel>
                <Select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  label={`${t('farms.district')} *`}
                  required
                >
                  {SRI_LANKAN_DISTRICTS.map(district => (
                    <MenuItem key={district.name} value={district.name}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('farms.cultivationZone')}
                name="cultivationZone"
                value={getZoneDescription(formData.cultivationZone)}
                InputProps={{ readOnly: true }}
                helperText={t('farms.selectDistrictFirst')}
              />
            </Grid>

            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('farms.zipCode')}
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t('farms.latitude')} (${t('common.optional')})`}
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
                label={`${t('farms.longitude')} (${t('common.optional')})`}
                name="location.coordinates.longitude"
                type="number"
                value={formData.location.coordinates.longitude}
                onChange={handleChange}
                placeholder="e.g., 79.8612"
                inputProps={{ step: "any" }}
              />
            </Grid> */}

            {/* Area Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('farms.areaInformation')}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={`${t('farms.totalAreaValue')} *`}
                name="totalArea.value"
                type="number"
                value={formData.totalArea.value}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth required>
                <InputLabel>{t('farms.unit')}</InputLabel>
                <Select
                  name="totalArea.unit"
                  value={formData.totalArea.unit}
                  onChange={handleChange}
                  label={t('farms.unit')}
                >
                  <MenuItem value="acres">{t('farms.units.acres')}</MenuItem>
                  <MenuItem value="hectares">{t('farms.units.hectares')}</MenuItem>
                  <MenuItem value="sq meters">{t('farms.units.sqMeters')}</MenuItem>
                  <MenuItem value="sq feet">{t('farms.units.sqFeet')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={t('farms.cultivatedAreaValue')}
                name="cultivatedArea.value"
                type="number"
                value={formData.cultivatedArea.value}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>{t('farms.unit')}</InputLabel>
                <Select
                  name="cultivatedArea.unit"
                  value={formData.cultivatedArea.unit}
                  onChange={handleChange}
                  label={t('farms.unit')}
                >
                  <MenuItem value="acres">{t('farms.units.acres')}</MenuItem>
                  <MenuItem value="hectares">{t('farms.units.hectares')}</MenuItem>
                  <MenuItem value="sq meters">{t('farms.units.sqMeters')}</MenuItem>
                  <MenuItem value="sq feet">{t('farms.units.sqFeet')}</MenuItem>
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
                  {t('farms.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? t('farms.creating') : t('farms.createFarmButton')}
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
