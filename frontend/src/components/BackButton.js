import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { navigate } from 'gatsby';

const BackButton = ({ to = -1, tooltip = 'Go back', ...props }) => {
  const handleClick = () => {
    if (typeof to === 'string') {
      navigate(to);
    } else {
      window.history.back();
    }
  };

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={handleClick} {...props}>
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
