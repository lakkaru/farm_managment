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
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import BackButton from '../../components/BackButton';
import { farmAPI } from '../../services/api';

const FarmsPageContent = () => {
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
      setError('Failed to load farms');
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
      toast.success('Farm deleted successfully');
      await loadFarms(); // Refresh the list
      setDeleteDialog({ open: false, farm: null });
    } catch (err) {
      console.error('Error deleting farm:', err);
      toast.error('Failed to delete farm');
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
          <BackButton to="/dashboard" variant="icon" />
          <Typography variant="h4" component="h1">
            Farm Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateFarm}
        >
          Add New Farm
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
                  No farms found. Start by creating your first farm.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateFarm}
                >
                  Create Farm
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : (
          farms.map((farm) => (
            <Grid item xs={12} sm={6} md={4} key={farm._id}>
              <Card>
                <CardContent>
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
                    <strong>Area:</strong> {formatArea(farm.totalArea)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Soil Type:</strong> {farm.soilType || 'Not specified'}
                  </Typography>
                  
                  {farm.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {farm.description}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewFarm(farm._id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Edit Farm">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleEditFarm(farm._id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete Farm">
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
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.farm?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
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
