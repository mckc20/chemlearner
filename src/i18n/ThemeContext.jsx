/* eslint-disable react/prop-types */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const ThemeContext = createContext({ theme: 'system', resolvedTheme: 'light', setTheme: () => {} })
const STORAGE_KEY = 'chemlearner_theme'

function readTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch { /* storage may be unavailable */ }
  return 'system'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readTheme)
  const [resolvedTheme, setResolvedTheme] = useState('light')
  const previousResolvedTheme = useRef(null)
  const transitionTimer = useRef(null)

  const beginThemeTransition = useCallback(() => {
    const root = document.documentElement
    if (!root.classList.contains('theme-transition')) {
      root.classList.add('theme-transition')
      // Apply the transition rules against the current theme before changing tokens.
      void root.offsetWidth
    }
    window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove('theme-transition')
    }, 240)
  }, [])

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && Boolean(media?.matches))
      const nextResolvedTheme = dark ? 'dark' : 'light'
      if (previousResolvedTheme.current && previousResolvedTheme.current !== nextResolvedTheme) {
        beginThemeTransition()
      }
      previousResolvedTheme.current = nextResolvedTheme
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.dataset.theme = nextResolvedTheme
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
      setResolvedTheme(nextResolvedTheme)
    }
    apply()
    media?.addEventListener?.('change', apply)
    if (!media?.addEventListener) media?.addListener?.(apply)
    return () => {
      media?.removeEventListener?.('change', apply)
      if (!media?.removeEventListener) media?.removeListener?.(apply)
    }
  }, [beginThemeTransition, theme])

  useEffect(() => () => {
    window.clearTimeout(transitionTimer.current)
    document.documentElement.classList.remove('theme-transition')
  }, [])

  const setTheme = useCallback((value) => {
    const nextResolvedTheme = value === 'system'
      ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : value
    const currentResolvedTheme = document.documentElement.dataset.theme
    if (currentResolvedTheme && currentResolvedTheme !== nextResolvedTheme) beginThemeTransition()
    setThemeState(value)
    try { localStorage.setItem(STORAGE_KEY, value) } catch { /* storage may be unavailable */ }
  }, [beginThemeTransition])

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
