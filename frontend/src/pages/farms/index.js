import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { farmAPI } from '../../services/api';

const FarmsPageContent = () => {
  const { t } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, farm: null });

  const loadFarms = useCallback(async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      const response = await farmAPI.getFarms();
      console.log(response.data.data[0]);
      setFarms(response.data.data || []);
    } catch (err) {
      console.error('Error loading farms:', err);
      setError(t('errors.serverError', 'Failed to load farms'));
      setFarms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  const handleCreateFarm = useCallback(() => {
    navigate('/farms/create');
  }, []);

  const handleViewFarm = useCallback((farmId) => {
    navigate(`/farms/${farmId}`);
  }, []);

  const handleEditFarm = useCallback((farmId) => {
    navigate(`/farms/${farmId}/edit`);
  }, []);

  const handleDeleteClick = useCallback((farm) => {
    setDeleteDialog({ open: true, farm });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const { farm } = deleteDialog;
    try {
      setError(''); // Clear any previous errors
      await farmAPI.deleteFarm(farm._id);
      toast.success(t('farms.farmDeleted'));
      await loadFarms(); // Refresh the list
      setDeleteDialog({ open: false, farm: null });
    } catch (err) {
      console.error('Error deleting farm:', err);
      toast.error(t('errors.serverError', 'Failed to delete farm'));
    }
  }, [deleteDialog, loadFarms]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog({ open: false, farm: null });
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
    if (!area) return 'No/A';
    
    // Handle both old nested structure {value, unit} and new flat number
    if (typeof area === 'object' && area.value !== undefined) {
      return `${area.value.toLocaleString()} ${area.unit || 'acres'}`;
    }
    
    // // Handle flat number structure
    // if (typeof area === 'number') {
    //   return `${area.toLocaleString()} acres`;
    // }
    
    return 'No/A';
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            {t('common.back')}
          </Button>
          <Typography variant="h4" component="h1">
            {t('farms.farmManagement')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateFarm}
        >
          {t('farms.addNewFarm')}
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Farms Grid */}
      <Grid container spacing={3}>
        {farms.length === 0 && !loading ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" color="textSecondary">
                  {t('farms.noFarmsMessage')}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateFarm}
                >
                  {t('farms.createFarm')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : (
          farms.map((farm) => (
            <Grid item xs={12} sm={6} md={4} key={farm._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => handleViewFarm(farm._id)}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {farm.name}
                  </Typography>
                  
                  <Typography color="textSecondary" gutterBottom>
                    {farm.district}, {farm.cultivationZone}
                  </Typography>

                  <Box component="div" sx={{ mb: 2 }}>
                    <Chip
                      label={farm.farmType}
                      color={getFarmTypeColor(farm.farmType)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="textSecondary">
                    <strong>{t('farms.area')}:</strong> {formatArea(farm.totalArea)}
                  </Typography>
                  
                  {farm.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {farm.description}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions onClick={(e) => e.stopPropagation()}>
                  <Tooltip title={t('farms.viewDetails')}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewFarm(farm._id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={t('farms.editFarm')}>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleEditFarm(farm._id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={t('farms.deleteFarm')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(farm)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('farms.confirmDeleteTitle')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('farms.confirmDeleteMessage', { 
              farmName: deleteDialog.farm?.name 
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const FarmsPage = () => {
  return (
    <AppProviders>
      <Layout>
        <FarmsPageContent />
      </Layout>
    </AppProviders>
  );
};

export default FarmsPage;
