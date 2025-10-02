import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardActionArea,
  Grid,
  Fade,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const LanguageWelcomeDialog = ({ open, onClose, onLanguageSelect }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { 
      code: 'si', 
      name: 'සිංහල', 
      nativeName: 'සිංහල',
      flag: '🇱🇰',
      description: 'ශ්‍රී ලාංකික ගොවියන් සඳහා',
      englishDescription: 'For Sri Lankan Farmers',
      primary: true
    },
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English',
      flag: '🌐',
      description: 'International Language',
      englishDescription: 'International Language',
      primary: false
    },
  ];

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  const handleConfirm = () => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('preferredLanguage', selectedLanguage);
    localStorage.setItem('hasSelectedLanguage', 'true');
    onLanguageSelect(selectedLanguage);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing without selection
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <LanguageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5" fontWeight="600" gutterBottom>
          Welcome to Farm Management / ගොවිපල කළමනාකරණයට සාදරයෙන් පිළිගනිමු
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please select your preferred language / කරුණාකර ඔබේ භාෂාව තෝරන්න
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Grid container spacing={2}>
          {languages.map((language) => (
            <Grid item xs={12} sm={6} key={language.code}>
              <Fade in timeout={500}>
                <Card
                  sx={{
                    border: selectedLanguage === language.code ? 2 : 1,
                    borderColor: selectedLanguage === language.code ? 'primary.main' : 'divider',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                    backgroundColor: language.primary ? 'primary.light' : 'background.paper',
                    ...(selectedLanguage === language.code && {
                      backgroundColor: 'primary.light',
                      '& .MuiTypography-root': {
                        color: 'primary.contrastText',
                      },
                    }),
                  }}
                >
                  <CardActionArea
                    onClick={() => handleLanguageSelect(language.code)}
                    sx={{ p: 3, textAlign: 'center', minHeight: 140 }}
                  >
                    <Box sx={{ fontSize: '2.5em', mb: 1 }}>
                      {language.flag}
                    </Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {language.nativeName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {language.description}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {language.englishDescription}
                    </Typography>
                    
                    {language.primary && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        backgroundColor: 'success.main',
                        color: 'success.contrastText',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}>
                        Recommended
                      </Box>
                    )}
                    
                    {selectedLanguage === language.code && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8,
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        borderRadius: '50%',
                        p: 0.5
                      }}>
                        <CheckIcon fontSize="small" />
                      </Box>
                    )}
                  </CardActionArea>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'info.contrastText' }}>
            💡 You can change the language anytime from the language switcher in the header
            <br />
            💡 ඔබට ශීර්ෂයේ භාෂා මාරුකරන්නා මගින් ඕනෑම වේලාවක භාෂාව වෙනස් කළ හැක
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 3,
          }}
        >
          Continue / ඉදිරියට
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LanguageWelcomeDialog;