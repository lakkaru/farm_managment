import React, { useState } from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../components/Layout/Layout';
import AppProviders from '../providers/AppProviders';

const PlanSeasonContent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [seasonData, setSeasonData] = useState({
    season: '',
    district: '',
    climateZone: '',
    irrigationMethod: '',
    soilCondition: '',
    paddyVariety: '',
    cultivatingArea: '',
    cultivationDate: new Date(),
  });
  const [growingStages, setGrowingStages] = useState([]);
  const [fertilizerSchedule, setFertilizerSchedule] = useState([]);

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

  // Common Sri Lankan paddy varieties
  const paddyVarieties = [
    { name: 'BG 300', duration: 105, type: 'Short Duration' },
    { name: 'BG 352', duration: 110, type: 'Short Duration' },
    { name: 'BG 360', duration: 115, type: 'Medium Duration' },
    { name: 'BG 366', duration: 120, type: 'Medium Duration' },
    { name: 'BG 379-2', duration: 125, type: 'Medium Duration' },
    { name: 'BG 94-1', duration: 130, type: 'Long Duration' },
    { name: 'AT 362', duration: 120, type: 'Medium Duration' },
    { name: 'AT 405', duration: 110, type: 'Short Duration' },
    { name: 'H 4', duration: 135, type: 'Long Duration' },
    { name: 'H 7', duration: 140, type: 'Long Duration' },
  ];

  const steps = [
    'Basic Information',
    'Growing Conditions',
    'Variety Selection',
    'Season Plan',
  ];

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

  const generateSeasonPlan = () => {
    const selectedVariety = paddyVarieties.find(v => v.name === seasonData.paddyVariety);
    if (!selectedVariety) return;

    const cultivationDate = new Date(seasonData.cultivationDate);
    const duration = selectedVariety.duration;

    // Generate growing stages
    const stages = [
      { stage: 'Land Preparation', startDay: -14, endDay: 0, description: 'Plowing, harrowing, and field preparation' },
      { stage: 'Nursery/Sowing', startDay: 0, endDay: 21, description: 'Seed sowing in nursery or direct seeding' },
      { stage: 'Transplanting', startDay: 21, endDay: 28, description: 'Transplanting seedlings to main field' },
      { stage: 'Tillering', startDay: 28, endDay: 45, description: 'Formation of tillers and vegetative growth' },
      { stage: 'Panicle Initiation', startDay: 45, endDay: 65, description: 'Panicle development begins' },
      { stage: 'Flowering', startDay: 65, endDay: 85, description: 'Flowering and pollination' },
      { stage: 'Grain Filling', startDay: 85, endDay: duration - 15, description: 'Grain development and filling' },
      { stage: 'Maturity', startDay: duration - 15, endDay: duration, description: 'Grain maturity and harvest preparation' },
      { stage: 'Harvesting', startDay: duration, endDay: duration + 7, description: 'Harvesting and post-harvest activities' },
    ];

    const stageSchedule = stages.map(stage => {
      const startDate = new Date(cultivationDate);
      startDate.setDate(startDate.getDate() + stage.startDay);
      const endDate = new Date(cultivationDate);
      endDate.setDate(endDate.getDate() + stage.endDay);

      return {
        ...stage,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
      };
    });

    setGrowingStages(stageSchedule);

    // Generate fertilizer schedule based on Sri Lanka Agriculture Department recommendations
    generateFertilizerSchedule(cultivationDate, parseFloat(seasonData.cultivatingArea) || 1);
  };

  const generateFertilizerSchedule = (cultivationDate, area) => {
    // Fertilizer recommendations based on Sri Lanka Agriculture Department guidelines
    const baseFertilizer = {
      urea: 50, // kg per acre
      tsp: 25,  // kg per acre
      mop: 25,  // kg per acre
    };

    const applications = [
      {
        stage: 'Basal Application',
        days: -1,
        description: 'Apply before transplanting',
        fertilizers: {
          urea: Math.round(baseFertilizer.urea * 0.3 * area),
          tsp: Math.round(baseFertilizer.tsp * 1.0 * area),
          mop: Math.round(baseFertilizer.mop * 0.5 * area),
        },
      },
      {
        stage: 'First Top Dressing',
        days: 21,
        description: 'Active tillering stage',
        fertilizers: {
          urea: Math.round(baseFertilizer.urea * 0.35 * area),
          tsp: 0,
          mop: Math.round(baseFertilizer.mop * 0.5 * area),
        },
      },
      {
        stage: 'Second Top Dressing',
        days: 45,
        description: 'Panicle initiation stage',
        fertilizers: {
          urea: Math.round(baseFertilizer.urea * 0.35 * area),
          tsp: 0,
          mop: 0,
        },
      },
    ];

    const schedule = applications.map(app => {
      const applicationDate = new Date(cultivationDate);
      applicationDate.setDate(applicationDate.getDate() + app.days);

      return {
        ...app,
        date: applicationDate.toLocaleDateString(),
      };
    });

    setFertilizerSchedule(schedule);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      generateSeasonPlan();
    }
    setActiveStep(prev => Math.min(prev + 1, steps.length));
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                    <MenuItem key={variety.name} value={variety.name}>
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
            </Grid>
            {seasonData.paddyVariety && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>{seasonData.paddyVariety}</strong> variety will take approximately{' '}
                    <strong>{paddyVarieties.find(v => v.name === seasonData.paddyVariety)?.duration} days</strong>{' '}
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
                          <TableCell>{stage.startDate}</TableCell>
                          <TableCell>{stage.endDate}</TableCell>
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
                          <TableCell>{app.date}</TableCell>
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
              disabled={activeStep === steps.length}
            >
              {activeStep === steps.length - 1 ? 'Generate Plan' : 'Next'}
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
      <Layout>
        <PlanSeasonContent />
      </Layout>
    </AppProviders>
  );
};

export default PlanSeason;
