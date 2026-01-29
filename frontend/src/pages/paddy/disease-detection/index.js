import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CardMedia,
  CardActions,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  PhotoCamera as CameraIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as HealthyIcon,
  LocalHospital as TreatmentIcon,
  Info as InfoIcon,
  BugReport as DiseaseIcon,
  Check as CheckIcon,
  Science as NutrientIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import BackButton from '../../../components/BackButton';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { diseaseDetectionAPI } from '../../../services/api';
import { toast } from 'react-toastify';

const PlantDiseaseDetectionContent = () => {
  // ===== COMMENTED OUT: AI IMAGE ANALYSIS FUNCTIONALITY =====
  // Uncomment these when AI detection is ready to be re-enabled
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
  // const [analyzing, setAnalyzing] = useState(false);
  // const [result, setResult] = useState(null);
  const [detailDialog, setDetailDialog] = useState({ open: false, deficiency: null });
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Nutritional deficiency data with sample information
  const nutritionalDeficiencies = [
    {
      id: 1,
      nutrient: 'Nitrogen (N)',
      severity: 'High Impact',
      color: 'warning',
      symptoms: [
        'Uniform yellowing (chlorosis) starting from older leaf tips',
        'Stunted growth and reduced tillering',
        'Light green to yellow older leaves',
        'Younger leaves relatively greener',
        'Reduced plant vigor'
      ],
      visualSigns: [
        'Pale yellow-green coloration of entire plant',
        'V-shaped yellowing pattern from leaf tips',
        'Lower leaves affected first',
        'Symptoms progress upward'
      ],
      causes: [
        'Low soil nitrogen content',
        'Poor organic matter in soil',
        'Heavy rains washing away nitrogen',
        'Sandy soils with low retention',
        'Late or insufficient fertilizer application'
      ],
      treatment: [
        'Apply urea (46-0-0) at 20-25 kg/acre',
        'Split application: 50% basal, 25% tillering, 25% panicle initiation',
        'Use ammonium sulfate (21-0-0) for quick results',
        'Apply calcium ammonium nitrate (CAN) 15-20 kg/acre',
        'Foliar spray of 2% urea solution for quick greening'
      ],
      prevention: [
        'Regular soil testing before planting',
        'Incorporate green manure crops',
        'Apply compost or FYM at 5-10 tons/acre',
        'Use slow-release nitrogen fertilizers',
        'Practice balanced fertilization',
        'Avoid over-irrigation that causes nitrogen leaching'
      ],
      timing: 'Apply immediately at first signs. Response visible in 7-10 days',
      criticalStages: 'Tillering and panicle initiation stages',
      imageUrl: 'http://www.knowledgebank.irri.org/images/stories/nitrogen-deficiency.jpg'
    },
    {
      id: 2,
      nutrient: 'Potassium (K)',
      severity: 'High Impact',
      color: 'error',
      symptoms: [
        'Yellow-orange discoloration starting from older leaf tips',
        'Leaf margins turn yellowish-brown and dry up ("firing")',
        'Poor grain filling and small grains',
        'Weak stems prone to lodging',
        'Dark brown necrotic spots on leaves'
      ],
      visualSigns: [
        'Brown scorched appearance on leaf margins',
        'Symptoms start from tips and edges',
        'Older leaves die prematurely',
        'Stems become weak and break easily'
      ],
      causes: [
        'Low potassium in soil',
        'High nitrogen application without potassium',
        'Sandy or acidic soils',
        'Continuous rice cultivation',
        'Straw removal from fields'
      ],
      treatment: [
        'Apply muriate of potash (KCl) at 15-20 kg/acre',
        'Use potassium sulfate for saline soils',
        'Apply 2% KCl foliar spray',
        'Split application: 50% basal, 50% at panicle initiation',
        'Emergency: Potassium nitrate foliar spray'
      ],
      prevention: [
        'Maintain K:N ratio of 1:1 or higher',
        'Return rice straw to fields',
        'Apply farmyard manure',
        'Use potassium-rich organic fertilizers',
        'Soil testing every season',
        'Avoid excessive nitrogen without potassium'
      ],
      timing: 'Critical at tillering and flowering stages',
      criticalStages: 'Tillering, flowering, and grain filling',
      imageUrl: 'http://www.knowledgebank.irri.org/images/stories/nutrients-potassium-deficiency.jpg'
    },
    {
      id: 3,
      nutrient: 'Phosphorus (P)',
      severity: 'Medium Impact',
      color: 'info',
      symptoms: [
        'Dark green, narrow, erect leaves',
        'Severely stunted growth',
        'Very few tillers',
        'Purple coloration may appear on leaves',
        'Delayed maturity',
        'Poor root development'
      ],
      visualSigns: [
        'Plants remain small and compact',
        'Dark bluish-green color',
        'Purplish tint on leaves and stems',
        'Reduced plant height throughout growth'
      ],
      causes: [
        'Acidic or alkaline soils fixing phosphorus',
        'Low organic matter',
        'Iron or aluminum toxicity',
        'Cold soil temperatures',
        'Waterlogged conditions'
      ],
      treatment: [
        'Apply single superphosphate (SSP) at 30-40 kg/acre',
        'Use diammonium phosphate (DAP) 20-25 kg/acre',
        'Apply rock phosphate in acidic soils',
        'Broadcast and incorporate before planting',
        'Use water-soluble phosphorus for quick action'
      ],
      prevention: [
        'Soil pH maintenance (6.0-7.0)',
        'Apply phosphorus at planting time',
        'Incorporate organic matter',
        'Use phosphorus-solubilizing bacteria',
        'Apply lime in acidic soils',
        'Ensure good drainage'
      ],
      timing: 'Best as basal application before transplanting',
      criticalStages: 'Early vegetative growth',
      imageUrl: 'http://www.knowledgebank.irri.org/images/stories/phosphorus-deficiency-field.jpg'
    },
    {
      id: 4,
      nutrient: 'Zinc (Zn)',
      severity: 'High Impact',
      color: 'warning',
      symptoms: [
        'Dusty brown spots or blotches on older leaves',
        'Chlorosis (whitening) of mid-veins in younger leaves',
        'Reduced plant height',
        'Bronzing of leaves',
        'Stunted growth 2-4 weeks after transplanting'
      ],
      visualSigns: [
        'Brown rusty spots on lower leaves',
        'White or light green mid-ribs',
        'Uneven plant height in field',
        'Plants fail to recover after transplanting shock'
      ],
      causes: [
        'High pH alkaline soils',
        'High phosphorus application',
        'Flooded conditions (anaerobic)',
        'Sandy or calcareous soils',
        'Low organic matter'
      ],
      treatment: [
        'Apply zinc sulfate (ZnSO4) at 10-12 kg/acre',
        'Foliar spray of 0.5% zinc sulfate + 0.25% lime',
        'Soil application before final puddling',
        'Zinc oxide application at 5 kg/acre',
        'Chelated zinc for quick results'
      ],
      prevention: [
        'Apply zinc as basal dose',
        'Maintain optimal soil moisture',
        'Avoid excessive phosphorus',
        'Use zinc-coated urea',
        'Incorporate organic matter',
        'Apply zinc every 2-3 years in deficient areas'
      ],
      timing: 'Apply before transplanting or at first symptoms',
      criticalStages: 'Transplanting to tillering stage',
      imageUrl: 'http://www.knowledgebank.irri.org/images/stories/nutrients-zinc-deficiency.jpg'
    },
    {
      id: 5,
      nutrient: 'Iron (Fe) - Toxicity',
      severity: 'High Impact',
      color: 'error',
      symptoms: [
        'Small brown spots on leaves that coalesce',
        'Bronzed or rusty appearance of foliage',
        'Reddish-brown discoloration',
        'Affects older leaves first',
        'Leaf tips and margins turn brown'
      ],
      visualSigns: [
        'Orange to brown speckling',
        'Leaves appear scorched or burnt',
        'Purple or reddish tinge on leaves',
        'Extensive leaf area covered with spots'
      ],
      causes: [
        'Poorly drained acidic soils (pH < 5.5)',
        'Waterlogged anaerobic conditions',
        'High organic matter in acidic soil',
        'Continuous flooding',
        'Reduction of ferric to ferrous iron'
      ],
      treatment: [
        'Improve drainage to oxidize soil',
        'Intermittent irrigation instead of continuous flooding',
        'Apply lime to raise pH to 6.0-6.5',
        'Apply potassium to counteract toxicity',
        'Use iron toxicity-tolerant varieties',
        'Mid-season drainage for aeration'
      ],
      prevention: [
        'Land leveling for proper drainage',
        'Avoid continuous deep flooding',
        'Apply lime before planting in acidic soils',
        'Use raised bed cultivation',
        'Incorporate rice straw to increase pH',
        'Plant tolerant varieties in problem areas'
      ],
      timing: 'Drainage and lime application before symptoms worsen',
      criticalStages: 'Mid-tillering to flowering',
      imageUrl: 'http://www.knowledgebank.irri.org/images/stories/nutrients-iron-toxicity.jpg'
    },
    {
      id: 6,
      nutrient: 'Sulfur (S)',
      severity: 'Medium Impact',
      color: 'warning',
      symptoms: [
        'Uniform light green to yellow color (whole plant)',
        'Younger leaves more affected than old',
        'Stunted growth',
        'Thin stems',
        'Delayed flowering and maturity'
      ],
      visualSigns: [
        'Overall pale appearance',
        'Similar to nitrogen but affects young leaves',
        'No distinct patterns or spots',
        'Uniform chlorosis across plant'
      ],
      causes: [
        'Sandy soils with low sulfur',
        'Low organic matter',
        'High rainfall areas',
        'Use of sulfur-free fertilizers',
        'Reduced sulfur deposition from atmosphere'
      ],
      treatment: [
        'Apply ammonium sulfate (21-0-0-24S) at 25 kg/acre',
        'Use gypsum (calcium sulfate) at 50 kg/acre',
        'Apply elemental sulfur at 10 kg/acre',
        'Use single superphosphate (contains 12% S)',
        'Foliar spray of 2% ammonium sulfate'
      ],
      prevention: [
        'Use sulfur-containing fertilizers',
        'Apply organic manure',
        'Use ammonium sulfate instead of urea',
        'Apply gypsum in sulfur-deficient areas',
        'Regular soil testing for sulfur'
      ],
      timing: 'Apply at first symptoms or as preventive measure',
      criticalStages: 'Early vegetative stage',
      imageUrl: 'http://www.knowledgebank.irri.org/images/stories/sulfur-deficiency-1.jpg'
    }
  ];

  /* ===== COMMENTED OUT: IMAGE UPLOAD AND ANALYSIS FUNCTIONS =====
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Reset previous results
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setAnalyzing(true);
    
    try {
      // Call the disease detection API
      const response = await diseaseDetectionAPI.analyzeImage(selectedImage);
      setResult(response.data.data);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage = error.response?.data?.message || 'Failed to analyze image. Please try again.';
      toast.error(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };
  ===== END COMMENTED SECTION ===== */

  // Handler to view full details of a deficiency
  const handleViewDetails = (deficiency) => {
    setDetailDialog({ open: true, deficiency });
  };

  // Get severity badge color
  const getSeverityColor = (severity) => {
    if (severity.includes('Critical') || severity.includes('High')) return 'error';
    if (severity.includes('Medium') || severity.includes('Moderate')) return 'warning';
    return 'info';
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: { xs: '100%', lg: 1400 }, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
        <BackButton to="/dashboard" sx={{ mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }} />
        <Box>
          <Typography variant="h4" gutterBottom>
            Rice Plant Nutritional Deficiencies
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Learn to identify and treat common nutritional deficiencies in rice plants
          </Typography>
        </Box>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }} icon={<NutrientIcon />}>
        <Typography variant="body2">
          <strong>Note:</strong> AI-powered disease detection is currently under development. 
          Below you'll find comprehensive information about common nutritional deficiencies and their treatments.
        </Typography>
      </Alert>

      {/* Nutritional Deficiencies Gallery */}
      <Grid container spacing={3}>
        {nutritionalDeficiencies.map((deficiency) => (
          <Grid item xs={12} sm={6} md={4} key={deficiency.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              {/* Deficiency Image */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={deficiency.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image+Available'}
                  alt={deficiency.nutrient}
                  sx={{ 
                    bgcolor: 'grey.200',
                    objectFit: 'cover'
                  }}
                />
                <Chip
                  label={deficiency.severity}
                  color={getSeverityColor(deficiency.severity)}
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 'bold' }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {deficiency.nutrient} Deficiency
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Key Symptoms:</strong>
                </Typography>
                <List dense>
                  {deficiency.symptoms.slice(0, 3).map((symptom, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                      <ListItemText 
                        primary={`• ${symptom}`}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  Critical Stage: {deficiency.criticalStages}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  fullWidth
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewDetails(deficiency)}
                >
                  View Complete Guide
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Deficiency Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, deficiency: null })}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {detailDialog.deficiency && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">
                    {detailDialog.deficiency.nutrient} Deficiency - Complete Guide
                  </Typography>
                  <Chip
                    label={detailDialog.deficiency.severity}
                    color={getSeverityColor(detailDialog.deficiency.severity)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              {/* Visual Reference Image */}
              {detailDialog.deficiency.imageUrl && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <img 
                    src={detailDialog.deficiency.imageUrl} 
                    alt={detailDialog.deficiency.nutrient}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '400px', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
                    Reference Photo: {detailDialog.deficiency.nutrient} Deficiency Symptoms
                  </Typography>
                </Box>
              )}

              {/* Visual Signs */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
                  🔍 Visual Signs
                </Typography>
                <List dense>
                  {detailDialog.deficiency.visualSigns.map((sign, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText primary={`• ${sign}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* All Symptoms */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="warning" />
                All Symptoms
              </Typography>
              <List dense>
                {detailDialog.deficiency.symptoms.map((symptom, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WarningIcon color="warning" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={symptom} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Causes */}
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="info" />
                Common Causes
              </Typography>
              <List dense>
                {detailDialog.deficiency.causes.map((cause, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InfoIcon color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={cause} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Treatment */}
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TreatmentIcon color="success" />
                Treatment Protocol
              </Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Timing:</strong> {detailDialog.deficiency.timing}
                </Typography>
              </Alert>
              <List dense>
                {detailDialog.deficiency.treatment.map((treatment, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TreatmentIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={treatment} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Prevention */}
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckIcon color="primary" />
                Prevention Measures
              </Typography>
              <List dense>
                {detailDialog.deficiency.prevention.map((prevention, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={prevention} />
                  </ListItem>
                ))}
              </List>

              {/* Critical Stages Alert */}
              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Critical Growth Stages:</strong> {detailDialog.deficiency.criticalStages}
                </Typography>
              </Alert>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setDetailDialog({ open: false, deficiency: null })}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

const PlantDiseaseDetection = () => {
  return (
    <AppProviders>
      <Layout>
        <PlantDiseaseDetectionContent />
      </Layout>
    </AppProviders>
  );
};

export default PlantDiseaseDetection;
