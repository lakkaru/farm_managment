import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';

const DebugPage = () => {
  const debugInfo = {
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
    currentURL: typeof window !== 'undefined' ? window.location.href : 'SSR',
    gatsbyCurrent: typeof window !== 'undefined' && window.___gatsby ? 'loaded' : 'not loaded',
    apiURL: process.env.GATSBY_API_URL || 'not set',
    environment: process.env.NODE_ENV || 'not set',
    timestamp: new Date().toISOString(),
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Debug Information
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Environment Details:
          </Typography>
          
          {Object.entries(debugInfo).map(([key, value]) => (
            <Box key={key} sx={{ mb: 1 }}>
              <Typography variant="body1">
                <strong>{key}:</strong> {String(value)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            JavaScript Test:
          </Typography>
          <Typography variant="body1" id="js-test" color="error">
            JavaScript NOT working
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Console Errors:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Check browser console (F12) for any JavaScript errors
          </Typography>
        </Box>
      </Paper>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if (typeof document !== 'undefined') {
                document.addEventListener('DOMContentLoaded', function() {
                  const testElement = document.getElementById('js-test');
                  if (testElement) {
                    testElement.textContent = 'JavaScript IS working!';
                    testElement.style.color = 'green';
                  }
                });
              }
            } catch (e) {
              console.error('Debug script error:', e);
            }
          `,
        }}
      />
    </Container>
  );
};

export default DebugPage;