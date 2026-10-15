import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { LanguageProvider } from '../i18n/LanguageContext'
import { DEFAULTS } from '../data/defaultCompounds'
import CompoundList from './CompoundList'

vi.mock('./CompoundCardImage', () => ({
  default: ({ compound, imageType }) => <div data-testid={`image-${compound.id}`}>{imageType}</div>,
}))

afterEach(() => localStorage.clear())

function renderList({ compounds = DEFAULTS.slice(0, 2), onView = vi.fn(), onSelectionChange = vi.fn() } = {}) {
  const selectedIds = new Set()
  return {
    onView,
    onSelectionChange,
    ...render(
      <LanguageProvider>
        <CompoundList compounds={compounds} onView={onView} selectedIds={selectedIds} onSelectionChange={onSelectionChange} />
      </LanguageProvider>
    ),
  }
}

test('table omits Information and grid cards retain selection and detail actions', () => {
  const { onView, onSelectionChange } = renderList()
  expect(screen.queryByRole('columnheader', { name: 'Information' })).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Grid' }))
  const grid = screen.getByRole('list', { name: 'Compounds' })
  expect(within(grid).getAllByRole('listitem')).toHaveLength(2)
  expect(within(grid).getByTestId(`image-${DEFAULTS[0].id}`)).toHaveTextContent('skeleton')
  fireEvent.click(screen.getByRole('checkbox', { name: 'Select all visible compounds' }))
  expect(onSelectionChange).toHaveBeenCalledWith(new Set(DEFAULTS.slice(0, 2).map(compound => compound.id)))

  fireEvent.click(within(grid).getByRole('checkbox', { name: `Select ${DEFAULTS[0].name}` }))
  expect(onView).not.toHaveBeenCalled()
  fireEvent.click(within(grid).getByRole('button', { name: `Open ${DEFAULTS[0].name}` }))
  expect(onView).toHaveBeenCalledWith(DEFAULTS[0])
})

test('clicking a table row opens its compound, while its checkbox only selects', () => {
  const { onView, onSelectionChange } = renderList()
  const compound = DEFAULTS[0]
  const row = screen.getByRole('row', { name: new RegExp(compound.name) })

  fireEvent.click(within(row).getByRole('checkbox', { name: `Select ${compound.name}` }))
  expect(onSelectionChange).toHaveBeenCalledWith(new Set([compound.id]))
  expect(onView).not.toHaveBeenCalled()

  fireEvent.click(within(row).getByText(compound.category))
  expect(onView).toHaveBeenCalledWith(compound)
})

test('layout and card image settings are remembered between mounts', () => {
  const firstRender = renderList()
  fireEvent.click(screen.getByRole('button', { name: 'Grid' }))
  fireEvent.change(screen.getByRole('combobox', { name: 'Card image' }), { target: { value: '3d' } })
  firstRender.unmount()

  renderList()
  expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('combobox', { name: 'Card image' })).toHaveValue('3d')
  expect(screen.getByTestId(`image-${DEFAULTS[0].id}`)).toHaveTextContent('3d')
})
