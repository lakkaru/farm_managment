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
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import BackButton from '../../../components/BackButton';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { diseaseDetectionAPI } from '../../../services/api';
import { toast } from 'react-toastify';

const PlantDiseaseDetectionContent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [detailDialog, setDetailDialog] = useState({ open: false, disease: null });
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

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

  const getMockDiagnosisResult = () => {
    const diseases = [
      {
        id: 1,
        name: 'Bacterial Leaf Blight',
        confidence: 87,
        severity: 'high',
        description: 'A bacterial disease that causes yellowing and drying of leaves',
        symptoms: ['Yellow stripes on leaves', 'Wilting', 'Leaf drying'],
        treatment: [
          'Apply copper-based fungicides',
          'Improve field drainage',
          'Use resistant varieties',
          'Remove infected plants'
        ],
        prevention: [
          'Use certified seeds',
          'Maintain proper plant spacing',
          'Avoid overhead irrigation',
          'Practice crop rotation'
        ]
      },
      {
        id: 2,
        name: 'Brown Spot',
        confidence: 23,
        severity: 'low',
        description: 'Fungal disease causing brown spots on leaves',
        symptoms: ['Circular brown spots', 'Yellow halos around spots'],
        treatment: ['Apply fungicides', 'Improve air circulation'],
        prevention: ['Balanced fertilization', 'Proper water management']
      }
    ];

    return {
      isHealthy: false,
      healthScore: 65,
      diseases: diseases,
      recommendations: [
        'Immediate treatment required for Bacterial Leaf Blight',
        'Monitor closely for disease progression',
        'Consider consulting agricultural extension officer',
        'Document treatment progress with follow-up photos'
      ]
    };
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info',
    };
    return colors[severity] || 'default';
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const handleViewDetails = (disease) => {
    setDetailDialog({ open: true, disease });
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: { xs: '100%', md: 1200 }, mx: 'auto' }}>
      {/* Header - responsive */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
        <BackButton to="/dashboard" sx={{ mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }} />
        <Box>
          <Typography variant="h4" gutterBottom>
            Plant Disease Detection
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Upload a photo of your paddy plant to detect diseases and get treatment recommendations
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Plant Image
            </Typography>
            
            {!imagePreview ? (
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Click to upload image
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Or drag and drop an image here
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Supported formats: JPG, PNG, GIF, WebP, HEIC, HEIF (Max 10MB)
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Plant preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<UploadIcon />}
                  >
                    Change Image
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetAnalysis}
                    color="error"
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              capture="environment"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<CameraIcon />}
                onClick={() => cameraInputRef.current?.click()}
              >
                Take Photo
              </Button>
              
              <Button
                variant="contained"
                onClick={analyzeImage}
                disabled={!selectedImage || analyzing}
                startIcon={analyzing ? <CircularProgress size={20} /> : <DiseaseIcon />}
              >
                {analyzing ? 'Analyzing...' : 'Analyze Plant'}
              </Button>
            </Box>
          </Paper>

          {/* Instructions */}
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              📸 Photo Guidelines:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="• Take clear, well-lit photos"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="• Focus on affected leaves or areas"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="• Avoid shadows and blur"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="• Include some healthy parts for comparison"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          {analyzing && (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Analyzing Your Plant...
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Our AI is examining the image for disease symptoms
              </Typography>
            </Paper>
          )}

          {result && (
            <Box>
              {/* Analysis Metadata */}
              {result.analysisMetadata && (
                <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Analysis Details
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Chip 
                      size="small" 
                      label={`Quality: ${result.analysisMetadata.imageQuality}%`}
                      color={result.analysisMetadata.imageQuality > 80 ? 'success' : result.analysisMetadata.imageQuality > 60 ? 'warning' : 'error'}
                    />
                    <Chip size="small" label={`Model: ${result.analysisMetadata.modelVersion}`} />
                    <Chip size="small" label={`Confidence: ${result.analysisMetadata.confidenceLevel}%`} />
                    <Chip 
                      size="small" 
                      label={`Processing: ${(result.analysisMetadata.processingTime / 1000).toFixed(1)}s`} 
                    />
                  </Box>
                </Paper>
              )}

              {/* Health Score */}
              <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Plant Health Score
                  </Typography>
                  <Chip
                    label={`${result.healthScore}%`}
                    color={getHealthScoreColor(result.healthScore)}
                    size="large"
                    icon={result.healthScore >= 80 ? <HealthyIcon /> : <WarningIcon />}
                  />
                </Box>
                
                {result.isHealthy ? (
                  <Alert severity="success" icon={<HealthyIcon />}>
                    Your plant appears to be healthy! Continue with regular care.
                  </Alert>
                ) : (
                  <Alert severity="warning" icon={<WarningIcon />}>
                    Disease symptoms detected. Review the analysis below for treatment recommendations.
                  </Alert>
                )}
              </Paper>

              {/* Detected Diseases */}
              {result.diseases.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Detected Diseases
                  </Typography>
                  
                  {result.diseases.map((disease) => (
                    <Card key={disease.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {disease.name}
                          </Typography>
                          <Box display="flex" gap={1}>
                            <Chip
                              label={`${disease.confidence}% confidence`}
                              size="small"
                              color="primary"
                            />
                            <Chip
                              label={disease.severity}
                              size="small"
                              color={getSeverityColor(disease.severity)}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" paragraph>
                          <strong>Scientific name:</strong> {disease.scientificName}
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {disease.description}
                        </Typography>
                        
                        {disease.economicImpact && (
                          <Alert severity="info" sx={{ mb: 2 }}>
                            <strong>Economic Impact:</strong> {disease.economicImpact}
                          </Alert>
                        )}
                        
                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                          <Chip 
                            size="small" 
                            label={`Common in: ${disease.commonRegions?.[0] || 'Various regions'}`}
                            variant="outlined"
                          />
                          <Chip 
                            size="small" 
                            label={`Season: ${disease.seasonality?.split(' ')[0] || 'Year-round'}`}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewDetails(disease)}
                        >
                          View Treatment Guide
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Paper>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  
                  <List>
                    {result.recommendations.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Disease Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, disease: null })}
        maxWidth="md"
        fullWidth
      >
        {detailDialog.disease && (
          <>
            <DialogTitle>
              <Box>
                <Typography variant="h6">
                  {detailDialog.disease.name} - Complete Guide
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {detailDialog.disease.scientificName}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {detailDialog.disease.description}
              </Typography>

              {detailDialog.disease.identificationFeatures && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Key Identification Features:
                  </Typography>
                  <List dense>
                    {detailDialog.disease.identificationFeatures.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Symptoms:
              </Typography>
              <List dense>
                {detailDialog.disease.symptoms.map((symptom, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={symptom} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Treatment Protocol:
              </Typography>
              <List dense>
                {detailDialog.disease.treatment.map((treatment, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TreatmentIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={treatment} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Prevention Measures:
              </Typography>
              <List dense>
                {detailDialog.disease.prevention.map((prevention, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={prevention} />
                  </ListItem>
                ))}
              </List>

              {detailDialog.disease.similarDiseases && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Similar diseases to consider:</strong> {detailDialog.disease.similarDiseases.join(', ')}
                    </Typography>
                  </Alert>
                </>
              )}

              {detailDialog.disease.economicImpact && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Economic Impact:</strong> {detailDialog.disease.economicImpact}
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialog({ open: false, disease: null })}>
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
