import { useEffect, useState } from 'react'
import { smilesToSvg } from '../services/rdkit'
import { resolveCompound } from '../services/pubchem'
import FormulaDisplay from './FormulaDisplay'

const TEXT_ONLY_TYPES = ['formula-from-name', 'name-from-formula', 'general-knowledge']
const STRUCTURE_PROMPT_TYPES = ['name-from-structure', 'category-from-structure']

function MiniStructure({ formula, smiles, size = 200, selected, correct, wrong, disabled, onClick }) {
  const [status, setStatus] = useState('loading')
  const [svg, setSvg] = useState(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    async function resolve() {
      try {
        let smi = smiles
        if (!smi) {
          const result = await resolveCompound(formula)
          smi = result.smiles
        }
        const svgMarkup = await smilesToSvg(smi, size, size)
        if (cancelled) return
        setSvg(svgMarkup)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    resolve()
    return () => { cancelled = true }
  }, [formula, smiles, size])

  let borderClass = 'border-gray-200 dark:border-gray-700'
  if (correct) borderClass = 'border-green-500 ring-1 ring-green-500'
  else if (wrong) borderClass = 'border-red-500 ring-1 ring-red-500'
  else if (selected) borderClass = 'border-blue-500'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-lg border-2 ${borderClass} overflow-hidden bg-white transition-colors ${
        disabled ? '' : 'hover:border-blue-400 cursor-pointer'
      }`}
      style={{ width: size, height: size }}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
          Error
        </div>
      )}
      {status === 'ready' && svg && (
        <div
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </button>
  )
}

export default function QuizQuestion({ question, onAnswer, userAnswer, phase, onNext }) {
  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [svg, setSvg] = useState(null)

  const isTextOnly = TEXT_ONLY_TYPES.includes(question.type)
  const isStructurePrompt = STRUCTURE_PROMPT_TYPES.includes(question.type)
  const isStructureOptions = question.type === 'structure-from-name'

  // Resolve compound SMILES → RDKit 2D SVG (only for structure-prompt types)
  useEffect(() => {
    if (!isStructurePrompt) {
      setStatus('ready')
      return
    }
    let cancelled = false
    setStatus('loading')
    setErrorMsg('')
    setSvg(null)

    async function resolve() {
      try {
        let smi = question.compoundSmiles
        if (!smi) {
          const result = await resolveCompound(question.compoundFormula)
          smi = result.smiles
        }
        const svgMarkup = await smilesToSvg(smi, 400, 400)
        if (cancelled) return
        setSvg(svgMarkup)
        setStatus('ready')
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message)
          setStatus('error')
        }
      }
    }

    resolve()
    return () => { cancelled = true }
  }, [question.compoundFormula, question.compoundSmiles, isStructurePrompt])

  function getButtonClass(index) {
    const base = 'w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors'
    if (phase === 'question') {
      return `${base} border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer`
    }
    // feedback phase
    if (index === question.correctIndex) {
      return `${base} border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300`
    }
    if (index === userAnswer && index !== question.correctIndex) {
      return `${base} border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300`
    }
    return `${base} border-gray-200 dark:border-gray-700 opacity-50`
  }

  // Build prompt text
  let promptText = ''
  if (question.type === 'formula-from-name') {
    promptText = `What is the formula of ${question.prompt}?`
  } else if (question.type === 'name-from-formula') {
    promptText = null // rendered with FormulaDisplay below
  } else if (question.type === 'name-from-structure') {
    promptText = 'What is the name of this compound?'
  } else if (question.type === 'category-from-structure') {
    promptText = 'What category does this compound belong to?'
  } else if (question.type === 'structure-from-name') {
    promptText = `Which structure is ${question.prompt}?`
  } else if (question.type === 'general-knowledge') {
    promptText = question.prompt
  }

  const showFormulaOptions = question.type === 'formula-from-name'

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div className="text-lg font-medium text-center">
        {question.type === 'name-from-formula' ? (
          <p>What is the name of <span className="text-blue-600 dark:text-blue-400"><FormulaDisplay formula={question.prompt} /></span>?</p>
        ) : (
          <p>{promptText}</p>
        )}
      </div>

      {/* 2D Structure SVG (for structure-prompt types) */}
      {isStructurePrompt && (
        <div className="relative w-full h-64 sm:h-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white overflow-hidden flex items-center justify-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
              Loading compound…
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Could not load structure</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{errorMsg}</p>
              <button
                onClick={() => onAnswer(null)}
                className="mt-2 text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Skip
              </button>
            </div>
          )}
          {status === 'ready' && svg && (
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>
      )}

      {/* Text options (all types except structure-from-name) */}
      {!isStructureOptions && status !== 'error' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              disabled={phase === 'feedback'}
              onClick={() => onAnswer(index)}
              className={getButtonClass(index)}
            >
              {showFormulaOptions ? (
                <FormulaDisplay formula={option} />
              ) : (
                option
              )}
            </button>
          ))}
        </div>
      )}

      {/* Structure options (structure-from-name) */}
      {isStructureOptions && (
        <div className="grid grid-cols-2 gap-3 justify-items-center">
          {question.options.map((optMol, index) => (
            <MiniStructure
              key={optMol.id}
              formula={optMol.formula}
              smiles={optMol.smiles}
              size={200}
              selected={userAnswer === index && phase === 'question'}
              correct={phase === 'feedback' && index === question.correctIndex}
              wrong={phase === 'feedback' && index === userAnswer && index !== question.correctIndex}
              disabled={phase === 'feedback'}
              onClick={() => onAnswer(index)}
            />
          ))}
        </div>
      )}

      {/* Next button in feedback phase */}
      {phase === 'feedback' && (
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
