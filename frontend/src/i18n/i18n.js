import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import siTranslations from './locales/si.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    
    fallbackLng: 'en',
    lng: 'si', // Default to Sinhala for Sri Lankan farmers
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    resources: {
      en: {
        translation: enTranslations,
      },
      si: {
        translation: siTranslations,
      },
    },
    
    detection: {
      // Store language preference in localStorage
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false, // Important for Gatsby
    },
  });

export default i18n;