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
import BackButton from '../../../../components/BackButton';
import { navigate } from 'gatsby';
import Layout from '../../../../components/Layout/Layout';
import AppProviders from '../../../../providers/AppProviders';
import { seasonPlanAPI, paddyVarietyAPI, farmAPI } from '../../../../services/api';
import { useTranslation } from 'react-i18next';
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
    irrigationMethod: '',
    paddyVariety: '',
    cultivatingArea: '',
    cultivationDate: null, // Change to null for DatePicker
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
        irrigationMethod: planData.irrigationMethod,
        paddyVariety: planData.paddyVariety._id,
        cultivatingArea: planData.cultivatingArea.toString(),
        cultivationDate: cultivationDate,
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

  const { t, i18n } = useTranslation();

  const slugify = (s) => {
    if (!s) return '';
    return s.toString().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
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

    // Note: climateZone is derived from farm on create and is not editable here
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
  // Validate required fields (climateZone is derived from farm and not editable here)
  const requiredFields = ['farmId', 'season', 'irrigationMethod', 'paddyVariety', 'cultivatingArea'];
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
      // Build a safe payload that excludes non-editable fields like climateZone and status
      const planData = {
        farmId: formData.farmId,
        season: formData.season,
        irrigationMethod: formData.irrigationMethod,
        paddyVariety: formData.paddyVariety,
        cultivatingArea: parseFloat(formData.cultivatingArea),
        cultivationDate: formData.cultivationDate ? dayjs(formData.cultivationDate).toISOString() : null,
      };

      console.log('Updating season plan data (safe payload):', planData);

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
        <BackButton to="/paddy/season-plans" sx={{ mt: 2 }}>
          {t('seasonPlans.viewPage.backToList')}
        </BackButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BackButton to={`/paddy/season-plans/${id}`} sx={{ mr: 2 }}>
          {t('common.back')}
        </BackButton>
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('seasonPlans.editSeasonPlan')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('seasonPlans.manageSeasonPlans')}
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
                <InputLabel>{t('seasonPlans.createForm.farmRequired')}</InputLabel>
                <Select
                  name="farmId"
                  value={formData.farmId}
                  onChange={handleChange}
                  label={t('seasonPlans.createForm.farmRequired')}
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
                <InputLabel>{t('seasonPlans.createForm.seasonRequired')}</InputLabel>
                <Select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  label={t('seasonPlans.createForm.seasonRequired')}
                >
                  <MenuItem value="maha">{t('seasonPlans.maha')}</MenuItem>
                  <MenuItem value="yala">{t('seasonPlans.yala')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* status removed from edit form - status changes handled elsewhere */}

            {/* climateZone removed from edit form (derived from farm on create) */}

            {/* Irrigation Method */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('seasonPlans.createForm.irrigationMethodRequired')}</InputLabel>
                <Select
                  name="irrigationMethod"
                  value={formData.irrigationMethod}
                  onChange={handleChange}
                  label={t('seasonPlans.createForm.irrigationMethodRequired')}
                >
                  <MenuItem value="Rain fed">{t('seasonPlans.irrigationMethods.rainfed')}</MenuItem>
                  <MenuItem value="Under irrigation">{t('seasonPlans.irrigationMethods.irrigated')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Soil Condition removed per product decision */}

            {/* Paddy Variety */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('seasonPlans.createForm.paddyVarietyRequired')}</InputLabel>
                <Select
                  name="paddyVariety"
                  value={formData.paddyVariety}
                  onChange={handleChange}
                  label={t('seasonPlans.createForm.paddyVarietyRequired')}
                >
                  {paddyVarieties.map(variety => (
                    <MenuItem key={variety._id} value={variety._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {t(`paddyVarieties.names.${slugify(variety.name)}`, { defaultValue: variety.name })}
                        {variety.popularName ? ` (${t(`paddyVarieties.descriptions.${slugify(variety.popularName)}`, { defaultValue: variety.popularName })})` : ''}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {variety.durationMonths ? `${variety.durationMonths} ${t('paddyVarieties.monthsUnit')} (${Math.round(variety.durationDays)} ${t('paddyVarieties.daysUnit')})` : (variety.duration || '')}
                        {((variety.characteristics?.grainQuality?.pericarpColour) || (variety.characteristics?.pericarpColour)) ? ` • ${t('paddyVarieties.grainColorLabel')} ${t(`paddyVarieties.colors.${slugify(variety.characteristics?.grainQuality?.pericarpColour || variety.characteristics?.pericarpColour)}`, { defaultValue: variety.characteristics?.grainQuality?.pericarpColour || variety.characteristics?.pericarpColour })}` : ''}
                        {((variety.characteristics?.grainQuality?.grainShape) || (variety.characteristics?.grainShape)) ? ` • ${t('paddyVarieties.grainSizeLabel')} ${t(`paddyVarieties.grainSizes.${slugify(variety.characteristics?.grainQuality?.grainShape || variety.characteristics?.grainShape)}`, { defaultValue: variety.characteristics?.grainQuality?.grainShape || variety.characteristics?.grainShape })}` : ''}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Cultivating Area */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('seasonPlans.createForm.cultivatingAreaRequired', { unit: 'acres' })}
                name="cultivatingArea"
                type="number"
                value={formData.cultivatingArea}
                onChange={handleChange}
                required
                inputProps={{ min: 0.1, step: 0.1 }}
                helperText={t('seasonPlans.createForm.cultivatingAreaMinimum', { unit: 'acres' })}
              />
            </Grid>

            {/* Cultivation Date */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t('seasonPlans.createForm.cultivationDateRequired')}
                  value={formData.cultivationDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: t('seasonPlans.createForm.cultivationDateHelper')
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
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? t('seasonPlans.createForm.creating') : t('seasonPlans.updateSeasonPlan')}
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
