import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  GetApp as InstallIcon,
  Close as CloseIcon,
  Smartphone as PhoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  canShowInstallPrompt,
  showInstallPrompt,
  initInstallPrompt,
  isPWAMode,
} from '../utils/pwa';

const PWAInstallPrompt = () => {
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already in PWA mode
    if (isPWAMode()) {
      return;
    }

    // Initialize install prompt
    initInstallPrompt();

    // Check if we can show install prompt after a delay
    const checkPrompt = setTimeout(() => {
      if (canShowInstallPrompt()) {
        setShowPrompt(true);
      }
    }, 5000); // Show after 5 seconds

    return () => clearTimeout(checkPrompt);
  }, []);

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      const accepted = await showInstallPrompt();
      if (accepted) {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwaPromptDismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwaPromptDismissed')) {
    return null;
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <Snackbar
      open={showPrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ mb: 2 }}
    >
      <Alert
        severity="info"
        variant="filled"
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              color="inherit"
              size="small"
              startIcon={<InstallIcon />}
              onClick={handleInstall}
              disabled={isInstalling}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {isInstalling
                ? t('pwa.installing', 'Installing...')
                : t('pwa.install', 'Install')}
            </Button>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon fontSize="small" />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {t('pwa.installTitle', 'Install Farm Management App')}
            </Typography>
            <Typography variant="caption" display="block">
              {t('pwa.installDescription', 'Get faster access and work offline!')}
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default PWAInstallPrompt;