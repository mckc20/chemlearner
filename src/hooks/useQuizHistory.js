import { useState, useEffect } from 'react'

const STORAGE_KEY = 'chemlearner_quiz_history'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveToStorage(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // ignore quota errors
  }
}

export function useQuizHistory() {
  const [history, setHistory] = useState(() => {
    return loadFromStorage() ?? []
  })

  useEffect(() => {
    saveToStorage(history)
  }, [history])

  function saveQuiz(result) {
    const quiz = {
      ...result,
      id: `quiz-${Date.now()}`,
      date: new Date().toISOString(),
    }
    setHistory(prev => [quiz, ...prev])
    return quiz
  }

  function deleteQuiz(id) {
    setHistory(prev => prev.filter(q => q.id !== id))
  }

  function clearHistory() {
    setHistory([])
  }

  return { history, saveQuiz, deleteQuiz, clearHistory }
}
