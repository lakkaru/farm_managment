import React from 'react';
import { Button, IconButton, Tooltip, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { navigate } from 'gatsby';

const BackButton = ({ 
  to = null, 
  variant = 'icon', 
  label = 'Back',
  color = 'primary',
  size = 'medium',
  sx = {},
  compactOnXs = true,
  ...props 
}) => {
  const handleBack = () => {
    if (to) {
      // Navigate to specific route
      navigate(to);
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      // Go back in browser history if available
      window.history.back();
    } else {
      // Fallback to dashboard
      navigate('/dashboard');
    }
  };

  if (variant === 'icon') {
    return (
      <Tooltip title={label}>
        <IconButton
          onClick={handleBack}
          color={color}
          size={size}
          sx={{
            mr: 1,
            ...sx
          }}
          {...props}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      onClick={handleBack}
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      color={color}
      size={size}
      sx={{
        mr: 2,
        ...sx
      }}
      {...props}
    >
      {compactOnXs ? (
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {label}
        </Box>
      ) : (
        label
      )}
    </Button>
  );
};

export default BackButton;
