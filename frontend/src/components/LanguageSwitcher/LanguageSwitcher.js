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
    const base = language.split('-')[0];
    i18n.changeLanguage(base);
    
    // Store preference in localStorage for persistence (both our key and i18next's key)
    localStorage.setItem('preferredLanguage', base);
    localStorage.setItem('i18nextLng', base);
    
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
      <Box
        onClick={handleClick}
        role="button"
        tabIndex={0}
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <Button
          size="small"
          startIcon={<span style={{ fontSize: '0.95em', lineHeight: 1 }}>{currentLanguage.flag}</span>}
          variant="outlined"
          sx={{
            minWidth: { xs: 34, sm: '52px' },
            fontSize: { xs: '0.68rem', sm: '0.78rem' },
            textTransform: 'none',
            color: 'primary.main',
            fontWeight: 600,
            px: { xs: 0.3, sm: 0.6 },
            py: { xs: 0.15, sm: 0.35 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.main',
            backgroundColor: 'rgba(76, 175, 80, 0.06)',
            boxShadow: { xs: 'none', sm: '0 1px 6px rgba(76, 175, 80, 0.12)' },
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              borderColor: 'primary.main',
              boxShadow: { xs: 'none', sm: '0 2px 8px rgba(76, 175, 80, 0.18)' },
              transform: { xs: 'none', sm: 'translateY(-1px)' },
            },
            transition: 'all 0.15s ease-in-out',
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{currentLanguage.code.toUpperCase()}</Box>
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
                <Box component="span" sx={{ fontSize: '1.0em', mr: 0.5 }}>{language.flag}</Box>
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
    <Box
      onClick={handleClick}
      role="button"
      tabIndex={0}
      sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
    >
      <Button
          startIcon={<span style={{ fontSize: '1.0em', lineHeight: 1 }}>{currentLanguage.flag}</span>}
        endIcon={<LanguageIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
        variant="outlined"
        size="small"
          sx={{
          textTransform: 'none',
          borderColor: 'primary.main',
          color: 'primary.main',
          fontWeight: 500,
          fontSize: { xs: '0.72rem', sm: '0.86rem' },
          px: { xs: 0.3, sm: 0.6 },
          py: { xs: 0.12, sm: 0.3 },
          minWidth: { xs: 'auto', sm: 'initial' },
          borderRadius: 2,
          border: '1px solid',
          boxShadow: { xs: 'none', sm: '0 1px 6px rgba(0,0,0,0.04)' },
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'primary.light',
            color: 'primary.contrastText',
          },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{currentLanguage.nativeName}</Box>
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
              fontSize: '0.85rem',
              py: { xs: 1, sm: 1.2 },
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Box component="span" sx={{ fontSize: '0.95em', mr: 0.5 }}>{language.flag}</Box>
              {i18n.language === language.code && (
                <CheckIcon fontSize="small" color="primary" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={language.nativeName}
              secondary={language.description}
              secondaryTypographyProps={{
                fontSize: '0.73rem',
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