import { renderHook, act } from '@testing-library/react'
import { useCompoundLibrary } from './useCompoundLibrary'

beforeEach(() => {
  localStorage.clear()
})

const validCompoundFields = {
  wikipediaUrl: 'https://en.wikipedia.org/wiki/Test',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/1',
  wikidataId: 'Q1',
  smiles: 'C',
}

const validCSVFields = {
  WikipediaUrl: 'https://en.wikipedia.org/wiki/Test',
  PubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/1',
  WikidataId: 'Q1',
  SMILES: 'C',
}

describe('useCompoundLibrary', () => {
  test('pre-loads 15 default compounds on first run', () => {
    const { result } = renderHook(() => useCompoundLibrary())
    expect(result.current.compounds).toHaveLength(15)
    const names = result.current.compounds.map(c => c.name)
    expect(names).toContain('Water')
    expect(names).toContain('Sulphuric Acid')
    expect(names).toContain('Salt')
    expect(names).toContain('Nitroglycerin')
  })

  test('restores compounds from localStorage on remount', () => {
    const { result, unmount } = renderHook(() => useCompoundLibrary())
    const initialCount = result.current.compounds.length

    act(() => {
      result.current.addCompound({ name: 'Ethanol', formula: 'C2H5OH', category: 'Alcohol', information: 'Drinking alcohol.', ...validCompoundFields })
    })
    expect(result.current.compounds).toHaveLength(initialCount + 1)

    unmount()
    const { result: result2 } = renderHook(() => useCompoundLibrary())
    expect(result2.current.compounds).toHaveLength(initialCount + 1)
    expect(result2.current.compounds.map(c => c.name)).toContain('Ethanol')
  })

  test('addCompound assigns a unique id', () => {
    const { result } = renderHook(() => useCompoundLibrary())
    let added
    act(() => {
      added = result.current.addCompound({ name: 'CO2', formula: 'CO2', category: 'Gas', information: 'Carbon dioxide.', ...validCompoundFields })
    })
    expect(added.id).toBeTruthy()
    expect(result.current.compounds.find(c => c.id === added.id)).toBeDefined()
  })

  test('deleteCompound removes the compound by id', () => {
    const { result } = renderHook(() => useCompoundLibrary())
    const idToDelete = result.current.compounds[0].id
    act(() => {
      result.current.deleteCompound(idToDelete)
    })
    expect(result.current.compounds.find(c => c.id === idToDelete)).toBeUndefined()
  })

  test('importFromCSV merges valid rows', () => {
    const { result } = renderHook(() => useCompoundLibrary())
    const before = result.current.compounds.length
    let res
    act(() => {
      res = result.current.importFromCSV([
        { Name: 'Ethanol', Formula: 'C2H5OH', Category: 'Alcohol', Information: 'Drinking alcohol.', ...validCSVFields },
        { Name: 'Methane', Formula: 'CH4', Category: 'Gas', Information: 'Natural gas.', ...validCSVFields },
      ])
    })
    expect(res.imported).toBe(2)
    expect(res.errors).toHaveLength(0)
    expect(result.current.compounds).toHaveLength(before + 2)
  })

  test('importFromCSV rejects rows with missing fields', () => {
    const { result } = renderHook(() => useCompoundLibrary())
    const before = result.current.compounds.length
    let res
    act(() => {
      res = result.current.importFromCSV([
        { Name: 'Ethanol', Formula: '', Category: 'Alcohol', Information: 'Missing formula.', ...validCSVFields },
      ])
    })
    expect(res.imported).toBe(0)
    expect(res.errors).toHaveLength(1)
    expect(result.current.compounds).toHaveLength(before)
  })

  test('importFromCSV rejects duplicate name', () => {
    const { result } = renderHook(() => useCompoundLibrary())
    let res
    act(() => {
      res = result.current.importFromCSV([
        { Name: 'Water', Formula: 'XYZW', Category: 'Test', Information: 'Duplicate name.', ...validCSVFields },
      ])
    })
    expect(res.imported).toBe(0)
    expect(res.errors[0]).toMatch(/duplicate name/i)
  })

  test('importFromCSV rejects duplicate formula', () => {
    const { result } = renderHook(() => useCompoundLibrary())
    let res
    act(() => {
      res = result.current.importFromCSV([
        { Name: 'NewWater', Formula: 'H2O', Category: 'Test', Information: 'Duplicate formula.', ...validCSVFields },
      ])
    })
    expect(res.imported).toBe(0)
    expect(res.errors[0]).toMatch(/duplicate formula/i)
  })
})
