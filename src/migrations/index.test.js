import { runMigrations } from './index.js'
import { DATA_VERSION, DEFAULTS } from '../data/defaultCompounds.js'

const COMPOUNDS_KEY = 'chemlearner_compounds'
const VERSION_KEY = 'chemlearner_data_version'
const DELETED_DEFAULTS_KEY = 'chemlearner_deleted_compound_defaults'

beforeEach(() => {
  localStorage.clear()
})

describe('runMigrations', () => {
  test('first-time user: sets version without storing compounds', () => {
    runMigrations()
    expect(localStorage.getItem(VERSION_KEY)).toBe(String(DATA_VERSION))
    expect(localStorage.getItem(COMPOUNDS_KEY)).toBeNull()
  })

  test('already at current version: does nothing', () => {
    const compounds = [{ id: 'comp-1', name: 'Custom' }]
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION))

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    expect(stored).toEqual(compounds)
  })

  test('v0→v1: backfills _userModified=false on unmodified defaults', () => {
    // Store defaults as-is (no _userModified flag, simulating pre-migration data)
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(DEFAULTS))

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    const water = stored.find(c => c.id === 'default-15')
    expect(water._userModified).toBe(false)
  })

  test('v0→v1: detects user-modified defaults', () => {
    const compounds = DEFAULTS.map(d =>
      d.id === 'default-15' ? { ...d, information: 'User changed this' } : { ...d }
    )
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    const water = stored.find(c => c.id === 'default-15')
    expect(water._userModified).toBe(true)
    expect(water.information).toBe('User changed this')
  })

  test('syncDefaults adds new defaults not in stored data', () => {
    // Store only a subset of defaults (simulating old version with fewer defaults)
    const subset = DEFAULTS.slice(0, 3).map(d => ({ ...d }))
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(subset))

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    expect(stored.length).toBe(DEFAULTS.length)
  })

  test('syncDefaults updates untouched defaults with latest data', () => {
    const compounds = DEFAULTS.map(d => ({ ...d, _userModified: false }))
    // Simulate a stored version that is outdated but has _userModified flags
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))
    // Set version to 0 to trigger migration
    localStorage.setItem(VERSION_KEY, '0')

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    const water = stored.find(c => c.id === 'default-15')
    // Should have latest default data
    expect(water.name).toBe('Water')
    expect(water._userModified).toBe(false)
  })

  test('syncDefaults preserves user-modified defaults', () => {
    const compounds = DEFAULTS.map(d =>
      d.id === 'default-15'
        ? { ...d, name: 'My Water', _userModified: true }
        : { ...d, _userModified: false }
    )
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    const water = stored.find(c => c.id === 'default-15')
    expect(water.name).toBe('My Water')
    expect(water._userModified).toBe(true)
  })

  test('syncDefaults skips deleted defaults', () => {
    const compounds = DEFAULTS.filter(d => d.id !== 'default-15').map(d => ({ ...d }))
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))
    localStorage.setItem(DELETED_DEFAULTS_KEY, JSON.stringify(['default-15']))

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    expect(stored.find(c => c.id === 'default-15')).toBeUndefined()
  })

  test('backfillSchemaFields adds missing fields', () => {
    const compounds = [{ id: 'comp-1', name: 'Partial', formula: 'X' }]
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    const partial = stored.find(c => c.id === 'comp-1')
    expect(partial.category).toBe('')
    expect(partial.information).toBe('')
    expect(partial.smiles).toBe('')
  })

  test('user-added compounds are never touched by migration', () => {
    const compounds = [
      ...DEFAULTS.map(d => ({ ...d })),
      { id: 'comp-custom', name: 'My Compound', formula: 'XYZ', category: 'Test', information: 'Custom' },
    ]
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    const custom = stored.find(c => c.id === 'comp-custom')
    expect(custom.name).toBe('My Compound')
    expect(custom._userModified).toBeUndefined()
  })

  test('v2→v3: resets _userModified on defaults falsely flagged due to missing smiles', () => {
    // Simulate pre-SMILES data: defaults without smiles field, marked as modified
    // because v0→v1 compared the missing smiles field against DEFAULTS
    const compounds = DEFAULTS.map(d => {
      const { smiles, ...rest } = d
      return { ...rest, smiles: '', _userModified: true }
    })
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))
    localStorage.setItem(VERSION_KEY, '2')

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    const water = stored.find(c => c.id === 'default-15')
    // Should be reset to false since no real user edits were made
    expect(water._userModified).toBe(false)
    // syncDefaults should have restored the SMILES
    expect(water.smiles).toBe('O')
  })

  test('v2→v3: preserves _userModified on truly user-edited defaults', () => {
    const compounds = DEFAULTS.map(d =>
      d.id === 'default-15'
        ? { ...d, information: 'I changed this', _userModified: true }
        : { ...d, _userModified: false }
    )
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))
    localStorage.setItem(VERSION_KEY, '2')

    runMigrations()

    const stored = JSON.parse(localStorage.getItem(COMPOUNDS_KEY))
    const water = stored.find(c => c.id === 'default-15')
    expect(water._userModified).toBe(true)
    expect(water.information).toBe('I changed this')
  })

  test('sets version to DATA_VERSION after migration', () => {
    localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(DEFAULTS))

    runMigrations()

    expect(localStorage.getItem(VERSION_KEY)).toBe(String(DATA_VERSION))
  })
})
