import { render, screen, within } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { LanguageProvider } from '../i18n/LanguageContext'
import { CompoundStructure } from './CompareModal'

vi.mock('../services/pubchem', () => ({
  resolveCompound: vi.fn().mockRejectedValue(new Error('Could not fetch structure for CID 311.')),
}))

vi.mock('../services/rdkit', () => ({
  smilesToSvg: vi.fn().mockResolvedValue('<svg data-testid="citric-structure" />'),
}))

test('shows the 2D structure even when the PubChem SDF request fails', async () => {
  const { container } = render(
    <LanguageProvider>
      <CompoundStructure mol={{ formula: 'C6H8O7', smiles: 'OC(CC(O)=O)(CC(O)=O)C(O)=O' }} />
    </LanguageProvider>
  )

  const twoDimensionalPanel = container.querySelector('.compound-structure-panel--2d')
  expect(await within(twoDimensionalPanel).findByTestId('citric-structure')).toBeInTheDocument()
  expect(await screen.findByText('Could not fetch structure for CID 311.')).toBeInTheDocument()
  expect(within(twoDimensionalPanel).queryByText('Could not load structure')).not.toBeInTheDocument()
})
