/* eslint-disable react/prop-types */
import { useEffect, useId, useRef, useState } from 'react'
import { elements, elementName, families, familyNames } from '../data/periodicElements'
import { clueField, gradeElementAnswers } from '../data/periodicQuestions'
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'

export default function ElementQuestions({ round, dispatch, onNewRound }) {
  const { language } = useLanguage()
  const current = elements.find(element => element.number === round.queue[0])
  const points = Object.values(round.found).filter(Boolean).length
  const total = round.included.length
  return <div className="mx-auto max-w-xl space-y-6">
    <div className="flex justify-center gap-5 text-sm" aria-live="polite" aria-atomic="true">
      <span>{t(language, 'periodicQuiz.answeredCount', { count: Object.keys(round.found).length, total })}</span>
      <span>{t(language, 'periodicQuiz.pointsCount', { count: points, total })}</span>
    </div>
    {current ? <ElementAnswerForm key={round.revision} element={current} round={round} dispatch={dispatch} />
      : <ElementQuestionResults round={round} points={points} onNewRound={onNewRound} />}
    <p className="sr-only" role="status">
      {round.feedback && t(language, `periodicQuiz.questionFeedback.${round.feedback.kind}`)}
    </p>
  </div>
}

function ElementAnswerForm({ element, round, dispatch }) {
  const { language } = useLanguage()
  const [answers, setAnswers] = useState({})
  const formRef = useRef(null)
  const nextRef = useRef(null)
  const id = useId()
  const fields = round.config.answerFields
  const clue = clueField(fields)
  const canSubmit = gradeElementAnswers(element, fields, answers, language) !== null
  const hasFeedback = Object.keys(round.fieldResults).length > 0
  const correct = hasFeedback && Object.values(round.fieldResults).every(Boolean)

  useEffect(() => {
    formRef.current?.querySelector('input, select')?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!hasFeedback) return
    if (round.reviewing) nextRef.current?.focus({ preventScroll: true })
    else formRef.current?.querySelector('[aria-invalid="true"]')?.focus({ preventScroll: true })
  }, [round.submissionCount, round.reviewing, hasFeedback])

  return <form ref={formRef} className="surface-module periodic-question-card space-y-6 p-5 sm:p-7" onSubmit={event => {
    event.preventDefault()
    if (!round.reviewing && canSubmit) dispatch({ type: 'submit', number: element.number, answers, language })
  }}>
    <div className="space-y-2 text-center" aria-live="polite" aria-atomic="true">
      <p className="text-sm">{t(language, 'periodicQuiz.givenClue', { field: t(language, `periodicQuiz.field.${clue}`) })}</p>
      <div className="periodic-quiz-prompt__name-row">
        <h2 className="periodic-quiz-prompt__name">{clue === 'name' ? elementName(element, language) : element[clue]}</h2>
        {!round.reviewing && <button type="button" className="periodic-quiz-icon-button periodic-quiz-skip" aria-label={t(language, 'periodicQuiz.skip')} title={t(language, 'periodicQuiz.skip')} onClick={() => dispatch({ type: 'skip' })}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7" /></svg>
        </button>}
      </div>
    </div>
    <div className="space-y-4">
      {fields.map(field => {
        const result = round.fieldResults[field]
        const showCorrection = round.reviewing && result === false
        const locked = round.reviewing || result === true
        const fieldId = `${id}-${field}`
        const props = {
          id: fieldId,
          name: field,
          className: `periodic-answer-input ${result === undefined ? '' : `periodic-answer-input--${result ? 'correct' : 'incorrect'}`}`,
          value: answers[field] ?? '',
          required: true,
          'aria-invalid': result === false ? true : undefined,
          'aria-describedby': result === undefined ? undefined : `${fieldId}-result${showCorrection ? ` ${fieldId}-correction` : ''}`,
          onChange: event => { if (!locked) setAnswers(previous => ({ ...previous, [field]: event.target.value })) },
        }
        return <div key={field} className="space-y-1">
          <label htmlFor={fieldId} className="font-semibold">{t(language, `periodicQuiz.field.${field}`)}</label>
          <div className={showCorrection ? 'periodic-answer-comparison' : undefined}>
            {field === 'family' ? <select {...props} disabled={locked}>
              <option value="">{t(language, 'periodicQuiz.chooseFamily')}</option>
              {families.map(family => <option key={family} value={family}>{familyNames[language][family]}</option>)}
            </select> : <input {...props} readOnly={locked} type={field === 'number' ? 'number' : 'text'}
              min={field === 'number' ? 1 : undefined} max={field === 'number' ? 118 : undefined} step={field === 'number' ? 1 : undefined}
              autoComplete="off" autoCapitalize="off" spellCheck={false} />}
            {showCorrection && <div id={`${fieldId}-correction`} className="periodic-answer-correction">
              <span>{t(language, 'periodicQuiz.correctAnswerLabel')}</span>{' '}
              <strong>{field === 'name' ? elementName(element, language) : field === 'family' ? familyNames[language][element.family] : element[field]}</strong>
            </div>}
          </div>
          {result !== undefined && <p id={`${fieldId}-result`} className="sr-only">
            {t(language, result ? 'periodicQuiz.correct' : 'periodicQuiz.incorrect')}
          </p>}
        </div>
      })}
    </div>
    {hasFeedback && <div className="space-y-3" role="status">
      <p className="font-semibold">{t(language, correct ? 'periodicQuiz.answersCorrect' : round.reviewing ? 'periodicQuiz.answersIncorrect' : 'periodicQuiz.retryIncorrect')}</p>
    </div>}
    {round.reviewing
      ? <button ref={nextRef} type="button" className="primary-button" onClick={() => dispatch({ type: 'next' })}>{t(language, 'periodicQuiz.nextQuestion')}</button>
      : <button type="submit" className="primary-button" disabled={!canSubmit}>{t(language, 'periodicQuiz.submitAnswers')}</button>}
    {hasFeedback && <span key={round.submissionCount} aria-hidden="true" className={`periodic-question-flash !m-0 periodic-question-flash--${correct ? 'correct' : 'incorrect'}`} />}
  </form>
}

function ElementQuestionResults({ round, points, onNewRound }) {
  const { language } = useLanguage()
  const headingRef = useRef(null)
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [])
  return <>
    <div className="space-y-3 text-center">
      <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold">{t(language, 'periodicQuiz.roundComplete')}</h2>
      <p className="text-xl">{t(language, 'periodicQuiz.finalScore', { points, total: round.included.length })}</p>
      <button type="button" className="primary-button" onClick={onNewRound}>{t(language, 'periodicQuiz.newRound')}</button>
    </div>
    <ul className="space-y-2" aria-label={t(language, 'periodicQuiz.questionResults')}>
      {round.included.map(number => {
        const element = elements.find(value => value.number === number)
        const correct = round.found[number]
        return <li key={number} className={`periodic-question-result periodic-question-result--${correct ? 'correct' : 'incorrect'}`}>
          <span aria-hidden="true" className="text-lg">{correct ? '✓' : '✕'}</span>
          <div className="min-w-0">
            <p className="font-semibold">{elementName(element, language)} <span className="sr-only">— {t(language, correct ? 'periodicQuiz.correct' : 'periodicQuiz.incorrect')}</span></p>
            <p className="text-sm">{element.symbol} · {element.number} · {familyNames[language][element.family]}</p>
          </div>
        </li>
      })}
    </ul>
  </>
}
