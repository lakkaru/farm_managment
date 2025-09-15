import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  Photo as PhotoIcon,
  Science as ScienceIcon,
  LocalHospital as TreatmentIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';

const diseaseDatabase = [
  {
    id: 1,
    name: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae pv. oryzae'
  },
  {
    id: 2,
    name: 'Brown Spot',
    scientificName: 'Bipolaris oryzae'
  },
  {
    id: 3,
    name: 'Rice Blast',
    scientificName: 'Magnaporthe oryzae'
  },
  {
    id: 4,
    name: 'Sheath Blight',
    scientificName: 'Rhizoctonia solani'
  },
  {
    id: 5,
    name: 'False Smut',
    scientificName: 'Ustilaginoidea virens'
  },
  {
    id: 6,
    name: 'Leaf Scald',
    scientificName: 'Monographella albescens'
  }
];

const AdminDiseaseReferencesContent = () => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialog, setUploadDialog] = useState({ open: false, diseaseId: null });
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewDialog, setPreviewDialog] = useState({ open: false, images: [], disease: null });

  // Form data for uploads
  const [formData, setFormData] = useState({
    descriptions: [],
    severities: [],
    stages: [],
    affectedAreas: []
  });

  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      const mockReferences = diseaseDatabase.map(disease => ({
        diseaseId: disease.id,
        diseaseName: disease.name,
        referenceImages: [
          // Mock data - replace with actual API data
          {
            _id: `img_${disease.id}_1`,
            filename: `ref_${disease.id}_001.jpg`,
            originalName: `${disease.name}_reference_1.jpg`,
            description: `Early stage ${disease.name}`,
            severity: 'mild',
            imageFeatures: {
              affectedArea: 'leaf',
              stage: 'early'
            },
            uploadedAt: new Date().toISOString()
          }
        ]
      }));
      setReferences(mockReferences);
    } catch (error) {
      console.error('Error loading references:', error);
      toast.error('Failed to load disease references');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate files
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error(`${file.name} is too large (max 10MB)`);
        continue;
      }
      validFiles.push(file);
    }

    setUploadFiles(validFiles);
    
    // Initialize form data arrays
    setFormData({
      descriptions: validFiles.map(() => ''),
      severities: validFiles.map(() => 'moderate'),
      stages: validFiles.map(() => 'middle'),
      affectedAreas: validFiles.map(() => 'leaf')
    });
  };

  const updateFormData = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const uploadReferenceImages = async () => {
    if (uploadFiles.length === 0) {
      toast.error('Please select images to upload');
      return;
    }

    const disease = diseaseDatabase.find(d => d.id === uploadDialog.diseaseId);
    if (!disease) {
      toast.error('Invalid disease selected');
      return;
    }

    setUploading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add files
      uploadFiles.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      // Add metadata
      formDataToSend.append('diseaseId', uploadDialog.diseaseId);
      formDataToSend.append('diseaseName', disease.name);
      formDataToSend.append('descriptions', JSON.stringify(formData.descriptions));
      formDataToSend.append('severities', JSON.stringify(formData.severities));
      formDataToSend.append('stages', JSON.stringify(formData.stages));
      formDataToSend.append('affectedAreas', JSON.stringify(formData.affectedAreas));

      // Simulate API call
      console.log('Uploading reference images:', {
        diseaseId: uploadDialog.diseaseId,
        fileCount: uploadFiles.length,
        descriptions: formData.descriptions,
        severities: formData.severities
      });

      // Mock successful upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`Successfully uploaded ${uploadFiles.length} reference images for ${disease.name}`);
      
      // Reset and close dialog
      setUploadDialog({ open: false, diseaseId: null });
      setUploadFiles([]);
      setFormData({ descriptions: [], severities: [], stages: [], affectedAreas: [] });
      
      // Reload references
      loadReferences();

    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload reference images');
    } finally {
      setUploading(false);
    }
  };

  const openUploadDialog = (diseaseId) => {
    setUploadDialog({ open: true, diseaseId });
  };

  const closeUploadDialog = () => {
    setUploadDialog({ open: false, diseaseId: null });
    setUploadFiles([]);
    setFormData({ descriptions: [], severities: [], stages: [], affectedAreas: [] });
  };

  const openPreviewDialog = (disease) => {
    const diseaseRef = references.find(r => r.diseaseId === disease.id);
    setPreviewDialog({
      open: true,
      images: diseaseRef?.referenceImages || [],
      disease
    });
  };

  const deleteReferenceImage = async (diseaseId, imageId) => {
    if (!window.confirm('Are you sure you want to delete this reference image?')) {
      return;
    }

    try {
      // Simulate API call
      console.log('Deleting reference image:', { diseaseId, imageId });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Reference image deleted successfully');
      loadReferences();
      
      // Update preview dialog if open
      if (previewDialog.open && previewDialog.disease?.id === diseaseId) {
        const updatedRef = references.find(r => r.diseaseId === diseaseId);
        setPreviewDialog(prev => ({
          ...prev,
          images: updatedRef?.referenceImages || []
        }));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete reference image');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'success';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Disease Reference Images
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Upload reference images for each disease to improve AI analysis accuracy. The system will compare 
          user-uploaded images with these references to provide better diagnostic results.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {diseaseDatabase.map((disease) => {
          const diseaseRef = references.find(r => r.diseaseId === disease.id);
          const imageCount = diseaseRef?.referenceImages?.length || 0;

          return (
            <Grid item xs={12} md={6} lg={4} key={disease.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScienceIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h3">
                      {disease.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                    {disease.scientificName}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhotoIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {imageCount} reference images
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => openUploadDialog(disease.id)}
                    >
                      Upload
                    </Button>
                    
                    {imageCount > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => openPreviewDialog(disease)}
                      >
                        View ({imageCount})
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Upload Dialog */}
      <Dialog 
        open={uploadDialog.open} 
        onClose={closeUploadDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Upload Reference Images
          {uploadDialog.diseaseId && (
            <Typography variant="body2" color="textSecondary">
              {diseaseDatabase.find(d => d.id === uploadDialog.diseaseId)?.name}
            </Typography>
          )}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              multiple
              accept="image/*,.heic,.heif"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="reference-upload-input"
            />
            <label htmlFor="reference-upload-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Select Images (Max 10MB each)
              </Button>
            </label>
            
            {uploadFiles.length > 0 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {uploadFiles.length} images selected
              </Alert>
            )}
          </Box>

          {uploadFiles.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Image Details
              </Typography>
              
              {uploadFiles.map((file, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">
                      {index + 1}. {file.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={formData.descriptions[index] || ''}
                          onChange={(e) => updateFormData(index, 'descriptions', e.target.value)}
                          placeholder="Describe this reference image..."
                        />
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>Severity</InputLabel>
                          <Select
                            value={formData.severities[index] || 'moderate'}
                            onChange={(e) => updateFormData(index, 'severities', e.target.value)}
                            label="Severity"
                          >
                            <MenuItem value="mild">Mild</MenuItem>
                            <MenuItem value="moderate">Moderate</MenuItem>
                            <MenuItem value="severe">Severe</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>Stage</InputLabel>
                          <Select
                            value={formData.stages[index] || 'middle'}
                            onChange={(e) => updateFormData(index, 'stages', e.target.value)}
                            label="Stage"
                          >
                            <MenuItem value="early">Early</MenuItem>
                            <MenuItem value="middle">Middle</MenuItem>
                            <MenuItem value="late">Late</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Affected Area</InputLabel>
                          <Select
                            value={formData.affectedAreas[index] || 'leaf'}
                            onChange={(e) => updateFormData(index, 'affectedAreas', e.target.value)}
                            label="Affected Area"
                          >
                            <MenuItem value="leaf">Leaf</MenuItem>
                            <MenuItem value="stem">Stem</MenuItem>
                            <MenuItem value="grain">Grain</MenuItem>
                            <MenuItem value="sheath">Leaf Sheath</MenuItem>
                            <MenuItem value="panicle">Panicle</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeUploadDialog}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={uploadReferenceImages}
            disabled={uploading || uploadFiles.length === 0}
            startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            {uploading ? 'Uploading...' : `Upload ${uploadFiles.length} Images`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, images: [], disease: null })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Reference Images - {previewDialog.disease?.name}
          <Typography variant="body2" color="textSecondary">
            {previewDialog.images.length} images
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {previewDialog.images.length === 0 ? (
            <Alert severity="info">
              No reference images uploaded yet for this disease.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {previewDialog.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`/api/admin/diseases/reference-image/${image.filename}`}
                      alt={image.description}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {image.description || 'No description'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={image.severity} 
                          size="small" 
                          color={getSeverityColor(image.severity)}
                        />
                        <Chip 
                          label={image.imageFeatures?.stage || 'Unknown stage'} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={image.imageFeatures?.affectedArea || 'Unknown area'} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(image.uploadedAt).toLocaleDateString()}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteReferenceImage(previewDialog.disease.id, image._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setPreviewDialog({ open: false, images: [], disease: null })}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const AdminDiseaseReferencesPage = () => {
  return (
    <AppProviders>
      <Layout>
        <AdminDiseaseReferencesContent />
      </Layout>
    </AppProviders>
  );
};

export default AdminDiseaseReferencesPage;

export const Head = () => (
  <>
    <title>Disease Reference Images - Admin | Farm Management System</title>
    <meta name="description" content="Manage disease reference images for AI analysis" />
  </>
);
