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
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import BackButton from '../../../components/BackButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { seasonPlanAPI, paddyVarietyAPI, farmAPI } from '../../../services/api';
import { useFarm } from '../../../contexts/FarmContext';
import { toast } from 'react-toastify';

const CreateSeasonPlanContent = () => {
  const { t, i18n } = useTranslation();

  // Dev-only: log current language and sample translations to help debug missing translations
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      // eslint-disable-next-line no-console
      console.debug('i18n language (create):', i18n?.language || window.i18next?.language || 'unknown');
      // eslint-disable-next-line no-console
      console.debug('transplantingDate translation (create):', t('seasonPlans.createForm.transplantingDate'));
    } catch (e) {
      // ignore
    }
  }
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [paddyVarieties, setPaddyVarieties] = useState([]);
  const [farms, setFarms] = useState([]);
  const [error, setError] = useState('');
  const { selectedFarm } = useFarm();

  const [formData, setFormData] = useState({
    farmId: '',
    season: '',
    irrigationMethod: '',
    plantingMethod: 'direct_seeding',
    paddyVariety: '',
    cultivatingArea: '',
    cultivationDate: null, // Change to null for DatePicker
    transplantingDate: null,
    expectedHarvestDate: null, // Add for bidirectional calculation
    soilP: '',
  });

  // Add state for calculation mode
  const [calculationMode, setCalculationMode] = useState('from-cultivation'); // 'from-cultivation' or 'from-harvest'

  // Display info from selected farm
  const [selectedFarmInfo, setSelectedFarmInfo] = useState({
    district: '',
    cultivationZone: '',
    totalArea: '',
    areaUnit: '',
  });

  const isFarmSelected = Boolean(formData.farmId);

  // Check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = [
      formData.farmId,
      formData.season,
      formData.irrigationMethod,
      formData.paddyVariety,
      formData.cultivatingArea,
      formData.cultivationDate,
      formData.expectedHarvestDate
    ];
    return requiredFields.every(field => field !== '' && field !== null && field !== undefined);
  };

  // Helper to slugify labels for i18n lookup (e.g. "Keeri Samba" -> "keeri_samba")
  const slugify = (s) => {
    if (!s) return '';
    return s.toString().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  };

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      await Promise.all([loadPaddyVarieties(), loadFarms()]);
      setDataLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFarm) {
      const farmArea = selectedFarm.totalArea?.value || '';
      const roundedArea = farmArea ? Math.round(parseFloat(farmArea) * 100) / 100 : '';
      // Only populate selectedFarmInfo for display — do not auto-fill form fields
      setSelectedFarmInfo({
        district: selectedFarm.district || '',
        cultivationZone: selectedFarm.cultivationZone || '',
        totalArea: roundedArea,
        areaUnit: selectedFarm.totalArea?.unit || 'acres',
      });
    }
  }, [selectedFarm]);

  const loadPaddyVarieties = async () => {
    try {
      console.log('Loading paddy varieties...');
      const response = await paddyVarietyAPI.getPaddyVarieties();
      console.log('Paddy varieties response:', response.data);
      console.log('First variety details:', response.data.data?.[0]);
      console.log('First variety duration:', response.data.data?.[0]?.duration);
      
      // Sort varieties by name first (A-Z), then by duration (ascending)
      const sortedVarieties = (response.data.data || []).sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name);
        if (nameCompare !== 0) return nameCompare;
        
        // Extract numeric duration for comparison
        const getDuration = (durationStr) => {
          const match = durationStr.match(/(\d+)(?:-(\d+))?/);
          if (match) {
            const min = parseInt(match[1]);
            const max = match[2] ? parseInt(match[2]) : min;
            return (min + max) / 2;
          }
          return 0;
        };
        
        return getDuration(a.duration) - getDuration(b.duration);
      });
      
      setPaddyVarieties(sortedVarieties);
    } catch (error) {
      console.error('Error loading paddy varieties:', error);
      toast.error(t('seasonPlans.failedToLoad'));
    }
  };

  const loadFarms = async () => {
    try {
      const response = await farmAPI.getFarms();
      setFarms(response.data.data || []);
    } catch (error) {
      console.error('Error loading farms:', error);
      toast.error(t('farms.failedToLoad'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // If plantingMethod changes away from transplanting, clear transplantingDate
      ...(name === 'plantingMethod' && value !== 'transplanting' ? { transplantingDate: null } : {}),
    }));

    // When farm is selected, update displayed farm info but do NOT auto-fill form fields
    if (name === 'farmId') {
      const selectedFarmData = farms.find(farm => farm._id === value);
      if (selectedFarmData) {
        const farmArea = selectedFarmData.totalArea?.value || '';
        const roundedArea = farmArea ? Math.round(parseFloat(farmArea) * 100) / 100 : '';
        setSelectedFarmInfo({
          district: selectedFarmData.district || '',
          cultivationZone: selectedFarmData.cultivationZone || '',
          totalArea: roundedArea,
          areaUnit: selectedFarmData.totalArea?.unit || 'acres',
        });
      }
    }

    // Recalculate dates when paddy variety changes
    if (name === 'paddyVariety') {
      if (calculationMode === 'from-cultivation' && formData.cultivationDate) {
        const harvestDate = calculateHarvestDate(formData.cultivationDate, value);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          expectedHarvestDate: harvestDate,
        }));
      } else if (calculationMode === 'from-harvest' && formData.expectedHarvestDate) {
        const cultivationDate = calculateCultivationDate(formData.expectedHarvestDate, value);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          cultivationDate: cultivationDate,
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

  // Handle cultivation date change
  const handleCultivationDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      cultivationDate: date,
    }));

    // If in cultivation mode, calculate harvest date
    if (calculationMode === 'from-cultivation' && date && formData.paddyVariety) {
      const harvestDate = calculateHarvestDate(date, formData.paddyVariety);
      setFormData(prev => ({
        ...prev,
        expectedHarvestDate: harvestDate,
      }));
    }
  };

  // Handle harvest date change
  const handleHarvestDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      expectedHarvestDate: date,
    }));

    // If in harvest mode, calculate cultivation date
    if (calculationMode === 'from-harvest' && date && formData.paddyVariety) {
      const cultivationDate = calculateCultivationDate(date, formData.paddyVariety);
      setFormData(prev => ({
        ...prev,
        cultivationDate: cultivationDate,
      }));
    }
  };

  // Handle calculation mode change
  const handleCalculationModeChange = (event, newMode) => {
    if (newMode !== null) {
      setCalculationMode(newMode);
      
      // Recalculate based on new mode
      if (newMode === 'from-cultivation' && formData.cultivationDate && formData.paddyVariety) {
        const harvestDate = calculateHarvestDate(formData.cultivationDate, formData.paddyVariety);
        setFormData(prev => ({
          ...prev,
          expectedHarvestDate: harvestDate,
        }));
      } else if (newMode === 'from-harvest' && formData.expectedHarvestDate && formData.paddyVariety) {
        const cultivationDate = calculateCultivationDate(formData.expectedHarvestDate, formData.paddyVariety);
        setFormData(prev => ({
          ...prev,
          cultivationDate: cultivationDate,
        }));
      }
    }
  };

  // Calculate harvest date from cultivation date
  const calculateHarvestDate = (cultivationDate, varietyId) => {
    const selectedVariety = paddyVarieties.find(v => v._id === varietyId);
    if (selectedVariety && selectedVariety.duration) {
      const durationMatch = selectedVariety.duration.match(/(\d+)(?:-(\d+))?/);
      if (durationMatch) {
        const minDuration = parseInt(durationMatch[1]);
        const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
        const avgDuration = (minDuration + maxDuration) / 2;
        
        return dayjs(cultivationDate).add(avgDuration, 'day');
      }
    }
    return null;
  };

  // Calculate cultivation date from harvest date
  const calculateCultivationDate = (harvestDate, varietyId) => {
    const selectedVariety = paddyVarieties.find(v => v._id === varietyId);
    if (selectedVariety && selectedVariety.duration) {
      const durationMatch = selectedVariety.duration.match(/(\d+)(?:-(\d+))?/);
      if (durationMatch) {
        const minDuration = parseInt(durationMatch[1]);
        const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
        const avgDuration = (minDuration + maxDuration) / 2;
        
        return dayjs(harvestDate).subtract(avgDuration, 'day');
      }
    }
    return null;
  };

  // Calculate first plowing date (typically 7-10 days before cultivation)
  const getFirstPlowingDate = () => {
    if (formData.cultivationDate) {
      return dayjs(formData.cultivationDate).subtract(21, 'day').format('MMM DD, YYYY');
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
  const requiredFields = ['farmId', 'season', 'irrigationMethod', 'paddyVariety', 'cultivatingArea'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError(t('seasonPlans.createForm.validation.fillAllFields'));
        return;
      }

      if (!formData.cultivationDate) {
        setError(t('seasonPlans.createForm.validation.selectCultivationDate'));
        return;
      }

      if (!formData.expectedHarvestDate) {
        setError(t('seasonPlans.createForm.validation.ensureBothDates'));
        return;
      }

      // Validate harvest date is after cultivation date
      if (dayjs(formData.expectedHarvestDate).isBefore(dayjs(formData.cultivationDate))) {
        setError(t('seasonPlans.createForm.validation.harvestAfterCultivation'));
        return;
      }

      // Validate season duration is reasonable (at least 60 days)
      const seasonDuration = dayjs(formData.expectedHarvestDate).diff(dayjs(formData.cultivationDate), 'day');
      if (seasonDuration < 60) {
        setError(t('seasonPlans.createForm.validation.minimumDuration'));
        return;
      }

      // Validate cultivating area doesn't exceed farm area
      if (selectedFarmInfo.totalArea && parseFloat(formData.cultivatingArea) > parseFloat(selectedFarmInfo.totalArea)) {
        // Add a small tolerance for floating point comparison (0.01 acres)
        const tolerance = 0.01;
        const cultivatingArea = parseFloat(formData.cultivatingArea);
        const farmArea = parseFloat(selectedFarmInfo.totalArea);
        
        if (cultivatingArea > (farmArea + tolerance)) {
          setError(t('seasonPlans.createForm.validation.areaExceedsLimit', { 
            total: selectedFarmInfo.totalArea, 
            unit: selectedFarmInfo.areaUnit 
          }));
          return;
        }
      }

      // Convert cultivatingArea to number and dates to ISO strings
      const planData = {
        ...formData,
        cultivatingArea: parseFloat(formData.cultivatingArea),
        cultivationDate: formData.cultivationDate ? dayjs(formData.cultivationDate).toISOString() : null,
        transplantingDate: formData.transplantingDate ? dayjs(formData.transplantingDate).toISOString() : undefined,
        plantingMethod: formData.plantingMethod,
        soilP: formData.soilP !== '' ? Number(formData.soilP) : undefined,
        expectedHarvest: {
          date: formData.expectedHarvestDate ? dayjs(formData.expectedHarvestDate).toISOString() : null,
        },
      };

      // Remove the frontend-only field
      delete planData.expectedHarvestDate;

      console.log('Sending season plan data:', planData);

      await seasonPlanAPI.createSeasonPlan(planData);
      toast.success(t('seasonPlans.seasonPlanCreated'));
      navigate('/paddy/season-plans');
    } catch (err) {
      console.error('Season plan creation error:', err);
      console.error('Error response:', err.response);
      
      let message = t('seasonPlans.failedToCreate');
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

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <BackButton to="/paddy/season-plans" sx={{ mr: 2 }}>
          {t('common.back')}
        </BackButton>
        <Typography variant="h4" gutterBottom>
          {t('seasonPlans.createForm.title')}
        </Typography>
      </Box>
      {/* Development-only visible i18n debug: helps verify runtime language and specific translation strings */}
      {process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block' }}>
            {`i18n.language (runtime): ${window.i18next?.language || 'unknown'}`}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            {`transplantingDateHelper => ${t('seasonPlans.createForm.transplantingDateHelper')}`}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            {`soilPHelper => ${t('seasonPlans.createForm.soilPHelper')}`}
          </Typography>
        </Alert>
      )}
      {/* <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        {t('seasonPlans.createForm.subtitle')}
      </Typography> */}

      {!selectedFarm && farms.length === 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('seasonPlans.createForm.noFarmsAvailable')}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Required fields note and asterisk styling: use MUI required prop and color the asterisk via a local selector */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{t('seasonPlans.basicInformation')}</Typography>
            <Alert severity="info" sx={{ mt: 1, py: 0.5 }}>
              <Typography variant="caption" sx={{ m: 0 }}>
                {t('forms.requiredFieldsNote')}
              </Typography>
            </Alert>
          </Box>

          <Box sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}>
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
                  disabled={!isFarmSelected}
                  label={t('seasonPlans.createForm.seasonRequired')}
                >
                  <MenuItem value="maha">{t('seasonPlans.maha')}</MenuItem>
                  <MenuItem value="yala">{t('seasonPlans.yala')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* District (Read-only) */}
            {selectedFarmInfo.district && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('seasonPlans.createForm.district')}
                  value={selectedFarmInfo.district}
                  InputProps={{ readOnly: true }}
                  disabled
                  helperText={t('seasonPlans.createForm.fromSelectedFarm')}
                />
              </Grid>
            )}

            {/* Climate Zone (Read-only) */}
            {selectedFarmInfo.cultivationZone && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('seasonPlans.createForm.climateZone')}
                  value={selectedFarmInfo.cultivationZone}
                  InputProps={{ readOnly: true }}
                  disabled
                  helperText={t('seasonPlans.createForm.fromSelectedFarm')}
                />
              </Grid>
            )}

            {/* Irrigation Method */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('seasonPlans.createForm.irrigationMethodRequired')}</InputLabel>
                <Select
                  name="irrigationMethod"
                  value={formData.irrigationMethod}
                  onChange={handleChange}
                  disabled={!isFarmSelected}
                  label={t('seasonPlans.createForm.irrigationMethodRequired')}
                >
                  <MenuItem value="Rain fed">{t('seasonPlans.irrigationMethods.rainfed')}</MenuItem>
                  <MenuItem value="Under irrigation">{t('seasonPlans.irrigationMethods.irrigated')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Planting Method */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('seasonPlans.createForm.plantingMethod')}</InputLabel>
                <Select
                  name="plantingMethod"
                  value={formData.plantingMethod}
                  onChange={handleChange}
                  disabled={!isFarmSelected}
                  label={t('seasonPlans.createForm.plantingMethod')}
                >
                  <MenuItem value="direct_seeding">{t('seasonPlans.createForm.plantingMethods.direct_seeding')}</MenuItem>
                  <MenuItem value="transplanting">{t('seasonPlans.createForm.plantingMethods.transplanting')}</MenuItem>
                  <MenuItem value="parachute_seeding">{t('seasonPlans.createForm.plantingMethods.parachute_seeding')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Soil Condition */}
            {/* Soil condition removed — not used for fertilizer recommendations */}

            {/* Paddy Variety */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('seasonPlans.createForm.paddyVarietyRequired')}</InputLabel>
                <Select
                  name="paddyVariety"
                  value={formData.paddyVariety}
                  onChange={handleChange}
                  label={t('seasonPlans.createForm.paddyVarietyRequired')}
                  disabled={!isFarmSelected || dataLoading}
                >
                  {paddyVarieties.length === 0 && !dataLoading ? (
                    <MenuItem disabled>
                      {t('seasonPlans.createForm.noPaddyVarieties')}
                    </MenuItem>
                  ) : (
                    paddyVarieties.map(variety => (
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
                    ))
                  )}
                </Select>
                {dataLoading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant="caption" color="textSecondary">
                      {t('seasonPlans.createForm.loadingVarieties')}
                    </Typography>
                  </Box>
                )}
                {!dataLoading && paddyVarieties.length === 0 && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {t('seasonPlans.createForm.noPaddyVarietiesFound')}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Total Farm Area (Read-only) */}
            {selectedFarmInfo.totalArea && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('seasonPlans.createForm.totalFarmArea')}
                  value={`${selectedFarmInfo.totalArea} ${selectedFarmInfo.areaUnit}`}
                  InputProps={{ readOnly: true }}
                  disabled
                  helperText={t('seasonPlans.createForm.totalAreaHelperText')}
                />
              </Grid>
            )}

            {/* Cultivating Area */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('seasonPlans.createForm.cultivatingAreaRequired', { unit: selectedFarmInfo.areaUnit || 'acres' })}
                name="cultivatingArea"
                type="number"
                value={formData.cultivatingArea}
                onChange={handleChange}
                disabled={!isFarmSelected}
                required
                inputProps={{ 
                  min: 0.01, 
                  step: 0.01, // Changed from 0.1 to 0.01 to allow values like 0.75
                  max: selectedFarmInfo.totalArea ? parseFloat(selectedFarmInfo.totalArea) + 0.01 : undefined
                }}
                helperText={selectedFarmInfo.totalArea ? 
                  t('seasonPlans.createForm.cultivatingAreaAvailable', { 
                    total: selectedFarmInfo.totalArea, 
                    unit: selectedFarmInfo.areaUnit || 'acres',
                    max: selectedFarmInfo.totalArea 
                  }) :
                  t('seasonPlans.createForm.cultivatingAreaMinimum', { unit: selectedFarmInfo.areaUnit || 'acres' })
                }
                InputProps={{
                  endAdornment: <InputAdornment position="end">{selectedFarmInfo.areaUnit || 'acres'}</InputAdornment>,
                }}
                error={selectedFarmInfo.totalArea && parseFloat(formData.cultivatingArea) > (parseFloat(selectedFarmInfo.totalArea) + 0.01)}
              />
            </Grid>

            {/* Date Calculation Mode Toggle */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('seasonPlans.createForm.datePlanning')}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {t('seasonPlans.createForm.datePlanningSubtitle')}
                </Typography>
                <ToggleButtonGroup
                  value={calculationMode}
                  exclusive
                  onChange={handleCalculationModeChange}
                  disabled={!isFarmSelected}
                  aria-label="date calculation mode"
                  size="small"
                >
                  <ToggleButton value="from-cultivation" aria-label="from cultivation date">
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2">{t('seasonPlans.createForm.setCultivationDate')}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {t('seasonPlans.createForm.setCultivationDateDesc')}
                      </Typography>
                    </Box>
                  </ToggleButton>
                  <ToggleButton value="from-harvest" aria-label="from harvest date">
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2">{t('seasonPlans.createForm.setHarvestDate')}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {t('seasonPlans.createForm.setHarvestDateDesc')}
                      </Typography>
                    </Box>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Cultivation Date */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t('seasonPlans.createForm.cultivationDateRequired')}
                  value={formData.cultivationDate}
                  onChange={calculationMode === 'from-cultivation' ? handleCultivationDateChange : () => {}}
                  disabled={calculationMode === 'from-harvest' || !isFarmSelected}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: calculationMode === 'from-cultivation' 
                        ? t('seasonPlans.createForm.cultivationDateHelper')
                        : formData.paddyVariety 
                          ? t('seasonPlans.createForm.cultivationDateAuto')
                          : t('seasonPlans.createForm.selectPaddyVarietyFirst'),
                      InputProps: calculationMode === 'from-harvest' ? { readOnly: true } : {}
                    }
                  }}
                />
              </LocalizationProvider>
              {calculationMode === 'from-cultivation' && formData.cultivationDate && (
                <Chip 
                  size="small" 
                  label={t('seasonPlans.createForm.primaryDate')} 
                  color="primary" 
                  sx={{ mt: 1 }} 
                />
              )}
            </Grid>

            {/* Transplanting Date (optional) - only show when plantingMethod is transplanting */}
            {formData.plantingMethod === 'transplanting' && (
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t('seasonPlans.createForm.transplantingDate')}
                    value={formData.transplantingDate}
                    onChange={(d) => setFormData(prev => ({ ...prev, transplantingDate: d }))}
                    disabled={!isFarmSelected}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        helperText: t('seasonPlans.createForm.transplantingDateHelper')
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            )}

            {/* Soil test result input hidden temporarily (no sample sheet available) */}

            {/* Expected Harvest Date */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t('seasonPlans.createForm.expectedHarvestDateRequired')}
                  value={formData.expectedHarvestDate}
                  onChange={calculationMode === 'from-harvest' ? handleHarvestDateChange : () => {}}
                  disabled={calculationMode === 'from-cultivation' || !isFarmSelected}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: calculationMode === 'from-harvest' 
                        ? t('seasonPlans.createForm.harvestDateHelper')
                        : formData.paddyVariety 
                          ? t('seasonPlans.createForm.harvestDateAuto')
                          : t('seasonPlans.createForm.selectPaddyVarietyFirst'),
                      InputProps: calculationMode === 'from-cultivation' ? { readOnly: true } : {},
                      sx: calculationMode === 'from-cultivation' ? {
                        '& .MuiInputBase-input': {
                          color: 'success.main',
                          fontWeight: 'medium',
                        }
                      } : {}
                    }
                  }}
                />
              </LocalizationProvider>
              {calculationMode === 'from-harvest' && formData.expectedHarvestDate && (
                <Chip 
                  size="small" 
                  label={t('seasonPlans.createForm.primaryDate')} 
                  color="primary" 
                  sx={{ mt: 1 }} 
                />
              )}
            </Grid>

            {/* Show variety duration info */}
            {formData.paddyVariety && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>{t('seasonPlans.createForm.selectedVariety')}</strong> {paddyVarieties.find(v => v._id === formData.paddyVariety)?.name} 
                      {' '}({paddyVarieties.find(v => v._id === formData.paddyVariety)?.duration})
                    </Typography>
                    
                    {formData.cultivationDate && formData.expectedHarvestDate && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>{t('seasonPlans.createForm.seasonTimeline')}</strong>
                        </Typography>
                        
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                          {/* First Plowing */}
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ 
                              p: 1.5, 
                              bgcolor: 'warning.light', 
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'warning.main',
                              height: 'auto', // Auto height
                              minHeight: 85, // Minimum height
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 'bold', wordWrap: 'break-word', overflow: 'hidden' }}>
                                {t('seasonPlans.createForm.firstPlowing')}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', my: 0.5, wordWrap: 'break-word', overflow: 'hidden' }}>
                                {getFirstPlowingDate()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ wordWrap: 'break-word', overflow: 'hidden' }}>
                                {t('seasonPlans.createForm.startEarly')}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          {/* Cultivation */}
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ 
                              p: 1.5, 
                              bgcolor: 'success.light', 
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'success.main',
                              height: 'auto', // Auto height
                              minHeight: 85, // Minimum height
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <Typography variant="caption" color="success.dark" sx={{ fontWeight: 'bold', wordWrap: 'break-word', overflow: 'hidden' }}>
                                {t('seasonPlans.createForm.cultivationDate')}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', my: 0.5, wordWrap: 'break-word', overflow: 'hidden' }}>
                                {dayjs(formData.cultivationDate).format('MMM DD, YYYY')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ wordWrap: 'break-word', overflow: 'hidden' }}>
                                {t('seasonPlans.createForm.plantingDay')}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          {/* Harvest */}
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ 
                              p: 1.5, 
                              bgcolor: 'primary.light', 
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'primary.main',
                              height: 'auto', // Auto height
                              minHeight: 85, // Minimum height
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 'bold', wordWrap: 'break-word', overflow: 'hidden' }}>
                                {t('seasonPlans.createForm.harvestDate')}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', my: 0.5, wordWrap: 'break-word', overflow: 'hidden' }}>
                                {dayjs(formData.expectedHarvestDate).format('MMM DD, YYYY')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ wordWrap: 'break-word', overflow: 'hidden' }}>
                                {t('seasonPlans.createForm.daysTotal', { days: Math.round(dayjs(formData.expectedHarvestDate).diff(dayjs(formData.cultivationDate), 'day')) })}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </Alert>
              </Grid>
            )}
          </Grid>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/paddy/season-plans')}
              disabled={loading}
            >
              {t('seasonPlans.createForm.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid() || loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? t('seasonPlans.createForm.creating') : t('seasonPlans.createForm.createSeasonPlan')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const CreateSeasonPlan = () => {
  return (
    <AppProviders>
      <Layout>
        <CreateSeasonPlanContent />
      </Layout>
    </AppProviders>
  );
};

export default CreateSeasonPlan;
