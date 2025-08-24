import React from 'react';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';

const PhaseNotification = ({ 
  phase = 1, 
  currentFocus = "Paddy Cultivation",
  upcomingFeatures = ["Other Crops", "Livestock Management", "Inventory Tracking", "Advanced Reports"],
  severity = "info"
}) => {
  return (
    <Alert severity={severity} sx={{ mb: 3 }}>
      <AlertTitle sx={{ fontWeight: 'bold' }}>
        🌾 Phase {phase} Implementation - {currentFocus} Focus
      </AlertTitle>
      <Typography variant="body2" sx={{ mb: 1 }}>
        This system is currently optimized for <strong>{currentFocus}</strong> management. 
        We're building features progressively to ensure the best user experience.
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Currently Available:</strong>
      </Typography>
      <Box component="ul" sx={{ ml: 2, mb: 1 }}>
        <li>Farm Management</li>
        <li>Paddy Variety Database</li>
        <li>Season Planning</li>
        <li>Fertilizer Recommendations</li>
        <li>Growth Stage Tracking</li>
      </Box>
      <Typography variant="body2">
        <strong>Coming Soon:</strong> {upcomingFeatures.join(", ")}
      </Typography>
    </Alert>
  );
};

export default PhaseNotification;
