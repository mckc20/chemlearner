import { useState } from 'react'
import { useCompoundLibrary } from './hooks/useCompoundLibrary'
import { useQuizHistory } from './hooks/useQuizHistory'
import { useQuizQuestions } from './hooks/useQuizQuestions'
import CompoundList from './components/CompoundList'
import CSVUploader from './components/CSVUploader'
import CompoundViewer from './components/CompoundViewer'
import EditCompoundModal from './components/EditCompoundModal'
import AddCompoundModal from './components/AddCompoundModal'
import CompareModal from './components/CompareModal'
import QuizSetup from './components/QuizSetup'
import QuizMode from './components/QuizMode'
import QuizHistory from './components/QuizHistory'
import './index.css'

export default function App() {
  const { compounds, addCompound, updateCompound, deleteCompound, importFromCSV } = useCompoundLibrary()
  const { history, saveQuiz, deleteQuiz } = useQuizHistory()
  const { getQuestionsForCompounds } = useQuizQuestions()
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showUploader, setShowUploader] = useState(false)
  const [viewedCompound, setViewedCompound] = useState(null)
  const [editingCompound, setEditingCompound] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeView, setActiveView] = useState('library') // 'library' | 'quiz-setup' | 'quiz' | 'history'
  const [quizCompounds, setQuizCompounds] = useState([])
  const [quizConfig, setQuizConfig] = useState(null)
  const [quizKey, setQuizKey] = useState(0) // force remount on retry
  const [showCompare, setShowCompare] = useState(false)

  function handleDelete(id) {
    deleteCompound(id)
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function startQuizSetup(mols) {
    setQuizCompounds(mols)
    setActiveView('quiz-setup')
  }

  function handleQuizSetupStart(config) {
    setQuizConfig(config)
    setQuizKey(k => k + 1)
    setActiveView('quiz')
  }

  function handleExportCSV() {
    const selected = compounds.filter(c => selectedIds.has(c.id))
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
    a.download = `compounds_${timestamp}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleStartQuiz() {
    const selected = compounds.filter(c => selectedIds.has(c.id))
    startQuizSetup(selected)
  }

  function handleQuizExit(action, mols) {
    if (action === 'retry') {
      // Reuse existing quizConfig — skip setup screen
      setQuizCompounds(mols)
      setQuizKey(k => k + 1)
      setActiveView('quiz')
    } else if (action === 'practice') {
      setQuizCompounds(mols)
      setQuizKey(k => k + 1)
      setActiveView('quiz')
    } else {
      setActiveView('library')
    }
  }

  function handleHistoryRetry(mols) {
    startQuizSetup(mols)
  }

  function handleHistoryPracticeMistakes(mols) {
    startQuizSetup(mols)
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
                  activeView === item.key || ((activeView === 'quiz' || activeView === 'quiz-setup') && item.key === 'library')
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

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Library view */}
        {activeView === 'library' && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Compound Library</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCompare(true)}
                  disabled={selectedIds.size !== 2}
                  className={`text-sm px-3 py-1.5 rounded transition-colors ${
                    selectedIds.size === 2
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'border border-gray-300 dark:border-gray-600 opacity-40 cursor-not-allowed text-gray-900 dark:text-gray-100'
                  }`}
                >
                  Compare
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

            <CompoundList
              compounds={compounds}
              onDelete={handleDelete}
              onView={setViewedCompound}
              onEdit={setEditingCompound}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Add Compound
              </button>
              <button
                onClick={() => setShowUploader(v => !v)}
                className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {showUploader ? 'Hide CSV Upload' : 'Import CSV'}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={selectedIds.size === 0}
                className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Export CSV
              </button>
            </div>
          </>
        )}

        {/* Quiz setup view */}
        {activeView === 'quiz-setup' && (
          <QuizSetup
            quizCompounds={quizCompounds}
            allCompounds={compounds}
            availableGKCount={getQuestionsForCompounds(quizCompounds.map(c => c.id)).length}
            onStart={handleQuizSetupStart}
            onCancel={() => setActiveView('library')}
          />
        )}

        {/* Quiz view */}
        {activeView === 'quiz' && (
          <QuizMode
            key={quizKey}
            quizCompounds={quizCompounds}
            allCompounds={compounds}
            quizConfig={quizConfig}
            getQuestionsForCompounds={getQuestionsForCompounds}
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
              allCompounds={compounds}
            />
          </>
        )}
      </main>

      {showAddModal && (
        <AddCompoundModal
          onAdd={(compound) => {
            addCompound(compound)
            setShowAddModal(false)
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingCompound && (
        <EditCompoundModal
          compound={editingCompound}
          onSave={(id, updates) => {
            updateCompound(id, updates)
            setEditingCompound(null)
          }}
          onCancel={() => setEditingCompound(null)}
        />
      )}

      {viewedCompound && (
        <CompoundViewer
          compound={viewedCompound}
          onClose={() => setViewedCompound(null)}
        />
      )}

      {showCompare && selectedIds.size === 2 && (
        <CompareModal
          compounds={compounds.filter(c => selectedIds.has(c.id))}
          onClose={() => setShowCompare(false)}
        />
      )}

      <footer className="mt-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-3 text-center text-xs text-gray-400 dark:text-gray-500">
        <div>
          A joint{' '}
          <a href="https://github.com/mckc20/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">mckc20</a>
          ,{' '}
          <a href="https://github.com/rafacm" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">rafacm</a>
          {' '}and{' '}
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">Claude Code</a>
          {' '}production.
        </div>
        <div>
          Source code available in <a href="https://github.com/mckc20/chemlearner" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">GitHub</a>.
        </div>
        <div className="mt-1 text-gray-300 dark:text-gray-600">
          Version {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'}{' '}
          {typeof __BUILD_TIME__ !== 'undefined' && `built ${new Date(__BUILD_TIME__).toLocaleString('sv-SE', { timeZone: 'Europe/Vienna', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(' ', ' ')} (Vienna, Austria)`}
        </div>
      </footer>
    </div>
  )
}
