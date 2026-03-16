import { DATA_VERSION, DEFAULTS } from '../data/defaultMolecules.js'

const MOLECULES_KEY = 'chemlearner_molecules'
const VERSION_KEY = 'chemlearner_data_version'
const DELETED_DEFAULTS_KEY = 'chemlearner_deleted_defaults'

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

function loadMolecules() {
  try {
    const raw = localStorage.getItem(MOLECULES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveMolecules(molecules) {
  localStorage.setItem(MOLECULES_KEY, JSON.stringify(molecules))
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
 * v0 → v1: Backfill _userModified flag on existing default molecules.
 * Compares each stored default field-by-field against DEFAULTS.
 * If all fields match → _userModified: false. If any differ → true.
 */
function migrateV0toV1(molecules) {
  const defaultsMap = new Map(DEFAULTS.map(d => [d.id, d]))

  return molecules.map(mol => {
    if (!mol.id?.startsWith('default-')) {
      return mol // user-added molecules are untouched
    }
    if (mol._userModified !== undefined) {
      return mol // already has flag
    }

    const original = defaultsMap.get(mol.id)
    if (!original) {
      // default id not in current DEFAULTS (shouldn't happen, but be safe)
      return { ...mol, _userModified: true }
    }

    const isModified = COMPARE_FIELDS.some(field => mol[field] !== original[field])
    return { ...mol, _userModified: isModified }
  })
}

/**
 * v2 → v3: Fix default molecules falsely marked as _userModified.
 * The v0→v1 migration compared all fields including 'smiles', which didn't
 * exist in pre-v1 stored data. This caused `undefined !== 'someSmiles'` to
 * mark untouched defaults as modified, preventing syncDefaults from updating
 * them (leaving smiles as '' and triggering the ambiguous-formula path).
 *
 * Re-evaluate: if the only differences between stored and current DEFAULTS
 * are fields that were undefined in stored data, reset _userModified to false.
 */
function migrateV2toV3(molecules) {
  const defaultsMap = new Map(DEFAULTS.map(d => [d.id, d]))

  return molecules.map(mol => {
    if (!mol.id?.startsWith('default-') || mol._userModified !== true) {
      return mol
    }

    const original = defaultsMap.get(mol.id)
    if (!original) return mol

    // Check if any field the user could have actually edited differs
    const userEditableFields = COMPARE_FIELDS.filter(f => f !== 'smiles')
    const hasRealEdit = userEditableFields.some(field =>
      mol[field] !== undefined && mol[field] !== '' && mol[field] !== original[field]
    )

    if (hasRealEdit) return mol

    // Only 'new' fields (like smiles) differed — reset the flag
    return { ...mol, _userModified: false }
  })
}

// Registry of version-specific migrations. Key = version they migrate TO.
const MIGRATIONS = {
  1: migrateV0toV1,
  3: migrateV2toV3,
}

/**
 * Sync defaults: add new defaults, update untouched existing ones.
 */
function syncDefaults(molecules) {
  const deletedDefaults = new Set(loadDeletedDefaults())
  const moleculesMap = new Map(molecules.map(m => [m.id, m]))

  for (const def of DEFAULTS) {
    if (deletedDefaults.has(def.id)) continue

    const existing = moleculesMap.get(def.id)
    if (!existing) {
      // New default — add it
      molecules.push({ ...def, _userModified: false })
    } else if (existing._userModified !== true) {
      // Untouched default — overwrite with latest
      const idx = molecules.findIndex(m => m.id === def.id)
      molecules[idx] = { ...def, _userModified: false }
    }
    // If _userModified === true → leave alone
  }

  return molecules
}

/**
 * Ensure all molecules have the expected schema fields.
 */
function backfillSchemaFields(molecules) {
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

  return molecules.map(mol => {
    let patched = mol
    for (const [field, defaultValue] of Object.entries(schemaFields)) {
      if (patched[field] === undefined) {
        if (patched === mol) patched = { ...mol }
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

  let molecules = loadMolecules()

  // First-time user: no stored data yet — just set version and return
  if (!molecules) {
    setStoredVersion(DATA_VERSION)
    return
  }

  // Run version-specific migrations in order
  for (let v = storedVersion + 1; v <= DATA_VERSION; v++) {
    const migrate = MIGRATIONS[v]
    if (migrate) {
      molecules = migrate(molecules)
    }
  }

  // Sync defaults (add new, update untouched)
  molecules = syncDefaults(molecules)

  // Backfill any missing schema fields
  molecules = backfillSchemaFields(molecules)

  // Persist
  saveMolecules(molecules)
  setStoredVersion(DATA_VERSION)
}
