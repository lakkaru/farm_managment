import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Rating,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { machineryAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { DISTRICTS } from '../../constants/districts';

const MACHINERY_TYPES = [
  'Tractor',
  'Harvester',
  'Plough',
  'Rotavator',
  'Cultivator',
  'Seeder',
  'Sprayer',
  'Thresher',
  'Rice Transplanter',
  'Combine Harvester',
  'Water Pump',
  'Weeder',
  'Other'
];

const AVAILABILITY_STATUS = ['Available', 'Busy', 'Under Maintenance'];
const PRICING_TYPES = ['Per Hour', 'Per Day', 'Per Acre', 'Per Service', 'Negotiable'];

const MyMachineryContent = () => {
  const { t } = useTranslation();
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [formData, setFormData] = useState({
    machineryType: '',
    brand: '',
    model: '',
    yearOfManufacture: '',
    powerRating: '',
    availability: 'Available',
    serviceArea: {
      districts: [],
      radius: 50
    },
    pricing: 'Per Day',
    priceAmount: '',
    contactInfo: {
      phone: '',
      whatsapp: '',
      email: ''
    },
    location: {
      address: '',
      district: ''
    },
    description: ''
  });

  useEffect(() => {
    loadMachinery();
  }, []);

  const loadMachinery = async () => {
    try {
      setLoading(true);
      const response = await machineryAPI.getMyMachinery();
      setMachinery(response.data);
    } catch (error) {
      console.error('Error loading machinery:', error);
      toast.error(t('machinery.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setSelectedMachinery(item);
      setFormData(item);
    } else {
      setSelectedMachinery(null);
      setFormData({
        machineryType: '',
        brand: '',
        model: '',
        yearOfManufacture: '',
        powerRating: '',
        availability: 'Available',
        serviceArea: {
          districts: [],
          radius: 50
        },
        pricing: 'Per Day',
        priceAmount: '',
        contactInfo: {
          phone: '',
          whatsapp: '',
          email: ''
        },
        location: {
          address: '',
          district: ''
        },
        description: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMachinery(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedMachinery) {
        await machineryAPI.updateMachinery(selectedMachinery._id, formData);
        toast.success(t('machinery.success.updated'));
      } else {
        await machineryAPI.createMachinery(formData);
        toast.success(t('machinery.success.created'));
      }
      handleCloseDialog();
      loadMachinery();
    } catch (error) {
      console.error('Error saving machinery:', error);
      toast.error(t('machinery.errors.saveFailed'));
    }
  };

  const handleDelete = async () => {
    try {
      await machineryAPI.deleteMachinery(selectedMachinery._id);
      toast.success(t('machinery.success.deleted'));
      setDeleteDialogOpen(false);
      setSelectedMachinery(null);
      loadMachinery();
    } catch (error) {
      console.error('Error deleting machinery:', error);
      toast.error(t('machinery.errors.deleteFailed'));
    }
  };

  const handleViewRequests = (machineryId) => {
    navigate(`/machinery/${machineryId}/requests`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          {t('machinery.myMachinery')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('machinery.addMachinery')}
        </Button>
      </Box>

      {machinery.length === 0 ? (
        <Alert severity="info">
          {t('machinery.noMachinery')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {machinery.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {item.brand} {item.model}
                      </Typography>
                      <Chip 
                        label={item.machineryType} 
                        size="small" 
                        color="primary" 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(item)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSelectedMachinery(item);
                          setDeleteDialogOpen(true);
                        }} 
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Chip 
                      label={item.availability} 
                      color={
                        item.availability === 'Available' ? 'success' :
                        item.availability === 'Busy' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <MoneyIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Rs. {item.priceAmount} / {item.pricing}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {item.location.district}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {item.contactInfo.phone}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Rating value={item.rating.average} readOnly size="small" precision={0.5} />
                    <Typography variant="caption">
                      ({item.rating.count} {t('machinery.reviews')})
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewRequests(item._id)}
                    sx={{ mt: 1 }}
                  >
                    {t('machinery.viewRequests')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMachinery ? t('machinery.editMachinery') : t('machinery.addMachinery')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('machinery.machineryType')}</InputLabel>
                <Select
                  value={formData.machineryType}
                  label={t('machinery.machineryType')}
                  onChange={(e) => setFormData({ ...formData, machineryType: e.target.value })}
                >
                  {MACHINERY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('machinery.brand')}
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('machinery.model')}
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('machinery.yearOfManufacture')}
                type="number"
                value={formData.yearOfManufacture}
                onChange={(e) => setFormData({ ...formData, yearOfManufacture: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('machinery.powerRating')}
                placeholder="e.g., 50 HP"
                value={formData.powerRating}
                onChange={(e) => setFormData({ ...formData, powerRating: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('machinery.availability')}</InputLabel>
                <Select
                  value={formData.availability}
                  label={t('machinery.availability')}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                >
                  {AVAILABILITY_STATUS.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('machinery.pricing')}</InputLabel>
                <Select
                  value={formData.pricing}
                  label={t('machinery.pricing')}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                >
                  {PRICING_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('machinery.priceAmount')}
                type="number"
                value={formData.priceAmount}
                onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('machinery.district')}</InputLabel>
                <Select
                  value={formData.location.district}
                  label={t('machinery.district')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, district: e.target.value }
                  })}
                >
                  {DISTRICTS.map((district) => (
                    <MenuItem key={district} value={district}>{district}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('machinery.serviceDistricts')}</InputLabel>
                <Select
                  multiple
                  value={formData.serviceArea.districts}
                  label={t('machinery.serviceDistricts')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    serviceArea: { ...formData.serviceArea, districts: e.target.value }
                  })}
                >
                  {DISTRICTS.map((district) => (
                    <MenuItem key={district} value={district}>{district}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('machinery.phone')}
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, phone: e.target.value }
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('machinery.whatsapp')}
                value={formData.contactInfo.whatsapp}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, whatsapp: e.target.value }
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('machinery.address')}
                value={formData.location.address}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, address: e.target.value }
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('machinery.description')}
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('machinery.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography>{t('machinery.deleteConfirmMessage')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const MyMachinery = () => {
  return (
    <AppProviders>
      <Layout>
        <MyMachineryContent />
      </Layout>
    </AppProviders>
  );
};

export default MyMachinery;
