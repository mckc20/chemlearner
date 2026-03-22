import { createContext, useContext, useState, useCallback } from 'react'

const LanguageContext = createContext()

const STORAGE_KEY = 'chemlearner_language'

function detectLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'de' || stored === 'en') return stored
  } catch { /* ignore */ }
  const browserLang = navigator.language || navigator.languages?.[0] || 'en'
  return browserLang.startsWith('de') ? 'de' : 'en'
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(detectLanguage)

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang)
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* ignore */ }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
