let rdkitPromise = null

const RDKIT_CDN_BASE = 'https://unpkg.com/@rdkit/rdkit/dist/'

/**
 * Initializes and returns the RDKit WASM module (singleton).
 */
export function initRDKit() {
  if (!rdkitPromise) {
    if (typeof window.initRDKitModule !== 'function') {
      return Promise.reject(new Error('RDKit is not loaded. Make sure the CDN script is included.'))
    }
    rdkitPromise = window.initRDKitModule({
      locateFile: (file) => RDKIT_CDN_BASE + file,
    })
  }
  return rdkitPromise
}

/**
 * Generates a 2D skeletal structure SVG from a SMILES string using RDKit.
 *
 * @param {string} smiles - SMILES string
 * @param {number} [width=300] - SVG width
 * @param {number} [height=300] - SVG height
 * @returns {Promise<string>} SVG markup
 */
export async function smilesToSvg(smiles, width = 300, height = 300) {
  const RDKit = await initRDKit()
  const mol = RDKit.get_mol(smiles)
  if (!mol) {
    throw new Error(`Could not parse SMILES: "${smiles}"`)
  }
  try {
    mol.add_hs_in_place()
    mol.set_new_coords()
    return mol.get_svg(width, height)
  } finally {
    mol.delete()
  }
}

/**
 * Generates a 2D skeletal structure SVG from an SDF molblock using RDKit.
 *
 * @param {string} molblock - SDF molblock
 * @param {number} [width=300] - SVG width
 * @param {number} [height=300] - SVG height
 * @returns {Promise<string>} SVG markup
 */
export async function molblockToSvg(molblock, width = 300, height = 300) {
  const RDKit = await initRDKit()
  const mol = RDKit.get_mol(molblock)
  if (!mol) {
    throw new Error('Could not parse molblock')
  }
  try {
    return mol.get_svg(width, height)
  } finally {
    mol.delete()
  }
}
