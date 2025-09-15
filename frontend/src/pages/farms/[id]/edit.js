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
import { navigate } from 'gatsby';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { farmAPI } from '../../../services/api';
import { toast } from 'react-toastify';
import { SRI_LANKAN_DISTRICTS, getZoneDescription } from '../../../constants/districts';

const EditFarmContent = ({ farmId }) => {
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
        cultivationZone: farm.cultivationZone || farm.location?.cultivationZone || '',
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
      const selectedDistrict = SRI_LANKAN_DISTRICTS.find(d => d.name === value);
      if (selectedDistrict) {
        setFormData(prev => ({
          ...prev,
          cultivationZone: selectedDistrict.cultivationZone
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      
      // Prepare data for submission
      const submitData = {
        name: formData.name,
        description: formData.description,
        farmType: formData.farmType,
        district: formData.district,
        cultivationZone: formData.cultivationZone,
        location: formData.location,
        totalArea: Number(formData.totalArea),
        cultivatedArea: Number(formData.cultivatedArea)
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
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Farm
      </Typography>

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
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Farm Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Farm Type</InputLabel>
                <Select
                  name="farmType"
                  value={formData.farmType}
                  label="Farm Type"
                  onChange={handleChange}
                >
                  <MenuItem value="crop">Crop Farm</MenuItem>
                  <MenuItem value="livestock">Livestock Farm</MenuItem>
                  <MenuItem value="mixed">Mixed Farm</MenuItem>
                  <MenuItem value="aquaculture">Aquaculture</MenuItem>
                  <MenuItem value="poultry">Poultry Farm</MenuItem>
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

            {/* Location Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Location Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>District</InputLabel>
                <Select
                  name="district"
                  value={formData.district}
                  label="District"
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
                label="Cultivation Zone"
                name="cultivationZone"
                value={formData.cultivationZone}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                helperText={
                  formData.district ? getZoneDescription(formData.district) : 'Select district first'
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Zip Code"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
              />
            </Grid>

            {/* Area Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Area Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Area Value"
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
                <InputLabel>Unit</InputLabel>
                <Select
                  name="totalArea.unit"
                  value={formData.totalArea.unit}
                  label="Unit"
                  onChange={handleChange}
                >
                  <MenuItem value="acres">Acres</MenuItem>
                  <MenuItem value="hectares">Hectares</MenuItem>
                  <MenuItem value="sq meters">Sq Meters</MenuItem>
                  <MenuItem value="sq feet">Sq Feet</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cultivated Area Value"
                name="cultivatedArea.value"
                type="number"
                value={formData.cultivatedArea.value}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="cultivatedArea.unit"
                  value={formData.cultivatedArea.unit}
                  label="Unit"
                  onChange={handleChange}
                >
                  <MenuItem value="acres">Acres</MenuItem>
                  <MenuItem value="hectares">Hectares</MenuItem>
                  <MenuItem value="sq meters">Sq Meters</MenuItem>
                  <MenuItem value="sq feet">Sq Feet</MenuItem>
                </Select>
              </FormControl>
            </Grid>



            {/* Coordinates */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Coordinates (Optional)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Latitude"
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
                label="Longitude"
                name="location.coordinates.longitude"
                type="number"
                value={formData.location.coordinates.longitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} /> : 'Update Farm'}
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
