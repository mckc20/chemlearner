/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
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
import LandingPage from './components/LandingPage'
import PeriodicTable from './components/PeriodicTable'
import SectionHeader from './components/SectionHeader'
import ThemeSwitch from './components/ThemeSwitch'
import './index.css'

function Workspace({ onNavigate, pathname }) {
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
    { key: 'library', number: '01', label: t(language, 'nav.library'), href: '/compounds' },
    { key: 'history', number: '02', label: t(language, 'nav.quizHistory'), href: '/compounds' },
    { key: 'periodic-table', number: '03', label: language === 'de' ? 'Periodensystem' : 'Periodic table', href: '/periodic-table' },
  ]

  return (
    <div className="app-shell">
      <header className="app-topbar flex items-center justify-between px-5 sm:px-8">
        <a href="/" onClick={(event) => onNavigate(event, '/')} className="font-semibold text-base tracking-tight flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <span className="brand-logo w-6 h-6" aria-hidden="true" />
            ChemLearner
        </a>
        <div className="flex items-center gap-3 sm:gap-5 text-sm text-gray-500 dark:text-gray-400">
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)] max-[640px]:flex-col">
        <aside className="app-sidebar py-8">
          <div className="px-6 pb-4 text-[10px] font-semibold uppercase tracking-[.14em] text-gray-400">Chemistry</div>
          <nav aria-label="Main navigation" className="space-y-1 px-3">
            {navItems.map(item => {
              const isActive = item.key === 'periodic-table'
                ? pathname === '/periodic-table'
                : pathname !== '/periodic-table' && (activeView === item.key || ((activeView === 'quiz' || activeView === 'quiz-setup') && item.key === 'library'))
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(event) => {
                    onNavigate(event, item.href)
                    if (item.key !== 'periodic-table') setActiveView(item.key)
                  }}
                  className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-number">{item.number}</span>
                  <span className="text-sm">{item.label}</span>
                </a>
              )
            })}
          </nav>
          <div className="mx-6 my-7 border-t border-gray-200" />
          <div className="px-6 text-[10px] font-semibold uppercase tracking-[.14em] text-gray-400">Explore</div>
          <a href="/" onClick={(event) => onNavigate(event, '/')} className="nav-item mx-3 mt-2">
            <span className="nav-number">↗</span><span className="text-sm">{language === 'de' ? 'Startseite' : 'Home'}</span>
          </a>
        </aside>

        <main className="workspace-main min-w-0 flex-1 space-y-10">
        {pathname === '/periodic-table' ? <PeriodicTable /> : null}

        {/* Library view */}
          {pathname !== '/periodic-table' && activeView === 'library' && (
          <>
            <SectionHeader number="01" title={t(language, 'library.title')} />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCompare(true)}
                  disabled={selectedIds.size !== 2}
                  className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
        {pathname !== '/periodic-table' && activeView === 'quiz-setup' && (
          <QuizSetup
            quizCompounds={translateCompounds(language, quizCompounds)}
            allCompounds={translatedCompounds}
            availableGKCount={getQuestionsForCompounds(quizCompounds.map(c => c.id)).length}
            onStart={handleQuizSetupStart}
            onCancel={() => setActiveView('library')}
          />
        )}

        {/* Quiz view */}
        {pathname !== '/periodic-table' && activeView === 'quiz' && (
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
        {pathname !== '/periodic-table' && activeView === 'history' && (
          <>
            <SectionHeader number="02" title={t(language, 'history.title')} />
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
      </div>

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

      <footer className="border-t border-gray-200 bg-white py-5 text-center text-xs text-gray-400 dark:text-gray-500">
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

function canHandleNavigation(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(event, destination) {
    if (!canHandleNavigation(event)) return
    event.preventDefault()
    if (window.location.pathname === destination) return
    window.history.pushState({}, '', destination)
    setPathname(destination)
  }

  return pathname === '/compounds' || pathname === '/periodic-table'
    ? <Workspace onNavigate={navigate} pathname={pathname} />
    : <LandingPage onNavigate={navigate} />
}
