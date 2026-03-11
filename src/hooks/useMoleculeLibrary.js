import { useState, useEffect } from 'react'

const STORAGE_KEY = 'chemlearner_molecules'

const DEFAULTS = [
  {
    id: 'default-1',
    name: 'Water',
    formula: 'H2O',
    category: 'Solvent',
    description: 'The most common solvent on Earth, essential for all known life.',
  },
  {
    id: 'default-2',
    name: 'Sulphuric Acid',
    formula: 'H2SO4',
    category: 'Acid',
    description: 'A highly corrosive strong mineral acid with wide industrial use.',
  },
  {
    id: 'default-3',
    name: 'Salt',
    formula: 'NaCl',
    category: 'Salt',
    description: 'Common table salt, an ionic compound formed from sodium and chlorine.',
  },
  {
    id: 'default-4',
    name: 'Nitroglycerin',
    formula: 'C3H5N3O9',
    category: 'Explosive',
    description: 'A highly sensitive explosive compound used in dynamite and as a vasodilator.',
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

  return { molecules, addMolecule, deleteMolecule, importFromCSV }
}
