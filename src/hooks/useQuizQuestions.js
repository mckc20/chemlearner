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

  const getQuestionsForMolecule = useCallback((moleculeId) => {
    return questions.filter(q => q.moleculeId === moleculeId)
  }, [questions])

  const getQuestionsForMolecules = useCallback((moleculeIds) => {
    const idSet = new Set(moleculeIds)
    return questions.filter(q => idSet.has(q.moleculeId))
  }, [questions])

  return { questions, getQuestionsForMolecule, getQuestionsForMolecules }
}
