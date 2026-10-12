import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import App from './App'
import { QUIZ_SETTINGS_KEY } from './data/periodicQuiz'
import { LanguageProvider } from './i18n/LanguageContext'

afterEach(() => {
  window.history.replaceState({}, '', '/')
  localStorage.removeItem('chemlearner_language')
  localStorage.removeItem(QUIZ_SETTINGS_KEY)
  vi.restoreAllMocks()
})

function renderApp() {
  return render(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  )
}

test('renders the start page at the root route', () => {
  renderApp()
  expect(screen.getByRole('heading', { name: 'Explore molecular worlds.' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Library' }))
  expect(screen.getByRole('link', { name: 'Molecule Library' })).toHaveAttribute('href', '/compounds')
  expect(screen.getByRole('link', { name: 'Periodic Table of Elements' })).toHaveAttribute('href', '/periodic-table')
  expect(screen.getByRole('button', { name: 'Tools' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Learn' })).toBeDisabled()
})

test('opens the compound workspace from the start page', () => {
  renderApp()
  fireEvent.click(screen.getByRole('button', { name: 'Library' }))
  fireEvent.click(screen.getByRole('link', { name: 'Molecule Library' }))
  expect(window.location.pathname).toBe('/compounds')
  expect(screen.getByText('ChemLearner')).toBeInTheDocument()
})

test('opens the Library dropdown on hover and closes it with Escape', () => {
  renderApp()
  const trigger = screen.getByRole('button', { name: 'Library' })
  fireEvent.mouseEnter(trigger)
  expect(screen.getByRole('link', { name: 'Periodic Table of Elements' })).toBeInTheDocument()
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('link', { name: 'Periodic Table of Elements' })).not.toBeInTheDocument()
})

test('opens the periodic table from the Library dropdown', () => {
  renderApp()
  fireEvent.click(screen.getByRole('button', { name: 'Library' }))
  fireEvent.click(screen.getByRole('link', { name: 'Periodic Table of Elements' }))
  expect(window.location.pathname).toBe('/periodic-table')
  expect(screen.getByRole('heading', { name: 'Periodic table' })).toBeInTheDocument()
})

test('renders the compound workspace when loaded directly', () => {
  window.history.replaceState({}, '', '/compounds')
  renderApp()
  expect(screen.getByRole('heading', { name: 'Compound Library' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'ChemLearner' })).toHaveAttribute('href', '/')
})

test('updates the view when browser navigation changes the route', () => {
  renderApp()
  window.history.pushState({}, '', '/compounds')
  fireEvent.popState(window)
  expect(screen.getByRole('heading', { name: 'Compound Library' })).toBeInTheDocument()
})

test('opens quiz history from the library heading and returns to the library', () => {
  window.history.replaceState({}, '', '/compounds')
  renderApp()
  expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Quiz History' }))
  expect(screen.getByRole('heading', { name: 'Quiz History' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Molecule Library' }))
  expect(screen.getByRole('heading', { name: 'Compound Library' })).toBeInTheDocument()
})

test('opens the periodic quiz from the reference page and supports a direct load', () => {
  window.history.replaceState({}, '', '/periodic-table')
  const view = renderApp()
  fireEvent.click(screen.getByRole('button', { name: 'Quiz' }))
  expect(screen.getByRole('dialog', { name: 'Set up your quiz' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(window.location.pathname).toBe('/periodic-table')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Quiz' }))
  fireEvent.click(screen.getByLabelText('Find the element'))
  fireEvent.click(screen.getByRole('button', { name: 'Start' }))
  expect(window.location.pathname).toBe('/periodic-table/quiz')
  expect(screen.getByRole('heading', { name: 'Periodic table quiz' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('link', { name: 'Back to periodic table' }))
  expect(window.location.pathname).toBe('/periodic-table')
  view.unmount()

  window.history.replaceState({}, '', '/periodic-table/quiz')
  renderApp()
  expect(screen.getByRole('heading', { name: 'Periodic table quiz' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Compound Library' })).not.toBeInTheDocument()
})

test('switching language during periodic quiz changes names without resetting progress', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.999999)
  window.history.replaceState({}, '', '/periodic-table/quiz')
  renderApp()
  fireEvent.click(screen.getByRole('button', { name: 'EN' }))
  fireEvent.click(screen.getByLabelText('Find the element'))
  fireEvent.click(screen.getByRole('button', { name: 'Start' }))
  expect(screen.getByRole('heading', { name: 'Hydrogen' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'DE' }))
  expect(screen.getByRole('heading', { name: 'Wasserstoff' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Zeile 1, Spalte 1 beantworten' }))
  expect(screen.getByText('Punkte: 1/118')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Wasserstoff/ })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'EN' }))
  expect(screen.getByText('Points: 1/118')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Hydrogen/ })).toBeDisabled()
})

test('browser history starts a fresh round using the latest deferred settings', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.999999)
  window.history.replaceState({}, '', '/periodic-table/quiz')
  renderApp()
  fireEvent.click(screen.getByLabelText('Find the element'))
  fireEvent.click(screen.getByRole('button', { name: 'Start' }))
  fireEvent.click(screen.getByRole('button', { name: 'Answer row 1, column 1' }))
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
  fireEvent.change(screen.getByLabelText('Round length'), { target: { value: 'custom' } })
  fireEvent.change(screen.getByLabelText('Number of elements'), { target: { value: '2' } })
  fireEvent.click(screen.getByRole('button', { name: 'Apply', exact: true }))
  fireEvent.click(screen.getByRole('button', { name: 'Apply in next round' }))
  expect(screen.getByText('Found: 1/118')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('link', { name: 'Back to periodic table' }))
  window.history.replaceState({}, '', '/periodic-table/quiz')
  fireEvent.popState(window)
  expect(screen.getByText('Found: 0/2')).toBeInTheDocument()
  expect(screen.getByText('Points: 0/2')).toBeInTheDocument()
})

test('starts Element questions from the setup dialog and preserves changed settings through history', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.999999)
  window.history.replaceState({}, '', '/periodic-table')
  renderApp()
  fireEvent.click(screen.getByRole('button', { name: 'Quiz' }))
  fireEvent.click(screen.getByLabelText('Element questions'))
  fireEvent.click(screen.getByRole('button', { name: 'Start' }))
  expect(window.location.pathname).toBe('/periodic-table/quiz')
  expect(screen.getByRole('heading', { name: 'Element questions' })).toBeInTheDocument()
  expect(screen.queryByRole('region', { name: 'Element grid' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Symbol' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Name' }))
  fireEvent.click(screen.getByRole('button', { name: 'Apply', exact: true }))
  fireEvent.click(screen.getByRole('button', { name: 'Apply in next round' }))
  fireEvent.click(screen.getByRole('link', { name: 'Back to periodic table' }))
  window.history.replaceState({}, '', '/periodic-table/quiz')
  fireEvent.popState(window)
  expect(screen.getByRole('heading', { name: 'Element questions' })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('')
  expect(screen.getByRole('heading', { name: 'H', exact: true })).toBeInTheDocument()
})

test('help supports a direct route, German translation and browser history', () => {
  window.history.replaceState({}, '', '/help')
  renderApp()
  expect(screen.getByRole('heading', { name: 'Help', level: 1 })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Compound Library' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'DE' }))
  expect(screen.getByRole('heading', { name: 'Hilfe', level: 1 })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Atomanimation' })).toBeInTheDocument()
  window.history.replaceState({}, '', '/periodic-table')
  fireEvent.popState(window)
  expect(screen.queryByRole('heading', { name: 'Hilfe', level: 1 })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('link', { name: 'Hilfe', exact: true }))
  expect(window.location.pathname).toBe('/help')
})
