import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon   from './locales/en/common.json';
import enChat     from './locales/en/chat.json';
import enSettings from './locales/en/settings.json';
import enPricing  from './locales/en/pricing.json';
import enMemory   from './locales/en/memory.json';
import enErrors   from './locales/en/errors.json';

import trCommon   from './locales/tr/common.json';
import trChat     from './locales/tr/chat.json';
import trSettings from './locales/tr/settings.json';
import trPricing  from './locales/tr/pricing.json';
import trMemory   from './locales/tr/memory.json';
import trErrors   from './locales/tr/errors.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, chat: enChat, settings: enSettings, pricing: enPricing, memory: enMemory, errors: enErrors },
      tr: { common: trCommon, chat: trChat, settings: trSettings, pricing: trPricing, memory: trMemory, errors: trErrors },
    },
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
