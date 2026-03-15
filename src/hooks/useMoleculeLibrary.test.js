import { renderHook, act } from '@testing-library/react'
import { useMoleculeLibrary } from './useMoleculeLibrary'

beforeEach(() => {
  localStorage.clear()
})

const validMoleculeFields = {
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

describe('useMoleculeLibrary', () => {
  test('pre-loads 15 default molecules on first run', () => {
    const { result } = renderHook(() => useMoleculeLibrary())
    expect(result.current.molecules).toHaveLength(15)
    const names = result.current.molecules.map(m => m.name)
    expect(names).toContain('Water')
    expect(names).toContain('Sulphuric Acid')
    expect(names).toContain('Salt')
    expect(names).toContain('Nitroglycerin')
  })

  test('restores molecules from localStorage on remount', () => {
    const { result, unmount } = renderHook(() => useMoleculeLibrary())
    const initialCount = result.current.molecules.length

    act(() => {
      result.current.addMolecule({ name: 'Ethanol', formula: 'C2H5OH', category: 'Alcohol', information: 'Drinking alcohol.', ...validMoleculeFields })
    })
    expect(result.current.molecules).toHaveLength(initialCount + 1)

    unmount()
    const { result: result2 } = renderHook(() => useMoleculeLibrary())
    expect(result2.current.molecules).toHaveLength(initialCount + 1)
    expect(result2.current.molecules.map(m => m.name)).toContain('Ethanol')
  })

  test('addMolecule assigns a unique id', () => {
    const { result } = renderHook(() => useMoleculeLibrary())
    let added
    act(() => {
      added = result.current.addMolecule({ name: 'CO2', formula: 'CO2', category: 'Gas', information: 'Carbon dioxide.', ...validMoleculeFields })
    })
    expect(added.id).toBeTruthy()
    expect(result.current.molecules.find(m => m.id === added.id)).toBeDefined()
  })

  test('deleteMolecule removes the molecule by id', () => {
    const { result } = renderHook(() => useMoleculeLibrary())
    const idToDelete = result.current.molecules[0].id
    act(() => {
      result.current.deleteMolecule(idToDelete)
    })
    expect(result.current.molecules.find(m => m.id === idToDelete)).toBeUndefined()
  })

  test('importFromCSV merges valid rows', () => {
    const { result } = renderHook(() => useMoleculeLibrary())
    const before = result.current.molecules.length
    let res
    act(() => {
      res = result.current.importFromCSV([
        { Name: 'Ethanol', Formula: 'C2H5OH', Category: 'Alcohol', Information: 'Drinking alcohol.', ...validCSVFields },
        { Name: 'Methane', Formula: 'CH4', Category: 'Gas', Information: 'Natural gas.', ...validCSVFields },
      ])
    })
    expect(res.imported).toBe(2)
    expect(res.errors).toHaveLength(0)
    expect(result.current.molecules).toHaveLength(before + 2)
  })

  test('importFromCSV rejects rows with missing fields', () => {
    const { result } = renderHook(() => useMoleculeLibrary())
    const before = result.current.molecules.length
    let res
    act(() => {
      res = result.current.importFromCSV([
        { Name: 'Ethanol', Formula: '', Category: 'Alcohol', Information: 'Missing formula.', ...validCSVFields },
      ])
    })
    expect(res.imported).toBe(0)
    expect(res.errors).toHaveLength(1)
    expect(result.current.molecules).toHaveLength(before)
  })

  test('importFromCSV rejects duplicate name', () => {
    const { result } = renderHook(() => useMoleculeLibrary())
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
    const { result } = renderHook(() => useMoleculeLibrary())
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
