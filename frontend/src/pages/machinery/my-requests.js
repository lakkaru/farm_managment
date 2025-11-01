import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';
import { machineryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const REQUEST_STATUSES = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];

const MyRequestsContent = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    estimatedCost: '',
    notes: ''
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await machineryAPI.getMyRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Accepted': return 'info';
      case 'In Progress': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'default';
      case 'Rejected': return 'error';
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
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Machinery Requests
      </Typography>

      {requests.length === 0 ? (
        <Alert severity="info">
          No machinery requests yet. Search for machinery and request services to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {requests.map((request) => (
            <Grid item xs={12} key={request._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {request.machinery?.brand} {request.machinery?.model}
                          </Typography>
                          <Chip 
                            label={request.machineryType} 
                            size="small" 
                            color="primary" 
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                        <Chip 
                          label={request.status} 
                          color={getStatusColor(request.status)}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {request.farm?.name} - {request.farm?.location?.district}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {dayjs(request.serviceDate).format('MMM DD, YYYY')}
                            </Typography>
                          </Box>
                        </Grid>

                        {request.duration && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Duration: {request.duration.value} {request.duration.unit}
                            </Typography>
                          </Grid>
                        )}

                        {request.estimatedCost && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                              Estimated Cost: Rs. {request.estimatedCost}
                            </Typography>
                          </Grid>
                        )}

                        {request.description && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              {request.description}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" mb={1}>
                          Contact Information
                        </Typography>
                        {request.machinery?.owner && (
                          <>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                              <PersonIcon fontSize="small" />
                              <Typography variant="body2">
                                {request.machinery.owner.profile?.firstName} {request.machinery.owner.profile?.lastName}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PhoneIcon fontSize="small" />
                              <Typography variant="body2">
                                {request.machinery.owner.contact?.phone}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Box>

                      {request.notes && request.notes.length > 0 && (
                        <Box mt={2}>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary" mb={1}>
                            Notes
                          </Typography>
                          {request.notes.map((note, index) => (
                            <Typography key={index} variant="caption" display="block" mb={0.5}>
                              {note.text}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      Requested: {dayjs(request.createdAt).format('MMM DD, YYYY')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

const MyRequests = () => {
  return (
    <AppProviders>
      <Layout>
        <MyRequestsContent />
      </Layout>
    </AppProviders>
  );
};

export default MyRequests;
