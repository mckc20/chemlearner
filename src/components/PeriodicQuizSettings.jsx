/* eslint-disable react/prop-types */
import { families, familyNames } from '../data/periodicElements'
import { eligibleElements, readSettings, saveSettings, validSettings } from '../data/periodicQuiz'
import { answerFields, clueField, validAnswerFields } from '../data/periodicQuestions'
import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'

export function PeriodicQuizSettingsFields({ config, onChange, mode = 'find' }) {
  const { language } = useLanguage()
  const available = eligibleElements(config).length

  function toggleFamily(family) {
    const selected = config.families.includes(family)
      ? config.families.filter(value => value !== family) : [...config.families, family]
    const size = eligibleElements({ families: selected }).length
    onChange({ ...config, families: selected, count: config.count === 'all' ? 'all' : Math.min(config.count, size) || '' })
  }

  return <div className="space-y-5">
    {mode === 'questions' && <fieldset>
      <legend className="mb-2 font-semibold">{t(language, 'periodicQuiz.answerFields')}</legend>
      <div className="grid grid-cols-2 gap-2">
        {answerFields.map(field => <label key={field} className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={config.answerFields.includes(field)} onChange={() => onChange({
            ...config,
            answerFields: config.answerFields.includes(field) ? config.answerFields.filter(value => value !== field) : [...config.answerFields, field],
          })} />
          {t(language, `periodicQuiz.field.${field}`)}
        </label>)}
      </div>
      <p className="mt-2 text-sm" role={validAnswerFields(config.answerFields) ? undefined : 'alert'}>
        {validAnswerFields(config.answerFields)
          ? t(language, 'periodicQuiz.givenClue', { field: t(language, `periodicQuiz.field.${clueField(config.answerFields)}`) })
          : t(language, 'periodicQuiz.requireClue')}
      </p>
    </fieldset>}
    <fieldset>
      <legend className="mb-2 font-semibold">{t(language, 'periodicQuiz.families')}</legend>
      <div className="grid grid-cols-2 gap-2">
        {families.map(family => <label key={family} className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={config.families.includes(family)} onChange={() => toggleFamily(family)} />
          {familyNames[language][family]}
        </label>)}
      </div>
      {!available && <p role="alert" className="mt-2 text-sm">{t(language, 'periodicQuiz.requireFamily')}</p>}
    </fieldset>
    <label className="block space-y-2">
      <span className="font-semibold">{t(language, 'periodicQuiz.roundLength')}</span>
      <select className="periodic-answer-input" value={config.count === 'all' ? 'all' : 'custom'} onChange={event => onChange({ ...config, count: event.target.value === 'all' ? 'all' : Math.min(10, available) || '' })}>
        <option value="all">{t(language, 'periodicQuiz.allElements', { count: available })}</option>
        <option value="custom">{t(language, 'periodicQuiz.customCount')}</option>
      </select>
    </label>
    {config.count !== 'all' && <label className="block space-y-2">
      <span>{t(language, 'periodicQuiz.elementCount')}</span>
      <input className="periodic-answer-input" type="number" min="1" max={available || 1} step="1" required value={config.count} onChange={event => onChange({ ...config, count: event.target.value === '' ? '' : Number(event.target.value) })} />
    </label>}
    <label className="block space-y-2">
      <span className="font-semibold">{t(language, mode === 'questions' ? 'periodicQuiz.answerFeedback' : 'periodicQuiz.wrongAnswer')}</span>
      <select className="periodic-answer-input" value={mode === 'questions' ? config.questionFeedback : config.wrongAnswer} onChange={event => onChange({ ...config, [mode === 'questions' ? 'questionFeedback' : 'wrongAnswer']: event.target.value })}>
        <option value="retry">{t(language, 'periodicQuiz.keepTrying')}</option>
        {mode === 'questions'
          ? <option value="first">{t(language, 'periodicQuiz.feedbackFirst')}</option>
          : <option value="skip">{t(language, 'periodicQuiz.autoSkip')}</option>}
      </select>
    </label>
    <p className="text-sm text-gray-500 dark:text-gray-400">{t(language, mode === 'questions' ? 'periodicQuiz.questionScoringHelp' : 'periodicQuiz.scoringHelp')}</p>
  </div>
}

export function PeriodicQuizSetupForm({ onStart, onCancel }) {
  const { language } = useLanguage()
  const [mode, setMode] = useState('self')
  const [config, setConfig] = useState(readSettings)
  return <form className="space-y-5" onSubmit={event => {
    event.preventDefault()
    if (mode !== 'self' && !validSettings(config, mode)) return
    if (mode !== 'self') saveSettings(config)
    onStart(event, { ...config, mode })
  }}>
    <fieldset className="space-y-3">
      <legend className="mb-2 font-semibold">{t(language, 'periodicQuiz.mode')}</legend>
      {['self', 'find', 'questions'].map(value => <label key={value} className="flex items-start gap-3">
        <input type="radio" name="periodic-mode" value={value} checked={mode === value} onChange={() => setMode(value)} />
        <span>{t(language, `periodicQuiz.${value}`)}</span>
      </label>)}
    </fieldset>
    {mode !== 'self' && <PeriodicQuizSettingsFields config={config} onChange={setConfig} mode={mode} />}
    <div className="flex justify-end gap-3">
      {onCancel && <button type="button" className="secondary-button" onClick={onCancel}>{t(language, 'periodicQuiz.cancel')}</button>}
      <button type="submit" className="primary-button" disabled={mode !== 'self' && !validSettings(config, mode)}>{t(language, 'periodicQuiz.start')}</button>
    </div>
  </form>
}
