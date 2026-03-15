import { useState, useMemo } from 'react'
import QuizQuestion from './QuizQuestion'
import QuizResults from './QuizResults'

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuiz(quizMolecules, allMolecules) {
  const shuffled = shuffle(quizMolecules)

  return shuffled.map(mol => {
    // Decide question type
    // Check if this molecule's formula is unique among quiz molecules
    const formulaDupes = quizMolecules.filter(m => m.formula === mol.formula)
    let type = Math.random() < 0.5 ? 'name' : 'formula'

    // If formula is not unique among selected molecules, force name type
    if (type === 'formula' && formulaDupes.length > 1) {
      type = 'name'
    }

    // Build distractors from full library (excluding the correct molecule)
    const others = allMolecules.filter(m => m.id !== mol.id)
    const correctValue = type === 'name' ? mol.name : mol.formula

    // Get unique distractor values
    const distractorPool = shuffle(others)
      .map(m => type === 'name' ? m.name : m.formula)
      .filter(v => v !== correctValue)
    const uniqueDistractors = [...new Set(distractorPool)]

    // Take up to 3 distractors (fewer if library is small)
    const numDistractors = Math.min(3, uniqueDistractors.length)
    const distractors = uniqueDistractors.slice(0, numDistractors)

    // Combine correct answer with distractors and shuffle
    const allOptions = [correctValue, ...distractors]
    const shuffledOptions = shuffle(allOptions)
    const correctIndex = shuffledOptions.indexOf(correctValue)

    return {
      moleculeId: mol.id,
      moleculeName: mol.name,
      moleculeFormula: mol.formula,
      type,
      options: shuffledOptions,
      correctIndex,
    }
  })
}

export default function QuizMode({ quizMolecules, allMolecules, onExit, onSave }) {
  const questions = useMemo(
    () => buildQuiz(quizMolecules, allMolecules),
    // Only build once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [phase, setPhase] = useState('question') // 'question' | 'feedback' | 'results'

  function handleAnswer(answerIndex) {
    setAnswers(prev => [...prev, answerIndex])
    setPhase('feedback')
  }

  function handleNext() {
    const nextIndex = currentIndex + 1
    if (nextIndex >= questions.length) {
      // Quiz complete — save result
      const finalAnswers = [...answers]
      const score = finalAnswers.filter((a, i) => a === questions[i].correctIndex).length
      onSave({
        score,
        total: questions.length,
        questions: questions.map((q, i) => ({
          ...q,
          userAnswer: finalAnswers[i] ?? null,
        })),
      })
      setPhase('results')
    } else {
      setCurrentIndex(nextIndex)
      setPhase('question')
    }
  }

  function handleRetry() {
    onExit('retry', quizMolecules)
  }

  function handlePracticeMistakes() {
    const mistakeIds = questions
      .filter((q, i) => answers[i] !== q.correctIndex)
      .map(q => q.moleculeId)
    const mistakeMolecules = quizMolecules.filter(m => mistakeIds.includes(m.id))
    onExit('practice', mistakeMolecules)
  }

  if (phase === 'results') {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-center">Quiz Complete</h2>
        <QuizResults
          questions={questions}
          answers={answers}
          onExit={() => onExit('exit')}
          onRetry={handleRetry}
          onPracticeMistakes={handlePracticeMistakes}
        />
      </div>
    )
  }

  const question = questions[currentIndex]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <button
          onClick={() => onExit('exit')}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Exit Quiz
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <QuizQuestion
        key={currentIndex}
        question={question}
        onAnswer={handleAnswer}
        userAnswer={answers[currentIndex]}
        phase={phase}
        onNext={handleNext}
      />
    </div>
  )
}
