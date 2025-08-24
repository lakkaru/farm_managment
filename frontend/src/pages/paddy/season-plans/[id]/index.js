import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
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
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon,
  Notes as NotesIcon,
  Grass as GrassIcon,
  SquareFoot as AreaIcon,
  Science as ScienceIcon,
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
  
  // Implementation tracking states
  const [fertilizerDialog, setFertilizerDialog] = useState({ open: false, index: null });
  const [stageDialog, setStageDialog] = useState({ open: false, index: null });
  const [implementationData, setImplementationData] = useState({
    applied: false,
    implementedDate: '',
    notes: '',
    completed: false,
    actualStartDate: '',
    actualEndDate: '',
  });
  const [saving, setSaving] = useState(false); // Prevent duplicate saves
  const toastShownRef = useRef(false);
  
  // Harvest tracking states
  const [harvestDialog, setHarvestDialog] = useState(false);
  const [harvestData, setHarvestData] = useState({
    date: '',
    actualYield: '',
    quality: '',
    notes: '',
  });

  const loadSeasonPlan = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    if (id) {
      loadSeasonPlan();
    }
  }, [id, loadSeasonPlan]);

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

  const getCompletedStages = () => {
    if (!plan?.growingStages) return 0;
    return plan.growingStages.filter(stage => stage.completed).length;
  };

  const getProgressPercentage = () => {
    const totalStages = plan?.growingStages?.length || 1;
    const completedStages = getCompletedStages();
    return (completedStages / totalStages) * 100;
  };

  // Implementation tracking functions
  const handleFertilizerImplementation = (index) => {
    const application = plan.fertilizerSchedule[index];
    const newData = {
      applied: application.applied || false,
      implementedDate: application.implementedDate ? new Date(application.implementedDate).toISOString().split('T')[0] : '',
      notes: application.notes || '',
    };
    setImplementationData(newData);
    setFertilizerDialog({ open: true, index });
  };

  const handleStageImplementation = (index) => {
    const stage = plan.growingStages[index];
    const newData = {
      completed: stage.completed || false,
      actualStartDate: stage.actualStartDate ? new Date(stage.actualStartDate).toISOString().split('T')[0] : '',
      actualEndDate: stage.actualEndDate ? new Date(stage.actualEndDate).toISOString().split('T')[0] : '',
      notes: stage.notes || '',
    };
    setImplementationData(newData);
    setStageDialog({ open: true, index });
  };

  const saveFertilizerImplementation = async () => {
    if (saving) return; // Prevent duplicate calls
    setSaving(true);
    toastShownRef.current = false; // Reset toast flag
    
    try {
      const response = await seasonPlanAPI.updateFertilizerImplementation(
        id,
        fertilizerDialog.index,
        {
          applied: implementationData.applied,
          implementedDate: implementationData.implementedDate || undefined,
          notes: implementationData.notes,
        }
      );
      setPlan(response.data.data);
      setFertilizerDialog({ open: false, index: null });
      
      // Reload plan data to get updated status
      await loadSeasonPlan();
      
      // Show success message only once
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast.success('✅ Fertilizer application updated');
      }
    } catch (error) {
      console.error('Error updating fertilizer implementation:', error);
      toast.error('Failed to update fertilizer application');
    } finally {
      setSaving(false);
    }
  };

  const saveStageImplementation = async () => {
    if (saving) return; // Prevent duplicate calls
    setSaving(true);
    toastShownRef.current = false; // Reset toast flag
    
    try {
      const response = await seasonPlanAPI.updateStageImplementation(
        id,
        stageDialog.index,
        {
          completed: implementationData.completed,
          actualStartDate: implementationData.actualStartDate || undefined,
          actualEndDate: implementationData.actualEndDate || undefined,
          notes: implementationData.notes,
        }
      );
      setPlan(response.data.data);
      setStageDialog({ open: false, index: null });
      
      // Reload plan data to get updated status
      await loadSeasonPlan();
      
      // Show success message only once
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast.success('✅ Growing stage updated');
      }
    } catch (error) {
      console.error('Error updating stage implementation:', error);
      toast.error('Failed to update growing stage');
    } finally {
      setSaving(false);
    }
  };

  const closeFertilizerDialog = () => {
    setFertilizerDialog({ open: false, index: null });
    setImplementationData({
      applied: false,
      implementedDate: '',
      notes: '',
    });
  };

  const closeStageDialog = () => {
    setStageDialog({ open: false, index: null });
    setImplementationData({
      completed: false,
      actualStartDate: '',
      actualEndDate: '',
      notes: '',
    });
  };

  // Harvest tracking functions
  const handleHarvest = () => {
    const harvest = plan.actualHarvest || {};
    setHarvestData({
      date: harvest.date ? new Date(harvest.date).toISOString().split('T')[0] : '',
      actualYield: harvest.actualYield || '',
      quality: harvest.quality || '',
      notes: harvest.notes || '',
    });
    setHarvestDialog(true);
  };

  const saveHarvestData = async () => {
    if (saving) return; // Prevent duplicate calls
    setSaving(true);
    toastShownRef.current = false; // Reset toast flag
    
    try {
      const response = await seasonPlanAPI.updateHarvest(id, {
        date: harvestData.date || undefined,
        actualYield: harvestData.actualYield ? parseFloat(harvestData.actualYield) : undefined,
        quality: harvestData.quality || undefined,
        notes: harvestData.notes || undefined,
      });
      setPlan(response.data.data);
      setHarvestDialog(false);
      
      // Reload plan data to get updated status
      await loadSeasonPlan();
      
      // Show success message only once
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast.success('🌾 Harvest data updated successfully');
      }
    } catch (error) {
      console.error('Error updating harvest:', error);
      toast.error('Failed to update harvest data');
    } finally {
      setSaving(false);
    }
  };

  const closeHarvestDialog = () => {
    setHarvestDialog(false);
    setHarvestData({
      date: '',
      actualYield: '',
      quality: '',
      notes: '',
    });
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
                    <GrassIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Paddy Variety"
                    secondary={`${plan.paddyVariety?.name || 'N/A'} (${plan.paddyVariety?.duration || 0} days)`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AreaIcon />
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
                🌾 Growing Stages Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={getProgressPercentage()} 
                  sx={{ 
                    height: 12, 
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #D2B48C 0%, #90EE90 25%, #98FB98 50%, #F0FFF0 75%, #FFFACD 100%)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #8B4513 0%, #228B22 25%, #008000 50%, #ADFF2F 75%, #DAA520 100%)',
                      borderRadius: 6
                    }
                  }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  🌱 {getCompletedStages()} of {plan.growingStages?.length || 0} stages completed
                </Typography>
              </Box>

              {/* Harvest Information */}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">
                  🌾 Harvest Information
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleHarvest}
                  sx={{
                    background: plan.actualHarvest?.date 
                      ? 'linear-gradient(45deg, #228B22, #32CD32)'
                      : 'linear-gradient(45deg, #DAA520, #FFD700)',
                    '&:hover': {
                      background: plan.actualHarvest?.date 
                        ? 'linear-gradient(45deg, #006400, #228B22)'
                        : 'linear-gradient(45deg, #B8860B, #DAA520)',
                    }
                  }}
                >
                  {plan.actualHarvest?.date ? 'Update Harvest' : 'Record Harvest'}
                </Button>
              </Box>
              
              {plan.actualHarvest?.date && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#F0FFF0', 
                  borderRadius: 2,
                  border: '2px solid #90EE90',
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#006400', fontWeight: 'bold', mb: 1 }}>
                    ✅ Harvest Completed: {formatDate(plan.actualHarvest.date)}
                  </Typography>
                  {plan.actualHarvest.actualYield && (
                    <Typography variant="body2" sx={{ color: '#228B22', mb: 0.5 }}>
                      📊 Actual Yield: {plan.actualHarvest.actualYield} kg
                      {plan.expectedHarvest?.estimatedYield && (
                        <span style={{ color: '#666', marginLeft: 8 }}>
                          (Expected: {plan.expectedHarvest.estimatedYield} tons - {((plan.actualHarvest.actualYield / (plan.expectedHarvest.estimatedYield * 1000)) * 100).toFixed(1)}% achieved)
                        </span>
                      )}
                    </Typography>
                  )}
                  {plan.actualHarvest.quality && (
                    <Typography variant="body2" sx={{ color: '#228B22', mb: 0.5 }}>
                      🏆 Quality: {plan.actualHarvest.quality}
                    </Typography>
                  )}
                  {plan.actualHarvest.notes && (
                    <Typography variant="body2" sx={{ color: '#228B22', fontStyle: 'italic' }}>
                      📝 Notes: {plan.actualHarvest.notes}
                    </Typography>
                  )}
                </Box>
              )}
              
              {!plan.actualHarvest?.date && plan.expectedHarvest?.date && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#FFFACD', 
                  borderRadius: 2,
                  border: '2px solid #DAA520',
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#B8860B' }}>
                    📅 Expected Harvest: {formatDate(plan.expectedHarvest.date)}
                    {plan.expectedHarvest.estimatedYield && (
                      <span style={{ marginLeft: 8 }}>
                        (Estimated: {plan.expectedHarvest.estimatedYield} tons)
                      </span>
                    )}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Growing Stages */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🌾 Growing Stages
              </Typography>
              <Grid container spacing={2}>
                {plan.growingStages?.map((stage, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          height: '100%',
                          background: stage.completed 
                            ? 'linear-gradient(135deg, #90EE90, #98FB98)'
                            : 'linear-gradient(135deg, #F5F5F5, #E8F5E8)',
                          borderLeft: `4px solid ${stage.completed ? '#006400' : '#90EE90'}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(144, 238, 144, 0.4)'
                          }
                        }}
                      >
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
                          Planned: {formatDate(stage.startDate)} - {formatDate(stage.endDate)}
                        </Typography>
                        {stage.actualStartDate && stage.actualEndDate && (
                          <Typography variant="body2" color="success.main" gutterBottom>
                            ✓ Actual: {formatDate(stage.actualStartDate)} - {formatDate(stage.actualEndDate)}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {stage.description}
                        </Typography>
                        {stage.notes && (
                          <Box sx={{ mt: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1, borderLeft: 3, borderColor: 'info.main' }}>
                            <Typography variant="caption" sx={{ color: 'info.dark', fontStyle: 'italic' }}>
                              📝 Notes: {stage.notes}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Tooltip title={stage.completed ? 'Mark as Incomplete' : 'Mark as Complete'}>
                            <IconButton
                              size="small"
                              color={stage.completed ? 'success' : 'primary'}
                              onClick={() => handleStageImplementation(index)}
                            >
                              {stage.completed ? <CheckIcon /> : <PlayArrowIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add Notes">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleStageImplementation(index)}
                            >
                              <NotesIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
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
                🌿 Fertilizer Schedule
              </Typography>
              <Grid container spacing={2}>
                {plan.fertilizerSchedule?.map((app, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          height: '100%',
                          background: app.applied 
                            ? 'linear-gradient(135deg, #98FB98, #90EE90)'
                            : 'linear-gradient(135deg, #F5F5F5, #FFF8E7)',
                          borderLeft: `4px solid ${app.applied ? '#006400' : '#FFD700'}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                          }
                        }}
                      >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ScienceIcon sx={{ mr: 1, color: app.applied ? 'success.main' : 'grey.400' }} />
                          <Typography variant="subtitle2">
                            {app.stage}
                          </Typography>
                          {app.applied && (
                            <CheckCircleIcon sx={{ ml: 'auto', color: 'success.main' }} />
                          )}
                        </Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Scheduled: {formatDate(app.date)}
                        </Typography>
                        {app.implementedDate && (
                          <Typography variant="body2" color="success.main" gutterBottom>
                            ✓ Implemented: {formatDate(app.implementedDate)}
                          </Typography>
                        )}
                        <Typography variant="body2" gutterBottom>
                          {app.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {app.fertilizers?.urea > 0 && (
                            <Typography variant="caption" display="block">
                              Urea: {app.fertilizers.urea} kg
                            </Typography>
                          )}
                          {app.fertilizers?.tsp > 0 && (
                            <Typography variant="caption" display="block">
                              TSP: {app.fertilizers.tsp} kg
                            </Typography>
                          )}
                          {app.fertilizers?.mop > 0 && (
                            <Typography variant="caption" display="block">
                              MOP: {app.fertilizers.mop} kg
                            </Typography>
                          )}
                          {app.fertilizers?.zincSulphate > 0 && (
                            <Typography variant="caption" display="block">
                              Zinc Sulphate: {app.fertilizers.zincSulphate} kg
                            </Typography>
                          )}
                        </Box>
                        {app.notes && (
                          <Box sx={{ mt: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1, borderLeft: 3, borderColor: 'info.main' }}>
                            <Typography variant="caption" sx={{ color: 'info.dark', fontStyle: 'italic' }}>
                              📝 Notes: {app.notes}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Tooltip title={app.applied ? 'Mark as Not Applied' : 'Mark as Applied'}>
                            <IconButton
                              size="small"
                              color={app.applied ? 'success' : 'primary'}
                              onClick={() => handleFertilizerImplementation(index)}
                            >
                              {app.applied ? <CheckIcon /> : <PlayArrowIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add Notes">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleFertilizerImplementation(index)}
                            >
                              <NotesIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
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
                  {/* {plan.actualHarvest?.date && (
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
                  )} */}
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

      {/* Fertilizer Implementation Dialog */}
      <Dialog open={fertilizerDialog.open} onClose={closeFertilizerDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Fertilizer Application
          {fertilizerDialog.index !== null && plan?.fertilizerSchedule?.[fertilizerDialog.index] && (
            <Typography variant="subtitle2" color="textSecondary">
              {plan.fertilizerSchedule[fertilizerDialog.index].stage}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={implementationData.applied}
                  onChange={(e) => setImplementationData({ ...implementationData, applied: e.target.checked })}
                />
              }
              label="Mark as Applied"
              sx={{ mb: 2 }}
            />
            
            {implementationData.applied && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Implementation Date"
                  value={implementationData.implementedDate ? dayjs(implementationData.implementedDate) : null}
                  onChange={(newValue) => {
                    const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
                    setImplementationData({ ...implementationData, implementedDate: dateString });
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mb: 2 }
                    }
                  }}
                />
              </LocalizationProvider>
            )}
            
            <TextField
              label="Notes (optional)"
              multiline
              rows={3}
              value={implementationData.notes}
              onChange={(e) => setImplementationData({ ...implementationData, notes: e.target.value })}
              fullWidth
              placeholder="Add any notes about the fertilizer application..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFertilizerDialog} disabled={saving}>Cancel</Button>
          <Button onClick={saveFertilizerImplementation} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stage Implementation Dialog */}
      <Dialog open={stageDialog.open} onClose={closeStageDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Growing Stage
          {stageDialog.index !== null && plan?.growingStages?.[stageDialog.index] && (
            <Typography variant="subtitle2" color="textSecondary">
              {plan.growingStages[stageDialog.index].stage}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={implementationData.completed}
                  onChange={(e) => setImplementationData({ ...implementationData, completed: e.target.checked })}
                />
              }
              label="Mark as Completed"
              sx={{ mb: 2 }}
            />
            
            {implementationData.completed && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <>
                  <DatePicker
                    label="Actual Start Date"
                    value={implementationData.actualStartDate ? dayjs(implementationData.actualStartDate) : null}
                    onChange={(newValue) => {
                      const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
                      setImplementationData({ ...implementationData, actualStartDate: dateString });
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { mb: 2 }
                      }
                    }}
                  />
                  
                  <DatePicker
                    label="Actual End Date"
                    value={implementationData.actualEndDate ? dayjs(implementationData.actualEndDate) : null}
                    onChange={(newValue) => {
                      const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
                      setImplementationData({ ...implementationData, actualEndDate: dateString });
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { mb: 2 }
                      }
                    }}
                  />
                </>
              </LocalizationProvider>
            )}
            
            <TextField
              label="Notes (optional)"
              multiline
              rows={3}
              value={implementationData.notes}
              onChange={(e) => setImplementationData({ ...implementationData, notes: e.target.value })}
              fullWidth
              placeholder="Add any notes about this growing stage..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStageDialog} disabled={saving}>Cancel</Button>
          <Button onClick={saveStageImplementation} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Harvest Dialog */}
      <Dialog open={harvestDialog} onClose={closeHarvestDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          🌾 Record Harvest Data
          <Typography variant="subtitle2" color="textSecondary">
            Update your actual harvest information
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Harvest Date"
                value={harvestData.date ? dayjs(harvestData.date) : null}
                onChange={(newValue) => {
                  const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
                  setHarvestData({ ...harvestData, date: dateString });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { mb: 2 }
                  }
                }}
              />
            </LocalizationProvider>

            <TextField
              label="Actual Yield (kg)"
              type="number"
              value={harvestData.actualYield}
              onChange={(e) => setHarvestData({ ...harvestData, actualYield: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="Enter actual yield in kg"
            />

            <TextField
              label="Quality Grade"
              select
              value={harvestData.quality}
              onChange={(e) => setHarvestData({ ...harvestData, quality: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select quality grade</option>
              <option value="Premium">Premium</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
              <option value="Below Grade">Below Grade</option>
            </TextField>

            <TextField
              label="Notes (optional)"
              multiline
              rows={3}
              value={harvestData.notes}
              onChange={(e) => setHarvestData({ ...harvestData, notes: e.target.value })}
              fullWidth
              placeholder="Add any notes about the harvest (weather conditions, challenges, etc.)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHarvestDialog} disabled={saving}>Cancel</Button>
          <Button onClick={saveHarvestData} variant="contained" disabled={saving} sx={{
            background: 'linear-gradient(45deg, #228B22, #32CD32)',
            '&:hover': {
              background: 'linear-gradient(45deg, #006400, #228B22)',
            }
          }}>
            {saving ? 'Saving...' : 'Save Harvest'}
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
