import { useState, useEffect } from 'react'
import { DEFAULTS } from '../data/defaultCompounds.js'

const STORAGE_KEY = 'chemlearner_compounds'
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

  return { compounds }
}
