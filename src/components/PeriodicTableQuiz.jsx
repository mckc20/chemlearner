/* eslint-disable react/prop-types */
import { useReducer, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'
import { elements, elementName, familyNames } from '../data/periodicElements'
import { createRound, normalizeSettings, readSettings, roundReducer, saveSettings, validSettings } from '../data/periodicQuiz'
import PeriodicGrid from './PeriodicGrid'
import { PeriodicFamilyLegend } from './PeriodicTable'
import PeriodicQuizDialog from './PeriodicQuizDialog'
import { PeriodicQuizSettingsFields, PeriodicQuizSetupForm } from './PeriodicQuizSettings'
import SectionHeader from './SectionHeader'
import ElementQuestions from './ElementQuestions'

function positionLabel(language, element) {
  return t(language, 'periodicQuiz.position', {
    row: element.period,
    column: element.period > 7 ? element.group + 3 : element.group,
  })
}

export default function PeriodicTableQuiz({ onNavigate, initialConfig, onConfigChange }) {
  const { language } = useLanguage()
  const [mode, setMode] = useState(() => ['self', 'find', 'questions'].includes(initialConfig?.mode) ? initialConfig.mode : null)
  const [savedConfig, setSavedConfig] = useState(() => ['find', 'questions'].includes(initialConfig?.mode) ? normalizeSettings(initialConfig) : readSettings())
  const [round, dispatch] = useReducer(roundReducer, savedConfig, createRound)
  const [revealed, setRevealed] = useState(() => new Set())
  const [touched, setTouched] = useState(() => new Set())
  const [draft, setDraft] = useState(null)
  const [confirmSettings, setConfirmSettings] = useState(false)
  const promptRef = useRef(null)
  const settingsRef = useRef(null)
  const current = elements.find(element => element.number === round.queue[0])
  const complete = round.queue.length === 0
  const total = round.included.length
  const found = Object.keys(round.found).length
  const points = Object.values(round.found).filter(Boolean).length

  function startRound(config) {
    dispatch({ type: 'restart', round: createRound(config) })
  }

  function closeSettings() {
    setDraft(null)
    setConfirmSettings(false)
    // Restore focus after the background is no longer inert.
    window.requestAnimationFrame(() => settingsRef.current?.focus({ preventScroll: true }))
  }

  function applySettings(restart) {
    const config = normalizeSettings(draft)
    setSavedConfig(config)
    saveSettings(config)
    onConfigChange?.({ ...config, mode })
    if (restart) startRound(config)
    closeSettings()
  }

  function chooseCell(event, element) {
    if (mode === 'self') {
      setTouched(previous => new Set(previous).add(element.number))
      setRevealed(previous => {
        const next = new Set(previous)
        if (next.has(element.number)) next.delete(element.number)
        else next.add(element.number)
        return next
      })
      return
    }
    dispatch({ type: 'guess', number: element.number })
    if (current?.number === element.number && event.detail === 0) {
      promptRef.current?.focus({ preventScroll: true })
    }
  }

  const prompt = mode === 'find' && <>
    <div className="space-y-1" aria-live="polite" aria-atomic="true">
      <p className="text-sm">{t(language, complete ? 'periodicQuiz.roundComplete' : 'periodicQuiz.findPrompt')}</p>
      <div className="periodic-quiz-prompt__name-row">
        <h2 ref={promptRef} tabIndex={-1} className="periodic-quiz-prompt__name">
          {current ? elementName(current, language) : t(language, 'periodicQuiz.finalScore', { points, total })}
        </h2>
        {!complete && <button
          type="button"
          className="periodic-quiz-icon-button periodic-quiz-skip"
          aria-label={t(language, 'periodicQuiz.skip')}
          title={t(language, 'periodicQuiz.skip')}
          onClick={() => dispatch({ type: 'skip' })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>}
      </div>
      <div className="flex justify-center gap-5 text-sm">
        <span>{t(language, 'periodicQuiz.foundCount', { count: found, total })}</span>
        <span>{t(language, 'periodicQuiz.pointsCount', { count: points, total })}</span>
      </div>
    </div>
    {complete && <div className="flex justify-center">
      <button type="button" className="primary-button" onClick={() => startRound(savedConfig)}>{t(language, 'periodicQuiz.newRound')}</button>
    </div>}
    <p className="sr-only" role="status">
      {round.feedback && t(language, `periodicQuiz.${round.feedback.kind}`, {
        name: elementName(elements.find(element => element.number === round.feedback.number), language),
      })}
    </p>
  </>

  return <section aria-labelledby="periodic-quiz-title" className="periodic-quiz-section">
    <div className="space-y-6" inert={draft ? true : undefined}>
      <SectionHeader
        number="03"
        title={t(language, mode === 'questions' ? 'periodicQuiz.questions' : 'periodicQuiz.title')}
        description={t(language, mode === 'questions' ? 'periodicQuiz.questionsDescription' : mode === 'find' ? 'periodicQuiz.findDescription' : 'periodicQuiz.description')}
        headingId="periodic-quiz-title"
        actions={<div className="flex flex-wrap justify-end gap-2">
          <a href="/periodic-table" onClick={event => onNavigate(event, '/periodic-table')} className="secondary-button inline-flex items-center">{t(language, 'periodicQuiz.back')}</a>
          {mode === 'self' && <button type="button" className="secondary-button" onClick={() => { setRevealed(new Set()); setTouched(new Set()) }}>{t(language, 'periodicQuiz.hideAll')}</button>}
          {mode && mode !== 'self' && <div className="flex items-center gap-2">
            {!complete && <button type="button" className="secondary-button" onClick={() => startRound(savedConfig)}>{t(language, 'periodicQuiz.reset')}</button>}
            <button
              ref={settingsRef}
              type="button"
              className="secondary-button periodic-quiz-icon-button"
              aria-label={t(language, 'periodicQuiz.settings')}
              title={t(language, 'periodicQuiz.settings')}
              onClick={() => setDraft(savedConfig)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2h5l.5 3 2 1 2.5-1 2.5 4-2 2v2l2 2-2.5 4-2.5-1-2 1-.5 3h-5L9 19l-2-1-2.5 1L2 15l2-2v-2L2 9l2.5-4L7 6l2-1Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>}
        </div>}
      />
      {!mode ? <div className="surface-module max-w-xl p-5 sm:p-7">
        <PeriodicQuizSetupForm onStart={(_event, config) => {
          setMode(config.mode)
          onConfigChange?.(config)
          if (config.mode !== 'self') {
            setSavedConfig(normalizeSettings(config))
            startRound(config)
          }
        }} />
      </div> : mode === 'questions' ? <ElementQuestions round={round} dispatch={dispatch} onNewRound={() => startRound(savedConfig)} /> : <>
        <PeriodicGrid label={t(language, 'periodicQuiz.grid')} prompt={prompt} renderCell={element => {
          const visible = mode === 'self' ? revealed.has(element.number) : Object.hasOwn(round.found, element.number)
          const included = mode === 'self' || round.included.includes(element.number)
          const showResult = mode === 'find' && complete && visible
          const result = round.found[element.number]
          const label = visible
            ? `${element.number} ${elementName(element, language)} (${element.symbol}), ${familyNames[language][element.family]}${showResult ? `, ${t(language, result ? 'periodicQuiz.correct' : 'periodicQuiz.incorrect')}` : ''}`
            : t(language, mode === 'self' ? 'periodicQuiz.revealCell' : 'periodicQuiz.answerCell', { position: positionLabel(language, element) })
          return <button
            type="button"
            onClick={event => chooseCell(event, element)}
            disabled={mode === 'find' && (!included || visible)}
            aria-label={label}
            aria-pressed={mode === 'self' ? visible : undefined}
            className={`element-cell periodic-quiz-cell ${visible ? `element-cell--${element.family} periodic-quiz-cell--revealed` : 'periodic-quiz-cell--blank'} ${!included ? 'periodic-quiz-cell--excluded' : ''} ${mode === 'self' && touched.has(element.number) ? 'periodic-quiz-cell--touched' : ''} ${showResult ? `periodic-quiz-cell--${result ? 'correct' : 'incorrect'}` : ''} ${mode === 'find' && round.wrongCells.includes(element.number) ? 'periodic-quiz-cell--wrong' : ''}`}
          >
            {visible && <>
              <span className="element-cell__number">{element.number}</span>
              <span className="element-cell__symbol">{element.symbol}</span>
              <span className="element-cell__name">{elementName(element, language)}</span>
              {showResult && <span className="periodic-quiz-cell__result" aria-hidden="true">{result ? '✓' : '✕'}</span>}
            </>}
          </button>
        }} />
        {mode === 'find' && complete && <p className="text-sm">{t(language, 'periodicQuiz.resultLegend')}</p>}
        <PeriodicFamilyLegend language={language} />
      </>}
    </div>
    {draft && <PeriodicQuizDialog
      title={t(language, confirmSettings ? 'periodicQuiz.restartTitle' : 'periodicQuiz.settings')}
      description={confirmSettings ? t(language, 'periodicQuiz.restartDescription') : undefined}
      onCancel={() => confirmSettings ? setConfirmSettings(false) : closeSettings()}
    >
      {confirmSettings ? <div className="flex flex-wrap justify-end gap-3">
        <button type="button" className="secondary-button" onClick={() => setConfirmSettings(false)}>{t(language, 'periodicQuiz.cancel')}</button>
        <button type="button" className="primary-button" onClick={() => applySettings(true)}>{t(language, 'periodicQuiz.continue')}</button>
        <button type="button" className="secondary-button" onClick={() => applySettings(false)}>{t(language, 'periodicQuiz.applyNext')}</button>
      </div> : <form className="space-y-5" onSubmit={event => {
        event.preventDefault()
        if (!validSettings(draft, mode)) return
        if (JSON.stringify(normalizeSettings(draft)) === JSON.stringify(savedConfig)) closeSettings()
        else if (complete) applySettings(false)
        else setConfirmSettings(true)
      }}>
        <PeriodicQuizSettingsFields config={draft} onChange={setDraft} mode={mode} />
        <div className="flex justify-end gap-3">
          <button type="button" className="secondary-button" onClick={closeSettings}>{t(language, 'periodicQuiz.cancel')}</button>
          <button type="submit" className="primary-button" disabled={!validSettings(draft, mode)}>{t(language, 'periodicQuiz.apply')}</button>
        </div>
      </form>}
    </PeriodicQuizDialog>}
  </section>
}
