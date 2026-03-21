import { DATA_VERSION, DEFAULTS } from '../data/defaultCompounds.js'

const COMPOUNDS_KEY = 'chemlearner_compounds'
const VERSION_KEY = 'chemlearner_data_version'
const DELETED_DEFAULTS_KEY = 'chemlearner_deleted_compound_defaults'

// Fields to compare when inferring _userModified for v0→v1
const COMPARE_FIELDS = [
  'name', 'formula', 'category', 'information',
  'wikipediaUrl', 'pubchemUrl', 'wikidataId', 'smiles',
]

function getStoredVersion() {
  const raw = localStorage.getItem(VERSION_KEY)
  return raw ? parseInt(raw, 10) : 0
}

function setStoredVersion(v) {
  localStorage.setItem(VERSION_KEY, String(v))
}

function loadCompounds() {
  try {
    const raw = localStorage.getItem(COMPOUNDS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveCompounds(compounds) {
  localStorage.setItem(COMPOUNDS_KEY, JSON.stringify(compounds))
}

function loadDeletedDefaults() {
  try {
    const raw = localStorage.getItem(DELETED_DEFAULTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return []
}

/**
 * v0 → v1: Backfill _userModified flag on existing default compounds.
 * Compares each stored default field-by-field against DEFAULTS.
 * If all fields match → _userModified: false. If any differ → true.
 */
function migrateV0toV1(compounds) {
  const defaultsMap = new Map(DEFAULTS.map(d => [d.id, d]))

  return compounds.map(compound => {
    if (!compound.id?.startsWith('default-')) {
      return compound // user-added compounds are untouched
    }
    if (compound._userModified !== undefined) {
      return compound // already has flag
    }

    const original = defaultsMap.get(compound.id)
    if (!original) {
      // default id not in current DEFAULTS (shouldn't happen, but be safe)
      return { ...compound, _userModified: true }
    }

    const isModified = COMPARE_FIELDS.some(field => compound[field] !== original[field])
    return { ...compound, _userModified: isModified }
  })
}

/**
 * v2 → v3: Fix default compounds falsely marked as _userModified.
 * The v0→v1 migration compared all fields including 'smiles', which didn't
 * exist in pre-v1 stored data. This caused `undefined !== 'someSmiles'` to
 * mark untouched defaults as modified, preventing syncDefaults from updating
 * them (leaving smiles as '' and triggering the ambiguous-formula path).
 *
 * Re-evaluate: if the only differences between stored and current DEFAULTS
 * are fields that were undefined in stored data, reset _userModified to false.
 */
function migrateV2toV3(compounds) {
  const defaultsMap = new Map(DEFAULTS.map(d => [d.id, d]))

  return compounds.map(compound => {
    if (!compound.id?.startsWith('default-') || compound._userModified !== true) {
      return compound
    }

    const original = defaultsMap.get(compound.id)
    if (!original) return compound

    // Check if any field the user could have actually edited differs
    const userEditableFields = COMPARE_FIELDS.filter(f => f !== 'smiles')
    const hasRealEdit = userEditableFields.some(field =>
      compound[field] !== undefined && compound[field] !== '' && compound[field] !== original[field]
    )

    if (hasRealEdit) return compound

    // Only 'new' fields (like smiles) differed — reset the flag
    return { ...compound, _userModified: false }
  })
}

/**
 * v5 → v6: Sort default compounds alphabetically by name.
 * User-added compounds are kept at the end in their original order.
 */
function migrateV5toV6(compounds) {
  const defaults = compounds.filter(c => c.id?.startsWith('default-'))
  const userAdded = compounds.filter(c => !c.id?.startsWith('default-'))

  defaults.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

  return [...defaults, ...userAdded]
}

// Registry of version-specific migrations. Key = version they migrate TO.
const MIGRATIONS = {
  1: migrateV0toV1,
  3: migrateV2toV3,
  6: migrateV5toV6,
}

/**
 * Sync defaults: add new defaults, update untouched existing ones.
 */
function syncDefaults(compounds) {
  const deletedDefaults = new Set(loadDeletedDefaults())
  const compoundsMap = new Map(compounds.map(c => [c.id, c]))

  for (const def of DEFAULTS) {
    if (deletedDefaults.has(def.id)) continue

    const existing = compoundsMap.get(def.id)
    if (!existing) {
      // New default — add it
      compounds.push({ ...def, _userModified: false })
    } else if (existing._userModified !== true) {
      // Untouched default — overwrite with latest
      const idx = compounds.findIndex(c => c.id === def.id)
      compounds[idx] = { ...def, _userModified: false }
    }
    // If _userModified === true → leave alone
  }

  return compounds
}

/**
 * Ensure all compounds have the expected schema fields.
 */
function backfillSchemaFields(compounds) {
  const schemaFields = {
    name: '',
    formula: '',
    category: '',
    information: '',
    wikipediaUrl: '',
    pubchemUrl: '',
    wikidataId: '',
    smiles: '',
  }

  return compounds.map(compound => {
    let patched = compound
    for (const [field, defaultValue] of Object.entries(schemaFields)) {
      if (patched[field] === undefined) {
        if (patched === compound) patched = { ...compound }
        patched[field] = defaultValue
      }
    }
    return patched
  })
}

/**
 * Main entry point. Call synchronously before React renders.
 */
export function runMigrations() {
  const storedVersion = getStoredVersion()

  if (storedVersion >= DATA_VERSION) return

  let compounds = loadCompounds()

  // First-time user: no stored data yet — just set version and return
  if (!compounds) {
    setStoredVersion(DATA_VERSION)
    return
  }

  // Run version-specific migrations in order
  for (let v = storedVersion + 1; v <= DATA_VERSION; v++) {
    const migrate = MIGRATIONS[v]
    if (migrate) {
      compounds = migrate(compounds)
    }
  }

  // Sync defaults (add new, update untouched)
  compounds = syncDefaults(compounds)

  // Backfill any missing schema fields
  compounds = backfillSchemaFields(compounds)

  // Persist
  saveCompounds(compounds)
  setStoredVersion(DATA_VERSION)
}
