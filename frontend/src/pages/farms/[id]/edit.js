import React, { useState, useEffect, useCallback } from 'react';
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
import BackButton from '../../../components/BackButton';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { farmAPI } from '../../../services/api';
import { toast } from 'react-toastify';
import { SRI_LANKAN_DISTRICTS, getZoneDescription, getDistrictZone } from '../../../constants/districts';

const EditFarmContent = ({ farmId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const loadFarm = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await farmAPI.getFarm(farmId);
      const farm = response.data.data;
      
      setFormData({
        name: farm.name || '',
        description: farm.description || '',
        farmType: farm.farmType || '',
        district: farm.district || farm.location?.district || '',
  cultivationZone: farm.cultivationZone || farm.location?.cultivationZone || getDistrictZone(farm.district || farm.location?.district) || '',
        location: {
          address: farm.location?.address || '',
          country: 'Sri Lanka',
          zipCode: farm.location?.zipCode || '',
          coordinates: {
            latitude: farm.location?.coordinates?.latitude || '',
            longitude: farm.location?.coordinates?.longitude || ''
          }
        },
        totalArea: {
          value: farm.totalArea?.value || farm.totalArea || '',
          unit: farm.totalArea?.unit || 'acres'
        },
        cultivatedArea: {
          value: farm.cultivatedArea?.value || farm.cultivatedArea || '',
          unit: farm.cultivatedArea?.unit || 'acres'
        }
      });
    } catch (err) {
      console.error('Error loading farm:', err);
      setError('Failed to load farm details');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    if (farmId) {
      loadFarm();
    }
  }, [farmId, loadFarm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
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

    // Auto-populate cultivation zone when district changes
    if (name === 'district') {
      const zoneCode = getDistrictZone(value);
      setFormData(prev => ({
        ...prev,
        cultivationZone: zoneCode || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      
      // Validate required fields
      if (!formData.totalArea.value || formData.totalArea.value <= 0) {
        setError('Total area value is required and must be greater than 0');
        return;
      }
      
      // Prepare data for submission
      const submitData = {
        name: formData.name,
        description: formData.description,
        farmType: formData.farmType,
        district: formData.district,
        cultivationZone: formData.cultivationZone,
        location: {
          address: formData.location.address || formData.district || 'Not specified',
          country: formData.location.country,
          zipCode: formData.location.zipCode,
          ...(formData.location.coordinates.latitude && formData.location.coordinates.longitude ? {
            coordinates: {
              latitude: Number(formData.location.coordinates.latitude),
              longitude: Number(formData.location.coordinates.longitude)
            }
          } : {})
        },
        totalArea: {
          value: Number(formData.totalArea.value) || 0,
          unit: formData.totalArea.unit || 'acres'
        },
        cultivatedArea: {
          value: formData.cultivatedArea.value ? Number(formData.cultivatedArea.value) : 0,
          unit: formData.cultivatedArea.unit || 'acres'
        }
      };

      await farmAPI.updateFarm(farmId, submitData);
      toast.success('Farm updated successfully');
      navigate(`/farms/${farmId}`);
      
    } catch (err) {
      console.error('Error updating farm:', err);
      setError(err.response?.data?.message || 'Failed to update farm');
      toast.error('Failed to update farm');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/farms/${farmId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <BackButton to={`/farms/${farmId}`} sx={{ mr: 2 }}>
          {t('common.back')}
        </BackButton>
        <Typography variant="h4" component="h1">
          {t('farms.editFarm')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {t('farms.basicInformation')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('farms.farmName')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('farms.farmType')}</InputLabel>
                <Select
                  name="farmType"
                  value={formData.farmType}
                  label={t('farms.farmType')}
                  onChange={handleChange}
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

            {/* Location Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('farms.locationInformation')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('farms.district')}</InputLabel>
                <Select
                  name="district"
                  value={formData.district}
                  label={t('farms.district')}
                  onChange={handleChange}
                >
                  {SRI_LANKAN_DISTRICTS.map((district) => (
                    <MenuItem key={district.name} value={district.name}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('farms.cultivationZone')}
                name="cultivationZone"
                value={formData.cultivationZone}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                helperText={
                  formData.cultivationZone ? getZoneDescription(formData.cultivationZone) : t('farms.selectDistrictFirst')
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('farms.address')}
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('farms.zipCode')}
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
              />
            </Grid> */}

            {/* Area Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('farms.areaInformation')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('farms.totalAreaValue')}
                name="totalArea.value"
                type="number"
                value={formData.totalArea.value}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth required>
                <InputLabel>{t('farms.unit')}</InputLabel>
                <Select
                  name="totalArea.unit"
                  value={formData.totalArea.unit}
                  label={t('farms.unit')}
                  onChange={handleChange}
                >
                  <MenuItem value="acres">{t('farms.units.acres')}</MenuItem>
                  <MenuItem value="hectares">{t('farms.units.hectares')}</MenuItem>
                  <MenuItem value="sq meters">{t('farms.units.sqMeters')}</MenuItem>
                  <MenuItem value="sq feet">{t('farms.units.sqFeet')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
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

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>{t('farms.unit')}</InputLabel>
                <Select
                  name="cultivatedArea.unit"
                  value={formData.cultivatedArea.unit}
                  label={t('farms.unit')}
                  onChange={handleChange}
                >
                  <MenuItem value="acres">{t('farms.units.acres')}</MenuItem>
                  <MenuItem value="hectares">{t('farms.units.hectares')}</MenuItem>
                  <MenuItem value="sq meters">{t('farms.units.sqMeters')}</MenuItem>
                  <MenuItem value="sq feet">{t('farms.units.sqFeet')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>



            {/* Coordinates */}
            {/* <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('farms.coordinatesOptional')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('farms.latitude')}
                name="location.coordinates.latitude"
                type="number"
                value={formData.location.coordinates.latitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('farms.longitude')}
                name="location.coordinates.longitude"
                type="number"
                value={formData.location.coordinates.longitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
              />
            </Grid> */}

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  {t('farms.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} /> : t('farms.updateFarm')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

const EditFarm = (props) => {
  return (
    <AppProviders>
      <Layout>
        <EditFarmContent farmId={props.params?.id} />
      </Layout>
    </AppProviders>
  );
};

export default EditFarm;
