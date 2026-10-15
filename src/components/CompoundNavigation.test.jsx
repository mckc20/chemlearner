import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import App from '../App'
import { LanguageProvider } from '../i18n/LanguageContext'

vi.mock('../services/pubchem', () => ({ resolveCompound: () => new Promise(() => {}) }))
afterEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); vi.restoreAllMocks() })

test('closing an element opened from comparison restores both selected tabs and the invoking link', () => {
  window.history.replaceState({}, '', '/compounds')
  render(<LanguageProvider><App /></LanguageProvider>)
  fireEvent.click(screen.getByRole('checkbox', { name: 'Select Sodium chloride' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Select Water' }))
  fireEvent.click(screen.getByRole('button', { name: 'Compare' }))
  const comparison = screen.getByRole('dialog', { name: 'Compare Compounds' })
  const cards = comparison.querySelectorAll('.compound-comparison-card')
  const salt = [...cards].find(card => card.querySelector('header h3').textContent === 'Sodium chloride')
  const water = [...cards].find(card => card.querySelector('header h3').textContent === 'Water')
  fireEvent.click(within(salt).getByRole('tab', { name: 'Chemistry' }))
  fireEvent.click(within(water).getByRole('tab', { name: 'Properties' }))
  fireEvent.click(within(salt).getByRole('button', { name: 'Sodium' }))
  expect(screen.getByRole('dialog', { name: 'Sodium' })).toBeInTheDocument()
  fireEvent.keyDown(document, { key: 'Escape' })
  const restored = screen.getByRole('dialog', { name: 'Compare Compounds' })
  const restoredCards = restored.querySelectorAll('.compound-comparison-card')
  const restoredSalt = [...restoredCards].find(card => card.querySelector('header h3').textContent === 'Sodium chloride')
  const restoredWater = [...restoredCards].find(card => card.querySelector('header h3').textContent === 'Water')
  expect(within(restoredSalt).getByRole('tab', { name: 'Chemistry' })).toHaveAttribute('aria-selected', 'true')
  expect(within(restoredWater).getByRole('tab', { name: 'Properties' })).toHaveAttribute('aria-selected', 'true')
  expect(within(restoredSalt).getByRole('button', { name: 'Sodium' })).toHaveFocus()
})
