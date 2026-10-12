import { expect, test } from 'vitest'
import { elements } from './periodicElements'
import { answerFields, clueField, defaultAnswerFields, gradeElementAnswers, validAnswerFields } from './periodicQuestions'
import { createRound, normalizeSettings, roundReducer, validSettings } from './periodicQuiz'

const selections = Array.from({ length: 16 }, (_, mask) => answerFields.filter((_, i) => mask & (1 << i)))

test.each(selections.map(fields => [fields.join(',') || 'none', fields]))('validates and supplies a distinct clue for %s', (_label, fields) => {
  const valid = fields.length > 0 && !['name', 'symbol', 'number'].every(field => fields.includes(field))
  expect(validAnswerFields(fields)).toBe(valid)
  expect(validSettings({ ...normalizeSettings(), answerFields: fields }, 'questions')).toBe(valid)
  if (valid) {
    expect(['name', 'symbol', 'number']).toContain(clueField(fields))
    expect(fields).not.toContain(clueField(fields))
    const element = elements[7]
    expect(gradeElementAnswers(element, fields, element, 'en').correct).toBe(true)
  }
})

test('clues prefer names, then symbols, then atomic numbers', () => {
  expect(clueField(defaultAnswerFields)).toBe('name')
  expect(clueField(['name', 'family'])).toBe('symbol')
  expect(clueField(['name', 'symbol'])).toBe('number')
})

test('grading trims text, accepts localized name variants and symbol casing, and compares numbers numerically', () => {
  expect(gradeElementAnswers(elements[12], ['name', 'symbol', 'family'], {
    name: ' ALUMINUM ', symbol: ' al ', family: 'post-transition',
  }, 'en')).toEqual({ correct: true, fields: { name: true, symbol: true, family: true } })
  expect(gradeElementAnswers(elements[54], ['name', 'number'], { name: ' CÄSIUM ', number: '055' }, 'de').correct).toBe(true)
  expect(gradeElementAnswers(elements[0], ['name'], { name: 'Hydrogen' }, 'de').correct).toBe(false)
  expect(gradeElementAnswers(elements[0], defaultAnswerFields, { symbol: 'H', number: '2', family: 'noble' }, 'en'))
    .toEqual({ correct: false, fields: { symbol: true, number: false, family: false } })
})

test.each(['', ' ', '0', '119', '-1', '1.5', '1e1'])('invalid atomic number %s is not a graded attempt', number => {
  const round = createRound({ count: 1 }, () => 0.999999)
  expect(roundReducer(round, { type: 'submit', number: 1, language: 'en', answers: { symbol: 'H', number, family: 'nonmetal' } })).toBe(round)
})

test('partial submissions do not lose points and retries preserve the penalty for the whole element', () => {
  let round = createRound({ count: 1 }, () => 0.999999)
  expect(roundReducer(round, { type: 'submit', number: 1, language: 'en', answers: { symbol: 'H' } })).toBe(round)
  round = roundReducer(round, { type: 'submit', number: 1, language: 'en', answers: { symbol: 'H', number: '1', family: 'noble' } })
  expect(round.fieldResults).toEqual({ symbol: true, number: true, family: false })
  expect(round.queue).toEqual([1])
  round = roundReducer(round, { type: 'submit', number: 1, language: 'en', answers: { symbol: 'H', number: '1', family: 'nonmetal' } })
  expect(round.found).toEqual({ 1: false })
  expect(round.reviewing).toBe(true)
  round = roundReducer(round, { type: 'next' })
  expect(round.queue).toEqual([])
})

test('legacy and invalid answer-field preferences default safely; valid preferences survive other modes', () => {
  for (const answerFields of [undefined, [], ['name', 'symbol', 'number'], ['invalid']]) {
    expect(normalizeSettings({ answerFields }).answerFields).toEqual(defaultAnswerFields)
  }
  expect(normalizeSettings({ answerFields: ['family', 'name'] }).answerFields).toEqual(['name', 'family'])
  expect(validSettings({ ...normalizeSettings(), answerFields: [] }, 'find')).toBe(true)
})

test('first-try feedback retires incorrect elements only after Next and cannot be submitted twice', () => {
  let round = createRound({ count: 1, questionFeedback: 'first' }, () => 0.999999)
  const action = { type: 'submit', number: 1, language: 'en', answers: { symbol: 'He', number: '2', family: 'noble' } }
  round = roundReducer(round, action)
  expect(round.reviewing).toBe(true)
  expect(round.fieldResults).toEqual({ symbol: false, number: false, family: false })
  expect(round.submittedAnswers).toEqual(action.answers)
  expect(round.found).toEqual({ 1: false })
  expect(round.queue).toEqual([1])
  expect(roundReducer(round, action)).toBe(round)
  expect(roundReducer(round, { type: 'skip' })).toBe(round)
  round = roundReducer(round, { type: 'next' })
  expect(round.queue).toEqual([])
  expect(round.reviewing).toBe(false)
})

test('retrying preserves locked correct fields across attempted edits and language switches', () => {
  let round = createRound({ count: 1, answerFields: ['name', 'family'] }, () => 0.999999)
  round = roundReducer(round, { type: 'submit', number: 1, language: 'en', answers: { name: 'Hydrogen', family: 'noble' } })
  expect(round.fieldResults).toEqual({ name: true, family: false })
  round = roundReducer(round, { type: 'submit', number: 1, language: 'de', answers: { name: 'Incorrect edit', family: 'nonmetal' } })
  expect(round.fieldResults).toEqual({ name: true, family: true })
  expect(round.submittedAnswers.name).toBe('Hydrogen')
  expect(round.found).toEqual({ 1: false })
  expect(round.reviewing).toBe(true)
})

test('old automatic-skip preferences migrate to first-try feedback without changing table settings', () => {
  expect(normalizeSettings({ wrongAnswer: 'skip' })).toMatchObject({ wrongAnswer: 'skip', questionFeedback: 'first' })
  expect(normalizeSettings({ wrongAnswer: 'skip', questionFeedback: 'retry' }).questionFeedback).toBe('retry')
  expect(normalizeSettings().questionFeedback).toBe('retry')
})
