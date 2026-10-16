'use client'

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from 'react'
import { Language, translations, Translations } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  dir: 'ltr' | 'rtl'
  isRtl: boolean
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'medshop-lang'
const LANG_CHANGE_EVENT = 'medshop-lang-change'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  window.addEventListener(LANG_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(LANG_CHANGE_EVENT, callback)
  }
}

function getSnapshot(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'ar' ? 'ar' : 'fr'
  } catch {
    return 'fr'
  }
}

function getServerSnapshot(): Language {
  return 'fr'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Sync HTML attributes whenever language changes
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', language)
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Ignore
    }
    window.dispatchEvent(new Event(LANG_CHANGE_EVENT))
  }, [])

  const toggleLanguage = useCallback(() => {
    const nextLang = language === 'fr' ? 'ar' : 'fr'
    setLanguage(nextLang)
  }, [language, setLanguage])

  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr'
  const isRtl = dir === 'rtl'
  const t = useMemo(() => translations[language], [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      dir,
      isRtl,
      t,
    }),
    [language, setLanguage, toggleLanguage, dir, isRtl, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
