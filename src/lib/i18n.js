import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

const STORAGE_KEY = 'sw_lang'

const savedLang = localStorage.getItem(STORAGE_KEY) ||
  (navigator.language.startsWith('ar') ? 'ar' : 'en')

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

// Sync <html> dir and lang attributes
function applyDirection(lang) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lang)
  localStorage.setItem(STORAGE_KEY, lang)
}

applyDirection(savedLang)
i18n.on('languageChanged', applyDirection)

export default i18n
