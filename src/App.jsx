import { useState } from 'react'
import { useCompoundLibrary } from './hooks/useCompoundLibrary'
import { useQuizHistory } from './hooks/useQuizHistory'
import { useQuizQuestions } from './hooks/useQuizQuestions'
import { useLanguage } from './i18n/LanguageContext'
import { t, translateCompound, translateCompounds } from './i18n/translate'
import LanguageSwitch from './i18n/LanguageSwitch'
import CompoundList from './components/CompoundList'
import CompoundViewer from './components/CompoundViewer'
import CompareModal from './components/CompareModal'
import QuizSetup from './components/QuizSetup'
import QuizMode from './components/QuizMode'
import QuizHistory from './components/QuizHistory'
import './index.css'

export default function App() {
  const { language } = useLanguage()
  const { compounds } = useCompoundLibrary()
  const { history, saveQuiz, deleteQuiz } = useQuizHistory()
  const { getQuestionsForCompounds } = useQuizQuestions()
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [viewedCompound, setViewedCompound] = useState(null)
  const [activeView, setActiveView] = useState('library') // 'library' | 'quiz-setup' | 'quiz' | 'history'
  const [quizCompounds, setQuizCompounds] = useState([])
  const [quizConfig, setQuizConfig] = useState(null)
  const [quizKey, setQuizKey] = useState(0) // force remount on retry
  const [showCompare, setShowCompare] = useState(false)

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

  const translatedCompounds = translateCompounds(language, compounds)

  const navItems = [
    { key: 'library', label: t(language, 'nav.library') },
    { key: 'history', label: t(language, 'nav.quizHistory') },
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
            <LanguageSwitch />
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
              <h1 className="text-xl font-semibold">{t(language, 'library.title')}</h1>
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
                  {t(language, 'library.compare')}
                </button>
                <button
                  onClick={handleStartQuiz}
                  disabled={selectedIds.size < 2}
                  className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t(language, 'library.startQuiz', { count: selectedIds.size })}
                </button>
              </div>
            </div>

            <CompoundList
              compounds={translatedCompounds}
              onView={setViewedCompound}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={handleExportCSV}
                disabled={selectedIds.size === 0}
                className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t(language, 'library.exportCsv')}
              </button>
            </div>
          </>
        )}

        {/* Quiz setup view */}
        {activeView === 'quiz-setup' && (
          <QuizSetup
            quizCompounds={translateCompounds(language, quizCompounds)}
            allCompounds={translatedCompounds}
            availableGKCount={getQuestionsForCompounds(quizCompounds.map(c => c.id)).length}
            onStart={handleQuizSetupStart}
            onCancel={() => setActiveView('library')}
          />
        )}

        {/* Quiz view */}
        {activeView === 'quiz' && (
          <QuizMode
            key={quizKey}
            quizCompounds={translateCompounds(language, quizCompounds)}
            allCompounds={translatedCompounds}
            quizConfig={quizConfig}
            getQuestionsForCompounds={getQuestionsForCompounds}
            onExit={handleQuizExit}
            onSave={saveQuiz}
          />
        )}

        {/* History view */}
        {activeView === 'history' && (
          <>
            <h1 className="text-xl font-semibold">{t(language, 'history.title')}</h1>
            <QuizHistory
              history={history}
              onDeleteQuiz={deleteQuiz}
              onRetry={handleHistoryRetry}
              onPracticeMistakes={handleHistoryPracticeMistakes}
              allCompounds={translatedCompounds}
            />
          </>
        )}
      </main>

      {viewedCompound && (
        <CompoundViewer
          compound={translateCompound(language, viewedCompound)}
          onClose={() => setViewedCompound(null)}
        />
      )}

      {showCompare && selectedIds.size === 2 && (
        <CompareModal
          compounds={translatedCompounds.filter(c => selectedIds.has(c.id))}
          onClose={() => setShowCompare(false)}
        />
      )}

      <footer className="mt-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-3 text-center text-xs text-gray-400 dark:text-gray-500">
        <div>
          {t(language, 'footer.joint')}{' '}
          <a href="https://github.com/mckc20/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">mckc20</a>
          ,{' '}
          <a href="https://github.com/rafacm" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">rafacm</a>
          {' '}{t(language, 'footer.and')}{' '}
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">Claude Code</a>
          {' '}{t(language, 'footer.production')}
        </div>
        <div>
          {t(language, 'footer.sourceCode')} <a href="https://github.com/mckc20/chemlearner" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">GitHub</a>.
        </div>
        <div className="mt-1 text-gray-300 dark:text-gray-600">
          Version {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'}{' '}
          {typeof __BUILD_TIME__ !== 'undefined' && `built ${new Date(__BUILD_TIME__).toLocaleString('sv-SE', { timeZone: 'Europe/Vienna', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(' ', ' ')} (Vienna, Austria)`}
        </div>
      </footer>
    </div>
  )
}
