import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'
import FormulaDisplay from './FormulaDisplay'

export default function QuizHistory({ history, onDeleteQuiz, onRetry, onPracticeMistakes, allCompounds }) {
  const { language } = useLanguage()
  const [expandedId, setExpandedId] = useState(null)

  const dateLocale = language === 'de' ? 'de-DE' : 'en-US'

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium">{t(language, 'history.noHistory')}</p>
        <p className="text-sm mt-1">{t(language, 'history.noHistoryDetail')}</p>
      </div>
    )
  }

  function handleRetry(quiz) {
    // Find compounds that still exist in the library
    const compoundIds = quiz.questions.map(q => q.compoundId)
    const available = allCompounds.filter(m => compoundIds.includes(m.id))
    if (available.length < 2) {
      alert(t(language, 'history.notEnoughCompounds'))
      return
    }
    onRetry(available)
  }

  function handlePracticeMistakes(quiz) {
    const mistakeIds = quiz.questions
      .filter(q => q.userAnswer !== q.correctIndex)
      .map(q => q.compoundId)
    const available = allCompounds.filter(m => mistakeIds.includes(m.id))
    if (available.length === 0) return
    if (available.length < 2) {
      // Single mistake compound — still allow, distractors come from full library
      onPracticeMistakes(available)
      return
    }
    onPracticeMistakes(available)
  }

  function quizTypeLabel(type) {
    return t(language, `quizType.${type}`) || type
  }

  return (
    <div className="space-y-3">
      {history.map(quiz => {
        const pct = Math.round((quiz.score / quiz.total) * 100)
        const isExpanded = expandedId === quiz.id
        const mistakes = quiz.questions.filter(q => q.userAnswer !== q.correctIndex)

        let colorClass = 'text-red-600 dark:text-red-400'
        if (pct >= 80) colorClass = 'text-green-600 dark:text-green-400'
        else if (pct >= 50) colorClass = 'text-amber-600 dark:text-amber-400'

        return (
          <div
            key={quiz.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Summary row */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : quiz.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <span className={`text-lg font-bold ${colorClass}`}>
                  {quiz.score}/{quiz.total}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {new Date(quiz.date).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {quiz.total} {t(language, 'history.questions')} · {pct}%{quiz.quizType ? ` · ${quizTypeLabel(quiz.quizType)}` : ''}
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{isExpanded ? '\u25B2' : '\u25BC'}</span>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3">
                {/* Per-question breakdown */}
                <div className="space-y-1.5">
                  {quiz.questions.map((q, i) => {
                    const correct = q.userAnswer === q.correctIndex
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {correct ? '\u2713' : '\u2717'}
                        </span>
                        <span className="font-medium">
                          {q.type === 'general-knowledge' ? (q.prompt || q.compoundName) : q.compoundName}
                        </span>
                        <span className="text-gray-400">\u00B7</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {quizTypeLabel(q.type)}
                        </span>
                        {!correct && q.userAnswer != null && (
                          <>
                            <span className="text-gray-400">\u00B7</span>
                            <span className="text-red-500 dark:text-red-400 text-xs">
                              {t(language, 'history.answered')} {q.type === 'formula' ? (
                                <FormulaDisplay formula={q.options[q.userAnswer]} />
                              ) : q.options[q.userAnswer]}
                            </span>
                            <span className="text-green-500 dark:text-green-400 text-xs">
                              {t(language, 'history.correct')} {q.type === 'formula' ? (
                                <FormulaDisplay formula={q.options[q.correctIndex]} />
                              ) : q.options[q.correctIndex]}
                            </span>
                          </>
                        )}
                        {q.userAnswer == null && (
                          <>
                            <span className="text-gray-400">\u00B7</span>
                            <span className="text-gray-500 text-xs">{t(language, 'history.skipped')}</span>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleRetry(quiz)}
                    className="text-xs px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t(language, 'history.retry')}
                  </button>
                  <button
                    onClick={() => handlePracticeMistakes(quiz)}
                    disabled={mistakes.length === 0}
                    className="text-xs px-3 py-1.5 rounded border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {t(language, 'history.practiceMistakes', { count: mistakes.length })}
                  </button>
                  <button
                    onClick={() => onDeleteQuiz(quiz.id)}
                    className="text-xs px-3 py-1.5 rounded border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {t(language, 'history.delete')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
