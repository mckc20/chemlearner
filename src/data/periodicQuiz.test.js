import { afterEach, expect, test, vi } from 'vitest'
import { elements, families } from './periodicElements'
import { createRound, normalizeSettings, QUIZ_SETTINGS_KEY, readSettings, roundReducer, saveSettings } from './periodicQuiz'

const orderedRound = config => createRound(config, () => 0.999999)
const guess = (round, number) => roundReducer(round, { type: 'guess', number })
const skip = round => roundReducer(round, { type: 'skip' })

afterEach(() => {
  localStorage.removeItem(QUIZ_SETTINGS_KEY)
  vi.restoreAllMocks()
})

test('default round contains all 118 distinct elements and custom rounds obey family filters', () => {
  const all = createRound()
  expect(all.included).toHaveLength(118)
  expect(new Set(all.included).size).toBe(118)
  const subset = createRound({ families: ['lanthanoid', 'actinoid'], count: 10 })
  expect(subset.included).toHaveLength(10)
  expect(new Set(subset.included).size).toBe(10)
  expect(subset.included.every(number => ['lanthanoid', 'actinoid'].includes(elements[number - 1].family))).toBe(true)
  expect(createRound({ families: ['noble'], count: 99 }).included).toHaveLength(7)
})

test('skips rotate the queue without a penalty; wrong guesses penalize only the requested element once', () => {
  let round = orderedRound({ count: 3 })
  round = skip(round)
  expect(round.queue).toEqual([2, 3, 1])
  round = guess(round, 3)
  round = guess(round, 1)
  expect(round.queue).toEqual([2, 3, 1])
  expect(round.mistakes).toEqual([2])
  expect(round.wrongCells).toEqual([3, 1])
  round = skip(round)
  expect(round.wrongCells).toEqual([])
  round = guess(round, 3)
  round = guess(round, 1)
  round = guess(round, 2)
  expect(round.queue).toEqual([])
  expect(round.found).toEqual({ 1: true, 2: false, 3: true })
  expect(guess(round, 2)).toBe(round)
  expect(skip(round)).toBe(round)
})

test('auto-skip cycles mistakes to the back and preserves penalties across manual skips', () => {
  let round = orderedRound({ count: 3, wrongAnswer: 'skip' })
  round = guess(round, 2)
  expect(round.queue).toEqual([2, 3, 1])
  expect(round.wrongCells).toEqual([])
  round = skip(round)
  round = guess(round, 3)
  round = skip(round)
  round = guess(round, 2)
  round = guess(round, 1)
  expect(round.found).toEqual({ 1: false, 2: true, 3: true })
})

test('excluded and already found cells cannot change the round', () => {
  let round = orderedRound({ count: 2 })
  expect(guess(round, 3)).toBe(round)
  round = guess(round, 1)
  expect(guess(round, 1)).toBe(round)
  expect(skip(round).queue).toEqual([2])
})

test('all 118 can be completed including both detached rows', () => {
  let round = createRound()
  for (const number of [...round.queue]) round = guess(round, number)
  expect(round.queue).toEqual([])
  expect(Object.values(round.found).filter(Boolean)).toHaveLength(118)
})

test('preferences round-trip and invalid or unavailable storage safely uses defaults', () => {
  saveSettings({ families: ['noble'], count: 3, wrongAnswer: 'skip' })
  expect(readSettings()).toEqual(normalizeSettings({ families: ['noble'], count: 3, wrongAnswer: 'skip' }))
  localStorage.setItem(QUIZ_SETTINGS_KEY, '{broken')
  expect(readSettings()).toEqual(normalizeSettings({ families, count: 'all', wrongAnswer: 'retry' }))
  expect(normalizeSettings({ families: ['invalid'], count: -2 })).toEqual(normalizeSettings())
  const storage = Object.getPrototypeOf(localStorage)
  vi.spyOn(storage, 'getItem').mockImplementation(() => { throw new Error('unavailable') })
  vi.spyOn(storage, 'setItem').mockImplementation(() => { throw new Error('unavailable') })
  expect(readSettings()).toEqual(normalizeSettings())
  expect(() => saveSettings(normalizeSettings())).not.toThrow()
})
