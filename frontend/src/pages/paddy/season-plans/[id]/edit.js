import React, { useState, useEffect } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { navigate } from 'gatsby';
import Layout from '../../../../components/Layout/Layout';
import AppProviders from '../../../../providers/AppProviders';
import { seasonPlanAPI, paddyVarietyAPI, farmAPI } from '../../../../services/api';
import { toast } from 'react-toastify';

const EditSeasonPlanContent = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [paddyVarieties, setPaddyVarieties] = useState([]);
  const [farms, setFarms] = useState([]);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState(null);

  const [formData, setFormData] = useState({
    farmId: '',
    season: '',
    climateZone: '',
    irrigationMethod: '',
    soilCondition: '',
    paddyVariety: '',
    cultivatingArea: '',
    cultivationDate: null, // Change to null for DatePicker
    status: '',
  });

  const loadSeasonPlan = async () => {
    try {
      const response = await seasonPlanAPI.getSeasonPlan(id);
      const planData = response.data.data;
      setPlan(planData);
      
      // Convert date to dayjs object for DatePicker
      const cultivationDate = dayjs(planData.cultivationDate);
      
      setFormData({
        farmId: planData.farmId._id,
        season: planData.season,
        climateZone: planData.climateZone,
        irrigationMethod: planData.irrigationMethod,
        soilCondition: planData.soilCondition,
        paddyVariety: planData.paddyVariety._id,
        cultivatingArea: planData.cultivatingArea.toString(),
        cultivationDate: cultivationDate,
        status: planData.status,
      });
    } catch (error) {
      console.error('Error loading season plan:', error);
      setError('Failed to load season plan');
      toast.error('Failed to load season plan');
    } finally {
      setLoadingData(false);
    }
  };

  const loadPaddyVarieties = async () => {
    try {
      const response = await paddyVarietyAPI.getPaddyVarieties();
      setPaddyVarieties(response.data.data || []);
    } catch (error) {
      console.error('Error loading paddy varieties:', error);
      toast.error('Failed to load paddy varieties');
    }
  };

  const loadFarms = async () => {
    try {
      const response = await farmAPI.getFarms();
      setFarms(response.data.data || []);
    } catch (error) {
      console.error('Error loading farms:', error);
      toast.error('Failed to load farms');
    }
  };

  useEffect(() => {
    if (id) {
      loadSeasonPlan();
      loadPaddyVarieties();
      loadFarms();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Auto-populate climate zone when farm changes
    if (name === 'farmId') {
      const selectedFarmData = farms.find(farm => farm._id === value);
      if (selectedFarmData) {
        setFormData(prev => ({
          ...prev,
          climateZone: selectedFarmData.cultivationZone || '',
        }));
      }
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      cultivationDate: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      const requiredFields = ['farmId', 'season', 'climateZone', 'irrigationMethod', 'soilCondition', 'paddyVariety', 'cultivatingArea'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError('Please fill in all required fields');
        return;
      }

      if (!formData.cultivationDate) {
        setError('Please select a cultivation date');
        return;
      }

      // Convert cultivatingArea to number and date to ISO string
      const planData = {
        ...formData,
        cultivatingArea: parseFloat(formData.cultivatingArea),
        cultivationDate: formData.cultivationDate ? dayjs(formData.cultivationDate).toISOString() : null,
      };

      console.log('Updating season plan data:', planData);

      await seasonPlanAPI.updateSeasonPlan(id, planData);
      toast.success('Season plan updated successfully!');
      navigate(`/paddy/season-plans/${id}`);
    } catch (err) {
      console.error('Season plan update error:', err);
      console.error('Error response:', err.response);
      
      let message = 'Failed to update season plan';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.errors) {
        message = err.response.data.errors.map(e => e.msg).join(', ');
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading season plan...</Typography>
      </Box>
    );
  }

  if (error && !plan) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/paddy/season-plans')}
          sx={{ mt: 2 }}
        >
          Back to Season Plans
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/paddy/season-plans/${id}`)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" gutterBottom>
            Edit Season Plan
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Update your paddy cultivation season plan
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Farm Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Farm *</InputLabel>
                <Select
                  name="farmId"
                  value={formData.farmId}
                  onChange={handleChange}
                  label="Farm *"
                >
                  {farms.map(farm => (
                    <MenuItem key={farm._id} value={farm._id}>
                      {farm.name} ({farm.district})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Season */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Season *</InputLabel>
                <Select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  label="Season *"
                >
                  <MenuItem value="maha">Maha (October - March)</MenuItem>
                  <MenuItem value="yala">Yala (April - September)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status *</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status *"
                >
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Climate Zone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Climate Zone *"
                name="climateZone"
                value={formData.climateZone}
                onChange={handleChange}
                required
                helperText="Auto-populated from selected farm"
              />
            </Grid>

            {/* Irrigation Method */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Irrigation Method *</InputLabel>
                <Select
                  name="irrigationMethod"
                  value={formData.irrigationMethod}
                  onChange={handleChange}
                  label="Irrigation Method *"
                >
                  <MenuItem value="Rain fed">Rain fed</MenuItem>
                  <MenuItem value="Under irrigation">Under irrigation</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Soil Condition */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Soil Condition *</InputLabel>
                <Select
                  name="soilCondition"
                  value={formData.soilCondition}
                  onChange={handleChange}
                  label="Soil Condition *"
                >
                  <MenuItem value="Sandy">Sandy</MenuItem>
                  <MenuItem value="Clay">Clay</MenuItem>
                  <MenuItem value="Loam">Loam</MenuItem>
                  <MenuItem value="Sandy Loam">Sandy Loam</MenuItem>
                  <MenuItem value="Clay Loam">Clay Loam</MenuItem>
                  <MenuItem value="Silt Loam">Silt Loam</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Paddy Variety */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Paddy Variety *</InputLabel>
                <Select
                  name="paddyVariety"
                  value={formData.paddyVariety}
                  onChange={handleChange}
                  label="Paddy Variety *"
                >
                  {paddyVarieties.map(variety => (
                    <MenuItem key={variety._id} value={variety._id}>
                      {variety.name} ({variety.type} - {variety.duration})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Cultivating Area */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cultivating Area (acres) *"
                name="cultivatingArea"
                type="number"
                value={formData.cultivatingArea}
                onChange={handleChange}
                required
                inputProps={{ min: 0.1, step: 0.1 }}
                helperText="Minimum 0.1 acres"
              />
            </Grid>

            {/* Cultivation Date */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Cultivation Date *"
                  value={formData.cultivationDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: "Select cultivation date"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/paddy/season-plans/${id}`)}
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
              {loading ? 'Updating...' : 'Update Season Plan'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const EditSeasonPlan = ({ params }) => {
  return (
    <AppProviders>
      <Layout>
        <EditSeasonPlanContent id={params?.id} />
      </Layout>
    </AppProviders>
  );
};

export default EditSeasonPlan;
