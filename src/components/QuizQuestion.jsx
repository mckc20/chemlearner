import { useEffect, useRef, useState } from 'react'
import { resolveMolecule } from '../services/pubchem'
import FormulaDisplay from './FormulaDisplay'

export default function QuizQuestion({ question, onAnswer, userAnswer, phase, onNext }) {
  const viewerRef = useRef(null)
  const viewerInstanceRef = useRef(null)
  const molblockRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')

  // Resolve molecule formula → SDF molblock
  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setErrorMsg('')
    molblockRef.current = null

    async function resolve() {
      try {
        const result = await resolveMolecule(question.moleculeFormula)
        if (cancelled) return
        molblockRef.current = result.molblock
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
  }, [question.moleculeFormula])

  // Mount 3Dmol.js viewer
  useEffect(() => {
    if (status !== 'ready' || !viewerRef.current || !molblockRef.current) return

    const viewer = window.$3Dmol.createViewer(viewerRef.current, {
      backgroundColor: 'white',
    })
    viewer.addModel(molblockRef.current, 'sdf')
    viewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.3 } })
    viewer.zoomTo({}, 0.8)
    viewer.render()
    viewerInstanceRef.current = viewer

    return () => {
      viewer.clear()
      viewerInstanceRef.current = null
    }
  }, [status])

  // ResizeObserver
  useEffect(() => {
    if (!viewerRef.current || !viewerInstanceRef.current) return
    const el = viewerRef.current
    const observer = new ResizeObserver(() => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.resize()
        viewerInstanceRef.current.render()
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [status])

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

  const promptType = question.type === 'name' ? 'name' : 'formula'

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <p className="text-lg font-medium text-center">
        What is the <span className="text-blue-600 dark:text-blue-400">{promptType}</span> of this molecule?
      </p>

      {/* 3D Viewer */}
      <div className="relative w-full h-64 sm:h-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
            Loading molecule…
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
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
        <div
          ref={viewerRef}
          className="w-full h-full"
          style={{ visibility: status === 'ready' ? 'visible' : 'hidden' }}
        />
      </div>

      {/* Options */}
      {status !== 'error' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              disabled={phase === 'feedback'}
              onClick={() => onAnswer(index)}
              className={getButtonClass(index)}
            >
              {question.type === 'formula' ? (
                <FormulaDisplay formula={option} />
              ) : (
                option
              )}
            </button>
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
