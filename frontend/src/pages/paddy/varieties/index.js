import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { paddyVarietyAPI } from '../../../services/api';
import { toast } from 'react-toastify';

const PaddyVarietiesContent = () => {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVarieties, setFilteredVarieties] = useState([]);

  useEffect(() => {
    loadPaddyVarieties();
  }, []);

  useEffect(() => {
    // Filter varieties based on search term
    const filtered = varieties.filter(variety =>
      variety.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variety.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVarieties(filtered);
  }, [varieties, searchTerm]);

  const loadPaddyVarieties = async () => {
    try {
      setLoading(true);
      const response = await paddyVarietyAPI.getPaddyVarieties();
      console.log('Varieties page - API response:', response.data);
      console.log('First variety in varieties page:', response.data.data?.[0]);
      console.log('First variety duration in varieties page:', response.data.data?.[0]?.duration);
      setVarieties(response.data.data || []);
    } catch (error) {
      console.error('Error loading paddy varieties:', error);
      toast.error('Failed to load paddy varieties');
      setVarieties([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Traditional': 'primary',
      'Improved': 'success',
      'Hybrid': 'warning',
      'Other': 'default',
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading paddy varieties...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Paddy Varieties
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Browse available paddy varieties for your cultivation plans
          </Typography>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search varieties by name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Varieties Grid */}
      {filteredVarieties.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AgricultureIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {searchTerm ? 'No Varieties Found' : 'No Paddy Varieties Available'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm 
              ? `No varieties match your search "${searchTerm}". Try different keywords.`
              : 'No paddy varieties have been added to the system yet.'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredVarieties.map((variety) => (
            <Grid item xs={12} sm={6} md={4} key={variety._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  {/* Variety Name and Type */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {variety.name}
                    </Typography>
                    <Chip
                      label={variety.type}
                      size="small"
                      color={getTypeColor(variety.type)}
                    />
                  </Box>

                  {/* Duration */}
                  <Typography variant="body2" gutterBottom>
                    <strong>Duration:</strong> {variety.duration}
                  </Typography>

                  {/* Duration in Days (Numeric) */}
                  {/* {(() => {
                    const durationMatch = variety.duration?.match(/(\d+)(?:-(\d+))?/);
                    if (durationMatch) {
                      const minDuration = parseInt(durationMatch[1]);
                      const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
                      const avgDuration = (minDuration + maxDuration) / 2;
                      return (
                        <Typography variant="body2" gutterBottom>
                          <strong>Average Days:</strong> {avgDuration} days
                        </Typography>
                      );
                    }
                    return null;
                  })()}

                  {/* Year of Release */}
                  {variety.yearOfRelease && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Released:</strong> {variety.yearOfRelease}
                    </Typography>
                  )}

                  {/* Popular Name */}
                  {variety.popularName && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Popular Name:</strong> {variety.popularName}
                    </Typography>
                  )}

                  {/* Parentage */}
                  {variety.parentage && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Parentage:</strong> {variety.parentage}
                    </Typography>
                  )}

                  {/* Recommendation */}
                  {variety.recommendation && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Recommendation:</strong> {variety.recommendation}
                    </Typography>
                  )}

                  {/* Characteristics */}
                  {variety.characteristics && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Characteristics:
                      </Typography>
                      {variety.characteristics.yield && (
                        <Typography variant="body2" color="textSecondary">
                          • Yield: {variety.characteristics.yield} tons/acre
                        </Typography>
                      )}
                      {variety.characteristics.resistance && (
                        <Typography variant="body2" color="textSecondary">
                          • Resistance: {variety.characteristics.resistance.join(', ')}
                        </Typography>
                      )}
                      {variety.characteristics.suitableSeasons && (
                        <Typography variant="body2" color="textSecondary">
                          • Suitable Seasons: {variety.characteristics.suitableSeasons.join(', ')}
                        </Typography>
                      )}
                      {variety.characteristics.grainType && (
                        <Typography variant="body2" color="textSecondary">
                          • Grain Type: {variety.characteristics.grainType}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Description */}
                  {variety.description && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      {variety.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Results Count */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Showing {filteredVarieties.length} of {varieties.length} varieties
        </Typography>
      </Box>
    </Box>
  );
};

const PaddyVarieties = () => {
  return (
    <AppProviders>
      <Layout>
        <PaddyVarietiesContent />
      </Layout>
    </AppProviders>
  );
};

export default PaddyVarieties;
