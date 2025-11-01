import React, { useState, useEffect } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/i18n';
import LanguageWelcomeDialog from '../components/LanguageWelcomeDialog/LanguageWelcomeDialog';

/**
 * AppProviders - Additional providers for features not in gatsby-browser.js
 * Note: Core providers (Auth, Farm, Theme, QueryClient) are in gatsby-browser.js
 * This component only adds I18next and language dialog
 */
const AppProviders = ({ children }) => {
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);

  useEffect(() => {
    // Check if this is the browser environment and if user hasn't selected language before
    if (typeof window !== 'undefined') {
      const hasSelectedLanguage = localStorage.getItem('hasSelectedLanguage');
      // support both our preferredLanguage key and i18next's own key
      const preferredLanguageRaw = localStorage.getItem('preferredLanguage') || localStorage.getItem('i18nextLng');
      const preferredLanguage = preferredLanguageRaw ? preferredLanguageRaw.split('-')[0] : null;
      
      if (!hasSelectedLanguage && !preferredLanguage) {
        // Show language selection dialog for first-time users
        setShowLanguageDialog(true);
      } else if (preferredLanguage) {
        // Set saved language preference (normalize regional variants like 'si-LK' -> 'si')
        i18n.changeLanguage(preferredLanguage);
      }
    }
  }, []);

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);
    setShowLanguageDialog(false);
  };

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      
      {/* Language Welcome Dialog for first-time users */}
      <LanguageWelcomeDialog
        open={showLanguageDialog}
        onClose={() => setShowLanguageDialog(false)}
        onLanguageSelect={handleLanguageSelect}
      />
      
      {typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </I18nextProvider>
  );
};

export default AppProviders;
