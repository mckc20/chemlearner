import { DEFAULTS } from '../data/defaultCompounds'

const CACHE_PREFIX = 'pubchem_cache_'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'
const MIN_REQUEST_INTERVAL_MS = 200
const POLL_INTERVAL_MS = 1000
const MAX_POLL_ATTEMPTS = 30
const MAX_REQUEST_ATTEMPTS = 3

let lastRequestTime = 0
let requestQueue = Promise.resolve()

function bundledCompound(formula, smiles) {
  if (smiles) return DEFAULTS.find(item => item.formula === formula && item.smiles === smiles)
  const matches = DEFAULTS.filter(item => item.formula === formula)
  return matches.length === 1 ? matches[0] : null
}

async function loadBundledStructure(compound) {
  const cid = Number(compound.pubchemUrl.split('/').at(-1))
  const response = await globalThis.fetch(`${import.meta.env.BASE_URL}structures/${cid}.sdf`)
  if (!response.ok) throw new Error(`Could not load bundled structure for CID ${cid}.`)
  const molblock = await response.text()
  if (!molblock.includes('M  END') || !molblock.includes('$$$$')) {
    throw new Error(`Invalid bundled structure for CID ${cid}.`)
  }
  return { cid, molblock, smiles: compound.smiles, isAmbiguous: false }
}

function throttle() {
  const turn = requestQueue.catch(() => {}).then(async () => {
    const elapsed = Date.now() - lastRequestTime
    if (elapsed < MIN_REQUEST_INTERVAL_MS) await delay(MIN_REQUEST_INTERVAL_MS - elapsed)
    lastRequestTime = Date.now()
  })
  requestQueue = turn
  return turn
}

function delay(ms) {
  return new Promise(resolve => globalThis.setTimeout(resolve, ms))
}

async function fetchPubChem(url) {
  for (let attempt = 0; attempt < MAX_REQUEST_ATTEMPTS; attempt++) {
    await throttle()
    try {
      const response = await globalThis.fetch(url)
      if (![429, 500, 502, 503, 504].includes(response.status) || attempt === MAX_REQUEST_ATTEMPTS - 1) return response
    } catch (error) {
      if (attempt === MAX_REQUEST_ATTEMPTS - 1) throw error
    }
    await delay(500 * 2 ** attempt)
  }
}

/**
 * Polls a PubChem ListKey until results are ready.
 */
async function pollListKey(listKey) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/listkey/${listKey}/property/IsomericSMILES/JSON`

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await delay(POLL_INTERVAL_MS)
    const response = await fetchPubChem(url)
    if (response.status === 404) {
      throw new Error('PubChem search returned no results.')
    }

    const data = await response.json()

    if (data.Waiting) continue

    if (data.PropertyTable?.Properties) {
      return data.PropertyTable.Properties
    }

    if (data.Fault) {
      throw new Error(data.Fault.Details?.[0] || 'PubChem search failed.')
    }
  }

  throw new Error('PubChem search timed out.')
}

/**
 * Fetches the 3D SDF molblock for a CID from PubChem.
 */
async function fetchSdf(cid) {
  // Try 3D first, fall back to 2D (ionic compounds like NaCl lack 3D conformers)
  const url3d = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`
  const response3d = await fetchPubChem(url3d)
  if (response3d.ok) {
    return response3d.text()
  }

  const url2d = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`
  const response2d = await fetchPubChem(url2d)
  if (!response2d.ok) {
    throw new Error(`Could not fetch structure for CID ${cid}.`)
  }
  return response2d.text()
}

/**
 * Resolves a SMILES string to a CID and SDF molblock via PubChem.
 * This is a direct (synchronous) lookup — no polling needed.
 */
async function resolveBySmiles(smiles) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/property/IsomericSMILES/JSON`
  const response = await fetchPubChem(url)

  if (response.status === 404) {
    throw new Error(`SMILES "${smiles}" not found in PubChem.`)
  }

  const data = await response.json()

  if (data.Fault) {
    throw new Error(data.Fault.Details?.[0] || `SMILES "${smiles}" not found in PubChem.`)
  }

  const compounds = data.PropertyTable?.Properties
  if (!compounds || compounds.length === 0) {
    throw new Error(`No results found for SMILES "${smiles}".`)
  }

  return compounds[0]
}

/**
 * Resolves a chemical formula (and optionally a SMILES string) to a 3D SDF
 * molblock via PubChem.
 *
 * When a SMILES string is provided it is used for an exact lookup, avoiding
 * the ambiguous-formula path entirely.
 *
 * Pipeline: SMILES|formula → PubChem → CID → 3D SDF
 * Results are cached in localStorage.
 *
 * @param {string} formula - Chemical formula (e.g. "H2O")
 * @param {string} [smiles] - Optional SMILES string for exact lookup
 * @returns {{ molblock: string, smiles: string, isAmbiguous: boolean }}
 */
export async function resolveCompound(formula, smiles) {
  const cacheKey = CACHE_PREFIX + (smiles || formula)
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    const parsed = JSON.parse(cached)
    const isExpired = !parsed.cachedAt || (Date.now() - parsed.cachedAt > CACHE_TTL_MS)
    const isStaleVersion = parsed.appVersion !== APP_VERSION
    if (!isExpired && !isStaleVersion && parsed.cid != null && parsed.smiles) {
      return parsed
    }
    localStorage.removeItem(cacheKey)
  }

  const bundled = bundledCompound(formula, smiles)
  if (bundled) {
    try {
      const result = { ...await loadBundledStructure(bundled), cachedAt: Date.now(), appVersion: APP_VERSION }
      localStorage.setItem(cacheKey, JSON.stringify(result))
      return result
    } catch {
      // A missing asset should not prevent the PubChem fallback below.
    }
  }

  let cid, resolvedSmiles, isAmbiguous

  if (smiles) {
    // Exact SMILES lookup — always unambiguous
    const compound = await resolveBySmiles(smiles)
    cid = compound.CID
    resolvedSmiles = compound.IsomericSMILES || smiles
    isAmbiguous = false
  } else {
    // Fallback: formula-based async search
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/formula/${encodeURIComponent(formula)}/property/IsomericSMILES/JSON`
    const response = await fetchPubChem(url)

    if (response.status === 404) {
      throw new Error(`Formula "${formula}" not found in PubChem.`)
    }

    const data = await response.json()
    let compounds

    if (data.Waiting?.ListKey) {
      compounds = await pollListKey(data.Waiting.ListKey)
    } else if (data.PropertyTable?.Properties) {
      compounds = data.PropertyTable.Properties
    } else if (data.Fault) {
      throw new Error(data.Fault.Details?.[0] || `Formula "${formula}" not found in PubChem.`)
    } else {
      throw new Error(`Unexpected PubChem response for formula "${formula}".`)
    }

    if (!compounds || compounds.length === 0) {
      throw new Error(`No results found for formula "${formula}".`)
    }

    cid = compounds[0].CID
    resolvedSmiles = compounds[0].IsomericSMILES || compounds[0].SMILES
    isAmbiguous = compounds.length > 1
  }

  const molblock = await fetchSdf(cid)

  const result = {
    cid,
    molblock,
    smiles: resolvedSmiles,
    isAmbiguous,
    cachedAt: Date.now(),
    appVersion: APP_VERSION,
  }

  localStorage.setItem(cacheKey, JSON.stringify(result))
  return result
}
