import { useState } from 'react'
import { useMoleculeLibrary } from './hooks/useMoleculeLibrary'
import MoleculeList from './components/MoleculeList'
import CSVUploader from './components/CSVUploader'
import './index.css'

export default function App() {
  const { molecules, deleteMolecule, importFromCSV } = useMoleculeLibrary()
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showUploader, setShowUploader] = useState(false)

  function handleDelete(id) {
    deleteMolecule(id)
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">
            ChemLearner 3D
          </span>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-gray-900 dark:text-gray-100 font-medium">Library</span>
            <span>Quiz</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Molecule Library</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploader(v => !v)}
              className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {showUploader ? 'Hide CSV Upload' : 'Import CSV'}
            </button>
            <button
              disabled={selectedIds.size < 2}
              className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Start Quiz ({selectedIds.size} selected)
            </button>
          </div>
        </div>

        {showUploader && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Import from CSV</h2>
            <CSVUploader onImport={importFromCSV} />
          </div>
        )}

        <MoleculeList
          molecules={molecules}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </main>
    </div>
  )
}
