import { useEffect, useState } from 'react'
import FormulaDisplay from './FormulaDisplay'
import CompoundFacts from './CompoundFacts'
import { CompoundStructure, detailFields } from './CompareModal'

export default function CompoundViewer({ compound, onClose }) {
  const [isAmbiguous, setIsAmbiguous] = useState(false)

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{compound.name}</h2>
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none px-2"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
            <FormulaDisplay formula={compound.formula} />
          </p>

          {/* Ambiguity warning */}
          {isAmbiguous && (
            <div className="px-3 py-2 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
              The formula <FormulaDisplay formula={compound.formula} /> is ambiguous. Displaying the most common structure (Isomer A). Use a SMILES string for specific results.
            </div>
          )}

          <CompoundStructure mol={compound} onAmbiguous={setIsAmbiguous} />

          {detailFields.map(({ label, key, mono }) => (
            <div key={key}>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
              {compound[key] ? (
                <p className={`text-sm text-gray-800 dark:text-gray-200 mt-0.5 ${mono ? 'font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs break-all' : ''}`}>
                  {compound[key]}
                </p>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 italic">--</p>
              )}
            </div>
          ))}

          {compound.id && <CompoundFacts compoundId={compound.id} compact />}

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Links</p>
            <div className="flex flex-wrap gap-3 text-sm mt-0.5">
              {compound.wikipediaUrl ? (
                <a href={compound.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Wikipedia</a>
              ) : <span className="text-gray-400 dark:text-gray-500 italic">--</span>}
              {compound.pubchemUrl && (
                <a href={compound.pubchemUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">PubChem</a>
              )}
              {compound.wikidataId && (
                <a href={`https://www.wikidata.org/wiki/${compound.wikidataId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Wikidata ({compound.wikidataId})
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
