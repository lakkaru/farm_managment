import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './src/contexts/AuthContext';
import { FarmProvider } from './src/contexts/FarmContext';
import createEmotionCache from './src/utils/createEmotionCache';

import 'react-toastify/dist/ReactToastify.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a shared cache instance
const cache = createEmotionCache();

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green color for farm theme
      light: '#81c784',
      dark: '#388e3c',
    },
    secondary: {
      main: '#ff9800', // Orange accent
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
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

export const wrapRootElement = ({ element }) => (
  <CacheProvider value={cache}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <FarmProvider>
            {element}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </FarmProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </CacheProvider>
);

export const wrapPageElement = ({ element }) => {
  return (
    <CacheProvider value={cache}>
      {element}
    </CacheProvider>
  );
};
