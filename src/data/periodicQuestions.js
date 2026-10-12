import { matchesElementName } from './periodicElements'

export const answerFields = ['symbol', 'name', 'number', 'family']
export const defaultAnswerFields = ['symbol', 'number', 'family']
const identifyingFields = ['name', 'symbol', 'number']

export function validAnswerFields(fields) {
  return Array.isArray(fields) && fields.length > 0
    && fields.every(field => answerFields.includes(field))
    && identifyingFields.some(field => !fields.includes(field))
}

export function clueField(fields) {
  return identifyingFields.find(field => !fields.includes(field))
}

// Incomplete or malformed submissions are not attempts and cannot lose points.
export function gradeElementAnswers(element, fields, answers, language) {
  if (!validAnswerFields(fields) || fields.some(field => !String(answers?.[field] ?? '').trim())) return null
  if (fields.includes('number') && (!/^\d+$/.test(String(answers.number).trim())
    || Number(answers.number) < 1 || Number(answers.number) > 118)) return null
  const results = Object.fromEntries(fields.map(field => {
    const value = String(answers[field]).trim()
    if (field === 'name') return [field, matchesElementName(value, element, language)]
    if (field === 'symbol') return [field, value.toLowerCase() === element.symbol.toLowerCase()]
    if (field === 'number') return [field, Number(value) === element.number]
    return [field, value === element.family]
  }))
  return { fields: results, correct: Object.values(results).every(Boolean) }
}
