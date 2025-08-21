import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Agriculture as AgricultureIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  WaterDrop as WaterIcon,
  Terrain as TerrainIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocalFlorist as FertilizerIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import Layout from '../../../../components/Layout/Layout';
import AppProviders from '../../../../providers/AppProviders';
import { seasonPlanAPI } from '../../../../services/api';
import { toast } from 'react-toastify';

const SeasonPlanViewContent = ({ id }) => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadSeasonPlan();
    }
  }, [id]);

  const loadSeasonPlan = async () => {
    try {
      setLoading(true);
      const response = await seasonPlanAPI.getSeasonPlan(id);
      setPlan(response.data.data);
    } catch (error) {
      console.error('Error loading season plan:', error);
      setError('Failed to load season plan');
      toast.error('Failed to load season plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await seasonPlanAPI.deleteSeasonPlan(id);
      toast.success('Season plan deleted successfully');
      navigate('/paddy/season-plans');
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
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount?.toLocaleString() || 0}`;
  };

  const getCompletedStages = () => {
    if (!plan?.growingStages) return 0;
    return plan.growingStages.filter(stage => stage.completed).length;
  };

  const getAppliedFertilizers = () => {
    if (!plan?.fertilizerSchedule) return 0;
    return plan.fertilizerSchedule.filter(app => app.applied).length;
  };

  const getProgressPercentage = () => {
    const totalStages = plan?.growingStages?.length || 1;
    const completedStages = getCompletedStages();
    return (completedStages / totalStages) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading season plan...</Typography>
      </Box>
    );
  }

  if (error || !plan) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Season plan not found'}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/paddy/season-plans')}
          sx={{ mt: 2 }}
        >
          Back to Season Plans
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/paddy/season-plans')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" gutterBottom>
              {plan.farmId?.name} - {plan.season.toUpperCase()} Season
            </Typography>
            <Chip
              label={plan.status.replace('_', ' ').toUpperCase()}
              color={getStatusColor(plan.status)}
              size="medium"
              sx={{ textTransform: 'uppercase' }}
            />
          </Box>
        </Box>
        <Box>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={() => navigate(`/paddy/season-plans/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialog(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="District"
                    secondary={plan.farmId?.district || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TerrainIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Climate Zone"
                    secondary={plan.climateZone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WaterIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Irrigation Method"
                    secondary={plan.irrigationMethod}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TerrainIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Soil Condition"
                    secondary={plan.soilCondition}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AgricultureIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Paddy Variety"
                    secondary={`${plan.paddyVariety?.name || 'N/A'} (${plan.paddyVariety?.duration || 0} days)`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AgricultureIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cultivating Area"
                    secondary={`${plan.cultivatingArea} acres`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Dates and Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timeline & Progress
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cultivation Date"
                    secondary={formatDate(plan.cultivationDate)}
                  />
                </ListItem>
                {plan.expectedHarvest?.date && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Expected Harvest"
                      secondary={formatDate(plan.expectedHarvest.date)}
                    />
                  </ListItem>
                )}
                {plan.actualHarvest?.date && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Actual Harvest"
                      secondary={formatDate(plan.actualHarvest.date)}
                    />
                  </ListItem>
                )}
              </List>

              {/* Progress */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Growing Stages Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={getProgressPercentage()} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {getCompletedStages()} of {plan.growingStages?.length || 0} stages completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Growing Stages */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Growing Stages
              </Typography>
              <Grid container spacing={2}>
                {plan.growingStages?.map((stage, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ScheduleIcon sx={{ mr: 1, color: stage.completed ? 'success.main' : 'grey.400' }} />
                          <Typography variant="subtitle2">
                            {stage.stage}
                          </Typography>
                          {stage.completed && (
                            <CheckCircleIcon sx={{ ml: 'auto', color: 'success.main' }} />
                          )}
                        </Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {formatDate(stage.startDate)} - {formatDate(stage.endDate)}
                        </Typography>
                        <Typography variant="body2">
                          {stage.description}
                        </Typography>
                        {stage.notes && (
                          <Typography variant="caption" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
                            Notes: {stage.notes}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Fertilizer Schedule */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fertilizer Schedule
              </Typography>
              <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                Total Cost: {formatCurrency(plan.totalFertilizerCost)}
              </Typography>
              <Grid container spacing={2}>
                {plan.fertilizerSchedule?.map((app, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <FertilizerIcon sx={{ mr: 1, color: app.applied ? 'success.main' : 'grey.400' }} />
                          <Typography variant="subtitle2">
                            {app.stage}
                          </Typography>
                          {app.applied && (
                            <CheckCircleIcon sx={{ ml: 'auto', color: 'success.main' }} />
                          )}
                        </Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {formatDate(app.date)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {app.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" display="block">
                            Urea: {app.fertilizers?.urea || 0} kg
                          </Typography>
                          <Typography variant="caption" display="block">
                            TSP: {app.fertilizers?.tsp || 0} kg
                          </Typography>
                          <Typography variant="caption" display="block">
                            MOP: {app.fertilizers?.mop || 0} kg
                          </Typography>
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                            Cost: {formatCurrency(app.totalCost)}
                          </Typography>
                        </Box>
                        {app.notes && (
                          <Typography variant="caption" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
                            Notes: {app.notes}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Harvest Information */}
        {(plan.expectedHarvest || plan.actualHarvest) && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Harvest Information
                </Typography>
                <Grid container spacing={3}>
                  {plan.expectedHarvest && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Expected Harvest
                      </Typography>
                      <Typography variant="body2">
                        Date: {formatDate(plan.expectedHarvest.date)}
                      </Typography>
                      <Typography variant="body2">
                        Estimated Yield: {plan.expectedHarvest.estimatedYield} tons
                      </Typography>
                    </Grid>
                  )}
                  {plan.actualHarvest?.date && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Actual Harvest
                      </Typography>
                      <Typography variant="body2">
                        Date: {formatDate(plan.actualHarvest.date)}
                      </Typography>
                      {plan.actualHarvest.actualYield && (
                        <Typography variant="body2">
                          Actual Yield: {plan.actualHarvest.actualYield} tons
                        </Typography>
                      )}
                      {plan.actualHarvest.quality && (
                        <Typography variant="body2">
                          Quality: {plan.actualHarvest.quality}
                        </Typography>
                      )}
                      {plan.actualHarvest.notes && (
                        <Typography variant="body2">
                          Notes: {plan.actualHarvest.notes}
                        </Typography>
                      )}
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this season plan? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const SeasonPlanView = ({ params }) => {
  return (
    <AppProviders>
      <Layout>
        <SeasonPlanViewContent id={params?.id} />
      </Layout>
    </AppProviders>
  );
};

export default SeasonPlanView;
