/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'
import LanguageSwitch from '../i18n/LanguageSwitch'
import ThemeSwitch from './ThemeSwitch'

export default function TopNavigation({ onNavigate, pathname }) {
  const { language } = useLanguage()
  const [libraryOpen, setLibraryOpen] = useState(false)
  const libraryRef = useRef(null)
  const isLibraryRoute = pathname === '/compounds'
  const isPeriodicRoute = pathname === '/periodic-table' || pathname === '/periodic-table/quiz'
  const libraryItems = [
    { label: t(language, 'nav.moleculeLibrary'), href: '/compounds' },
    { label: t(language, 'nav.periodicElements'), href: '/periodic-table' },
  ]

  useEffect(() => {
    if (!libraryOpen) return undefined

    function handlePointerDown(event) {
      if (!libraryRef.current?.contains(event.target)) setLibraryOpen(false)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setLibraryOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [libraryOpen])

  useEffect(() => setLibraryOpen(false), [pathname])

  function navigate(event, destination) {
    setLibraryOpen(false)
    onNavigate(event, destination)
  }

  return (
    <header className="site-topbar">
      <a href="/" onClick={(event) => navigate(event, '/')} className="site-brand">
        <span className="brand-logo site-brand__logo" aria-hidden="true" />
        ChemLearner
      </a>

      <nav className="site-navigation" aria-label={t(language, 'nav.main')}>
        <div
          className="site-navigation__group"
          ref={libraryRef}
          onMouseEnter={() => setLibraryOpen(true)}
          onMouseLeave={() => setLibraryOpen(false)}
        >
          <button
            type="button"
            className={`site-navigation__tab ${isLibraryRoute || isPeriodicRoute ? 'site-navigation__tab--active' : ''}`}
            aria-controls="library-navigation-menu"
            aria-expanded={libraryOpen}
            aria-current={isLibraryRoute || isPeriodicRoute ? 'page' : undefined}
            onClick={() => setLibraryOpen(true)}
          >
            {t(language, 'nav.library')}
            <span className="site-navigation__chevron" aria-hidden="true">⌄</span>
          </button>
          {libraryOpen && (
            <div className="site-navigation__menu" id="library-navigation-menu">
              {libraryItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={(item.href === '/compounds' && isLibraryRoute) || (item.href === '/periodic-table' && isPeriodicRoute) ? 'page' : undefined}
                  onClick={(event) => navigate(event, item.href)}
                  className="site-navigation__menu-item"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="site-navigation__tab site-navigation__tab--disabled" disabled>
          {t(language, 'nav.tools')}
        </button>
        <button type="button" className="site-navigation__tab site-navigation__tab--disabled" disabled>
          {t(language, 'nav.learn')}
        </button>
        <a href="/help" onClick={event => navigate(event, '/help')} className={`site-navigation__tab ${pathname === '/help' ? 'site-navigation__tab--active' : ''}`} aria-current={pathname === '/help' ? 'page' : undefined}>{t(language, 'nav.help')}</a>
      </nav>

      <div className="site-controls">
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </header>
  )
}
