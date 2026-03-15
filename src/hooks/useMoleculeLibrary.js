import { useState, useEffect } from 'react'
import { DEFAULTS } from '../data/defaultMolecules.js'

const STORAGE_KEY = 'chemlearner_molecules'
const DELETED_DEFAULTS_KEY = 'chemlearner_deleted_defaults'

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
    setMolecules(prev => prev.map(m => {
      if (m.id !== id) return m
      const updated = { ...m, ...updates }
      if (id.startsWith('default-')) {
        updated._userModified = true
      }
      return updated
    }))
  }

  function deleteMolecule(id) {
    if (id.startsWith('default-')) {
      try {
        const raw = localStorage.getItem(DELETED_DEFAULTS_KEY)
        const deleted = raw ? JSON.parse(raw) : []
        if (!deleted.includes(id)) {
          deleted.push(id)
          localStorage.setItem(DELETED_DEFAULTS_KEY, JSON.stringify(deleted))
        }
      } catch {
        // ignore storage errors
      }
    }
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
