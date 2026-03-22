import { useLanguage } from './LanguageContext'

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center text-sm">
      <button
        onClick={() => setLanguage('de')}
        className={`px-1.5 py-0.5 rounded-l border border-gray-300 dark:border-gray-600 transition-colors ${
          language === 'de'
            ? 'bg-blue-600 text-white border-blue-600 dark:border-blue-600'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        DE
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-1.5 py-0.5 rounded-r border border-l-0 border-gray-300 dark:border-gray-600 transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white border-blue-600 dark:border-blue-600'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  )
}
