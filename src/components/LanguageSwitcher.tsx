'use client'

import { useLanguage } from '@/context/LanguageContext'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl"
    >
      <button
        type="button"
        onClick={() => setLanguage('fr')}
        aria-pressed={language === 'fr'}
        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          language === 'fr'
            ? 'bg-gold text-black shadow-gold font-bold scale-102'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={language === 'ar'}
        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          language === 'ar'
            ? 'bg-gold text-black shadow-gold font-bold scale-102'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
        }`}
      >
        العربية
      </button>
    </div>
  )
}
