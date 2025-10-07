import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { WifiOff as WifiOffIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

const OfflinePage = () => {
  const { t } = useTranslation();

  const handleRefresh = () => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      // Register for background sync
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('background-sync');
      }).catch(console.error);
    }
    window.location.reload();
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <WifiOffIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom>
            {t('offline.title', 'You are offline')}
          </Typography>
          
          <Typography variant="body1" color="textSecondary" paragraph>
            {t('offline.message', 'Check your internet connection and try again. Some features may be limited while offline.')}
          </Typography>

          <Typography variant="body2" color="textSecondary" paragraph>
            {t('offline.cachedContent', 'You can still view previously loaded content while offline.')}
          </Typography>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ mt: 2 }}
          >
            {t('offline.retry', 'Try Again')}
          </Button>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            {t('offline.pwaInfo', 'This app works offline thanks to Progressive Web App technology')}
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default OfflinePage;

export const Head = () => (
  <>
    <title>Offline - Farm Management System</title>
    <meta name="description" content="You are currently offline" />
  </>
);