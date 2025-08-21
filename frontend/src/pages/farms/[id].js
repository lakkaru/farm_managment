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
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { farmAPI } from '../../services/api';

const FarmDetailContent = ({ farmId }) => {
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
          onClick={handleBack}
          variant="outlined"
        >
          Back to Farms
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
          onClick={handleBack}
          variant="outlined"
        >
          Back to Farms
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
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Farms
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
          Edit Farm
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Farm Type
                  </Typography>
                  <Chip
                    label={farm.farmType}
                    color={getFarmTypeColor(farm.farmType)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Area
                  </Typography>
                  <Typography variant="body1">
                    {formatArea(farm.totalArea)}
                  </Typography>
                </Grid>

                {farm.soilType && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Soil Type
                    </Typography>
                    <Typography variant="body1">
                      {farm.soilType}
                    </Typography>
                  </Grid>
                )}

                {farm.description && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Description
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
                Location Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    District
                  </Typography>
                  <Typography variant="body1">
                    {farm.district || 'Not specified'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Cultivation Zone
                  </Typography>
                  <Typography variant="body1">
                    {farm.cultivationZone || 'Not specified'}
                  </Typography>
                </Grid>

                {farm.location?.address && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {farm.location.address}
                    </Typography>
                  </Grid>
                )}

                {farm.location?.zipCode && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Zip Code
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
                  Owner Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {farm.owner.profile?.firstName} {farm.owner.profile?.lastName}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {farm.owner.email}
                </Typography>

                {farm.owner.contact?.phone && (
                  <Box component="div">
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Phone
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
                  Farm Managers
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
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Created On
                  </Typography>
                  <Typography variant="body1">
                    {farm.createdAt ? new Date(farm.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {farm.updatedAt ? new Date(farm.updatedAt).toLocaleDateString() : 'N/A'}
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
