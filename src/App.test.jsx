import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'

afterEach(() => window.history.replaceState({}, '', '/'))

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
  expect(screen.getByRole('link', { name: /compound library/i })).toHaveAttribute('href', '/compounds')
})

test('opens the compound workspace from the start page', () => {
  renderApp()
  fireEvent.click(screen.getByRole('link', { name: /compound library/i }))
  expect(window.location.pathname).toBe('/compounds')
  expect(screen.getByText('ChemLearner')).toBeInTheDocument()
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
