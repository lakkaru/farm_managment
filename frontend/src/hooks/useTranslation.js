import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Custom hook that wraps react-i18next's useTranslation
 * Provides additional utilities for the farm management app
 */
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  /**
   * Get current language code
   */
  const currentLanguage = i18n.language;
  
  /**
   * Check if current language is Sinhala
   */
  const isSinhala = currentLanguage === 'si';
  
  /**
   * Check if current language is English
   */
  const isEnglish = currentLanguage === 'en';
  
  /**
   * Change language
   */
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  /**
   * Format date according to current locale
   */
  const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Default formatting options
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    // Use Sinhala locale for Sinhala language, English for others
    const locale = isSinhala ? 'si-LK' : 'en-US';
    
    return dateObj.toLocaleDateString(locale, formatOptions);
  };
  
  /**
   * Format number according to current locale
   */
  const formatNumber = (number, options = {}) => {
    if (typeof number !== 'number') return number;
    
    const locale = isSinhala ? 'si-LK' : 'en-US';
    
    return number.toLocaleString(locale, options);
  };
  
  /**
   * Get translation with fallback
   */
  const tWithFallback = (key, fallback = '') => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };
  
  return {
    t,
    i18n,
    currentLanguage,
    isSinhala,
    isEnglish,
    changeLanguage,
    formatDate,
    formatNumber,
    tWithFallback,
  };
};

export default useTranslation;