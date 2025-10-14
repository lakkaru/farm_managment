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
import { Edit as EditIcon } from '@mui/icons-material';
import BackButton from '../../components/BackButton';
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

  const slugify = (s) => {
    if (!s) return '';
    return String(s).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  };

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
        <BackButton to="/farms" sx={{ mr: 2 }} aria-label={t('common.back')} />
      </Box>
    );
  }

  if (!farm) {
    return (
        <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Farm not found
        </Alert>
        <BackButton to="/farms" sx={{ mr: 2 }} aria-label={t('common.back')} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header - responsive */}
      <Box
        mb={3}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
          <BackButton to="/farms" sx={{ mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }} aria-label={t('common.back')} />
          <Typography variant="h4" component="h1">
            {farm.name}
          </Typography>
        </Box>
        <Box sx={{ mt: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            startIcon={<EditIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
            onClick={handleEdit}
            size="small"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {t('farms.editFarm')}
          </Button>
        </Box>
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t('farms.farmType')}
                  </Typography>
                  <Chip
                    label={t(`farms.farmTypes.${farm.farmType}`, farm.farmType)}
                    color={getFarmTypeColor(farm.farmType)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
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
                    <Typography
                      variant="body1"
                      sx={(theme) => ({
                        mt: 0.5,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 3,
                        [theme.breakpoints.up('sm')]: {
                          WebkitLineClamp: 5,
                        },
                        textOverflow: 'ellipsis',
                      })}
                    >
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
                    {farm.district ? t(`districts.${slugify(farm.district)}`, farm.district) : t('farms.notSpecified')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    {t('farms.cultivationZone')}
                  </Typography>
                  <Typography variant="body1">
                    {farm.cultivationZone ? t(`districts.zones.${farm.cultivationZone}`, farm.cultivationZone) : t('farms.notSpecified')}
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
