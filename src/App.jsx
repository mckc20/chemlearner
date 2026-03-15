import { useState } from 'react'
import { useMoleculeLibrary } from './hooks/useMoleculeLibrary'
import MoleculeList from './components/MoleculeList'
import CSVUploader from './components/CSVUploader'
import MoleculeViewer from './components/MoleculeViewer'
import EditMoleculeModal from './components/EditMoleculeModal'
import './index.css'

export default function App() {
  const { molecules, updateMolecule, deleteMolecule, importFromCSV } = useMoleculeLibrary()
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showUploader, setShowUploader] = useState(false)
  const [viewedMolecule, setViewedMolecule] = useState(null)
  const [editingMolecule, setEditingMolecule] = useState(null)

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
          <span className="font-semibold text-lg tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <circle cx="5" cy="6" r="2" />
              <circle cx="19" cy="6" r="2" />
              <circle cx="5" cy="18" r="2" />
              <circle cx="19" cy="18" r="2" />
              <line x1="9.5" y1="10.5" x2="6.5" y2="7.5" />
              <line x1="14.5" y1="10.5" x2="17.5" y2="7.5" />
              <line x1="9.5" y1="13.5" x2="6.5" y2="16.5" />
              <line x1="14.5" y1="13.5" x2="17.5" y2="16.5" />
            </svg>
            ChemLearner
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
          onView={setViewedMolecule}
          onEdit={setEditingMolecule}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </main>

      {editingMolecule && (
        <EditMoleculeModal
          molecule={editingMolecule}
          onSave={(id, updates) => {
            updateMolecule(id, updates)
            setEditingMolecule(null)
          }}
          onCancel={() => setEditingMolecule(null)}
        />
      )}

      {viewedMolecule && (
        <MoleculeViewer
          molecule={viewedMolecule}
          onClose={() => setViewedMolecule(null)}
        />
      )}
    </div>
  )
}
