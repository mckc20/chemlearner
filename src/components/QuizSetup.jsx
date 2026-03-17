import { useState } from 'react'

const QUIZ_TYPES = [
  { id: 'formula-from-name', label: 'Formula from Name', description: 'See a compound name, pick the correct formula', needsCompounds: true },
  { id: 'name-from-formula', label: 'Name from Formula', description: 'See a formula, pick the correct name', needsCompounds: true },
  { id: 'name-from-structure', label: 'Name from Structure', description: 'See a 2D structure, pick the correct name', needsCompounds: true },
  { id: 'structure-from-name', label: 'Structure from Name', description: 'See a compound name, pick the correct 2D structure', needsCompounds: true },
  { id: 'category-from-structure', label: 'Category from Structure', description: 'See a 2D structure, pick the correct category', needsCompounds: true },
  { id: 'general-knowledge', label: 'General Knowledge', description: 'Answer trivia questions about selected compounds', needsCompounds: false },
]

export default function QuizSetup({ quizCompounds, allCompounds, availableGKCount, onStart, onCancel }) {
  const [quizType, setQuizType] = useState('formula-from-name')
  const [questionCount, setQuestionCount] = useState(null) // null = use max

  const selected = QUIZ_TYPES.find(t => t.id === quizType)
  const isGK = quizType === 'general-knowledge'
  const compoundLimit = quizCompounds.length
  const maxQuestions = isGK
    ? Math.min(10, availableGKCount)
    : Math.min(10, compoundLimit)
  const isLimitedBySelection = !isGK && compoundLimit < 10

  const effectiveCount = questionCount == null
    ? maxQuestions
    : Math.min(questionCount, maxQuestions)

  function handleTypeChange(id) {
    setQuizType(id)
    // Reset count so it re-clamps to new max
    setQuestionCount(null)
  }

  function handleStart() {
    onStart({ quizType, questionCount: effectiveCount })
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Quiz Setup</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {quizCompounds.length} compound{quizCompounds.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Quiz type selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUIZ_TYPES.map(type => {
            const isGKType = type.id === 'general-knowledge'
            const disabled = isGKType && availableGKCount === 0
            return (
              <button
                key={type.id}
                onClick={() => !disabled && handleTypeChange(type.id)}
                disabled={disabled}
                className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  quizType === type.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500'
                    : disabled
                      ? 'border-gray-200 dark:border-gray-700 opacity-40 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                }`}
              >
                <p className="font-medium">{type.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{type.description}</p>
                {disabled && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">No questions available for selected compounds</p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Question count slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Number of Questions: <span className="text-blue-600 dark:text-blue-400">{effectiveCount}</span>
          {isLimitedBySelection && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-normal"> (only {compoundLimit} compound{compoundLimit !== 1 ? 's' : ''} selected)</span>
          )}
        </label>
        <input
          type="range"
          min={1}
          max={maxQuestions}
          value={effectiveCount}
          onChange={e => setQuestionCount(Number(e.target.value))}
          className="w-full accent-blue-600"
          disabled={maxQuestions <= 1}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>1</span>
          <span>{maxQuestions}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleStart}
          disabled={maxQuestions === 0}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          Start Quiz
        </button>
      </div>
    </div>
  )
}
