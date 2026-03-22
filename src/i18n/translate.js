import uiEn from './ui.en'
import uiDe from './ui.de'
import { CATEGORIES_DE } from './categories.de'
import { COMPOUNDS_DE } from './compounds.de'
import { COMPOUND_FACTS_DE } from './compoundFacts.de'
import { QUIZ_QUESTIONS_DE } from './quizQuestions.de'
import { COMPOUND_FACTS } from '../data/compoundFacts'

const uiStrings = { en: uiEn, de: uiDe }

/**
 * Translate a UI string key, with optional parameter interpolation.
 * t(lang, 'quiz.questionOf', { current: 1, total: 10 })
 */
export function t(lang, key, params = {}) {
  const str = uiStrings[lang]?.[key] ?? uiStrings.en[key] ?? key
  if (!params || Object.keys(params).length === 0) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '')
}

/**
 * Translate with singular/plural support.
 * Uses key for singular and key + 'Plural' for plural.
 * tp(lang, 'list.compoundCount', 5) → "5 compounds"
 */
export function tp(lang, key, count, params = {}) {
  const pluralKey = key + 'Plural'
  const selectedKey = count === 1 ? key : pluralKey
  const str = uiStrings[lang]?.[selectedKey] ?? uiStrings[lang]?.[key] ?? uiStrings.en[selectedKey] ?? uiStrings.en[key] ?? key
  const allParams = { count, ...params }
  return str.replace(/\{(\w+)\}/g, (_, k) => allParams[k] ?? '')
}

/**
 * Translate a category name.
 */
export function translateCategory(lang, category) {
  if (lang === 'en' || !category) return category
  return CATEGORIES_DE[category] ?? category
}

/**
 * Translate a single compound (overlay approach — does not mutate original).
 */
export function translateCompound(lang, compound) {
  if (lang === 'en' || !compound?.id) return compound
  const de = COMPOUNDS_DE[compound.id]
  if (!de) return compound
  return {
    ...compound,
    name: de.name ?? compound.name,
    information: de.information ?? compound.information,
    category: CATEGORIES_DE[compound.category] ?? compound.category,
    wikipediaUrl: de.wikipediaUrl ?? compound.wikipediaUrl,
  }
}

/**
 * Translate an array of compounds.
 */
export function translateCompounds(lang, compounds) {
  if (lang === 'en') return compounds
  return compounds.map(c => translateCompound(lang, c))
}

/**
 * Get translated facts for a compound.
 */
export function getTranslatedFacts(lang, compoundId) {
  if (lang === 'en') return COMPOUND_FACTS[compoundId] ?? []
  return COMPOUND_FACTS_DE[compoundId] ?? COMPOUND_FACTS[compoundId] ?? []
}

/**
 * Translate a general-knowledge quiz question.
 */
export function translateQuestion(lang, question) {
  if (lang === 'en' || !question?.id) return question
  const de = QUIZ_QUESTIONS_DE[question.id]
  if (!de) return question
  return {
    ...question,
    question: de.question ?? question.question,
    options: de.options ?? question.options,
  }
}
