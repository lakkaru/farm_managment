import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const LanguageSwitcher = ({ variant = 'button' }) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    
    // Store preference in localStorage for persistence
    localStorage.setItem('preferredLanguage', language);
    
    // Show feedback to user
    if (typeof window !== 'undefined' && window.toast) {
      const languageName = languages.find(lang => lang.code === language)?.nativeName;
      window.toast?.success(`Language changed to ${languageName}`);
    }
    
    handleClose();
  };

  const languages = [
    { 
      code: 'si', 
      name: 'සිංහල', 
      nativeName: 'සිංහල',
      flag: '🇱🇰',
      description: 'Sinhala - Sri Lankan farmers preferred language'
    },
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English',
      flag: '🌐',
      description: 'English - International language'
    },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  if (variant === 'compact' || variant === 'login') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          size="small"
          onClick={handleClick}
          startIcon={<span style={{ fontSize: '1.2em' }}>{currentLanguage.flag}</span>}
          variant="outlined"
          sx={{
            minWidth: '70px',
            fontSize: '0.9rem',
            textTransform: 'none',
            color: 'primary.main',
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'primary.main',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              borderColor: 'primary.main',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {currentLanguage.code.toUpperCase()}
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={i18n.language === language.code}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box component="span" sx={{ fontSize: '1.2em', mr: 0.5 }}>{language.flag}</Box>
                {i18n.language === language.code && <CheckIcon fontSize="small" color="primary" />}
              </ListItemIcon>
              <ListItemText 
                primary={language.nativeName}
                secondary={language.description}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: 'text.secondary'
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        onClick={handleClick}
        startIcon={<span style={{ fontSize: '1.2em' }}>{currentLanguage.flag}</span>}
        endIcon={<LanguageIcon />}
        variant="outlined"
        size="small"
        sx={{
          textTransform: 'none',
          borderColor: 'primary.main',
          color: 'primary.main',
          fontWeight: 500,
          px: 2,
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'primary.light',
            color: 'primary.contrastText',
          },
        }}
      >
        {currentLanguage.nativeName}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            minWidth: 160,
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
            sx={{
              fontSize: '0.875rem',
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box component="span" sx={{ fontSize: '1.2em', mr: 0.5 }}>{language.flag}</Box>
              {i18n.language === language.code && (
                <CheckIcon fontSize="small" color="primary" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={language.nativeName}
              secondary={language.description}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                color: 'text.secondary'
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;