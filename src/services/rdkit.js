let rdkitPromise = null

function initRDKit() {
  if (!rdkitPromise) {
    if (typeof window.initRDKitModule !== 'function') {
      return Promise.reject(new Error('RDKit is not loaded. Make sure the CDN script is included.'))
    }
    rdkitPromise = window.initRDKitModule()
  }
  return rdkitPromise
}

/**
 * Converts a SMILES string to an SDF molblock using RDKit WASM.
 *
 * @param {string} smiles - SMILES string
 * @returns {string} SDF molblock
 * @throws If SMILES is invalid or RDKit fails
 */
export async function smilesToMolblock(smiles) {
  const RDKit = await initRDKit()
  const mol = RDKit.get_mol(smiles)
  if (!mol) {
    throw new Error(`Could not parse SMILES: "${smiles}"`)
  }
  try {
    return mol.get_molblock()
  } finally {
    mol.delete()
  }
}
