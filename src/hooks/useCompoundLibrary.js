import { useState, useEffect } from 'react'
import { DEFAULTS } from '../data/defaultCompounds.js'

const STORAGE_KEY = 'chemlearner_compounds'
const DELETED_DEFAULTS_KEY = 'chemlearner_deleted_compound_defaults'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveToStorage(compounds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compounds))
  } catch {
    // ignore quota errors
  }
}

export function useCompoundLibrary() {
  const [compounds, setCompounds] = useState(() => {
    const stored = loadFromStorage()
    return stored ?? DEFAULTS
  })

  useEffect(() => {
    saveToStorage(compounds)
  }, [compounds])

  function addCompound(compound) {
    const newCompound = {
      ...compound,
      id: `comp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }
    setCompounds(prev => [...prev, newCompound])
    return newCompound
  }

  function updateCompound(id, updates) {
    setCompounds(prev => prev.map(c => {
      if (c.id !== id) return c
      const updated = { ...c, ...updates }
      if (id.startsWith('default-')) {
        updated._userModified = true
      }
      return updated
    }))
  }

  function deleteCompound(id) {
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
    setCompounds(prev => prev.filter(c => c.id !== id))
  }

  function importFromCSV(rows) {
    const existingNames = new Set(compounds.map(c => c.name.toLowerCase()))
    const existingFormulas = new Set(compounds.map(c => c.formula.toLowerCase()))
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

      const newCompound = {
        id: `comp-${Date.now()}-${Math.random().toString(36).slice(2)}-${index}`,
        name,
        formula,
        category,
        information,
        wikipediaUrl,
        pubchemUrl,
        wikidataId,
        smiles,
      }
      imported.push(newCompound)
      existingNames.add(name.toLowerCase())
      existingFormulas.add(formula.toLowerCase())
    })

    if (imported.length > 0) {
      setCompounds(prev => [...prev, ...imported])
    }

    return { imported: imported.length, errors }
  }

  return { compounds, addCompound, updateCompound, deleteCompound, importFromCSV }
}
