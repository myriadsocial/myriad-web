import enMessages from './en.json';
import idMessages from './id.json';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

export const allMessage = {
  en: enMessages,
  id: idMessages,
};

export const optionDetection = {
  lookupLocalStorage: 'i18nextLng',
};

const resources = {
  en: {translation: enMessages},
  id: {translation: idMessages},
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: optionDetection,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
