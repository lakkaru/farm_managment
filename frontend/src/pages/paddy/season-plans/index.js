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
import BackButton from '../../../components/BackButton';
import { useTranslation } from 'react-i18next';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { seasonPlanAPI } from '../../../services/api';
import { useFarm } from '../../../contexts/FarmContext';
import { toast } from 'react-toastify';

const SeasonPlansContent = () => {
  const { t, i18n } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, plan: null });
  const { selectedFarm } = useFarm();
  
  // Get status filter from URL query parameter
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Parse URL query parameter for status filter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      setStatusFilter(status || '');
    }
  }, []);

  useEffect(() => {
    loadSeasonPlans();
  }, [selectedFarm, statusFilter]);

  const loadSeasonPlans = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedFarm) {
        params.farmId = selectedFarm._id;
      }
      // Don't pass status to API - we'll filter client-side for more reliability
      const response = await seasonPlanAPI.getSeasonPlans(params);
      const allPlans = response.data.data || [];
      
      // Apply status filter client-side if present
      const filteredPlans = statusFilter 
        ? allPlans.filter(plan => plan.status === statusFilter)
        : allPlans;
      
      console.log('Status filter:', statusFilter);
      console.log('Total plans:', allPlans.length);
      console.log('Filtered plans:', filteredPlans.length);
      
      setPlans(filteredPlans);
    } catch (error) {
      console.error('Error loading season plans:', error);
      toast.error(t('seasonPlans.failedToLoad'));
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (plan) => {
    try {
      await seasonPlanAPI.deleteSeasonPlan(plan._id);
      toast.success(t('seasonPlans.seasonPlanDeleted'));
      setDeleteDialog({ open: false, plan: null });
      loadSeasonPlans();
    } catch (error) {
      console.error('Error deleting season plan:', error);
      toast.error(t('seasonPlans.failedToDelete'));
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

  const calculatePlantAge = (seedingDate) => {
    if (!seedingDate) return null;
    const now = new Date();
    const seeding = new Date(seedingDate);
    const diffTime = Math.abs(now - seeding);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDaysToHarvest = (harvestDate) => {
    if (!harvestDate) return null;
    const now = new Date();
    const harvest = new Date(harvestDate);
    const diffTime = harvest - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSeedingDate = (plan) => {
    // For transplanting, use transplanting date if available, otherwise cultivation date
    if (plan.plantingMethod === 'transplanting' && plan.transplantingDate) {
      return plan.transplantingDate;
    }
    // For direct seeding and parachute seeding, use cultivation date
    return plan.cultivationDate;
  };

  const getUnitTranslationKey = (unit) => {
    const unitMap = {
      'hectares': 'hectares',
      'acres': 'acres',
      'perches': 'perches'
    };
    return unitMap[unit] || 'acres';
  };

  const getIrrigationTranslationKey = (irrigationMethod) => {
    const irrigationMap = {
      'Rain fed': 'rainfed',
      'Under irrigation': 'irrigated'
    };
    return irrigationMap[irrigationMethod] || 'rainfed';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>{t('seasonPlans.loadingSeasonPlans')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header - responsive */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
        <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
          <BackButton to="/dashboard" sx={{ mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              {t('seasonPlans.title')}
            </Typography>
            {/* <Typography variant="body1" color="textSecondary">
              {t('seasonPlans.manageSeasonPlans')}
            </Typography> */}
          </Box>
        </Box>
        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/paddy/season-plans/create')}
            sx={{ minWidth: { xs: 'auto', sm: 150 } }}
            size="small"
          >
            {t('seasonPlans.createPlan')}
          </Button>
        </Box>
      </Box>

      {/* Farm Selection Info */}
      {!selectedFarm && plans.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('seasonPlans.viewingAllFarms', { defaultValue: 'Viewing season plans from all farms.' })}
        </Alert>
      )}

      {/* Status Filter Alert */}
      {statusFilter && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          onClose={() => {
            setStatusFilter('');
            navigate('/paddy/season-plans');
          }}
        >
          {t('seasonPlans.filteringByStatus', { 
            status: t(`seasonPlans.${statusFilter}`, { defaultValue: statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) })
          })}{' '}
          {t('seasonPlans.closeToViewAll')}
        </Alert>
      )}

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AgricultureIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {statusFilter 
              ? t('seasonPlans.noPlansWithStatus', { 
                  status: t(`seasonPlans.${statusFilter}`, { defaultValue: statusFilter }),
                  defaultValue: `No ${statusFilter} season plans found`
                })
              : t('seasonPlans.noSeasonPlansFound')}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {statusFilter ? (
              <span>
                {t('seasonPlans.tryDifferentFilter', { defaultValue: 'Try removing the filter to see all plans' })}
              </span>
            ) : (
              selectedFarm
                ? t('seasonPlans.noSeasonPlansForFarm', { farmName: selectedFarm.name })
                : t('seasonPlans.selectFarmToView')
            )}
          </Typography>
          {selectedFarm && !statusFilter && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/paddy/season-plans/create')}
            >
              {t('seasonPlans.createFirstSeasonPlan')}
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => {
            const completedStages = plan.growingStages ? plan.growingStages.filter(stage => stage.completed).length : 0;
            const totalStages = plan.growingStages ? plan.growingStages.length : 0;
            const actualYield = plan.actualHarvest?.actualYield;
            const expectedYieldKg = plan.expectedHarvest?.estimatedYield ? plan.expectedHarvest.estimatedYield * 1000 : null; // expectedHarvest.estimatedYield is in tons
            const percentOfExpected = actualYield && expectedYieldKg ? (actualYield / expectedYieldKg) * 100 : null;
            const percentDisplay = percentOfExpected !== null
              ? percentOfExpected.toLocaleString(i18n.language || 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
              : null;
            return (
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
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: plan.status === 'completed' 
                      ? '0 4px 12px rgba(76, 175, 80, 0.3)'
                      : plan.status === 'active'
                      ? '0 4px 12px rgba(33, 150, 243, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => navigate(`/paddy/season-plans/${plan._id}`)}
              >
                <CardContent sx={{ flex: 1 }}>
                  {/* Farm and Season Info */}
                  <Box sx={{mb:1}}>
                    <Typography variant="h6" gutterBottom>
                      {plan.farmId?.name || 'Unknown Farm'}
                    </Typography>
                    <Chip
                      label={t(`seasonPlans.${plan.season}`, { defaultValue: plan.season.toUpperCase() })}
                      size="small"
                      color={plan.season === 'maha' ? 'primary' : 'secondary'}
                      sx={{ textTransform: 'uppercase' }}
                    />
                  </Box>

                  {/* Status */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={t(`seasonPlans.${plan.status}`, { defaultValue: plan.status.replace('_', ' ').toUpperCase() })}
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
                        {t('seasonPlans.district')}: {plan.farmId?.district || t('common.notSpecified')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WaterIcon sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
                      <Typography variant="body2" color="textSecondary">
                        {t(`seasonPlans.irrigationMethods.${getIrrigationTranslationKey(plan.irrigationMethod)}`, { defaultValue: plan.irrigationMethod || t('common.notSpecified') })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
                      <Typography variant="body2" color="textSecondary">
                        {plan.plantingMethod === 'transplanting' && plan.transplantingDate
                          ? `${t('seasonPlans.transplantingDate', { defaultValue: 'Transplanting' })}: ${formatDate(plan.transplantingDate)}`
                          : `${t('seasonPlans.seedingDate', { defaultValue: 'Seeding' })}: ${formatDate(plan.cultivationDate)}`
                        }
                      </Typography>
                    </Box>
                    {plan.status === 'active' && (() => {
                      const seedingDate = getSeedingDate(plan);
                      const plantAge = calculatePlantAge(seedingDate);
                      const daysToHarvest = plan.expectedHarvest?.date ? calculateDaysToHarvest(plan.expectedHarvest.date) : null;
                      return (
                        <>
                          {plantAge !== null && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AgricultureIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                              <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                                {t('seasonPlans.plantAge', { defaultValue: 'Plant age' })}: {plantAge} {t('seasonPlans.days', { defaultValue: 'days' })}
                              </Typography>
                            </Box>
                          )}
                          {daysToHarvest !== null && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CalendarIcon sx={{ fontSize: 16, mr: 1, color: daysToHarvest > 0 ? 'success.main' : 'warning.main' }} />
                              <Typography variant="body2" sx={{ fontWeight: 'medium', color: daysToHarvest > 0 ? 'success.main' : 'warning.main' }}>
                                {daysToHarvest > 0 
                                  ? `${t('seasonPlans.daysToHarvest', { defaultValue: 'Days to harvest' })}: ${daysToHarvest}`
                                  : t('seasonPlans.harvestDue', { defaultValue: 'Harvest due' })
                                }
                              </Typography>
                            </Box>
                          )}
                        </>
                      );
                    })()}
                  </Box>

                  {/* Area and Variety */}
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('seasonPlans.area')}:</strong> {plan.cultivatingArea} {t(`seasonPlans.units.${getUnitTranslationKey(plan.areaUnit)}`)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('seasonPlans.paddyVariety')}:</strong> {plan.paddyVariety?.name || t('common.notSpecified')}
                  </Typography>

                  {/* Expected Harvest */}
                  {plan.expectedHarvest?.date && (
                    <Typography variant="body2" color="primary">
                      <strong>{t('seasonPlans.expectedHarvest')}:</strong> {formatDate(plan.expectedHarvest.date)}
                      {plan.expectedHarvest.estimatedYield && (
                        <span> ({plan.expectedHarvest.estimatedYield} {t('seasonPlans.units.tons')})</span>
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
                          {t('seasonPlans.viewPage.actualHarvest.completed')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'success.main', fontSize: '0.85rem' }}>
                        <strong>{t('seasonPlans.viewPage.actualHarvest.date')}:</strong> {formatDate(plan.actualHarvest.date)}
                      </Typography>
                      {plan.actualHarvest.actualYield && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5, color: 'success.main' }} />
                            <Typography variant="body2" sx={{ color: 'success.main', fontSize: '0.85rem' }}>
                              <strong>{t('seasonPlans.viewPage.actualHarvest.yield')}:</strong> {plan.actualHarvest.actualYield} {t('seasonPlans.units.kg')}
                              {percentDisplay && (
                                <span style={{ color: '#666', fontSize: '0.8rem' }}>
                                  {' '}({percentDisplay}% {t('seasonPlans.viewPage.actualHarvest.ofExpected')})
                                </span>
                              )}
                            </Typography>
                        </Box>
                      )}
                      {plan.actualHarvest.quality && (
                        <Typography variant="body2" sx={{ color: 'success.main', fontSize: '0.85rem', mt: 0.5 }}>
                          <strong>{t('seasonPlans.viewPage.actualHarvest.quality')}:</strong> {plan.actualHarvest.quality}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Show progress for active plans */}
                  {plan.status === 'active' && plan.growingStages && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'info.main' }}>
                        {t('seasonPlans.progressSummary', {
                          done: completedStages.toLocaleString(i18n.language || 'en-US'),
                          total: totalStages.toLocaleString(i18n.language || 'en-US'),
                          defaultValue: `Progress: ${completedStages}/${totalStages} stages completed`
                        })}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', p: 2, flexWrap: 'wrap', gap: 1 }} onClick={(e) => e.stopPropagation()}>
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
            );
          })}
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
        <DialogTitle>{t('seasonPlans.confirmDeleteTitle')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('seasonPlans.confirmDeleteMessage', {
              season: deleteDialog.plan?.season,
              year: new Date(deleteDialog.plan?.cultivationDate).getFullYear()
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, plan: null })}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.plan)}
            color="error"
            variant="contained"
          >
            {t('common.delete')}
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
