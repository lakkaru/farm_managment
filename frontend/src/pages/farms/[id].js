import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { navigate } from 'gatsby';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { farmAPI } from '../../services/api';

const FarmDetailContent = ({ farmId }) => {
  const { t } = useTranslation();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFarm = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await farmAPI.getFarm(farmId);
      setFarm(response.data.data);
    } catch (err) {
      console.error('Error loading farm:', err);
      setError(t('errors.serverError', 'Failed to load farm details'));
    } finally {
      setLoading(false);
    }
  }, [farmId, t]);

  useEffect(() => {
    if (farmId) {
      loadFarm();
    }
  }, [farmId, loadFarm]);

  const handleEdit = useCallback(() => {
    navigate(`/farms/${farmId}/edit`);
  }, [farmId]);

  const handleBack = useCallback(() => {
    navigate('/farms');
  }, []);

  const getFarmTypeColor = (type) => {
    const colors = {
      crop: 'success',
      livestock: 'warning', 
      mixed: 'info',
      aquaculture: 'primary',
      poultry: 'secondary',
    };
    return colors[type] || 'default';
  };

  const formatArea = (area) => {
    if (!area) return 'N/A';
    
    // Handle both old nested structure {value, unit} and new flat number
    if (typeof area === 'object' && area.value !== undefined) {
      return `${area.value.toLocaleString()} ${area.unit || 'acres'}`;
    }
    
    // Handle flat number structure
    if (typeof area === 'number') {
      return `${area.toLocaleString()} acres`;
    }
    
    return 'N/A';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/farms')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
      </Box>
    );
  }

  if (!farm) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Farm not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/farms')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box component="div">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/farms')}
            sx={{ mr: 2, mb: 2 }}
          >
            {t('common.back')}
          </Button>
          <Typography variant="h4" component="h1">
            {farm.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEdit}
        >
          {t('farms.editFarm')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('farms.basicInformation')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t('farms.farmType')}
                  </Typography>
                  <Chip
                    label={farm.farmType}
                    color={getFarmTypeColor(farm.farmType)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t('farms.totalAreaValue')}
                  </Typography>
                  <Typography variant="body1">
                    {formatArea(farm.totalArea)}
                  </Typography>
                </Grid>

                {/* {farm.soilType && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      {t('farms.soilType')}
                    </Typography>
                    <Typography variant="body1">
                      {farm.soilType}
                    </Typography>
                  </Grid>
                )} */}

                {farm.description && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      {t('farms.description')}
                    </Typography>
                    <Typography variant="body1">
                      {farm.description}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Location Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('farms.locationInformation')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    {t('farms.district')}
                  </Typography>
                  <Typography variant="body1">
                    {farm.district || t('farms.notSpecified')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    {t('farms.cultivationZone')}
                  </Typography>
                  <Typography variant="body1">
                    {farm.cultivationZone || t('farms.notSpecified')}
                  </Typography>
                </Grid>

                {farm.location?.address && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      {t('farms.address')}
                    </Typography>
                    <Typography variant="body1">
                      {farm.location.address}
                    </Typography>
                  </Grid>
                )}

                {farm.location?.zipCode && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      {t('farms.zipCode')}
                    </Typography>
                    <Typography variant="body1">
                      {farm.location.zipCode}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Owner Information */}
        {farm.owner && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('farms.ownerInformation')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" color="textSecondary">
                  {t('farms.name')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {farm.owner.profile?.firstName} {farm.owner.profile?.lastName}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  {t('farms.email')}
                </Typography>
                <Typography variant="body1">
                  {farm.owner.email}
                </Typography>

                {farm.owner.contact?.phone && (
                  <Box component="div">
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {t('farms.phone')}
                    </Typography>
                    <Typography variant="body1">
                      {farm.owner.contact.phone}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Managers Information */}
        {farm.managers && farm.managers.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('farms.farmManagers')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {farm.managers.map((manager, index) => (
                  <Box component="div" key={manager._id} sx={{ mb: index < farm.managers.length - 1 ? 2 : 0 }}>
                    <Typography variant="body1">
                      {manager.profile?.firstName} {manager.profile?.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {manager.email}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Additional Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('farms.additionalInformation')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t('farms.createdOn')}
                  </Typography>
                  <Typography variant="body1">
                    {farm.createdAt ? new Date(farm.createdAt).toLocaleDateString() : t('farms.notAvailable')}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t('farms.lastUpdated')}
                  </Typography>
                  <Typography variant="body1">
                    {farm.updatedAt ? new Date(farm.updatedAt).toLocaleDateString() : t('farms.notAvailable')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const FarmDetailPage = (props) => {
  return (
    <AppProviders>
      <Layout>
        <FarmDetailContent farmId={props.params?.id} />
      </Layout>
    </AppProviders>
  );
};

export default FarmDetailPage;
