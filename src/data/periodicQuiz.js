import { elements, families } from './periodicElements'
import { answerFields, defaultAnswerFields, gradeElementAnswers, validAnswerFields } from './periodicQuestions'

export const QUIZ_SETTINGS_KEY = 'chemlearner_periodic_quiz_settings'

export function eligibleElements(config) {
  return elements.filter(element => config.families.includes(element.family))
}

export function normalizeSettings(value = {}) {
  const selected = families.filter(family => Array.isArray(value?.families) && value.families.includes(family))
  const config = {
    families: selected.length ? selected : [...families],
    count: 'all',
    wrongAnswer: value?.wrongAnswer === 'skip' ? 'skip' : 'retry',
    questionFeedback: value?.questionFeedback === 'first' || (value?.questionFeedback == null && value?.wrongAnswer === 'skip') ? 'first' : 'retry',
    answerFields: validAnswerFields(value?.answerFields)
      ? answerFields.filter(field => value.answerFields.includes(field)) : [...defaultAnswerFields],
  }
  if (Number.isInteger(value?.count) && value.count > 0) {
    config.count = Math.min(value.count, eligibleElements(config).length)
  }
  return config
}

export function readSettings() {
  try {
    return normalizeSettings(JSON.parse(localStorage.getItem(QUIZ_SETTINGS_KEY)))
  } catch {
    return normalizeSettings()
  }
}

export function saveSettings(config) {
  try {
    localStorage.setItem(QUIZ_SETTINGS_KEY, JSON.stringify(normalizeSettings(config)))
  } catch { /* The quiz remains usable when storage is unavailable. */ }
}

export function validSettings(config, mode = 'find') {
  const size = eligibleElements(config).length
  return (mode !== 'questions' || validAnswerFields(config.answerFields)) && size > 0 && (config.count === 'all' || (
    Number.isInteger(config.count) && config.count > 0 && config.count <= size
  ))
}

export function createRound(settings, random = Math.random) {
  const config = normalizeSettings(settings)
  const pool = eligibleElements(config).map(element => element.number)
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const included = pool.slice(0, config.count === 'all' ? pool.length : config.count)
  return { config, included, queue: included, found: {}, mistakes: [], feedback: null, wrongCells: [], fieldResults: {}, submittedAnswers: {}, reviewing: false, submissionCount: 0, revision: 0 }
}

function postpone(queue) {
  return [...queue.slice(1), queue[0]]
}

export function roundReducer(state, action) {
  if (action.type === 'restart') return { ...action.round, revision: state.revision + 1 }
  const current = state.queue[0]
  if (!current) return state
  if (action.type === 'next' && state.reviewing) {
    return { ...state, queue: state.queue.slice(1), fieldResults: {}, submittedAnswers: {}, reviewing: false, feedback: null, revision: state.revision + 1 }
  }
  if (state.reviewing) return state
  if (action.type === 'skip') {
    return { ...state, queue: postpone(state.queue), wrongCells: [], fieldResults: {}, submittedAnswers: {}, revision: state.revision + 1, feedback: { kind: 'skipped', number: current } }
  }
  if (action.type === 'submit') {
    if (action.number !== current) return state
    // Preserve previously correct fields, even if the language changes while retrying.
    const answers = Object.fromEntries(state.config.answerFields.map(field => [field,
      state.fieldResults[field] === true ? state.submittedAnswers[field] : action.answers?.[field],
    ]))
    const grade = gradeElementAnswers(elements.find(element => element.number === current), state.config.answerFields, answers, action.language)
    if (!grade) return state
    const fieldResults = Object.fromEntries(state.config.answerFields.map(field => [field, state.fieldResults[field] === true || grade.fields[field]]))
    const correct = Object.values(fieldResults).every(Boolean)
    const reviewing = correct || state.config.questionFeedback === 'first'
    const earned = correct && !state.mistakes.includes(current)
    return {
      ...state, fieldResults, submittedAnswers: answers, reviewing, submissionCount: state.submissionCount + 1,
      found: reviewing ? { ...state.found, [current]: earned } : state.found,
      mistakes: correct || state.mistakes.includes(current) ? state.mistakes : [...state.mistakes, current],
      feedback: { kind: correct ? (earned ? 'earned' : 'foundAfterMistake') : 'wrongRetry', number: current },
    }
  }
  if (action.type !== 'guess' || !state.included.includes(action.number) || Object.hasOwn(state.found, action.number)) return state
  if (action.number === current) {
    const earned = !state.mistakes.includes(current)
    return {
      ...state, queue: state.queue.slice(1), found: { ...state.found, [current]: earned }, wrongCells: [],
      fieldResults: {}, revision: state.revision + 1,
      feedback: { kind: earned ? 'earned' : 'foundAfterMistake', number: current },
    }
  }
  return {
    ...state,
    queue: state.config.wrongAnswer === 'skip' ? postpone(state.queue) : state.queue,
    mistakes: state.mistakes.includes(current) ? state.mistakes : [...state.mistakes, current],
    wrongCells: state.config.wrongAnswer === 'skip' ? [] : [...new Set([...state.wrongCells, action.number])],
    revision: state.revision + (state.config.wrongAnswer === 'skip' ? 1 : 0),
    feedback: { kind: state.config.wrongAnswer === 'skip' ? 'wrongSkipped' : 'wrongRetry', number: current },
  }
}
