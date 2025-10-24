import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
// Sinhala consolidated translations
import siTranslations from './locales/si.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    
    // Normalize regional variants to base language (e.g. 'si-LK' -> 'si')
    load: 'languageOnly',

    // Prefer Sinhala, fall back to English when keys are missing
    fallbackLng: ['si', 'en'],
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

  // Expose i18n instance on window in development for easier debugging
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // attach non-enumerable to avoid accidental serialization
    try {
      Object.defineProperty(window, 'i18next', {
        configurable: true,
        writable: true,
        value: i18n,
      });
    } catch (e) {
      // fallback
      window.i18next = i18n;
    }
  }