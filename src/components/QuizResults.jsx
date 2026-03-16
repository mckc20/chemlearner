const TYPE_LABELS = {
  'formula-from-name': 'Identify formula',
  'name-from-formula': 'Identify name',
  'name-from-structure': 'Identify name from structure',
  'category-from-structure': 'Identify category from structure',
  'structure-from-name': 'Identify structure',
  'general-knowledge': 'General knowledge',
  // legacy types
  'name': 'Identify name',
  'formula': 'Identify formula',
}

function typeLabel(type) {
  return TYPE_LABELS[type] || type
}

export default function QuizResults({ questions, answers, onExit, onRetry, onPracticeMistakes }) {
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length
  const total = questions.length
  const pct = Math.round((score / total) * 100)

  const mistakes = questions.filter((q, i) => answers[i] !== q.correctIndex)

  let colorClass = 'text-red-600 dark:text-red-400'
  if (pct >= 80) colorClass = 'text-green-600 dark:text-green-400'
  else if (pct >= 50) colorClass = 'text-amber-600 dark:text-amber-400'

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="text-center space-y-1">
        <p className={`text-4xl font-bold ${colorClass}`}>{score}/{total}</p>
        <p className={`text-lg font-medium ${colorClass}`}>{pct}%</p>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-2">
        {questions.map((q, i) => {
          const correct = answers[i] === q.correctIndex
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${
                correct
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <span className={`text-lg ${correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {correct ? '✓' : '✗'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {q.type === 'general-knowledge' ? q.prompt : q.moleculeName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {typeLabel(q.type)}
                  {!correct && answers[i] != null && (
                    <> — Your answer: {typeof q.options[answers[i]] === 'string' ? q.options[answers[i]] : q.options[answers[i]]?.name}</>
                  )}
                  {answers[i] == null && ' — Skipped'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
        >
          Back to Library
        </button>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          Retry
        </button>
        <button
          onClick={onPracticeMistakes}
          disabled={mistakes.length === 0}
          className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          Practice Mistakes ({mistakes.length})
        </button>
      </div>
    </div>
  )
}
