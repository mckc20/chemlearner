const CACHE_PREFIX = 'pubchem_cache_'
const MIN_REQUEST_INTERVAL_MS = 200
const POLL_INTERVAL_MS = 1000
const MAX_POLL_ATTEMPTS = 30

let lastRequestTime = 0

async function throttle() {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed))
  }
  lastRequestTime = Date.now()
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Polls a PubChem ListKey until results are ready.
 */
async function pollListKey(listKey) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/listkey/${listKey}/property/IsomericSMILES/JSON`

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await delay(POLL_INTERVAL_MS)
    await throttle()

    const response = await fetch(url)
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
  await throttle()
  const url3d = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`
  const response3d = await fetch(url3d)
  if (response3d.ok) {
    return response3d.text()
  }

  await throttle()
  const url2d = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`
  const response2d = await fetch(url2d)
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
  await throttle()

  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/property/IsomericSMILES/JSON`
  const response = await fetch(url)

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
export async function resolveMolecule(formula, smiles) {
  const cacheKey = CACHE_PREFIX + (smiles || formula)
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    const parsed = JSON.parse(cached)
    // Invalidate cache entries missing required fields (e.g. cid, smiles)
    if (parsed.cid != null && parsed.smiles) {
      return parsed
    }
    localStorage.removeItem(cacheKey)
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
    await throttle()

    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/formula/${encodeURIComponent(formula)}/property/IsomericSMILES/JSON`
    const response = await fetch(url)

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
  }

  localStorage.setItem(cacheKey, JSON.stringify(result))
  return result
}
