import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import PrivateRoute from '../../components/PrivateRoute';
import AppProviders from '../../providers/AppProviders';
import { paddyVarietyAPI, seasonPlanAPI } from '../../services/api';
import { useFarm } from '../../contexts/FarmContext';
import { toast } from 'react-toastify';

const PlanSeasonContent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paddyVarieties, setPaddyVarieties] = useState([]);
  const [seasonData, setSeasonData] = useState({
    season: '',
    district: '',
    climateZone: '',
    irrigationMethod: '',
    soilCondition: '',
    paddyVariety: '',
    cultivatingArea: '',
    cultivationDate: dayjs(),
  });
  const [growingStages, setGrowingStages] = useState([]);
  const [fertilizerSchedule, setFertilizerSchedule] = useState([]);
  const { selectedFarm } = useFarm();

  // Auto-populate data from selected farm
  useEffect(() => {
    if (selectedFarm) {
      // Extract district from farm location
      const farmDistrict = selectedFarm.location?.city || '';
      const matchedDistrict = districts.find(d => 
        d.name.toLowerCase().includes(farmDistrict.toLowerCase()) ||
        farmDistrict.toLowerCase().includes(d.name.toLowerCase())
      );
      
      // Auto-populate form data from farm
      setSeasonData(prev => ({
        ...prev,
        district: matchedDistrict ? matchedDistrict.name : farmDistrict,
        climateZone: matchedDistrict ? matchedDistrict.zone : '',
        cultivatingArea: selectedFarm.totalArea?.value || '',
      }));
    }
  }, [selectedFarm, districts]);

  // Sri Lankan districts and their climate zones
  const districts = [
    { name: 'Colombo', zone: 'WL1' },
    { name: 'Gampaha', zone: 'WL1' },
    { name: 'Kalutara', zone: 'WL2' },
    { name: 'Kandy', zone: 'WM1' },
    { name: 'Matale', zone: 'WM2' },
    { name: 'Nuwara Eliya', zone: 'WU1' },
    { name: 'Galle', zone: 'WL3' },
    { name: 'Matara', zone: 'WL3' },
    { name: 'Hambantota', zone: 'DL1' },
    { name: 'Jaffna', zone: 'DL2' },
    { name: 'Kilinochchi', zone: 'DL2' },
    { name: 'Mannar', zone: 'DL2' },
    { name: 'Vavuniya', zone: 'DL3' },
    { name: 'Mullaitivu', zone: 'DL2' },
    { name: 'Batticaloa', zone: 'DL1' },
    { name: 'Ampara', zone: 'DL1' },
    { name: 'Trincomalee', zone: 'DL1' },
    { name: 'Kurunegala', zone: 'WM3' },
    { name: 'Puttalam', zone: 'DL1' },
    { name: 'Anuradhapura', zone: 'DL1' },
    { name: 'Polonnaruwa', zone: 'DL1' },
    { name: 'Badulla', zone: 'WM2' },
    { name: 'Moneragala', zone: 'DL3' },
    { name: 'Ratnapura', zone: 'WM3' },
    { name: 'Kegalle', zone: 'WM2' },
  ];

  const seasons = [
    { id: 'maha', name: 'Maha Season (October - March)', months: 'Oct-Mar' },
    { id: 'yala', name: 'Yala Season (April - September)', months: 'Apr-Sep' },
  ];

  const irrigationMethods = [
    'Rain fed',
    'Under irrigation',
  ];

  const soilTypes = [
    'Sandy',
    'Clay',
    'Loam',
    'Sandy Loam',
    'Clay Loam',
    'Silt Loam',
  ];

  // Common Sri Lankan paddy varieties - loaded from API
  // const paddyVarieties = [
  //   { name: 'BG 300', duration: 105, type: 'Short Duration' },
  //   ...
  // ];

  const steps = [
    'Basic Information',
    'Growing Conditions',
    'Variety Selection',
    'Season Plan',
  ];

  // Load paddy varieties from API
  useEffect(() => {
    const fetchPaddyVarieties = async () => {
      try {
        const response = await paddyVarietyAPI.getPaddyVarieties();
        if (response.data.data && response.data.data.length > 0) {
          setPaddyVarieties(response.data.data);
        } else {
          // Fallback to default varieties if API doesn't have data
          setDefaultPaddyVarieties();
        }
      } catch (error) {
        console.error('Error fetching paddy varieties:', error);
        // Fallback to default varieties
        setDefaultPaddyVarieties();
        if (error.response?.status !== 401) { // Don't show error for auth issues
          toast.error('Using default paddy varieties - API connection failed');
        }
      }
    };

    const setDefaultPaddyVarieties = () => {
      const defaultVarieties = [
        { _id: 'bg300', name: 'BG 300', duration: 105, type: 'Short Duration' },
        { _id: 'bg350', name: 'BG 350', duration: 110, type: 'Short Duration' },
        { _id: 'bg360', name: 'BG 360', duration: 115, type: 'Medium Duration' },
        { _id: 'bg380', name: 'BG 380', duration: 120, type: 'Medium Duration' },
        { _id: 'bg400-1', name: 'BG 400-1', duration: 125, type: 'Medium Duration' },
        { _id: 'at362', name: 'AT 362', duration: 110, type: 'Short Duration' },
        { _id: 'at405', name: 'AT 405', duration: 120, type: 'Medium Duration' },
        { _id: 'bw272-6b', name: 'BW 272-6B', duration: 105, type: 'Short Duration' },
        { _id: 'bw351', name: 'BW 351', duration: 115, type: 'Medium Duration' },
        { _id: 'h4', name: 'H 4', duration: 100, type: 'Short Duration' },
      ];
      setPaddyVarieties(defaultVarieties);
    };

    if (paddyVarieties.length === 0) { // Only fetch if not already loaded
      fetchPaddyVarieties();
    }
  }, []); // Empty dependency array to prevent multiple calls

  const handleInputChange = (field, value) => {
    setSeasonData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-update climate zone when district changes
    if (field === 'district') {
      const selectedDistrict = districts.find(d => d.name === value);
      if (selectedDistrict) {
        setSeasonData(prev => ({
          ...prev,
          climateZone: selectedDistrict.zone,
        }));
      }
    }
  };

  const generateSeasonPlan = async () => {
    if (!selectedFarm) {
      toast.error('Please select a farm first');
      return;
    }

    const selectedVariety = paddyVarieties.find(v => v._id === seasonData.paddyVariety);
    if (!selectedVariety) {
      toast.error('Please select a paddy variety');
      return;
    }

    setLoading(true);
    try {
      const planData = {
        farmId: selectedFarm._id,
        ...seasonData,
        cultivationDate: dayjs(seasonData.cultivationDate).toISOString(),
      };

      const response = await seasonPlanAPI.createSeasonPlan(planData);
      const plan = response.data.data;
      
      setGrowingStages(plan.growingStages);
      setFertilizerSchedule(plan.fertilizerSchedule);
      
      toast.success('Season plan created successfully!');
    } catch (error) {
      console.error('Error creating season plan:', error);
      toast.error('Failed to create season plan');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      generateSeasonPlan();
    } else {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Season</InputLabel>
                <Select
                  value={seasonData.season}
                  onChange={(e) => handleInputChange('season', e.target.value)}
                  label="Season"
                >
                  {seasons.map(season => (
                    <MenuItem key={season.id} value={season.id}>
                      {season.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Cultivation Date"
                  value={seasonData.cultivationDate}
                  onChange={(date) => handleInputChange('cultivationDate', date)}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select
                  value={seasonData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  label="District"
                >
                  {districts.map(district => (
                    <MenuItem key={district.name} value={district.name}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedFarm && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                  Auto-populated from farm location: {selectedFarm.location?.city}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Climate Zone"
                value={seasonData.climateZone}
                InputProps={{ readOnly: true }}
                helperText="Auto-populated based on district"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Irrigation Method</InputLabel>
                <Select
                  value={seasonData.irrigationMethod}
                  onChange={(e) => handleInputChange('irrigationMethod', e.target.value)}
                  label="Irrigation Method"
                >
                  {irrigationMethods.map(method => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Soil Condition</InputLabel>
                <Select
                  value={seasonData.soilCondition}
                  onChange={(e) => handleInputChange('soilCondition', e.target.value)}
                  label="Soil Condition"
                >
                  {soilTypes.map(soil => (
                    <MenuItem key={soil} value={soil}>
                      {soil}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Paddy Variety</InputLabel>
                <Select
                  value={seasonData.paddyVariety}
                  onChange={(e) => handleInputChange('paddyVariety', e.target.value)}
                  label="Paddy Variety"
                >
                  {paddyVarieties.map(variety => (
                    <MenuItem key={variety._id} value={variety._id}>
                      {variety.name} - {variety.duration} days ({variety.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cultivating Area (Acres)"
                type="number"
                value={seasonData.cultivatingArea}
                onChange={(e) => handleInputChange('cultivatingArea', e.target.value)}
                inputProps={{ min: 0.1, step: 0.1 }}
              />
              {selectedFarm && selectedFarm.totalArea?.value && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                  Farm total area: {selectedFarm.totalArea.value} {selectedFarm.totalArea.unit}
                </Typography>
              )}
            </Grid>
            {seasonData.paddyVariety && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>{paddyVarieties.find(v => v._id === seasonData.paddyVariety)?.name}</strong> variety will take approximately{' '}
                    <strong>{paddyVarieties.find(v => v._id === seasonData.paddyVariety)?.duration} days</strong>{' '}
                    from transplanting to harvest.
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        );

      case 3:
        return (
          <Box>
            {growingStages.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Growing Stages Schedule
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Stage</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {growingStages.map((stage, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip label={stage.stage} color="primary" variant="outlined" />
                          </TableCell>
                          <TableCell>{dayjs(stage.startDate).format('MMM DD, YYYY')}</TableCell>
                          <TableCell>{dayjs(stage.endDate).format('MMM DD, YYYY')}</TableCell>
                          <TableCell>{stage.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>
                  Fertilizer Application Schedule
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Stage</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Urea (kg)</TableCell>
                        <TableCell>TSP (kg)</TableCell>
                        <TableCell>MOP (kg)</TableCell>
                        <TableCell>Zinc Sulphate (kg)</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fertilizerSchedule.map((app, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip label={app.stage} color="secondary" variant="outlined" />
                          </TableCell>
                          <TableCell>{dayjs(app.date).format('MMM DD, YYYY')}</TableCell>
                          <TableCell>{app.fertilizers.urea > 0 ? app.fertilizers.urea : '-'}</TableCell>
                          <TableCell>{app.fertilizers.tsp > 0 ? app.fertilizers.tsp : '-'}</TableCell>
                          <TableCell>{app.fertilizers.mop > 0 ? app.fertilizers.mop : '-'}</TableCell>
                          <TableCell>{(app.fertilizers.zincSulphate || 0) > 0 ? (app.fertilizers.zincSulphate || 0) : '-'}</TableCell>
                          <TableCell>{app.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> Fertilizer recommendations are based on Sri Lanka Agriculture Department guidelines. 
                    Adjust quantities based on soil test results and local conditions.
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Paddy Season Planning
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Plan your paddy cultivation season with climate zone-specific recommendations, 
        variety selection, and fertilizer scheduling based on Sri Lanka Agriculture Department guidelines.
      </Typography>

      {!selectedFarm && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Please select a farm from the sidebar to create a season plan.
          </Typography>
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || activeStep === steps.length}
              startIcon={loading && <CircularProgress size={16} />}
            >
              {loading ? 'Generating...' : (activeStep === steps.length - 1 ? 'Generate Plan' : 'Next')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

const PlanSeason = () => {
  return (
    <AppProviders>
      <PrivateRoute>
        <Layout>
          <PlanSeasonContent />
        </Layout>
      </PrivateRoute>
    </AppProviders>
  );
};

export default PlanSeason;
