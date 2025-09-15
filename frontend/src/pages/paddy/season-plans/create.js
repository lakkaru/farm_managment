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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { navigate } from 'gatsby';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { seasonPlanAPI, paddyVarietyAPI, farmAPI } from '../../../services/api';
import { useFarm } from '../../../contexts/FarmContext';
import { toast } from 'react-toastify';

const CreateSeasonPlanContent = () => {
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
    soilCondition: '',
    paddyVariety: '',
    cultivatingArea: '',
    cultivationDate: null, // Change to null for DatePicker
    expectedHarvestDate: null, // Add for bidirectional calculation
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
      // Round to 2 decimal places to avoid floating point precision issues
      const roundedArea = farmArea ? Math.round(parseFloat(farmArea) * 100) / 100 : '';
      
      setFormData(prev => ({
        ...prev,
        farmId: selectedFarm._id,
        cultivatingArea: roundedArea, // Pre-populate with farm area
      }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Auto-populate farm info when farm changes
    if (name === 'farmId') {
      const selectedFarmData = farms.find(farm => farm._id === value);
      if (selectedFarmData) {
        const farmArea = selectedFarmData.totalArea?.value || '';
        // Round to 2 decimal places to avoid floating point precision issues
        const roundedArea = farmArea ? Math.round(parseFloat(farmArea) * 100) / 100 : '';
        
        setSelectedFarmInfo({
          district: selectedFarmData.district || '',
          cultivationZone: selectedFarmData.cultivationZone || '',
          totalArea: roundedArea,
          areaUnit: selectedFarmData.totalArea?.unit || 'acres',
        });
        // Pre-populate cultivating area with farm area
        setFormData(prev => ({
          ...prev,
          cultivatingArea: roundedArea,
        }));
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
      const requiredFields = ['farmId', 'season', 'irrigationMethod', 'soilCondition', 'paddyVariety', 'cultivatingArea'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError('Please fill in all required fields');
        return;
      }

      if (!formData.cultivationDate) {
        setError('Please select a cultivation date');
        return;
      }

      if (!formData.expectedHarvestDate) {
        setError('Please ensure both cultivation and harvest dates are set');
        return;
      }

      // Validate harvest date is after cultivation date
      if (dayjs(formData.expectedHarvestDate).isBefore(dayjs(formData.cultivationDate))) {
        setError('Harvest date must be after cultivation date');
        return;
      }

      // Validate season duration is reasonable (at least 60 days)
      const seasonDuration = dayjs(formData.expectedHarvestDate).diff(dayjs(formData.cultivationDate), 'day');
      if (seasonDuration < 60) {
        setError('Season duration must be at least 60 days');
        return;
      }

      // Validate cultivating area doesn't exceed farm area
      if (selectedFarmInfo.totalArea && parseFloat(formData.cultivatingArea) > parseFloat(selectedFarmInfo.totalArea)) {
        // Add a small tolerance for floating point comparison (0.01 acres)
        const tolerance = 0.01;
        const cultivatingArea = parseFloat(formData.cultivatingArea);
        const farmArea = parseFloat(selectedFarmInfo.totalArea);
        
        if (cultivatingArea > (farmArea + tolerance)) {
          setError(`Cultivating area cannot exceed the farm's total area of ${selectedFarmInfo.totalArea} ${selectedFarmInfo.areaUnit}`);
          return;
        }
      }

      // Convert cultivatingArea to number and dates to ISO strings
      const planData = {
        ...formData,
        cultivatingArea: parseFloat(formData.cultivatingArea),
        cultivationDate: formData.cultivationDate ? dayjs(formData.cultivationDate).toISOString() : null,
        expectedHarvest: {
          date: formData.expectedHarvestDate ? dayjs(formData.expectedHarvestDate).toISOString() : null,
        },
      };

      // Remove the frontend-only field
      delete planData.expectedHarvestDate;

      console.log('Sending season plan data:', planData);

      await seasonPlanAPI.createSeasonPlan(planData);
      toast.success('Season plan created successfully!');
      navigate('/paddy/season-plans');
    } catch (err) {
      console.error('Season plan creation error:', err);
      console.error('Error response:', err.response);
      
      let message = 'Failed to create season plan';
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/paddy/season-plans')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" gutterBottom>
          Create Season Plan
        </Typography>
      </Box>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Plan your next paddy cultivation season
      </Typography>

      {!selectedFarm && farms.length === 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          No farms available. Please create a farm first before creating a season plan.
        </Alert>
      )}

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

            {/* District (Read-only) */}
            {selectedFarmInfo.district && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="District"
                  value={selectedFarmInfo.district}
                  InputProps={{ readOnly: true }}
                  helperText="From selected farm"
                />
              </Grid>
            )}

            {/* Climate Zone (Read-only) */}
            {selectedFarmInfo.cultivationZone && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Climate Zone"
                  value={selectedFarmInfo.cultivationZone}
                  InputProps={{ readOnly: true }}
                  helperText="From selected farm"
                />
              </Grid>
            )}

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
                  disabled={dataLoading}
                >
                  {paddyVarieties.length === 0 && !dataLoading ? (
                    <MenuItem disabled>
                      No paddy varieties available
                    </MenuItem>
                  ) : (
                    paddyVarieties.map(variety => (
                      <MenuItem key={variety._id} value={variety._id}>
                        {variety.name} ({variety.type} - {variety.duration})
                      </MenuItem>
                    ))
                  )}
                </Select>
                {dataLoading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant="caption" color="textSecondary">
                      Loading varieties...
                    </Typography>
                  </Box>
                )}
                {!dataLoading && paddyVarieties.length === 0 && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    No paddy varieties found. Please check your connection or contact support.
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Total Farm Area (Read-only) */}
            {selectedFarmInfo.totalArea && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Farm Area"
                  value={`${selectedFarmInfo.totalArea} ${selectedFarmInfo.areaUnit}`}
                  InputProps={{ readOnly: true }}
                  helperText="Total area of selected farm"
                />
              </Grid>
            )}

            {/* Cultivating Area */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`Cultivating Area (${selectedFarmInfo.areaUnit || 'acres'}) *`}
                name="cultivatingArea"
                type="number"
                value={formData.cultivatingArea}
                onChange={handleChange}
                required
                inputProps={{ 
                  min: 0.01, 
                  step: 0.01, // Changed from 0.1 to 0.01 to allow values like 0.75
                  max: selectedFarmInfo.totalArea ? parseFloat(selectedFarmInfo.totalArea) + 0.01 : undefined
                }}
                helperText={selectedFarmInfo.totalArea ? 
                  `Available: ${selectedFarmInfo.totalArea} ${selectedFarmInfo.areaUnit || 'acres'} (Max: ${selectedFarmInfo.totalArea})` :
                  `Minimum 0.01 ${selectedFarmInfo.areaUnit || 'acres'}`
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
                  Date Planning
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Choose how you want to plan your season dates
                </Typography>
                <ToggleButtonGroup
                  value={calculationMode}
                  exclusive
                  onChange={handleCalculationModeChange}
                  aria-label="date calculation mode"
                  size="small"
                >
                  <ToggleButton value="from-cultivation" aria-label="from cultivation date">
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2">Set Cultivation Date</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Calculate harvest date
                      </Typography>
                    </Box>
                  </ToggleButton>
                  <ToggleButton value="from-harvest" aria-label="from harvest date">
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2">Set Harvest Date</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Calculate cultivation date
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
                  label="Cultivation Date *"
                  value={formData.cultivationDate}
                  onChange={calculationMode === 'from-cultivation' ? handleCultivationDateChange : handleDateChange}
                  disabled={calculationMode === 'from-harvest' && !formData.paddyVariety}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: calculationMode === 'from-cultivation' 
                        ? "Select cultivation date (past or future dates allowed for records)"
                        : formData.paddyVariety 
                          ? "Auto-calculated from harvest date"
                          : "Select paddy variety first",
                      InputProps: calculationMode === 'from-harvest' ? { readOnly: true } : {}
                    }
                  }}
                />
              </LocalizationProvider>
              {calculationMode === 'from-cultivation' && formData.cultivationDate && (
                <Chip 
                  size="small" 
                  label="Primary Date" 
                  color="primary" 
                  sx={{ mt: 1 }} 
                />
              )}
            </Grid>

            {/* Expected Harvest Date */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Expected Harvest Date *"
                  value={formData.expectedHarvestDate}
                  onChange={calculationMode === 'from-harvest' ? handleHarvestDateChange : () => {}}
                  disabled={calculationMode === 'from-cultivation' && !formData.paddyVariety}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: calculationMode === 'from-harvest' 
                        ? "Select target harvest date (past or future dates allowed for records)"
                        : formData.paddyVariety 
                          ? "Auto-calculated from cultivation date"
                          : "Select paddy variety first",
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
                  label="Primary Date" 
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
                      <strong>Selected Variety:</strong> {paddyVarieties.find(v => v._id === formData.paddyVariety)?.name} 
                      {' '}({paddyVarieties.find(v => v._id === formData.paddyVariety)?.duration})
                    </Typography>
                    
                    {formData.cultivationDate && formData.expectedHarvestDate && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Season Timeline:</strong>
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
                              height: 85, // Fixed height for consistency
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 'bold' }}>
                                FIRST PLOWING
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', my: 0.5 }}>
                                {getFirstPlowingDate()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Start 10 days early
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
                              height: 85, // Fixed height for consistency
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <Typography variant="caption" color="success.dark" sx={{ fontWeight: 'bold' }}>
                                CULTIVATION DATE
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', my: 0.5 }}>
                                {dayjs(formData.cultivationDate).format('MMM DD, YYYY')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Planting day
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
                              height: 85, // Fixed height for consistency
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 'bold' }}>
                                HARVEST DATE
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', my: 0.5 }}>
                                {dayjs(formData.expectedHarvestDate).format('MMM DD, YYYY')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {Math.round(dayjs(formData.expectedHarvestDate).diff(dayjs(formData.cultivationDate), 'day'))} days total
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

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/paddy/season-plans')}
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
              {loading ? 'Creating...' : 'Create Season Plan'}
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
