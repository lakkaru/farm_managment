# Internationalization (i18n) Guide

## Overview

This farm management application now supports both **Sinhala (සිංහල)** and **English** languages to serve Sri Lankan farmers effectively. The internationalization system uses React i18next for seamless language switching.

## Features

- 🌏 **Bilingual Support**: Sinhala and English languages
- 🔄 **Dynamic Language Switching**: Switch languages without page reload
- 💾 **Persistent Language Selection**: Language preference saved in localStorage
- 📱 **Mobile Friendly**: Language switcher works on mobile devices
- 🎯 **Default Language**: Sinhala is the default language for Sri Lankan farmers

## Language Switcher Locations

### Header Language Switcher
- Located in the top-right corner of the header
- Shows current language code (SI/EN)
- Compact design for space efficiency

### Usage in Components

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  );
};
```

### Custom Hook with Additional Utilities

```javascript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { 
    t, 
    currentLanguage, 
    isSinhala, 
    isEnglish,
    formatDate, 
    formatNumber 
  } = useTranslation();
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>Current Language: {currentLanguage}</p>
      <p>Date: {formatDate(new Date())}</p>
      <p>Number: {formatNumber(1234.56)}</p>
    </div>
  );
};
```

## Translation Structure

### English (`frontend/src/i18n/locales/en.json`)
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit"
  },
  "dashboard": {
    "title": "Dashboard",
    "totalFarms": "Total Farms"
  }
}
```

### Sinhala (`frontend/src/i18n/locales/si.json`)
```json
{
  "common": {
    "save": "සුරකින්න",
    "cancel": "අවලංගු කරන්න", 
    "edit": "සංස්කරණය"
  },
  "dashboard": {
    "title": "මුල් පිටුව",
    "totalFarms": "සම්පූර්ණ ගොවිපල"
  }
}
```

## Translation Categories

### 1. **common** - Shared elements
- Buttons (Save, Cancel, Edit, Delete, etc.)
- Status messages (Success, Error, Loading)
- Form elements (Required, Optional)

### 2. **navigation** - Menu items
- Dashboard, Farms, Season Plans
- Paddy Varieties, Disease Detection
- Profile, Admin, Logout

### 3. **auth** - Authentication
- Sign In, Sign Up, Password
- Welcome messages, Form labels

### 4. **dashboard** - Dashboard specific
- Statistics cards, Quick actions
- Recent activities

### 5. **farms** - Farm management
- Farm creation, editing, viewing
- Farm details, location info

### 6. **seasonPlans** - Season planning
- Season plan creation, management
- Cultivation details, status

### 7. **dailyRemarks** - Daily activities
- Remark categories, form fields
- Image uploads, descriptions

### 8. **paddyVarieties** - Paddy varieties
- Variety information, characteristics
- Yield data, recommendations

### 9. **diseaseDetection** - Disease detection
- Image analysis, results
- Treatment recommendations

### 10. **errors** - Error messages
- Network errors, validation errors
- Server errors, file upload errors

### 11. **validation** - Form validation
- Required field messages
- Input format validations

## How to Add New Translations

### 1. Add to English file (`en.json`)
```json
{
  "newSection": {
    "newKey": "New English Text"
  }
}
```

### 2. Add corresponding Sinhala translation (`si.json`)
```json
{
  "newSection": {
    "newKey": "නව සිංහල පාඨය"
  }
}
```

### 3. Use in component
```javascript
const { t } = useTranslation();
return <p>{t('newSection.newKey')}</p>;
```

## Language Detection Priority

1. **localStorage** - Previously saved language preference
2. **Browser Navigator** - User's browser language
3. **Default** - Sinhala (si) for Sri Lankan farmers

## Date and Number Formatting

The system automatically formats dates and numbers according to the selected language:

### Sinhala Locale (si-LK)
- Dates: Sinhala calendar format
- Numbers: Sinhala number formatting

### English Locale (en-US)
- Dates: English date format
- Numbers: Western number formatting

## Adding Translations to Existing Pages

To add translations to existing pages:

1. **Import the translation hook:**
```javascript
import { useTranslation } from 'react-i18next';
```

2. **Use the hook in your component:**
```javascript
const { t } = useTranslation();
```

3. **Replace hardcoded text:**
```javascript
// Before
<Typography variant="h4">Total Farms</Typography>

// After
<Typography variant="h4">{t('dashboard.totalFarms')}</Typography>
```

## Best Practices

### 1. **Consistent Key Naming**
- Use descriptive, hierarchical keys
- Group related translations together
- Use camelCase for key names

### 2. **Context-Aware Translations**
- Consider context when translating
- Some words may have different meanings in different contexts

### 3. **Cultural Sensitivity**
- Ensure translations are culturally appropriate
- Use terminology familiar to Sri Lankan farmers

### 4. **Fallback Handling**
```javascript
const title = t('page.title', 'Default Title');
```

### 5. **Dynamic Content**
```javascript
const message = t('farms.count', { count: farmCount });
```

## Troubleshooting

### Translation Key Not Found
- Check if the key exists in both language files
- Verify the key path is correct
- Ensure the translation files are properly imported

### Language Not Switching
- Check if the LanguageSwitcher component is properly imported
- Verify localStorage permissions
- Check browser console for errors

### Build Errors
- Ensure all translation keys used in code exist in JSON files
- Check for syntax errors in JSON files
- Verify imports are correct

## Future Enhancements

### Planned Features
- **Tamil Language Support** - For Tamil-speaking farmers
- **Voice Navigation** - Audio language support
- **Regional Dialects** - Support for different Sinhala dialects
- **Agricultural Terminology Database** - Comprehensive farming vocabulary
- **Offline Translation** - Work without internet connection

### Performance Optimizations
- **Lazy Loading** - Load translations on demand
- **Translation Caching** - Cache frequently used translations
- **Bundle Optimization** - Minimize translation file sizes

## Contributing Translations

To improve or add translations:

1. Review existing translations for accuracy
2. Add missing translations for new features
3. Test translations in context
4. Consider farmer feedback and terminology preferences

This internationalization system ensures the farm management application is accessible and user-friendly for Sri Lankan farmers in their preferred language.