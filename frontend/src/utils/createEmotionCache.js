import createCache from '@emotion/cache';

// Create a cache instance with consistent configuration for SSR and client
const createEmotionCache = () => {
  return createCache({
    key: 'css',
    prepend: true, // This ensures MUI styles are loaded first
  });
};

export default createEmotionCache;
