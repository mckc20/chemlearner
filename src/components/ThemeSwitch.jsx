import { useTheme } from '../i18n/ThemeContext'
import { useLanguage } from '../i18n/LanguageContext'

const options = [
  { value: 'light', label: 'Light theme', Icon: SunIcon },
  { value: 'dark', label: 'Dark theme', Icon: MoonIcon },
  { value: 'system', label: 'Use system theme', Icon: SystemIcon },
]

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const { language } = useLanguage()
  const labels = language === 'de'
    ? { light: 'Helles Design', dark: 'Dunkles Design', system: 'Systemdesign verwenden' }
    : null
  return (
    <div className="theme-switch" role="group" aria-label={language === 'de' ? 'Farbschema' : 'Color theme'}>
      {options.map(({ value, label, Icon }) => {
        const accessibleLabel = labels?.[value] ?? label
        return (
          <button
            key={value}
            type="button"
            className={`theme-switch__button ${theme === value ? 'theme-switch__button--active' : ''}`}
            aria-label={accessibleLabel}
            aria-pressed={theme === value}
            title={accessibleLabel}
            onClick={() => setTheme(value)}
          >
            <Icon />
          </button>
        )
      })}
    </div>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2M12 19.5v2M4.4 4.4l1.4 1.4m12.4 12.4 1.4 1.4M2.5 12h2m15 0h2M4.4 19.6l1.4-1.4M18.2 5.8l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 15.2A8 8 0 0 1 8.8 4.5 8.5 8.5 0 1 0 19.5 15.2Z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="17" height="12" rx="1" />
      <path d="M8.5 20h7M12 16v4" />
    </svg>
  )
}
