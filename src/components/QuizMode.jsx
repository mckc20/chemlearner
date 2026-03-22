import { useState, useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { t, translateQuestion } from '../i18n/translate'
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

function pickDistractors(pool, correct, count = 3) {
  const unique = [...new Set(shuffle(pool).filter(v => v !== correct))]
  return unique.slice(0, count)
}

function buildQuiz(quizCompounds, allCompounds, quizConfig, getQuestionsForCompounds, language) {
  const { quizType, questionCount } = quizConfig

  if (quizType === 'general-knowledge') {
    const gkQuestions = getQuestionsForCompounds(quizCompounds.map(m => m.id))
    const selected = shuffle(gkQuestions).slice(0, questionCount)
    const molMap = Object.fromEntries(quizCompounds.map(m => [m.id, m]))
    return selected.map(gk => {
      const translated = translateQuestion(language, gk)
      return {
        type: 'general-knowledge',
        compoundId: gk.compoundId,
        compoundName: molMap[gk.compoundId]?.name ?? '',
        prompt: translated.question,
        options: translated.options,
        correctIndex: gk.correctIndex,
      }
    })
  }

  // If questionCount exceeds available compounds, repeat compounds
  let pool = shuffle(quizCompounds)
  while (pool.length < questionCount) {
    pool = [...pool, ...shuffle(quizCompounds)]
  }
  const shuffled = pool.slice(0, questionCount)

  return shuffled.map(mol => {
    if (quizType === 'formula-from-name') {
      const correct = mol.formula
      const pool = allCompounds.filter(m => m.id !== mol.id).map(m => m.formula)
      const distractors = pickDistractors(pool, correct)
      const options = shuffle([correct, ...distractors])
      return {
        type: 'formula-from-name',
        compoundId: mol.id,
        compoundName: mol.name,
        compoundFormula: mol.formula,
        prompt: mol.name,
        options,
        correctIndex: options.indexOf(correct),
      }
    }

    if (quizType === 'name-from-formula') {
      const correct = mol.name
      const pool = allCompounds.filter(m => m.id !== mol.id).map(m => m.name)
      const distractors = pickDistractors(pool, correct)
      const options = shuffle([correct, ...distractors])
      return {
        type: 'name-from-formula',
        compoundId: mol.id,
        compoundName: mol.name,
        compoundFormula: mol.formula,
        prompt: mol.formula,
        options,
        correctIndex: options.indexOf(correct),
      }
    }

    if (quizType === 'name-from-structure') {
      const correct = mol.name
      const pool = allCompounds.filter(m => m.id !== mol.id).map(m => m.name)
      const distractors = pickDistractors(pool, correct)
      const options = shuffle([correct, ...distractors])
      return {
        type: 'name-from-structure',
        compoundId: mol.id,
        compoundName: mol.name,
        compoundFormula: mol.formula,
        compoundSmiles: mol.smiles,
        prompt: null, // 3D viewer is the prompt
        options,
        correctIndex: options.indexOf(correct),
      }
    }

    if (quizType === 'structure-from-name') {
      const others = shuffle(allCompounds.filter(m => m.id !== mol.id)).slice(0, 3)
      const optionMols = shuffle([mol, ...others])
      return {
        type: 'structure-from-name',
        compoundId: mol.id,
        compoundName: mol.name,
        compoundFormula: mol.formula,
        prompt: mol.name,
        options: optionMols.map(m => ({ id: m.id, name: m.name, formula: m.formula, smiles: m.smiles })),
        correctIndex: optionMols.findIndex(m => m.id === mol.id),
      }
    }

    if (quizType === 'category-from-structure') {
      const correct = mol.category || 'Unknown'
      const allCategories = [...new Set(allCompounds.map(m => m.category || 'Unknown'))]
      const distractors = pickDistractors(allCategories, correct)
      const options = shuffle([correct, ...distractors])
      return {
        type: 'category-from-structure',
        compoundId: mol.id,
        compoundName: mol.name,
        compoundFormula: mol.formula,
        compoundSmiles: mol.smiles,
        prompt: null, // 3D viewer is the prompt
        options,
        correctIndex: options.indexOf(correct),
      }
    }

    // fallback (shouldn't reach)
    return null
  }).filter(Boolean)
}

export default function QuizMode({ quizCompounds, allCompounds, quizConfig, getQuestionsForCompounds, onExit, onSave }) {
  const { language } = useLanguage()

  const questions = useMemo(
    () => buildQuiz(quizCompounds, allCompounds, quizConfig, getQuestionsForCompounds, language),
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
        quizType: quizConfig.quizType,
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
    onExit('retry', quizCompounds)
  }

  function handlePracticeMistakes() {
    const mistakeIds = questions
      .filter((q, i) => answers[i] !== q.correctIndex)
      .map(q => q.compoundId)
    const mistakeCompounds = quizCompounds.filter(m => mistakeIds.includes(m.id))
    onExit('practice', mistakeCompounds.length > 0 ? mistakeCompounds : quizCompounds)
  }

  if (phase === 'results') {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-center">{t(language, 'quiz.complete')}</h2>
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
          {t(language, 'quiz.questionOf', { current: currentIndex + 1, total: questions.length })}
        </h2>
        <button
          onClick={() => onExit('exit')}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {t(language, 'quiz.exitQuiz')}
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
