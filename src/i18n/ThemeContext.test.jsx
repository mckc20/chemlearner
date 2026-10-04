import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { LanguageProvider } from './LanguageContext'
import { ThemeProvider } from './ThemeContext'
import ThemeSwitch from '../components/ThemeSwitch'

function renderThemeControl() {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>
    </LanguageProvider>,
  )
}

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  delete document.documentElement.dataset.theme
})

test('theme selection is applied and persisted across mounts', () => {
  const firstMount = renderThemeControl()
  fireEvent.click(screen.getByRole('button', { name: 'Dark theme' }))

  expect(document.documentElement).toHaveClass('dark')
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  expect(document.documentElement).toHaveClass('theme-transition')
  expect(localStorage.getItem('chemlearner_theme')).toBe('dark')

  firstMount.unmount()
  renderThemeControl()
  expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'true')
  expect(document.documentElement).toHaveClass('dark')
})
