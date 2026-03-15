import { useState, useEffect } from 'react'

const STORAGE_KEY = 'chemlearner_molecules'

const DEFAULTS = [
  {
    id: 'default-1',
    name: 'Acetic acid',
    formula: 'CH3COOH',
    category: 'Acid',
    description: 'Table vinegar',
  },
  {
    id: 'default-2',
    name: 'Ammonia solution',
    formula: 'NH4OH',
    category: 'Base',
    description: 'Salmiac spirit, Cleaning and Fertilizers',
  },
  {
    id: 'default-3',
    name: 'Calcium hydroxide',
    formula: 'Ca(OH)2',
    category: 'Base',
    description: 'Slaked lime, Lime mortar',
  },
  {
    id: 'default-4',
    name: 'Carbonic acid',
    formula: 'H2CO3',
    category: 'Acid',
    description: 'Mineral water',
  },
  {
    id: 'default-5',
    name: 'Citric acid',
    formula: 'C6H8O7',
    category: 'Acid',
    description: 'Lemons',
  },
  {
    id: 'default-6',
    name: 'Hydrochloric acid',
    formula: 'HCl',
    category: 'Acid',
    description: 'Lime removal, Gastric juices contain 0.3% HCl',
  },
  {
    id: 'default-7',
    name: 'Nitric acid',
    formula: 'HNO3',
    category: 'Acid',
    description: 'Fertilizers, Dyes, Explosives',
  },
  {
    id: 'default-8',
    name: 'Nitroglycerin',
    formula: 'C3H5N3O9',
    category: 'Explosive',
    description: 'A highly sensitive explosive compound used in dynamite and as a vasodilator.',
  },
  {
    id: 'default-9',
    name: 'Phosphoric acid',
    formula: 'H3PO4',
    category: 'Acid',
    description: 'Fertilizers',
  },
  {
    id: 'default-10',
    name: 'Potassium hydroxide',
    formula: 'KOH',
    category: 'Base',
    description: 'Electrolyte in accumulators (batteries)',
  },
  {
    id: 'default-11',
    name: 'Salt',
    formula: 'NaCl',
    category: 'Salt',
    description: 'Common table salt, an ionic compound formed from sodium and chlorine.',
  },
  {
    id: 'default-12',
    name: 'Sodium carbonate',
    formula: 'Na2CO3',
    category: 'Base',
    description: 'Detergent, Glass production',
  },
  {
    id: 'default-13',
    name: 'Sodium hydroxide (Lye)',
    formula: 'NaOH',
    category: 'Base',
    description: 'Strongly corrosive, Soap production, Cleaning agents',
  },
  {
    id: 'default-14',
    name: 'Sulphuric Acid',
    formula: 'H2SO4',
    category: 'Acid',
    description: 'A highly corrosive strong mineral acid with wide industrial use.',
  },
  {
    id: 'default-15',
    name: 'Water',
    formula: 'H2O',
    category: 'Solvent',
    description: 'The most common solvent on Earth, essential for all known life.',
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
      const description = row.Description?.trim()

      if (!name || !formula || !category || !description) {
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
        description,
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
