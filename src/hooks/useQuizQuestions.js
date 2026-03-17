import { useState, useCallback } from 'react'
import { DEFAULT_QUIZ_QUESTIONS } from '../data/defaultQuizQuestions.js'

const STORAGE_KEY = 'chemlearner_quiz_questions'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveToStorage(questions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
  } catch {
    // ignore quota errors
  }
}

export function useQuizQuestions() {
  const [questions, setQuestions] = useState(() => {
    const stored = loadFromStorage()
    return stored ?? DEFAULT_QUIZ_QUESTIONS
  })

  const getQuestionsForCompound = useCallback((compoundId) => {
    return questions.filter(q => q.compoundId === compoundId)
  }, [questions])

  const getQuestionsForCompounds = useCallback((compoundIds) => {
    const idSet = new Set(compoundIds)
    return questions.filter(q => idSet.has(q.compoundId))
  }, [questions])

  return { questions, getQuestionsForCompound, getQuestionsForCompounds }
}
