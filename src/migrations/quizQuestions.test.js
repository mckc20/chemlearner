import { runQuizQuestionsMigrations } from './quizQuestions.js'
import { QUIZ_QUESTIONS_VERSION, DEFAULT_QUIZ_QUESTIONS } from '../data/defaultQuizQuestions.js'

const QUIZ_QUESTIONS_KEY = 'chemlearner_quiz_questions'
const QUIZ_VERSION_KEY = 'chemlearner_quiz_questions_version'
const DELETED_QUIZ_DEFAULTS_KEY = 'chemlearner_deleted_quiz_defaults'

beforeEach(() => {
  localStorage.clear()
})

describe('runQuizQuestionsMigrations', () => {
  test('first-time user: sets version without storing questions', () => {
    runQuizQuestionsMigrations()
    expect(localStorage.getItem(QUIZ_VERSION_KEY)).toBe(String(QUIZ_QUESTIONS_VERSION))
    expect(localStorage.getItem(QUIZ_QUESTIONS_KEY)).toBeNull()
  })

  test('already at current version: does nothing', () => {
    const questions = [{ id: 'custom-1', question: 'Custom?' }]
    localStorage.setItem(QUIZ_QUESTIONS_KEY, JSON.stringify(questions))
    localStorage.setItem(QUIZ_VERSION_KEY, String(QUIZ_QUESTIONS_VERSION))

    runQuizQuestionsMigrations()

    const stored = JSON.parse(localStorage.getItem(QUIZ_QUESTIONS_KEY))
    expect(stored).toEqual(questions)
  })

  test('syncDefaults adds new defaults not in stored data', () => {
    // Store only a subset of defaults
    const subset = DEFAULT_QUIZ_QUESTIONS.slice(0, 5).map(q => ({ ...q }))
    localStorage.setItem(QUIZ_QUESTIONS_KEY, JSON.stringify(subset))

    runQuizQuestionsMigrations()

    const stored = JSON.parse(localStorage.getItem(QUIZ_QUESTIONS_KEY))
    expect(stored.length).toBe(DEFAULT_QUIZ_QUESTIONS.length)
  })

  test('syncDefaults updates untouched defaults with latest data', () => {
    const questions = DEFAULT_QUIZ_QUESTIONS.map(q => ({ ...q, _userModified: false }))
    localStorage.setItem(QUIZ_QUESTIONS_KEY, JSON.stringify(questions))

    runQuizQuestionsMigrations()

    const stored = JSON.parse(localStorage.getItem(QUIZ_QUESTIONS_KEY))
    const first = stored.find(q => q.id === 'qq-1')
    expect(first._userModified).toBe(false)
    expect(first.question).toBe(DEFAULT_QUIZ_QUESTIONS[0].question)
  })

  test('syncDefaults preserves user-modified questions', () => {
    const questions = DEFAULT_QUIZ_QUESTIONS.map(q =>
      q.id === 'qq-1'
        ? { ...q, question: 'My custom question?', _userModified: true }
        : { ...q, _userModified: false }
    )
    localStorage.setItem(QUIZ_QUESTIONS_KEY, JSON.stringify(questions))

    runQuizQuestionsMigrations()

    const stored = JSON.parse(localStorage.getItem(QUIZ_QUESTIONS_KEY))
    const first = stored.find(q => q.id === 'qq-1')
    expect(first.question).toBe('My custom question?')
    expect(first._userModified).toBe(true)
  })

  test('syncDefaults skips deleted defaults', () => {
    const questions = DEFAULT_QUIZ_QUESTIONS.filter(q => q.id !== 'qq-1').map(q => ({ ...q }))
    localStorage.setItem(QUIZ_QUESTIONS_KEY, JSON.stringify(questions))
    localStorage.setItem(DELETED_QUIZ_DEFAULTS_KEY, JSON.stringify(['qq-1']))

    runQuizQuestionsMigrations()

    const stored = JSON.parse(localStorage.getItem(QUIZ_QUESTIONS_KEY))
    expect(stored.find(q => q.id === 'qq-1')).toBeUndefined()
  })

  test('backfillSchemaFields adds missing fields', () => {
    const questions = [{ id: 'custom-1', question: 'Partial?' }]
    localStorage.setItem(QUIZ_QUESTIONS_KEY, JSON.stringify(questions))

    runQuizQuestionsMigrations()

    const stored = JSON.parse(localStorage.getItem(QUIZ_QUESTIONS_KEY))
    const partial = stored.find(q => q.id === 'custom-1')
    expect(partial.options).toEqual([])
    expect(partial.correctIndex).toBe(0)
    expect(partial.compoundId).toBe('')
  })

  test('sets version to QUIZ_QUESTIONS_VERSION after migration', () => {
    localStorage.setItem(QUIZ_QUESTIONS_KEY, JSON.stringify(DEFAULT_QUIZ_QUESTIONS))

    runQuizQuestionsMigrations()

    expect(localStorage.getItem(QUIZ_VERSION_KEY)).toBe(String(QUIZ_QUESTIONS_VERSION))
  })
})
