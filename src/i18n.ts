// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';
import jaTranslation from './locales/ja/translation.json';
import siTranslation from './locales/si/translation.json';

// The translations
const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
  si: {
    translation: siTranslation,
  },
};

i18n
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize with configuration
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
