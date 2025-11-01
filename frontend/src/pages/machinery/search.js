import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  Build as BuildIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { machineryAPI, farmAPI } from '../../services/api';
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

const MachinerySearchContent = () => {
  const { t } = useTranslation();
  const [machinery, setMachinery] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    machineryType: '',
    district: '',
    availability: 'Available',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  const [requestData, setRequestData] = useState({
    farmId: '',
    serviceDate: dayjs().add(1, 'day'),
    duration: {
      value: 1,
      unit: 'Days'
    },
    description: ''
  });

  useEffect(() => {
    loadFarms();
    searchMachinery();
  }, []);

  const loadFarms = async () => {
    try {
      const response = await farmAPI.getFarms();
      setFarms(response.data);
    } catch (error) {
      console.error('Error loading farms:', error);
    }
  };

  const searchMachinery = async () => {
    try {
      setLoading(true);
      const response = await machineryAPI.searchMachinery(filters);
      setMachinery(response.data);
    } catch (error) {
      console.error('Error searching machinery:', error);
      toast.error(t('machinery.errors.searchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRequestDialog = (item) => {
    setSelectedMachinery(item);
    setRequestDialogOpen(true);
  };

  const handleCloseRequestDialog = () => {
    setRequestDialogOpen(false);
    setSelectedMachinery(null);
    setRequestData({
      farmId: '',
      serviceDate: dayjs().add(1, 'day'),
      duration: {
        value: 1,
        unit: 'Days'
      },
      description: ''
    });
  };

  const handleSubmitRequest = async () => {
    try {
      if (!requestData.farmId) {
        toast.error(t('machinery.errors.selectFarm'));
        return;
      }

      await machineryAPI.createRequest({
        ...requestData,
        machineryId: selectedMachinery._id,
        machineryType: selectedMachinery.machineryType,
        serviceDate: requestData.serviceDate.toISOString()
      });

      toast.success(t('machinery.success.requestSent'));
      handleCloseRequestDialog();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || t('machinery.errors.requestFailed'));
    }
  };

  const handleViewDetails = (item) => {
    setSelectedMachinery(item);
    setDetailsDialogOpen(true);
  };

  const handleSearchByFarm = async (farmId) => {
    if (!farmId) return;
    
    try {
      setLoading(true);
      const response = await machineryAPI.searchByFarm(farmId);
      setMachinery(response.data);
      toast.success(t('machinery.success.searchByFarm'));
    } catch (error) {
      console.error('Error searching by farm:', error);
      toast.error(t('machinery.errors.searchFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {t('machinery.searchMachinery')}
      </Typography>

      {/* Search Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t('machinery.machineryType')}</InputLabel>
                <Select
                  value={filters.machineryType}
                  label={t('machinery.machineryType')}
                  onChange={(e) => setFilters({ ...filters, machineryType: e.target.value })}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  {MACHINERY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t('machinery.district')}</InputLabel>
                <Select
                  value={filters.district}
                  label={t('machinery.district')}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  {DISTRICTS.map((district) => (
                    <MenuItem key={district} value={district}>{district}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label={t('machinery.minPrice')}
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label={t('machinery.maxPrice')}
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={searchMachinery}
                sx={{ height: '56px' }}
              >
                {t('common.search')}
              </Button>
            </Grid>

            {farms.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>{t('machinery.searchByMyFarm')}</InputLabel>
                  <Select
                    label={t('machinery.searchByMyFarm')}
                    onChange={(e) => handleSearchByFarm(e.target.value)}
                  >
                    {farms.map((farm) => (
                      <MenuItem key={farm._id} value={farm._id}>
                        {farm.name} - {farm.location.district}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : machinery.length === 0 ? (
        <Alert severity="info">
          {t('machinery.noResults')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {machinery.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card sx={{ height: '100%' }}>
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
                    <Chip 
                      label={item.availability} 
                      color={
                        item.availability === 'Available' ? 'success' :
                        item.availability === 'Busy' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </Box>

                  {item.powerRating && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <BuildIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {item.powerRating}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <MoneyIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="bold" color="primary">
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
                      ({item.rating.count})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • {item.totalServices} {t('machinery.services')}
                    </Typography>
                  </Box>

                  {item.description && (
                    <Typography variant="body2" color="text.secondary" mb={2} noWrap>
                      {item.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" gap={1} mt={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(item)}
                    >
                      {t('common.details')}
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenRequestDialog(item)}
                      disabled={item.availability !== 'Available'}
                    >
                      {t('machinery.requestService')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Request Dialog */}
      <Dialog open={requestDialogOpen} onClose={handleCloseRequestDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('machinery.requestService')}</DialogTitle>
        <DialogContent>
          {selectedMachinery && (
            <Box mb={2} mt={1}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('machinery.requesting')}:
              </Typography>
              <Typography variant="h6">
                {selectedMachinery.brand} {selectedMachinery.model}
              </Typography>
              <Typography variant="body2" color="primary">
                Rs. {selectedMachinery.priceAmount} / {selectedMachinery.pricing}
              </Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>{t('machinery.selectFarm')}</InputLabel>
                <Select
                  value={requestData.farmId}
                  label={t('machinery.selectFarm')}
                  onChange={(e) => setRequestData({ ...requestData, farmId: e.target.value })}
                >
                  {farms.map((farm) => (
                    <MenuItem key={farm._id} value={farm._id}>
                      {farm.name} - {farm.location.district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t('machinery.serviceDate')}
                  value={requestData.serviceDate}
                  onChange={(newValue) => setRequestData({ ...requestData, serviceDate: newValue })}
                  minDate={dayjs().add(1, 'day')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('machinery.duration')}
                type="number"
                value={requestData.duration.value}
                onChange={(e) => setRequestData({ 
                  ...requestData, 
                  duration: { ...requestData.duration, value: e.target.value }
                })}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>{t('machinery.unit')}</InputLabel>
                <Select
                  value={requestData.duration.unit}
                  label={t('machinery.unit')}
                  onChange={(e) => setRequestData({ 
                    ...requestData, 
                    duration: { ...requestData.duration, unit: e.target.value }
                  })}
                >
                  <MenuItem value="Hours">{t('machinery.hours')}</MenuItem>
                  <MenuItem value="Days">{t('machinery.days')}</MenuItem>
                  <MenuItem value="Acres">{t('machinery.acres')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('machinery.additionalDetails')}
                multiline
                rows={3}
                value={requestData.description}
                onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmitRequest} variant="contained" color="primary">
            {t('machinery.sendRequest')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('machinery.machineryDetails')}</DialogTitle>
        <DialogContent>
          {selectedMachinery && (
            <Box>
              <Typography variant="h6" mb={2}>
                {selectedMachinery.brand} {selectedMachinery.model}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    {t('machinery.type')}:
                  </Typography>
                  <Typography variant="body2">{selectedMachinery.machineryType}</Typography>
                </Grid>

                {selectedMachinery.yearOfManufacture && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('machinery.year')}:
                    </Typography>
                    <Typography variant="body2">{selectedMachinery.yearOfManufacture}</Typography>
                  </Grid>
                )}

                {selectedMachinery.powerRating && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      {t('machinery.power')}:
                    </Typography>
                    <Typography variant="body2">{selectedMachinery.powerRating}</Typography>
                  </Grid>
                )}

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    {t('machinery.status')}:
                  </Typography>
                  <Typography variant="body2">{selectedMachinery.availability}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    {t('machinery.pricing')}:
                  </Typography>
                  <Typography variant="body1" color="primary" fontWeight="bold">
                    Rs. {selectedMachinery.priceAmount} / {selectedMachinery.pricing}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    {t('machinery.serviceAreas')}:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                    {selectedMachinery.serviceArea.districts.map((district) => (
                      <Chip key={district} label={district} size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    {t('machinery.contactInfo')}:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">{selectedMachinery.contactInfo.phone}</Typography>
                  </Box>
                  {selectedMachinery.contactInfo.whatsapp && (
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <WhatsAppIcon fontSize="small" />
                      <Typography variant="body2">{selectedMachinery.contactInfo.whatsapp}</Typography>
                    </Box>
                  )}
                  {selectedMachinery.contactInfo.email && (
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2">{selectedMachinery.contactInfo.email}</Typography>
                    </Box>
                  )}
                </Grid>

                {selectedMachinery.location.address && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      {t('machinery.address')}:
                    </Typography>
                    <Typography variant="body2">{selectedMachinery.location.address}</Typography>
                  </Grid>
                )}

                {selectedMachinery.description && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      {t('machinery.description')}:
                    </Typography>
                    <Typography variant="body2">{selectedMachinery.description}</Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={selectedMachinery.rating.average} readOnly precision={0.5} />
                    <Typography variant="body2">
                      ({selectedMachinery.rating.count} {t('machinery.reviews')})
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {selectedMachinery.totalServices} {t('machinery.completedServices')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>{t('common.close')}</Button>
          {selectedMachinery && selectedMachinery.availability === 'Available' && (
            <Button 
              onClick={() => {
                setDetailsDialogOpen(false);
                handleOpenRequestDialog(selectedMachinery);
              }} 
              variant="contained" 
              color="primary"
            >
              {t('machinery.requestService')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const MachinerySearch = () => {
  return (
    <AppProviders>
      <Layout>
        <MachinerySearchContent />
      </Layout>
    </AppProviders>
  );
};

export default MachinerySearch;
