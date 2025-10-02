import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from '../contexts/AuthContext';
import { FarmProvider } from '../contexts/FarmContext';
import createEmotionCache from '../utils/createEmotionCache';
import i18n from '../i18n/i18n';
import LanguageWelcomeDialog from '../components/LanguageWelcomeDialog/LanguageWelcomeDialog';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create Emotion cache for SSR compatibility
const cache = createEmotionCache();

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#2e7d32',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const AppProviders = ({ children, emotionCache = cache }) => {
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);

  useEffect(() => {
    // Check if this is the browser environment and if user hasn't selected language before
    if (typeof window !== 'undefined') {
      const hasSelectedLanguage = localStorage.getItem('hasSelectedLanguage');
      const preferredLanguage = localStorage.getItem('preferredLanguage');
      
      if (!hasSelectedLanguage && !preferredLanguage) {
        // Show language selection dialog for first-time users
        setShowLanguageDialog(true);
      } else if (preferredLanguage) {
        // Set saved language preference
        i18n.changeLanguage(preferredLanguage);
      }
    }
  }, []);

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);
    setShowLanguageDialog(false);
  };

  return (
    <CacheProvider value={emotionCache}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <FarmProvider>
                {children}
                
                {/* Language Welcome Dialog for first-time users */}
                <LanguageWelcomeDialog
                  open={showLanguageDialog}
                  onClose={() => setShowLanguageDialog(false)}
                  onLanguageSelect={handleLanguageSelect}
                />
                
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                {typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
              </FarmProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </CacheProvider>
  );
};

export default AppProviders;
