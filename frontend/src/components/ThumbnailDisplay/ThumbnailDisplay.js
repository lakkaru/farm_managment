import React, { useState } from 'react';
import { Box } from '@mui/material';

const ThumbnailDisplay = ({ image, imageUrl, width = 60, height = 60 }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (image.url) {
      console.log('✅ R2 Thumbnail loaded successfully:', imageUrl);
    } else {
      console.log('✅ Legacy Thumbnail loaded successfully:', imageUrl);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    if (image.url) {
      console.error('❌ R2 Thumbnail failed to load:', imageUrl);
    } else {
      console.error('❌ Legacy Thumbnail failed to load, showing placeholder:', imageUrl);
    }
  };

  if (imageError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: width,
          height: height,
          color: image.url ? '#666' : '#888',
          fontSize: image.url ? '0.7rem' : '0.65rem',
          textAlign: 'center',
          backgroundColor: image.url ? 'transparent' : '#f8f9fa',
          border: image.url ? 'none' : '1px dashed #ddd',
          borderRadius: image.url ? 0 : 1
        }}
      >
        <Box sx={{ fontSize: image.url ? '1.2rem' : '1.4rem', mb: 0.3 }}>
          {image.url ? '🚫' : '🖼️'}
        </Box>
        {image.url ? (
          <Box>R2 Error</Box>
        ) : (
          <>
            <Box sx={{ fontWeight: 'bold', fontSize: '0.6rem' }}>Legacy</Box>
            <Box sx={{ fontSize: '0.55rem', opacity: 0.8 }}>Unavailable</Box>
          </>
        )}
      </Box>
    );
  }

  return (
    <img
      src={imageUrl}
      alt=""
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'cover',
        width: '100%',
        height: '100%'
      }}
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
};

export default ThumbnailDisplay;
