import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../contexts/AuthContext';
import { FarmProvider } from '../contexts/FarmContext';
import createEmotionCache from '../utils/createEmotionCache';
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
  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <FarmProvider>
              {children}
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
    </CacheProvider>
  );
};

export default AppProviders;
