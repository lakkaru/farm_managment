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
  // Remove trailing '*' from translations; rely on MUI required prop instead
  const labelText = (key) => {
    const txt = t(key);
    return txt.replace(/\s*\*+$/g, '');
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    farmType: '',
    district: '',
    divisionalSecretariat: '',
    gramaNiladhariDivision: '',
    cultivationZone: '',
    location: {
      address: '',
      country: 'Sri Lanka',
      // zipCode intentionally omitted - not collected from users
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

  const loadFarm = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await farmAPI.getFarm(farmId);
      const farm = response.data.data;
      
      const initialData = {
        name: farm.name || '',
        description: farm.description || '',
        farmType: farm.farmType || 'crop',
        district: farm.district || farm.location?.district || '',
        divisionalSecretariat: farm.divisionalSecretariat || '',
        gramaNiladhariDivision: farm.gramaNiladhariDivision || '',
        cultivationZone: farm.cultivationZone || farm.location?.cultivationZone || getDistrictZone(farm.district || farm.location?.district) || '',
        location: {
          address: farm.location?.address || '',
          country: 'Sri Lanka',
          // zipCode not collected from users
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
      };

      setFormData(initialData);
      // Capture the original form state for dirty-tracking
      try {
        setOriginalFormData(JSON.parse(JSON.stringify(initialData)));
      } catch (err) {
        // Fallback: store the reference (less safe but better than null)
        setOriginalFormData(initialData);
      }
      // Load divisional secretariats and GN divisions for selected district/DS
      try {
        if (farm.district) {
          setLoadingLocations(true);
          const locationAPI = await import('../../../services/locationAPI');
          const dsResp = await locationAPI.getDivisionalSecretariats(farm.district);
          setDivisionalSecretariats(dsResp.data || []);
          if (farm.divisionalSecretariat) {
            const gnResp = await locationAPI.getGNDivisions(farm.district, farm.divisionalSecretariat);
            setGnDivisions(gnResp.data || []);
          }
        }
      } catch (err) {
        console.error('Failed to load location lists for edit form', err);
      } finally {
        setLoadingLocations(false);
      }
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

  // Compute dirty state when formData or originalFormData changes
  useEffect(() => {
    if (!originalFormData) {
      setIsDirty(false);
      return;
    }

    try {
      const a = JSON.stringify(originalFormData);
      const b = JSON.stringify(formData);
      setIsDirty(a !== b);
    } catch (err) {
      // Fallback: mark dirty when can't stringify
      setIsDirty(true);
    }
  }, [formData, originalFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields (e.g., location.address or totalArea.value)
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          // ensure nested objects exist
          if (current[keys[i]] === undefined) current[keys[i]] = {};
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

    // Auto-populate cultivation zone when district changes and load DS list
    if (name === 'district') {
      const zoneCode = getDistrictZone(value);
      setFormData(prev => ({
        ...prev,
        cultivationZone: zoneCode || ''
      }));

      (async () => {
        if (!value) {
          setDivisionalSecretariats([]);
          setGnDivisions([]);
          return;
        }
        try {
          setLoadingLocations(true);
          const locationAPI = await import('../../../services/locationAPI');
          const resp = await locationAPI.getDivisionalSecretariats(value);
          setDivisionalSecretariats(resp.data || []);
          setGnDivisions([]);
        } catch (err) {
          console.error('Error loading divisional secretariats:', err);
        } finally {
          setLoadingLocations(false);
        }
      })();
    }
  };

  // Handle divisional secretariat change - load GN divisions
  const handleDSChange = async (e) => {
    const ds = e.target.value;
    setFormData(prev => ({
      ...prev,
      divisionalSecretariat: ds,
      gramaNiladhariDivision: ''
    }));

    if (!ds || !formData.district) {
      setGnDivisions([]);
      return;
    }

    try {
      setLoadingLocations(true);
      const locationAPI = await import('../../../services/locationAPI');
      const response = await locationAPI.getGNDivisions(formData.district, ds);
      setGnDivisions(response.data || []);
    } catch (error) {
      console.error('Error loading GN divisions:', error);
      toast.error('Failed to load GN divisions');
    } finally {
      setLoadingLocations(false);
    }
  };

  const slugify = (s) => {
    if (!s) return '';
    return s.toString().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
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
        divisionalSecretariat: formData.divisionalSecretariat,
        gramaNiladhariDivision: formData.gramaNiladhariDivision,
        cultivationZone: formData.cultivationZone,
        location: {
          address: formData.location.address || formData.district || 'Not specified',
          country: formData.location.country,
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
              <Typography variant="body2" color="error" sx={{ mb: 1, fontWeight: 500 }}>
                {t('forms.requiredFieldsNote')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('farms.farmType')}</InputLabel>
                <Select
                  name="farmType"
                  value={formData.farmType}
                  label={t('farms.farmType')}
                  onChange={handleChange}
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
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}>{t('farms.district')}</InputLabel>
                <Select
                  name="district"
                  value={formData.district}
                  label={t('farms.district')}
                  onChange={handleChange}
                >
                  {SRI_LANKAN_DISTRICTS
                    .slice()
                    .sort((a, b) => {
                      const la = t(`districts.${slugify(a.name)}`, { defaultValue: a.name });
                      const lb = t(`districts.${slugify(b.name)}`, { defaultValue: b.name });
                      return la.localeCompare(lb, undefined, { sensitivity: 'base' });
                    })
                    .map((district) => (
                      <MenuItem key={district.name} value={district.name}>
                        {t(`districts.${slugify(district.name)}`, { defaultValue: district.name })}
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
                value={formData.cultivationZone ? t(`districts.zones.${formData.cultivationZone}`, { defaultValue: getZoneDescription(formData.cultivationZone) }) : ''}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                disabled
                helperText={formData.cultivationZone ? '' : t('farms.selectDistrictFirst')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
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
              </FormControl>
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

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth required>
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}>{t('farms.unit')}</InputLabel>
                <Select
                  name="totalArea.unit"
                  value={formData.totalArea.unit}
                  label={t('farms.unit')}
                  onChange={handleChange}
                >
                  <MenuItem value="hectares">{t('farms.units.hectares')}</MenuItem>
                  <MenuItem value="acres">{t('farms.units.acres')}</MenuItem>
                  <MenuItem value="perches">{t('farms.units.perches')}</MenuItem>
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
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}>{t('farms.unit')}</InputLabel>
                <Select
                  name="cultivatedArea.unit"
                  value={formData.cultivatedArea.unit}
                  label={t('farms.unit')}
                  onChange={handleChange}
                >
                  <MenuItem value="hectares">{t('farms.units.hectares')}</MenuItem>
                  <MenuItem value="acres">{t('farms.units.acres')}</MenuItem>
                  <MenuItem value="perches">{t('farms.units.perches')}</MenuItem>
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
                  disabled={saving || !isDirty}
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
