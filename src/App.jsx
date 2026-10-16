/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useCompoundLibrary } from './hooks/useCompoundLibrary'
import { useQuizHistory } from './hooks/useQuizHistory'
import { useQuizQuestions } from './hooks/useQuizQuestions'
import { useLanguage } from './i18n/LanguageContext'
import { t, translateCompound, translateCompounds } from './i18n/translate'
import CompoundList from './components/CompoundList'
import CompoundViewer from './components/CompoundViewer'
import CompareModal from './components/CompareModal'
import QuizSetup from './components/QuizSetup'
import QuizMode from './components/QuizMode'
import QuizHistory from './components/QuizHistory'
import LandingPage from './components/LandingPage'
import PeriodicTable from './components/PeriodicTable'
import PeriodicTableQuiz from './components/PeriodicTableQuiz'
import SectionHeader from './components/SectionHeader'
import TopNavigation from './components/TopNavigation'
import ElementProfileDialog from './components/ElementProfileDialog'
import HelpPage from './components/HelpPage'
import { initialProfile } from './data/elementProfiles'
import './index.css'

function Workspace({ onNavigate, pathname }) {
  const { language } = useLanguage()
  const isPeriodicRoute = pathname === '/periodic-table' || pathname === '/periodic-table/quiz'
  const { compounds } = useCompoundLibrary()
  const { history, saveQuiz, deleteQuiz } = useQuizHistory()
  const { getQuestionsForCompounds } = useQuizQuestions()
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [viewedCompound, setViewedCompound] = useState(null)
  const [elementProfile, setElementProfile] = useState(null)
  const [linkedElement, setLinkedElement] = useState(null)
  const [linkedReturnControl, setLinkedReturnControl] = useState(null)
  const [compoundTabSelections, setCompoundTabSelections] = useState({})
  const profileTrigger = useRef(null)
  const [profileReturnControl, setProfileReturnControl] = useState(null)
  const [compoundFromProfile, setCompoundFromProfile] = useState(false)
  const updateProfile = useCallback(change => setElementProfile(current => ({ ...current, ...change })), [])

  function openElement(atomicNumber, trigger) {
    profileTrigger.current = trigger
    setProfileReturnControl(null)
    setElementProfile(initialProfile(atomicNumber, { paused: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false }))
  }
  function openProfileCompound(compound, control) {
    setCompoundTabSelections({})
    setLinkedReturnControl(null)
    setProfileReturnControl(control)
    setCompoundFromProfile(true)
    setViewedCompound(compound)
  }
  function closeCompound() {
    setViewedCompound(null)
    setCompoundFromProfile(false)
  }
  function openViewedCompound(compound) {
    setCompoundTabSelections({})
    setLinkedReturnControl(null)
    setViewedCompound(compound)
  }
  function openCompoundFromLinkedElement(compound) {
    setLinkedElement(null)
    setElementProfile(null)
    setShowCompare(false)
    setCompoundFromProfile(false)
    openViewedCompound(compound)
  }
  function openLinkedElement(atomicNumber, control) {
    setLinkedReturnControl(control)
    setLinkedElement(initialProfile(atomicNumber, { paused: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false }))
  }
  function changeCompoundTab(compoundId, tab) {
    setCompoundTabSelections(current => ({ ...current, [compoundId]: tab }))
  }
  useEffect(() => {
    setElementProfile(null)
    setLinkedElement(null)
    setLinkedReturnControl(null)
    setProfileReturnControl(null)
    setCompoundFromProfile(false)
    setViewedCompound(null)
    setShowCompare(false)
  }, [pathname])
  const [activeView, setActiveView] = useState('library') // 'library' | 'quiz-setup' | 'quiz' | 'history'
  const [quizCompounds, setQuizCompounds] = useState([])
  const [quizConfig, setQuizConfig] = useState(null)
  const [periodicQuizConfig, setPeriodicQuizConfig] = useState(null)
  const [quizKey, setQuizKey] = useState(0) // force remount on retry
  const [showCompare, setShowCompare] = useState(false)

  function navigateFromTopbar(event, destination) {
    if (canHandleNavigation(event)) {
      setElementProfile(null)
      setLinkedElement(null)
      setViewedCompound(null)
      setCompoundFromProfile(false)
      setProfileReturnControl(null)
      setShowCompare(false)
    }
    onNavigate(event, destination)
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

  function handlePeriodicQuizStart(event, config) {
    setPeriodicQuizConfig(config)
    onNavigate(event, '/periodic-table/quiz')
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

  return (
    <div className="app-shell">
      <TopNavigation onNavigate={navigateFromTopbar} pathname={pathname} />

      <main className="workspace-main min-w-0 space-y-10">
        {pathname === '/periodic-table' && <PeriodicTable onStartQuiz={handlePeriodicQuizStart} onSelectElement={openElement} selectedElement={elementProfile?.atomicNumber} />}
        {pathname === '/periodic-table/quiz' && <PeriodicTableQuiz onNavigate={onNavigate} initialConfig={periodicQuizConfig} onConfigChange={setPeriodicQuizConfig} />}

        {/* Library view */}
          {!isPeriodicRoute && activeView === 'library' && (
          <>
            <SectionHeader
              title={t(language, 'library.title')}
              actions={(
                <button
                  type="button"
                  onClick={() => setActiveView('history')}
                  className="secondary-button text-sm"
                >
                  {t(language, 'nav.quizHistory')}
                </button>
              )}
            />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setCompoundTabSelections({}); setLinkedReturnControl(null); setShowCompare(true) }}
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
              onView={openViewedCompound}
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
        {!isPeriodicRoute && activeView === 'quiz-setup' && (
          <QuizSetup
            quizCompounds={translateCompounds(language, quizCompounds)}
            allCompounds={translatedCompounds}
            availableGKCount={getQuestionsForCompounds(quizCompounds.map(c => c.id)).length}
            onStart={handleQuizSetupStart}
            onCancel={() => setActiveView('library')}
          />
        )}

        {/* Quiz view */}
        {!isPeriodicRoute && activeView === 'quiz' && (
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
        {!isPeriodicRoute && activeView === 'history' && (
          <>
            <SectionHeader
              title={t(language, 'history.title')}
              actions={(
                <button
                  type="button"
                  onClick={() => setActiveView('library')}
                  className="secondary-button text-sm"
                >
                  {t(language, 'nav.moleculeLibrary')}
                </button>
              )}
            />
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

      {elementProfile && !viewedCompound && !linkedElement && (
        <ElementProfileDialog
          profile={elementProfile}
          onChange={updateProfile}
          onNavigate={number => { setProfileReturnControl(null); setElementProfile(current => initialProfile(number, current)) }}
          onClose={() => setElementProfile(null)}
          compounds={compounds}
          onOpenCompound={openProfileCompound}
          onHelp={event => onNavigate(event, event.currentTarget.getAttribute('href'))}
          returnFocus={() => profileTrigger.current}
          restoreControl={profileReturnControl}
        />
      )}

      {viewedCompound && !linkedElement && (
        <CompoundViewer
          compound={translateCompound(language, viewedCompound)}
          onClose={closeCompound}
          returnFocus={compoundFromProfile ? () => null : undefined}
          activeTab={compoundTabSelections[viewedCompound.id] ?? 'overview'}
          onTabChange={tab => changeCompoundTab(viewedCompound.id, tab)}
          onOpenElement={openLinkedElement}
          restoreControl={linkedReturnControl}
        />
      )}

      {showCompare && selectedIds.size === 2 && !linkedElement && !viewedCompound && (
        <CompareModal
          compounds={translatedCompounds.filter(c => selectedIds.has(c.id))}
          onClose={() => setShowCompare(false)}
          tabSelections={compoundTabSelections}
          onTabChange={changeCompoundTab}
          onOpenElement={openLinkedElement}
          restoreControl={linkedReturnControl}
        />
      )}

      {linkedElement && (
        <ElementProfileDialog
          profile={linkedElement}
          onChange={change => setLinkedElement(current => ({ ...current, ...change }))}
          onNavigate={number => setLinkedElement(current => initialProfile(number, current))}
          onClose={() => setLinkedElement(null)}
          compounds={compounds}
          onOpenCompound={openCompoundFromLinkedElement}
          onHelp={event => onNavigate(event, event.currentTarget.getAttribute('href'))}
          returnFocus={() => null}
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
  if (event.type === 'submit') return true
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
    if (`${window.location.pathname}${window.location.hash}` === destination) return
    window.history.pushState({}, '', destination)
    setPathname(window.location.pathname)
  }

  if (pathname === '/help') return <HelpPage onNavigate={navigate} />

  return pathname === '/compounds' || pathname === '/periodic-table' || pathname === '/periodic-table/quiz'
    ? <Workspace onNavigate={navigate} pathname={pathname} />
    : <LandingPage onNavigate={navigate} pathname={pathname} />
}
