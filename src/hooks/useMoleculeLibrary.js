import { useState, useEffect } from 'react'

const STORAGE_KEY = 'chemlearner_molecules'

const DEFAULTS = [
  {
    id: 'default-1',
    name: 'Acetic acid',
    formula: 'CH3COOH',
    category: 'Acid',
    information: 'Table vinegar',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Acetic_acid',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/176',
    wikidataId: 'Q47512',
    smiles: 'CC(O)=O',
  },
  {
    id: 'default-2',
    name: 'Ammonia solution',
    formula: 'NH4OH',
    category: 'Base',
    information: 'Salmiac spirit, Cleaning and Fertilizers',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Ammonium_hydroxide',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/14923',
    wikidataId: 'Q188390',
    smiles: '[NH4+].[OH-]',
  },
  {
    id: 'default-3',
    name: 'Calcium hydroxide',
    formula: 'Ca(OH)2',
    category: 'Base',
    information: 'Slaked lime, Lime mortar',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Calcium_hydroxide',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6093208',
    wikidataId: 'Q182849',
    smiles: '[Ca](O)O',
  },
  {
    id: 'default-4',
    name: 'Carbonic acid',
    formula: 'H2CO3',
    category: 'Acid',
    information: 'Mineral water',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Carbonic_acid',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/767',
    wikidataId: 'Q104085',
    smiles: 'OC(O)=O',
  },
  {
    id: 'default-5',
    name: 'Citric acid',
    formula: 'C6H8O7',
    category: 'Acid',
    information: 'Lemons',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Citric_acid',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/311',
    wikidataId: 'Q159683',
    smiles: 'OC(CC(O)=O)(CC(O)=O)C(O)=O',
  },
  {
    id: 'default-6',
    name: 'Hydrochloric acid',
    formula: 'HCl',
    category: 'Acid',
    information: 'Lime removal, Gastric juices contain 0.3% HCl',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Hydrochloric_acid',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/313',
    wikidataId: 'Q2409',
    smiles: 'Cl',
  },
  {
    id: 'default-7',
    name: 'Nitric acid',
    formula: 'HNO3',
    category: 'Acid',
    information: 'Fertilizers, Dyes, Explosives',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Nitric_acid',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/944',
    wikidataId: 'Q40558',
    smiles: 'O[N+](=O)[O-]',
  },
  {
    id: 'default-8',
    name: 'Nitroglycerin',
    formula: 'C3H5N3O9',
    category: 'Explosive',
    information: 'A highly sensitive explosive compound used in dynamite and as a vasodilator.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Nitroglycerin',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/4510',
    wikidataId: 'Q184650',
    smiles: '[O-][N+](=O)OCC(O[N+](=O)[O-])CO[N+](=O)[O-]',
  },
  {
    id: 'default-9',
    name: 'Phosphoric acid',
    formula: 'H3PO4',
    category: 'Acid',
    information: 'Fertilizers',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Phosphoric_acid',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/1004',
    wikidataId: 'Q37221',
    smiles: 'OP(O)(O)=O',
  },
  {
    id: 'default-10',
    name: 'Potassium hydroxide',
    formula: 'KOH',
    category: 'Base',
    information: 'Electrolyte in accumulators (batteries)',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Potassium_hydroxide',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/14797',
    wikidataId: 'Q151438',
    smiles: '[K]O',
  },
  {
    id: 'default-11',
    name: 'Salt',
    formula: 'NaCl',
    category: 'Salt',
    information: 'Common table salt, an ionic compound formed from sodium and chlorine.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sodium_chloride',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5234',
    wikidataId: 'Q2314',
    smiles: '[Na]Cl',
  },
  {
    id: 'default-12',
    name: 'Sodium carbonate',
    formula: 'Na2CO3',
    category: 'Base',
    information: 'Detergent, Glass production',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sodium_carbonate',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/10340',
    wikidataId: 'Q190227',
    smiles: '[Na+].[Na+].[O-]C([O-])=O',
  },
  {
    id: 'default-13',
    name: 'Sodium hydroxide (Lye)',
    formula: 'NaOH',
    category: 'Base',
    information: 'Strongly corrosive, Soap production, Cleaning agents',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sodium_hydroxide',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/14798',
    wikidataId: 'Q40587',
    smiles: '[Na]O',
  },
  {
    id: 'default-14',
    name: 'Sulphuric Acid',
    formula: 'H2SO4',
    category: 'Acid',
    information: 'A highly corrosive strong mineral acid with wide industrial use.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sulfuric_acid',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/1118',
    wikidataId: 'Q4530',
    smiles: 'OS(O)(=O)=O',
  },
  {
    id: 'default-15',
    name: 'Water',
    formula: 'H2O',
    category: 'Solvent',
    information: 'The most common solvent on Earth, essential for all known life.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Water',
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/962',
    wikidataId: 'Q283',
    smiles: 'O',
  },
]

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveToStorage(molecules) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(molecules))
  } catch {
    // ignore quota errors
  }
}

export function useMoleculeLibrary() {
  const [molecules, setMolecules] = useState(() => {
    const stored = loadFromStorage()
    return stored ?? DEFAULTS
  })

  useEffect(() => {
    saveToStorage(molecules)
  }, [molecules])

  function addMolecule(molecule) {
    const newMolecule = {
      ...molecule,
      id: `mol-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }
    setMolecules(prev => [...prev, newMolecule])
    return newMolecule
  }

  function updateMolecule(id, updates) {
    setMolecules(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  function deleteMolecule(id) {
    setMolecules(prev => prev.filter(m => m.id !== id))
  }

  function importFromCSV(rows) {
    const existingNames = new Set(molecules.map(m => m.name.toLowerCase()))
    const existingFormulas = new Set(molecules.map(m => m.formula.toLowerCase()))
    const imported = []
    const errors = []

    rows.forEach((row, index) => {
      const name = row.Name?.trim()
      const formula = row.Formula?.trim()
      const category = row.Category?.trim()
      const information = row.Information?.trim()
      const wikipediaUrl = row.WikipediaUrl?.trim()
      const pubchemUrl = row.PubchemUrl?.trim()
      const wikidataId = row.WikidataId?.trim()
      const smiles = row.SMILES?.trim()

      if (!name || !formula || !category || !information || !wikipediaUrl || !pubchemUrl || !wikidataId || !smiles) {
        errors.push(`Row ${index + 1}: missing required field(s)`)
        return
      }
      if (existingNames.has(name.toLowerCase())) {
        errors.push(`Row ${index + 1}: duplicate name "${name}"`)
        return
      }
      if (existingFormulas.has(formula.toLowerCase())) {
        errors.push(`Row ${index + 1}: duplicate formula "${formula}"`)
        return
      }

      const newMolecule = {
        id: `mol-${Date.now()}-${Math.random().toString(36).slice(2)}-${index}`,
        name,
        formula,
        category,
        information,
        wikipediaUrl,
        pubchemUrl,
        wikidataId,
        smiles,
      }
      imported.push(newMolecule)
      existingNames.add(name.toLowerCase())
      existingFormulas.add(formula.toLowerCase())
    })

    if (imported.length > 0) {
      setMolecules(prev => [...prev, ...imported])
    }

    return { imported: imported.length, errors }
  }

  return { molecules, addMolecule, updateMolecule, deleteMolecule, importFromCSV }
}
