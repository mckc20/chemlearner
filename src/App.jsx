import { useState } from 'react'
import { useMoleculeLibrary } from './hooks/useMoleculeLibrary'
import { useQuizHistory } from './hooks/useQuizHistory'
import MoleculeList from './components/MoleculeList'
import CSVUploader from './components/CSVUploader'
import MoleculeViewer from './components/MoleculeViewer'
import EditMoleculeModal from './components/EditMoleculeModal'
import AddMoleculeModal from './components/AddMoleculeModal'
import QuizMode from './components/QuizMode'
import QuizHistory from './components/QuizHistory'
import './index.css'

export default function App() {
  const { molecules, addMolecule, updateMolecule, deleteMolecule, importFromCSV } = useMoleculeLibrary()
  const { history, saveQuiz, deleteQuiz } = useQuizHistory()
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showUploader, setShowUploader] = useState(false)
  const [viewedMolecule, setViewedMolecule] = useState(null)
  const [editingMolecule, setEditingMolecule] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeView, setActiveView] = useState('library') // 'library' | 'quiz' | 'history'
  const [quizMolecules, setQuizMolecules] = useState([])
  const [quizKey, setQuizKey] = useState(0) // force remount on retry

  function handleDelete(id) {
    deleteMolecule(id)
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function startQuiz(mols) {
    setQuizMolecules(mols)
    setQuizKey(k => k + 1)
    setActiveView('quiz')
  }

  function handleExportCSV() {
    const selected = molecules.filter(m => selectedIds.has(m.id))
    const columnMap = {
      Name: 'name', Formula: 'formula', Category: 'category', Information: 'information',
      WikipediaUrl: 'wikipediaUrl', PubchemUrl: 'pubchemUrl', WikidataId: 'wikidataId', SMILES: 'smiles'
    }
    const columns = Object.keys(columnMap)
    const escapeCsv = (val) => {
      const str = val == null ? '' : String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }
    const rows = [
      columns.join(','),
      ...selected.map(m => columns.map(col => escapeCsv(m[columnMap[col]])).join(','))
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const now = new Date()
    const timestamp = now.getFullYear().toString()
      + String(now.getMonth() + 1).padStart(2, '0')
      + String(now.getDate()).padStart(2, '0')
      + '_' + String(now.getHours()).padStart(2, '0')
      + String(now.getMinutes()).padStart(2, '0')
      + String(now.getSeconds()).padStart(2, '0')
    const a = document.createElement('a')
    a.href = url
    a.download = `molecules_${timestamp}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleStartQuiz() {
    const selected = molecules.filter(m => selectedIds.has(m.id))
    startQuiz(selected)
  }

  function handleQuizExit(action, mols) {
    if (action === 'retry') {
      startQuiz(mols)
    } else if (action === 'practice') {
      startQuiz(mols)
    } else {
      setActiveView('library')
    }
  }

  function handleHistoryRetry(mols) {
    startQuiz(mols)
  }

  function handleHistoryPracticeMistakes(mols) {
    startQuiz(mols)
  }

  const navItems = [
    { key: 'library', label: 'Library' },
    { key: 'history', label: 'Quiz History' },
  ]

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
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`${
                  activeView === item.key || (activeView === 'quiz' && item.key === 'library')
                    ? 'text-gray-900 dark:text-gray-100 font-medium'
                    : 'hover:text-gray-700 dark:hover:text-gray-300'
                } transition-colors`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-16 space-y-6">
        {/* Library view */}
        {activeView === 'library' && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Molecule Library</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Add Molecule
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={selectedIds.size === 0}
                  className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => setShowUploader(v => !v)}
                  className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {showUploader ? 'Hide CSV Upload' : 'Import CSV'}
                </button>
                <button
                  onClick={handleStartQuiz}
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
          </>
        )}

        {/* Quiz view */}
        {activeView === 'quiz' && (
          <QuizMode
            key={quizKey}
            quizMolecules={quizMolecules}
            allMolecules={molecules}
            onExit={handleQuizExit}
            onSave={saveQuiz}
          />
        )}

        {/* History view */}
        {activeView === 'history' && (
          <>
            <h1 className="text-xl font-semibold">Quiz History</h1>
            <QuizHistory
              history={history}
              onDeleteQuiz={deleteQuiz}
              onRetry={handleHistoryRetry}
              onPracticeMistakes={handleHistoryPracticeMistakes}
              allMolecules={molecules}
            />
          </>
        )}
      </main>

      {showAddModal && (
        <AddMoleculeModal
          onAdd={(molecule) => {
            addMolecule(molecule)
            setShowAddModal(false)
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

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

      <footer className="fixed bottom-0 inset-x-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 text-center text-xs text-gray-400 dark:text-gray-500">
        A joint{' '}
        <a href="https://github.com/mckc20/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">mckc20</a>
        ,{' '}
        <a href="https://github.com/rafacm" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">rafacm</a>
        {' '}and{' '}
        <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">Claude</a>
        {' '}production.
        {' | '}
        Source code available in <a href="https://github.com/mckc20/chemlearner" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">GitHub</a>.
      </footer>
    </div>
  )
}
