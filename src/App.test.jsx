import { render, screen } from '@testing-library/react'
import App from './App'

test('renders ChemLearner 3D nav title', () => {
  render(<App />)
  expect(screen.getByText('ChemLearner 3D')).toBeInTheDocument()
})
