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

const CreateLivestockContent = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Add Livestock
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Add animals to your livestock management system
      </Typography>

      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Livestock Management Coming Soon
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          This feature is under development. Focus on crop management for now.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/farms/create')}
          >
            Create Farm Instead
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const CreateLivestock = () => {
  return (
    <AppProviders>
      <Layout>
        <CreateLivestockContent />
      </Layout>
    </AppProviders>
  );
};

export default CreateLivestock;
