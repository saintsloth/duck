import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'
import en from './en';
import ru from './ru';

i18n
  // Подключение бэкенда i18next
  // .use(Backend) //import Backend from 'i18next-http-backend'
  // Автоматическое определение языка
  // .use(LanguageDetector) //import LanguageDetector from 'i18next-browser-languagedetector'
  // модуль инициализации
  .use (initReactI18next)
  .init({
    // Стандартный язык
    fallbackLng: 'ru',
    resources: {
      ru,
      en,
    },
    debug: true,
    // Распознавание и кэширование языковых кук
    detection: {
      order: ['queryString', 'cookie'],
      cache: ['cookie']
    },
    interpolation: {
      escapeValue: false
    }
  })

export default i18n;