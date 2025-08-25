import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Agriculture as AgricultureIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  WaterDrop as WaterIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import BackButton from '../../../components/BackButton';
import { seasonPlanAPI } from '../../../services/api';
import { useFarm } from '../../../contexts/FarmContext';
import { toast } from 'react-toastify';

const SeasonPlansContent = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, plan: null });
  const { selectedFarm } = useFarm();

  useEffect(() => {
    loadSeasonPlans();
  }, [selectedFarm]);

  const loadSeasonPlans = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedFarm) {
        params.farmId = selectedFarm._id;
      }
      const response = await seasonPlanAPI.getSeasonPlans(params);
      setPlans(response.data.data || []);
    } catch (error) {
      console.error('Error loading season plans:', error);
      toast.error('Failed to load season plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (plan) => {
    try {
      await seasonPlanAPI.deleteSeasonPlan(plan._id);
      toast.success('Season plan deleted successfully');
      setDeleteDialog({ open: false, plan: null });
      loadSeasonPlans();
    } catch (error) {
      console.error('Error deleting season plan:', error);
      toast.error('Failed to delete season plan');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: 'default',
      active: 'primary',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading season plans...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box display="flex" alignItems="center">
          <BackButton to="/dashboard" variant="icon" />
          <Box>
            <Typography variant="h4" gutterBottom>
              Season Plans
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your paddy cultivation season plans
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/paddy/season-plans/create')}
          sx={{ minWidth: 150 }}
        >
          Create Plan
        </Button>
      </Box>

      {/* Farm Selection Warning */}
      {!selectedFarm && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please select a farm from the sidebar to view and manage season plans for that farm.
        </Alert>
      )}

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AgricultureIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Season Plans Found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {selectedFarm
              ? `No season plans found for ${selectedFarm.name}. Create your first season plan to get started.`
              : 'Select a farm from the sidebar to view season plans.'}
          </Typography>
          {selectedFarm && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/paddy/season-plans/create')}
            >
              Create Your First Season Plan
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: plan.status === 'completed' 
                    ? 'linear-gradient(135deg, #E8F5E8, #F0FFF0)'
                    : plan.status === 'active'
                    ? 'linear-gradient(135deg, #E3F2FD, #F3E5F5)'
                    : 'linear-gradient(135deg, #F5F5F5, #FAFAFA)',
                  borderLeft: `4px solid ${
                    plan.status === 'completed' ? '#4CAF50' :
                    plan.status === 'active' ? '#2196F3' :
                    plan.status === 'cancelled' ? '#F44336' : '#FFC107'
                  }`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: plan.status === 'completed' 
                      ? '0 4px 12px rgba(76, 175, 80, 0.3)'
                      : plan.status === 'active'
                      ? '0 4px 12px rgba(33, 150, 243, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  {/* Farm and Season Info */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {plan.farmId?.name || 'Unknown Farm'}
                    </Typography>
                    <Chip
                      label={plan.season.toUpperCase()}
                      size="small"
                      color={plan.season === 'maha' ? 'primary' : 'secondary'}
                      sx={{ textTransform: 'uppercase' }}
                    />
                  </Box>

                  {/* Status */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={plan.status.replace('_', ' ').toUpperCase()}
                      size="small"
                      color={getStatusColor(plan.status)}
                      variant={plan.status === 'active' ? 'filled' : 'outlined'}
                    />
                  </Box>

                  {/* Basic Info */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
                      <Typography variant="body2" color="textSecondary">
                        District: {plan.farmId?.district || 'Unknown District'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WaterIcon sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
                      <Typography variant="body2" color="textSecondary">
                        {plan.irrigationMethod}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(plan.cultivationDate)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Area and Variety */}
                  <Typography variant="body2" gutterBottom>
                    <strong>Area:</strong> {plan.cultivatingArea} acres
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Variety:</strong> {plan.paddyVariety?.name || 'Unknown Variety'}
                  </Typography>

                  {/* Expected Harvest */}
                  {plan.expectedHarvest?.date && (
                    <Typography variant="body2" color="primary">
                      <strong>Expected Harvest:</strong> {formatDate(plan.expectedHarvest.date)}
                      {plan.expectedHarvest.estimatedYield && (
                        <span> ({plan.expectedHarvest.estimatedYield} tons)</span>
                      )}
                    </Typography>
                  )}

                  {/* Actual Harvest - Show for completed plans */}
                  {plan.status === 'completed' && plan.actualHarvest?.date && (
                    <Box sx={{ 
                      mt: 1, 
                      p: 1.5, 
                      backgroundColor: 'success.50', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'success.200'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                        <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 'bold' }}>
                          Harvest Completed
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'success.main', fontSize: '0.85rem' }}>
                        <strong>Date:</strong> {formatDate(plan.actualHarvest.date)}
                      </Typography>
                      {plan.actualHarvest.actualYield && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5, color: 'success.main' }} />
                          <Typography variant="body2" sx={{ color: 'success.main', fontSize: '0.85rem' }}>
                            <strong>Yield:</strong> {plan.actualHarvest.actualYield} kg
                            {plan.expectedHarvest?.estimatedYield && (
                              <span style={{ color: '#666', fontSize: '0.8rem' }}>
                                {' '}({((plan.actualHarvest.actualYield / (plan.expectedHarvest.estimatedYield * 1000)) * 100).toFixed(1)}% of expected)
                              </span>
                            )}
                          </Typography>
                        </Box>
                      )}
                      {plan.actualHarvest.quality && (
                        <Typography variant="body2" sx={{ color: 'success.main', fontSize: '0.85rem', mt: 0.5 }}>
                          <strong>Quality:</strong> {plan.actualHarvest.quality}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Show progress for active plans */}
                  {plan.status === 'active' && plan.growingStages && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'info.main' }}>
                        Progress: {plan.growingStages.filter(stage => stage.completed).length}/{plan.growingStages.length} stages completed
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/paddy/season-plans/${plan._id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Plan">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => navigate(`/paddy/season-plans/${plan._id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Plan">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, plan })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
        onClick={() => navigate('/paddy/season-plans/create')}
      >
        <AddIcon />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, plan: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the season plan for{' '}
            <strong>{deleteDialog.plan?.farmId?.name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, plan: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.plan)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const SeasonPlans = () => {
  return (
    <AppProviders>
      <Layout>
        <SeasonPlansContent />
      </Layout>
    </AppProviders>
  );
};

export default SeasonPlans;
