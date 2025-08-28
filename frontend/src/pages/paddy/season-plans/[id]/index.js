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
  MenuItem,
  Fab,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  WaterDrop as WaterIcon,
  Terrain as TerrainIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon,
  Notes as NotesIcon,
  Grass as GrassIcon,
  SquareFoot as AreaIcon,
  Science as ScienceIcon,
  Colorize as ColorizeIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Close as CloseIcon,
  Spa as SpaIcon,
  Add as AddIcon,
  Comment as CommentIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import Layout from '../../../../components/Layout/Layout';
import AppProviders from '../../../../providers/AppProviders';
import BackButton from '../../../../components/BackButton';
import { seasonPlanAPI } from '../../../../services/api';
import { toast } from 'react-toastify';

const SeasonPlanViewContent = ({ id }) => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [error, setError] = useState('');
  
  // Daily Remarks Categories
  const remarkCategories = [
    { value: 'general', label: 'General Observation', icon: '📝' },
    { value: 'weather', label: 'Weather Conditions', icon: '🌤️' },
    { value: 'pest', label: 'Pest Activity', icon: '🐛' },
    { value: 'disease', label: 'Disease Symptoms', icon: '🦠' },
    { value: 'fertilizer', label: 'Fertilizer Application', icon: '🌿' },
    { value: 'irrigation', label: 'Irrigation & Water', icon: '💧' },
    { value: 'growth', label: 'Plant Growth', icon: '🌱' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];
  
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

  // Leaf Color Chart states
  const [leafColorEnabled, setLeafColorEnabled] = useState(false);
  const [leafColorDialog, setLeafColorDialog] = useState(false);
  const [leafColorData, setLeafColorData] = useState({
    currentDate: '',
    plantAge: '',
    leafColorIndex: '',
    recommendedUrea: 0,
  });

  // Daily Remarks states
  const [remarkDialog, setRemarkDialog] = useState(false);
  const [editingRemark, setEditingRemark] = useState(null);
  const [remarkData, setRemarkData] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    category: 'general',
    title: '',
    description: '',
    images: []
  });
  const [remarkImages, setRemarkImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deleteRemarkDialog, setDeleteRemarkDialog] = useState(false);
  const [deleteRemarkId, setDeleteRemarkId] = useState(null);
  const [removeImageDialog, setRemoveImageDialog] = useState(false);
  const [removeImageData, setRemoveImageData] = useState({ remarkId: null, imageFilename: null });

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

  // Leaf Color Chart calculation
  const leafColorChart = {
    2: { 2: 25 },
    3: { 2: 25 },
    4: { 2: 60, 3: 20 },
    5: { 2: 80, 3: 40 },
    6: { 2: 37, 3: 22, 4: 7.5 },
    7: { 2: 30, 3: 15 },
    8: { 2: 30, 3: 15 },
  };

  const calculateUreaRecommendation = (plantAge, leafColorIndex) => {
    const ageData = leafColorChart[plantAge];
    if (!ageData) return 0;
    return ageData[leafColorIndex] || 0;
  };

  const calculatePlantAge = (currentDate, cultivationDate) => {
    if (!currentDate || !cultivationDate) return 0;
    const current = new Date(currentDate);
    const cultivation = new Date(cultivationDate);
    const diffTime = current - cultivation; // Remove Math.abs to handle direction
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Use center of week (3.5 days) as breakpoint for age calculation
    // Week 1: 0-6 days (center at 3.5), Week 2: 7-13 days (center at 10.5), etc.
    if (diffDays < 0) return 0; // Before cultivation date
    
    const ageWeeks = Math.floor((diffDays + 3.5) / 7);
    return Math.max(0, ageWeeks); // Ensure non-negative
  };

  const handleLeafColorCalculation = () => {
    if (leafColorData.currentDate && plan?.cultivationDate) {
      const calculatedAge = calculatePlantAge(leafColorData.currentDate, plan.cultivationDate);
      setLeafColorData(prev => ({
        ...prev,
        plantAge: calculatedAge.toString()
      }));
      
      if (calculatedAge && leafColorData.leafColorIndex) {
        const recommended = calculateUreaRecommendation(calculatedAge, parseInt(leafColorData.leafColorIndex));
        setLeafColorData(prev => ({
          ...prev,
          plantAge: calculatedAge.toString(),
          recommendedUrea: recommended
        }));
      }
    }
  };

  // Save LCC-based fertilizer application to database
  const saveLCCFertilizerApplication = async () => {
    if (saving) return;
    setSaving(true);
    toastShownRef.current = false;

    try {
      const response = await seasonPlanAPI.addLCCFertilizerApplication(id, {
        plantAge: leafColorData.plantAge,
        leafColorIndex: leafColorData.leafColorIndex,
        recommendedUrea: leafColorData.recommendedUrea,
        notes: `LCC-based urea application - ${leafColorData.recommendedUrea}kg per acre recommended for plant age ${leafColorData.plantAge} weeks with leaf color index ${leafColorData.leafColorIndex}`
      });

      setPlan(response.data.data);
      setLeafColorDialog(false);
      setLeafColorData({ plantAge: '', leafColorIndex: '', recommendedUrea: 0 });

      // Reload plan data to get updated fertilizer schedule
      await loadSeasonPlan();

      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast.success(`🌱 LCC-based urea application added: ${leafColorData.recommendedUrea * plan.cultivatingArea}kg total`);
      }
    } catch (error) {
      console.error('Error saving LCC fertilizer application:', error);
      toast.error('Failed to save LCC-based fertilizer application');
    } finally {
      setSaving(false);
    }
  };

  // Reset leaf color dialog data
  const resetLeafColorDialog = () => {
    setLeafColorDialog(false);
    setLeafColorData({ 
      currentDate: '', 
      plantAge: '', 
      leafColorIndex: '', 
      recommendedUrea: 0 
    });
  };

  // Delete fertilizer application
  const deleteFertilizerApplication = async (applicationIndex) => {
    if (saving) return;
    setSaving(true);
    toastShownRef.current = false;

    try {
      const application = plan.fertilizerSchedule[applicationIndex];
      
      // Check if application is already applied
      if (application.applied) {
        toast.error('Cannot delete an applied fertilizer application');
        setSaving(false);
        return;
      }

      const response = await seasonPlanAPI.deleteFertilizerApplication(id, applicationIndex);
      setPlan(response.data.data);
      
      // Reload plan data to get updated fertilizer schedule
      await loadSeasonPlan();
      
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        const deletedType = application.isLCCBased ? 'LCC-based' : 'Scheduled';
        toast.success(`🗑️ ${deletedType} fertilizer application deleted successfully`);
      }
    } catch (error) {
      console.error('Error deleting fertilizer application:', error);
      toast.error(error.response?.data?.message || 'Failed to delete fertilizer application');
    } finally {
      setSaving(false);
    }
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

  // Daily Remarks functions
  const openRemarkDialog = (remark = null) => {
    console.log('Opening remark dialog with remark:', remark);
    if (remark) {
      setEditingRemark(remark);
      console.log('Remark images:', remark.images);
      const remarkDataToSet = {
        date: dayjs(remark.date).format('YYYY-MM-DD'),
        category: remark.category,
        title: remark.title,
        description: remark.description,
        images: remark.images || []
      };
      console.log('Setting remarkData:', remarkDataToSet);
      setRemarkData(remarkDataToSet);
    } else {
      setEditingRemark(null);
      setRemarkData({
        date: dayjs().format('YYYY-MM-DD'),
        category: 'general',
        title: '',
        description: '',
        images: []
      });
    }
    setRemarkImages([]);
    setRemarkDialog(true);
  };

  const closeRemarkDialog = () => {
    setRemarkDialog(false);
    setEditingRemark(null);
    setRemarkData({
      date: dayjs().format('YYYY-MM-DD'),
      category: 'general',
      title: '',
      description: '',
      images: []
    });
    setRemarkImages([]);
  };

  const handleRemarkImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size
        });
        
        if (newImages.length === files.length) {
          setRemarkImages(prev => [...prev, ...newImages]);
          setUploadingImages(false);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    event.target.value = '';
  };

  const removeDialogImage = (index) => {
    setRemarkImages(prev => prev.filter((_, i) => i !== index));
  };

  const saveRemark = async () => {
    if (!remarkData.title.trim() || !remarkData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (saving) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('date', remarkData.date);
      formData.append('category', remarkData.category);
      formData.append('title', remarkData.title);
      formData.append('description', remarkData.description);

      // Add images
      remarkImages.forEach((imageObj, index) => {
        if (imageObj.file) {
          formData.append('images', imageObj.file);
        }
      });

      let response;
      if (editingRemark) {
        // Update existing remark
        response = await seasonPlanAPI.updateDailyRemark(id, editingRemark._id, formData);
        toast.success('📝 Daily remark updated successfully');
      } else {
        // Add new remark
        response = await seasonPlanAPI.addDailyRemark(id, formData);
        toast.success('📝 Daily remark added successfully');
      }

      // Update plan data
      setPlan(response.data.data);
      closeRemarkDialog();
      
    } catch (error) {
      console.error('Error saving daily remark:', error);
      toast.error('Failed to save daily remark');
    } finally {
      setSaving(false);
    }
  };

  const deleteRemark = async (remarkId) => {
    setDeleteRemarkId(remarkId);
    setDeleteRemarkDialog(true);
  };

  const confirmDeleteRemark = async () => {
    if (!deleteRemarkId) return;

    try {
      const response = await seasonPlanAPI.deleteDailyRemark(id, deleteRemarkId);
      setPlan(response.data.data);
      toast.success('🗑️ Daily remark deleted successfully');
      setDeleteRemarkDialog(false);
      setDeleteRemarkId(null);
    } catch (error) {
      console.error('Error deleting daily remark:', error);
      toast.error('Failed to delete daily remark');
    }
  };

  const removeRemarkImage = async (remarkId, imageFilename) => {
    setRemoveImageData({ remarkId, imageFilename });
    setRemoveImageDialog(true);
  };

  const confirmRemoveImage = async () => {
    const { remarkId, imageFilename } = removeImageData;
    if (!remarkId || !imageFilename) return;

    try {
      const response = await seasonPlanAPI.removeRemarkImage(id, remarkId, imageFilename);
      setPlan(response.data.data);
      
      // Update remarkData if we're currently editing this remark
      if (editingRemark && editingRemark._id === remarkId) {
        const updatedRemark = response.data.data.dailyRemarks.find(r => r._id === remarkId);
        if (updatedRemark) {
          setRemarkData(prev => ({
            ...prev,
            images: updatedRemark.images || []
          }));
        }
      }
      
      toast.success('🖼️ Image removed successfully');
      setRemoveImageDialog(false);
      setRemoveImageData({ remarkId: null, imageFilename: null });
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const getCategoryInfo = (category) => {
    return remarkCategories.find(cat => cat.value === category) || remarkCategories[7]; // Default to 'other'
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
          <BackButton to="/paddy/season-plans" variant="button" label="Back" />
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
                    <SpaIcon />
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  🌿 Fertilizer Schedule
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Leaf Color Chart:</Typography>
                    <IconButton
                      size="small"
                      onClick={() => setLeafColorEnabled(!leafColorEnabled)}
                      sx={{ color: leafColorEnabled ? 'success.main' : 'grey.400' }}
                    >
                      {leafColorEnabled ? <ToggleOnIcon /> : <ToggleOffIcon />}
                    </IconButton>
                  </Box>
                  {leafColorEnabled && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ColorizeIcon />}
                      onClick={() => {
                        setLeafColorData({
                          currentDate: dayjs().format('YYYY-MM-DD'),
                          plantAge: '',
                          leafColorIndex: '',
                          recommendedUrea: 0
                        });
                        setLeafColorDialog(true);
                      }}
                      sx={{
                        borderColor: '#90EE90',
                        color: '#228B22',
                        '&:hover': {
                          borderColor: '#228B22',
                          backgroundColor: '#F0FFF0'
                        }
                      }}
                    >
                      Check Leaf Color
                    </Button>
                  )}
                </Box>
              </Box>
              <Grid container spacing={2}>
                {plan.fertilizerSchedule?.map((app, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          height: '100%',
                          background: app.applied 
                            ? 'linear-gradient(135deg, #98FB98, #90EE90)'
                            : app.isLCCBased 
                              ? 'linear-gradient(135deg, #E3F2FD, #BBDEFB)'
                              : 'linear-gradient(135deg, #F5F5F5, #FFF8E7)',
                          borderLeft: `4px solid ${app.applied ? '#006400' : app.isLCCBased ? '#1976D2' : '#FFD700'}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: app.isLCCBased 
                              ? '0 4px 12px rgba(25, 118, 210, 0.4)'
                              : '0 4px 12px rgba(255, 215, 0, 0.4)'
                          }
                        }}
                      >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {app.isLCCBased ? (
                            <ColorizeIcon sx={{ mr: 1, color: app.applied ? 'success.main' : 'primary.main' }} />
                          ) : (
                            <ScienceIcon sx={{ mr: 1, color: app.applied ? 'success.main' : 'grey.400' }} />
                          )}
                          <Typography variant="subtitle2">
                            {app.stage}
                          </Typography>
                          {app.applied && (
                            <CheckCircleIcon sx={{ ml: 'auto', color: 'success.main' }} />
                          )}
                          {app.isLCCBased && !app.applied && (
                            <Chip 
                              label="LCC" 
                              size="small" 
                              sx={{ ml: 'auto', bgcolor: 'primary.main', color: 'white', fontSize: '0.6rem' }} 
                            />
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
                        
                        {/* LCC Data Display */}
                        {app.isLCCBased && app.lccData && (
                          <Box sx={{ 
                            mt: 1, 
                            p: 1, 
                            backgroundColor: '#E3F2FD', 
                            borderRadius: 1, 
                            borderLeft: 3, 
                            borderColor: 'primary.main' 
                          }}>
                            <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
                              📊 LCC Data: Age {app.lccData.plantAge}w, Color Index {app.lccData.leafColorIndex}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ color: 'primary.dark' }}>
                              Recommended: {app.lccData.recommendedPerAcre}kg/acre × {app.lccData.totalArea} acres
                            </Typography>
                          </Box>
                        )}

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
                          {!app.applied && (
                            <Tooltip title={`Delete ${app.isLCCBased ? 'LCC-based' : 'scheduled'} fertilizer application`}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => deleteFertilizerApplication(index)}
                                disabled={saving}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Remarks */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CommentIcon sx={{ mr: 1 }} />
                  Daily Remarks
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => openRemarkDialog()}
                  sx={{
                    background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
                    }
                  }}
                >
                  Add Remark
                </Button>
              </Box>
              
              {plan.dailyRemarks && plan.dailyRemarks.length > 0 ? (
                <Grid container spacing={2}>
                  {plan.dailyRemarks
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
                    .map((remark, index) => {
                      const categoryInfo = getCategoryInfo(remark.category);
                      return (
                        <Grid item xs={12} sm={6} md={4} key={remark._id || index}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              height: '100%',
                              background: 'linear-gradient(135deg, #F8F9FA, #E9ECEF)',
                              borderLeft: `4px solid #4CAF50`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
                              }
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar 
                                  sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    backgroundColor: 'transparent',
                                    fontSize: '1rem',
                                    mr: 1 
                                  }}
                                >
                                  {categoryInfo.icon}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {remark.title}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {categoryInfo.label}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      onClick={() => openRemarkDialog(remark)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => deleteRemark(remark._id)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                              
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                📅 {formatDate(remark.date)}
                              </Typography>
                              
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {remark.description}
                              </Typography>
                              
                              {remark.images && remark.images.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PhotoCameraIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                    {remark.images.length} image(s)
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {remark.images.slice(0, 3).map((image, imgIndex) => {
                                      const imageUrl = `${process.env.GATSBY_API_URL}/season-plans/remark-image/${image.filename}`;
                                      console.log('Loading thumbnail image:', imageUrl);
                                      console.log('Environment GATSBY_API_URL:', process.env.GATSBY_API_URL);
                                      console.log('Image filename:', image.filename);
                                      
                                      return (
                                        <Box
                                          key={imgIndex}
                                          sx={{
                                            width: 60,
                                            height: 60,
                                            border: '2px solid #ddd',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f5f5f5',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                              border: '2px solid #4CAF50',
                                              '& .remove-image-btn': {
                                                opacity: 1
                                              }
                                            }
                                          }}
                                          title={`Image: ${image.originalName || image.filename}`}
                                        >
                                          <img
                                            src={imageUrl}
                                            alt=""
                                            crossOrigin="anonymous"
                                            style={{
                                              maxWidth: '100%',
                                              maxHeight: '100%',
                                              objectFit: 'cover',
                                              width: '100%',
                                              height: '100%'
                                            }}
                                            onClick={() => {
                                              console.log('Opening image in new tab:', imageUrl);
                                              window.open(imageUrl, '_blank');
                                            }}
                                            onLoad={() => {
                                              console.log('✅ Thumbnail loaded successfully:', imageUrl);
                                            }}
                                            onError={(e) => {
                                              console.error('❌ Thumbnail failed to load:', imageUrl);
                                              console.error('Error event:', e);
                                              // Hide the image and show fallback
                                              e.target.style.display = 'none';
                                              const parent = e.target.parentElement;
                                              parent.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #999;">📷</div>`;
                                            }}
                                          />
                                          <IconButton
                                            className="remove-image-btn"
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation(); // Prevent opening image in new tab
                                              removeRemarkImage(remark._id, image.filename);
                                            }}
                                            sx={{
                                              position: 'absolute',
                                              top: 2,
                                              right: 2,
                                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                              opacity: 0,
                                              transition: 'opacity 0.2s',
                                              width: 20,
                                              height: 20,
                                              '&:hover': {
                                                backgroundColor: '#ffebee',
                                                color: '#f44336'
                                              }
                                            }}
                                          >
                                            <CloseIcon sx={{ fontSize: 14 }} />
                                          </IconButton>
                                        </Box>
                                      );
                                    })}
                                    {remark.images.length > 3 && (
                                      <Box
                                        sx={{
                                          width: 60,
                                          height: 60,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          backgroundColor: '#f8f9fa',
                                          borderRadius: 2,
                                          border: '2px solid #e0e0e0',
                                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                          fontSize: '0.8rem',
                                          fontWeight: 'bold',
                                          color: '#666',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          '&:hover': {
                                            backgroundColor: '#e8f5e8',
                                            border: '2px solid #4CAF50',
                                            transform: 'scale(1.05)'
                                          }
                                        }}
                                        onClick={() => {
                                          // Show first additional image for now
                                          if (remark.images[3]) {
                                            window.open(`${process.env.GATSBY_API_URL}/season-plans/remark-image/${remark.images[3].filename}`, '_blank');
                                          }
                                        }}
                                      >
                                        +{remark.images.length - 3}
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                </Grid>
              ) : (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 4, 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: 2,
                    border: '2px dashed #dee2e6'
                  }}
                >
                  <CommentIcon sx={{ fontSize: 48, color: '#6c757d', mb: 1 }} />
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No daily remarks yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Start documenting your daily observations and notes about this season
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => openRemarkDialog()}
                    sx={{ color: '#4CAF50', borderColor: '#4CAF50' }}
                  >
                    Add Your First Remark
                  </Button>
                </Box>
              )}
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

      {/* Leaf Color Chart Dialog */}
      <Dialog open={leafColorDialog} onClose={resetLeafColorDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          🌱 Leaf Color Chart - Urea Recommendation
          <Typography variant="subtitle2" color="textSecondary">
            Check leaf color and get urea recommendation for your paddy field
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Current Date"
                value={leafColorData.currentDate ? dayjs(leafColorData.currentDate) : dayjs()}
                onChange={(newValue) => {
                  const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
                  setLeafColorData(prev => ({ 
                    ...prev, 
                    currentDate: dateString,
                    plantAge: '',
                    recommendedUrea: 0
                  }));
                  
                  // Auto-calculate plant age when date changes
                  if (dateString && plan?.cultivationDate) {
                    const calculatedAge = calculatePlantAge(dateString, plan.cultivationDate);
                    setLeafColorData(prev => ({
                      ...prev,
                      currentDate: dateString,
                      plantAge: calculatedAge.toString()
                    }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { mb: 3 },
                    helperText: plan?.cultivationDate 
                      ? `Cultivation started: ${formatDate(plan.cultivationDate)}`
                      : 'Cultivation date not available'
                  }
                }}
              />
            </LocalizationProvider>

            <TextField
              label="Plant Age"
              value={leafColorData.plantAge ? `${leafColorData.plantAge} weeks` : ''}
              fullWidth
              disabled
              sx={{ mb: 3 }}
              helperText="Plant age is automatically calculated from current date and cultivation date"
              InputProps={{
                style: {
                  backgroundColor: '#f5f5f5'
                }
              }}
            />

            {leafColorData.plantAge && parseInt(leafColorData.plantAge) >= 2 && parseInt(leafColorData.plantAge) <= 8 && (
              <TextField
                label="Leaf Color Index"
                select
                value={leafColorData.leafColorIndex}
                onChange={(e) => {
                  const newIndex = e.target.value;
                  setLeafColorData(prev => ({ ...prev, leafColorIndex: newIndex }));
                  if (newIndex && leafColorData.plantAge) {
                    const recommended = calculateUreaRecommendation(
                      parseInt(leafColorData.plantAge),
                      parseInt(newIndex)
                    );
                    setLeafColorData(prev => ({ ...prev, leafColorIndex: newIndex, recommendedUrea: recommended }));
                  }
                }}
                fullWidth
                sx={{ mb: 3 }}
                SelectProps={{
                  native: true,
                  displayEmpty: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="Compare your paddy leaves with the color chart and select the closest match"
              >
                <option value="" disabled>Select leaf color index</option>
                {leafColorData.plantAge && leafColorChart[leafColorData.plantAge] && 
                  Object.keys(leafColorChart[leafColorData.plantAge]).map(colorIndex => (
                    <option key={colorIndex} value={colorIndex}>
                      Index {colorIndex} - {colorIndex === '2' ? 'Light Green (Pale)' : 
                                          colorIndex === '3' ? 'Medium Green (Normal)' : 
                                          'Dark Green (Rich)'}
                    </option>
                  ))
                }
              </TextField>
            )}

            {leafColorData.plantAge && (parseInt(leafColorData.plantAge) < 2 || parseInt(leafColorData.plantAge) > 8) && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#FFF3E0', 
                borderRadius: 2,
                border: '2px solid #FFB74D',
                mb: 3
              }}>
                <Typography variant="body2" sx={{ color: '#F57C00' }}>
                  ⚠️ Leaf Color Chart is applicable only for plants aged 2-8 weeks. 
                  Your plant is currently {leafColorData.plantAge} weeks old.
                </Typography>
              </Box>
            )}

            {leafColorData.recommendedUrea > 0 && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#E8F5E8', 
                borderRadius: 2,
                border: '2px solid #90EE90',
                mb: 2
              }}>
                <Typography variant="h6" sx={{ color: '#006400', mb: 1, display: 'flex', alignItems: 'center' }}>
                  <ColorizeIcon sx={{ mr: 1 }} />
                  Urea Recommendation
                </Typography>
                <Typography variant="body1" sx={{ color: '#228B22', fontWeight: 'bold', mb: 1 }}>
                  Apply {leafColorData.recommendedUrea} kg of Urea per acre
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Based on {leafColorData.plantAge} weeks plant age and leaf color index {leafColorData.leafColorIndex}
                </Typography>
                <Typography variant="body2" sx={{ color: '#228B22', fontWeight: 'bold' }}>
                  Total for {plan?.cultivatingArea} acres: {(leafColorData.recommendedUrea * (plan?.cultivatingArea || 0)).toFixed(1)} kg
                </Typography>
              </Box>
            )}

            {leafColorData.plantAge && leafColorData.leafColorIndex && leafColorData.recommendedUrea === 0 && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#E3F2FD', 
                borderRadius: 2,
                border: '2px solid #90CAF9',
                mb: 2
              }}>
                <Typography variant="body1" sx={{ color: '#1976D2' }}>
                  ✅ No urea application needed for this combination of plant age and leaf color index.
                  Your paddy appears to have adequate nitrogen levels.
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#F5F5F5', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                📋 Leaf Color Chart Guide:
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                • <strong>Index 2 (Light Green):</strong> Leaves appear pale, yellowish-green
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                • <strong>Index 3 (Medium Green):</strong> Normal healthy green color
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                • <strong>Index 4 (Dark Green):</strong> Deep, rich green color
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: '#666' }}>
                Compare the youngest fully expanded leaf with the standard color chart
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetLeafColorDialog}>
            Close
          </Button>
          {leafColorData.recommendedUrea > 0 && (
            <Button 
              variant="contained" 
              disabled={saving}
              sx={{
                background: 'linear-gradient(45deg, #228B22, #32CD32)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #006400, #228B22)',
                }
              }}
              onClick={saveLCCFertilizerApplication}
            >
              {saving ? 'Adding...' : 'Add to Fertilizer Schedule'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Daily Remarks Dialog */}
      <Dialog open={remarkDialog} onClose={closeRemarkDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRemark ? 'Edit Daily Remark' : 'Add Daily Remark'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={dayjs(remarkData.date)}
                    onChange={(newValue) => setRemarkData({
                      ...remarkData, 
                      date: newValue.format('YYYY-MM-DD')
                    })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Category"
                  value={remarkData.category}
                  onChange={(e) => setRemarkData({ ...remarkData, category: e.target.value })}
                  fullWidth
                >
                  {remarkCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 8 }}>{category.icon}</span>
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  value={remarkData.title}
                  onChange={(e) => setRemarkData({ ...remarkData, title: e.target.value })}
                  fullWidth
                  required
                  placeholder="Brief title for your observation"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={remarkData.description}
                  onChange={(e) => setRemarkData({ ...remarkData, description: e.target.value })}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  placeholder="Detailed description of your observation or note"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Attach Images (Optional)
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="remark-image-upload"
                    multiple
                    type="file"
                    onChange={handleRemarkImageUpload}
                  />
                  <label htmlFor="remark-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={uploadingImages ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                      disabled={uploadingImages}
                      sx={{ mr: 1 }}
                    >
                      {uploadingImages ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </label>
                  <Typography variant="caption" color="textSecondary">
                    Support JPG, PNG, GIF up to 5MB each
                  </Typography>
                </Box>
                
                {remarkImages.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="textSecondary" gutterBottom display="block">
                      Selected Images:
                    </Typography>
                    <Grid container spacing={1}>
                      {remarkImages.map((imageObj, index) => (
                        <Grid item key={index}>
                          <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Box
                              component="img"
                              src={imageObj.preview}
                              alt={imageObj.name}
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid #ddd'
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                backgroundColor: 'error.main',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'error.dark',
                                }
                              }}
                              onClick={() => removeDialogImage(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                
                {editingRemark && remarkData.images && remarkData.images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="textSecondary" gutterBottom display="block">
                      Existing Images ({remarkData.images.length}):
                    </Typography>
                    <Grid container spacing={1}>
                      {remarkData.images.filter(image => image && image.filename).map((image, index) => {
                        const imageUrl = `${process.env.GATSBY_API_URL}/season-plans/remark-image/${image.filename}`;
                        console.log('Edit dialog - Loading image:', imageUrl);
                        console.log('Edit dialog - Environment GATSBY_API_URL:', process.env.GATSBY_API_URL);
                        console.log('Edit dialog - Image data:', image);
                        return (
                          <Grid item key={index}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                              <Box
                                component="img"
                                src={imageUrl}
                                alt={image.originalName || image.filename}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  border: '1px solid #ddd',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  console.log('Edit dialog - Opening image in new tab:', imageUrl);
                                  window.open(imageUrl, '_blank');
                                }}
                                onLoad={() => {
                                  console.log('✅ Edit dialog - Thumbnail loaded successfully:', imageUrl);
                                }}
                                onError={(e) => {
                                  console.error('❌ Edit dialog - Thumbnail failed to load:', imageUrl);
                                  console.error('Edit dialog - Error event:', e);
                                  console.error('Edit dialog - Image src:', e.target.src);
                                  e.target.style.display = 'none';
                                  const parent = e.target.parentElement;
                                  if (parent.querySelector('.fallback-icon')) return;
                                  const fallback = document.createElement('div');
                                  fallback.className = 'fallback-icon';
                                  fallback.style.cssText = 'width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 4px; border: 1px solid #ddd; color: #999; font-size: 24px;';
                                  fallback.textContent = '📷';
                                  parent.appendChild(fallback);
                                }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: -8,
                                  right: -8,
                                  backgroundColor: 'error.main',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: 'error.dark',
                                  }
                                }}
                                onClick={() => removeRemarkImage(editingRemark._id, image.filename)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRemarkDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={saveRemark} 
            disabled={saving || !remarkData.title.trim() || !remarkData.description.trim()}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
              }
            }}
          >
            {saving ? 'Saving...' : (editingRemark ? 'Update' : 'Add Remark')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Remark Confirmation Dialog */}
      <Dialog open={deleteRemarkDialog} onClose={() => setDeleteRemarkDialog(false)}>
        <DialogTitle>Confirm Delete Daily Remark</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this daily remark? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRemarkDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteRemark} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Image Confirmation Dialog */}
      <Dialog open={removeImageDialog} onClose={() => setRemoveImageDialog(false)}>
        <DialogTitle>Confirm Remove Image</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this image? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveImageDialog(false)}>Cancel</Button>
          <Button onClick={confirmRemoveImage} color="error" variant="contained">
            Remove
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
