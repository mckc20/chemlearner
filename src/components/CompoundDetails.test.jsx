import { useState } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { LanguageProvider } from '../i18n/LanguageContext'
import { DEFAULTS } from '../data/defaultCompounds'
import CompoundDetails from './CompoundDetails'
import CompareModal from './CompareModal'

vi.mock('../services/pubchem', () => ({ resolveCompound: () => new Promise(() => {}) }))
const item = id => DEFAULTS.find(compound => compound.id === `default-${id}`)
afterEach(() => { localStorage.clear(); vi.restoreAllMocks() })

test('compound tabs expose localized labels, zero values and linked elements', () => {
  const open = vi.fn()
  render(<LanguageProvider><CompoundDetails compound={item(15)} onOpenElement={open} /></LanguageProvider>)
  const overview = screen.getByRole('tab', { name: 'Overview' })
  expect(overview).toHaveAttribute('aria-selected', 'true')
  overview.focus()
  fireEvent.keyDown(overview, { key: 'ArrowRight' })
  expect(screen.getByRole('tab', { name: 'Properties' })).toHaveFocus()
  expect(within(screen.getByRole('tabpanel')).getByText('0 °C')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('tab', { name: 'Chemistry' }))
  fireEvent.click(screen.getByRole('button', { name: 'Hydrogen' }))
  expect(open).toHaveBeenCalledWith(1, 'default-15-H')
  expect(screen.getByText('2H₂O → 2H₂ + O₂')).toBeInTheDocument()
  expect(screen.queryByText('Did you know?')).not.toBeInTheDocument()
  const sources = screen.getByText('Sources and data edition')
  expect(sources.closest('details')).not.toHaveAttribute('open')
})

test('German profile and fallback records do not mix editorial identities', () => {
  localStorage.setItem('chemlearner_language', 'de')
  const salt = item(11)
  const { rerender } = render(<LanguageProvider><CompoundDetails compound={salt} onOpenElement={() => {}} /></LanguageProvider>)
  expect(screen.getByRole('tab', { name: 'Überblick' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('tab', { name: 'Chemie' }))
  expect(screen.getByRole('button', { name: 'Natrium' })).toBeInTheDocument()
  rerender(<LanguageProvider><CompoundDetails compound={{ ...salt, formula: 'KCl', information: 'Edited' }} /></LanguageProvider>)
  expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  expect(screen.getByText('Edited')).toBeInTheDocument()
})

test('comparison panels keep independent tabs and distinct accessible IDs', () => {
  function Comparison() {
    const [tabs, setTabs] = useState({})
    return <CompareModal compounds={[item(11), item(15)]} onClose={() => {}} tabSelections={tabs} onTabChange={(id, tab) => setTabs(current => ({ ...current, [id]: tab }))} onOpenElement={() => {}} />
  }
  render(<LanguageProvider><Comparison /></LanguageProvider>)
  const dialog = screen.getByRole('dialog', { name: 'Compare Compounds' })
  const cards = dialog.querySelectorAll('.compound-comparison-card')
  fireEvent.click(within(cards[0]).getByRole('tab', { name: 'Chemistry' }))
  expect(within(cards[0]).getByRole('tab', { name: 'Chemistry' })).toHaveAttribute('aria-selected', 'true')
  expect(within(cards[1]).getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
  const ids = [...dialog.querySelectorAll('[role="tab"]')].map(tab => tab.id)
  expect(new Set(ids).size).toBe(ids.length)
})
