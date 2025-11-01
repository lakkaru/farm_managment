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
  FormHelperText,
} from '@mui/material';
import BackButton from '../../components/BackButton';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { farmAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { SRI_LANKAN_DISTRICTS, getZoneDescription } from '../../constants/districts';

const CreateFarmContent = () => {
  const { t } = useTranslation();
  // Helper to render labels: remove any trailing '*' from translations
  // We rely on MUI's `required` prop to render the asterisk, avoiding duplicates.
  const labelText = (key) => {
    const txt = t(key);
    return txt.replace(/\s*\*+$/g, '');
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    farmType: 'crop',
    district: '',
    divisionalSecretariat: '',
    gramaNiladhariDivision: '',
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

  // Location dropdown states
  const [divisionalSecretariats, setDivisionalSecretariats] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

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
        // Load divisional secretariats for the selected district
        handleDistrictChange(value);
      }
    }
    setError('');
  };

  // Handle district change - load divisional secretariats
  const handleDistrictChange = async (district) => {
    if (!district) {
      setDivisionalSecretariats([]);
      setGnDivisions([]);
      return;
    }

    try {
      setLoadingLocations(true);
      const locationAPI = await import('../../services/locationAPI');
      const response = await locationAPI.getDivisionalSecretariats(district);
      setDivisionalSecretariats(response.data || []);
      setGnDivisions([]);
    } catch (error) {
      console.error('Error loading divisional secretariats:', error);
      toast.error('Failed to load divisional secretariats');
    } finally {
      setLoadingLocations(false);
    }
  };

  // Handle divisional secretariat change - load GN divisions
  const handleDSChange = async (e) => {
    const ds = e.target.value;
    setFormData(prev => ({
      ...prev,
      divisionalSecretariat: ds,
      gramaNiladhariDivision: '',
    }));

    if (!ds || !formData.district) {
      setGnDivisions([]);
      return;
    }

    try {
      setLoadingLocations(true);
      const locationAPI = await import('../../services/locationAPI');
      const response = await locationAPI.getGNDivisions(formData.district, ds);
      setGnDivisions(response.data || []);
    } catch (error) {
      console.error('Error loading GN divisions:', error);
      toast.error('Failed to load GN divisions');
    } finally {
      setLoadingLocations(false);
    }
  };

  // Slugify a label to form translation keys (e.g. "Colombo" -> "colombo")
  const slugify = (s) => {
    if (!s) return '';
    return s.toString().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.farmType || !formData.district || 
          !formData.divisionalSecretariat || !formData.gramaNiladhariDivision ||
          !formData.totalArea.value) {
        setError('Please fill in all required fields including location details');
        return;
      }

      // Transform form data to match backend model
      const farmData = {
        name: formData.name,
        description: formData.description,
        farmType: formData.farmType,
        district: formData.district,
        divisionalSecretariat: formData.divisionalSecretariat,
        gramaNiladhariDivision: formData.gramaNiladhariDivision,
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

  // Determine whether the form is valid for submission
  const isFormValid = () => {
    // Required: name, farmType, district, divisionalSecretariat, gramaNiladhariDivision, totalArea.value (>0)
    if (!formData.name || !String(formData.name).trim()) return false;
    if (!formData.farmType) return false;
    if (!formData.district) return false;
    if (!formData.divisionalSecretariat) return false;
    if (!formData.gramaNiladhariDivision) return false;
    const totalAreaVal = Number(formData.totalArea?.value);
    if (!totalAreaVal || Number.isNaN(totalAreaVal) || totalAreaVal <= 0) return false;
    return true;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: { xs: '100%', sm: 800 }, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <BackButton to="/farms" sx={{ mr: 2 }} />
        <Typography variant="h4" gutterBottom>
          {t('farms.addNewFarm')}
        </Typography>
      </Box>
      {/* <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        {t('farms.addNewFarmDescription')}
      </Typography> */}

  <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
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
              <Typography variant="body2" color="error" sx={{ mb: 1, fontWeight: 500 }}>
                {t('forms.requiredFieldsNote')}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={labelText('farms.farmName')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                InputLabelProps={{ sx: { '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{`${t('farms.farmType')}`}</InputLabel>
                <Select
                  name="farmType"
                  value={formData.farmType}
                  onChange={handleChange}
                  label={`${t('farms.farmType')}`}
                  disabled
                >
                  <MenuItem value="crop">{t('farms.farmTypes.crop')}</MenuItem>
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
                helperText={t('farms.descriptionHelper')}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t('farms.locationInformation')}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}>{labelText('farms.district')}</InputLabel>
                <Select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  label={labelText('farms.district')}
                >
                  {SRI_LANKAN_DISTRICTS
                    .slice()
                    .sort((a, b) => {
                      const la = t(`districts.${slugify(a.name)}`, { defaultValue: a.name });
                      const lb = t(`districts.${slugify(b.name)}`, { defaultValue: b.name });
                      return la.localeCompare(lb, undefined, { sensitivity: 'base' });
                    })
                    .map(district => (
                      <MenuItem key={district.name} value={district.name}>
                        {t(`districts.${slugify(district.name)}`, { defaultValue: district.name })}
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
                value={formData.cultivationZone ? t(`districts.zones.${formData.cultivationZone}`, { defaultValue: getZoneDescription(formData.cultivationZone) }) : ''}
                InputProps={{ readOnly: true }}
                disabled
                helperText={formData.cultivationZone ? '' : t('farms.selectDistrictFirst')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.district}>
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}>
                  {t('auth.divisionalSecretariat')} 
                </InputLabel>
                <Select
                  name="divisionalSecretariat"
                  value={formData.divisionalSecretariat}
                  onChange={handleDSChange}
                  label={`${t('auth.divisionalSecretariat')} `}
                  disabled={loadingLocations || !formData.district}
                >
                  <MenuItem value="">
                    <em>{t('auth.selectDivisionalSecretariat')}</em>
                  </MenuItem>
                  {divisionalSecretariats.map((ds) => (
                    <MenuItem key={ds} value={ds}>
                      {t(
                        `divisionalSecretariats.${slugify(formData.district)}.${slugify(ds)}`,
                        { defaultValue: ds }
                      )}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {!formData.district ? t('farms.selectDistrictFirst') : ''}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.divisionalSecretariat}>
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}>
                  {t('auth.gramaNiladhariDivision')} 
                </InputLabel>
                <Select
                  name="gramaNiladhariDivision"
                  value={formData.gramaNiladhariDivision}
                  onChange={handleChange}
                  label={`${t('auth.gramaNiladhariDivision')} `}
                  disabled={loadingLocations || !formData.divisionalSecretariat}
                >
                  <MenuItem value="">
                    <em>{t('auth.selectGNDivision')}</em>
                  </MenuItem>
                  {gnDivisions.map((gn) => (
                    <MenuItem key={gn} value={gn}>
                      {t(
                        `gnDivisions.${slugify(formData.district)}.${slugify(formData.divisionalSecretariat)}.${slugify(gn)}`,
                        { defaultValue: gn }
                      )}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {!formData.divisionalSecretariat ? t('farms.selectDivisionalSecretariatFirst') : ''}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('farms.address')}
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder={t('farms.addressPlaceholder')}
                helperText={t('farms.addressHelper')}
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
                label={labelText('farms.totalAreaValue')}
                name="totalArea.value"
                type="number"
                value={formData.totalArea.value}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
                InputLabelProps={{ sx: { '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth required>
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}>{t('farms.unit')}</InputLabel>
                <Select
                  name="totalArea.unit"
                  value={formData.totalArea.unit}
                  onChange={handleChange}
                  label={t('farms.unit')}
                >
                  <MenuItem value="hectares">{t('farms.units.hectares')}</MenuItem>
                  <MenuItem value="acres">{t('farms.units.acres')}</MenuItem>
                  <MenuItem value="perches">{t('farms.units.perches')}</MenuItem>
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
                  <MenuItem value="hectares">{t('farms.units.hectares')}</MenuItem>
                  <MenuItem value="acres">{t('farms.units.acres')}</MenuItem>
                  <MenuItem value="perches">{t('farms.units.perches')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>



            {/* Action Buttons */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                  fullWidth={{ xs: true, sm: false }}
                >
                  {t('farms.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !isFormValid()}
                  startIcon={loading && <CircularProgress size={20} />}
                  sx={{ minWidth: { sm: 120 } }}
                  fullWidth={{ xs: true, sm: false }}
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
