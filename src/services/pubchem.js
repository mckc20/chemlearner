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
 * Resolves a chemical formula to a 3D SDF molblock via PubChem.
 * Pipeline: formula → async search → CID → 3D SDF
 * Results are cached in localStorage.
 *
 * @param {string} formula - Chemical formula (e.g. "H2O")
 * @returns {{ molblock: string, smiles: string, isAmbiguous: boolean }}
 */
export async function resolveMolecule(formula) {
  const cacheKey = CACHE_PREFIX + formula
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    const parsed = JSON.parse(cached)
    // Invalidate cache entries missing required fields (e.g. cid, smiles)
    if (parsed.cid != null && parsed.smiles) {
      return parsed
    }
    localStorage.removeItem(cacheKey)
  }

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

  const cid = compounds[0].CID
  const molblock = await fetchSdf(cid)

  const result = {
    cid,
    molblock,
    smiles: compounds[0].IsomericSMILES || compounds[0].SMILES,
    isAmbiguous: compounds.length > 1,
  }

  localStorage.setItem(cacheKey, JSON.stringify(result))
  return result
}
