import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { navigate } from 'gatsby';
import Layout from '../../components/Layout/Layout';
import AppProviders from '../../providers/AppProviders';

const CreateCropContent = () => {
  return (
  <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: { xs: '100%', sm: 800 }, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Add New Crop
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Track a new crop in your farm management system
      </Typography>

  <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Crop Management Coming Soon
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This feature is under development. You can add crops through the season planning system for now.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/paddy/season-plans/create')}
          >
            Plan Season Instead
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const CreateCrop = () => {
  return (
    <AppProviders>
      <Layout>
        <CreateCropContent />
      </Layout>
    </AppProviders>
  );
};

export default CreateCrop;
