import { render, screen } from '@testing-library/react'
import App from './App'

test('renders ChemLearner nav title', () => {
  render(<App />)
  expect(screen.getByText('ChemLearner')).toBeInTheDocument()
})
