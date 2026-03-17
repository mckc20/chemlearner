import { useEffect, useRef, useState } from 'react'
import { resolveCompound } from '../services/pubchem'
import { smilesToSvg } from '../services/rdkit'
import FormulaDisplay from './FormulaDisplay'
import CompoundFacts from './CompoundFacts'

export function CompoundStructure({ mol, onAmbiguous }) {
  const viewerRef = useRef(null)
  const viewerInstanceRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [svgMarkup, setSvgMarkup] = useState(null)
  const [svgError, setSvgError] = useState(false)
  const molblockRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      try {
        const result = await resolveCompound(mol.formula, mol.smiles)
        if (cancelled) return
        molblockRef.current = result.molblock
        if (result.isAmbiguous && onAmbiguous) onAmbiguous(true)
        setStatus('ready')

        if (result.smiles) {
          try {
            const svg = await smilesToSvg(result.smiles)
            if (!cancelled) setSvgMarkup(svg)
          } catch {
            if (!cancelled) setSvgError(true)
          }
        } else {
          setSvgError(true)
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message)
          setStatus('error')
        }
      }
    }

    resolve()
    return () => { cancelled = true }
  }, [mol.formula, mol.smiles])

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

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
      Resolving…
    </div>
  )

  const error = (
    <div className="flex flex-col items-center gap-1 px-4 text-center">
      <p className="text-sm font-medium text-red-600 dark:text-red-400">Could not load structure</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{errorMsg}</p>
    </div>
  )

  return (
    <div className="space-y-0">
      {/* 2D Structure */}
      <div className="relative z-10 h-48 border border-gray-200 dark:border-gray-700 rounded-t bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
        <span className="absolute top-1.5 left-2 text-[10px] text-gray-400 dark:text-gray-500">2D</span>
        {status === 'loading' && spinner}
        {status === 'error' && error}
        {status === 'ready' && !svgMarkup && !svgError && (
          <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        )}
        {status === 'ready' && svgMarkup && (
          <div
            className="h-full w-full p-3 [&_svg]:w-full [&_svg]:h-full [&_svg]:max-h-full [&_svg]:object-contain"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        )}
        {status === 'ready' && svgError && (
          <p className="text-xs text-gray-400 dark:text-gray-500">2D structure unavailable</p>
        )}
      </div>

      {/* 3D Structure */}
      <div className="relative h-48 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b bg-white dark:bg-gray-800 overflow-hidden">
        <span className="absolute top-1.5 left-2 text-[10px] text-gray-400 dark:text-gray-500 z-10">3D</span>
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">{spinner}</div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center">{error}</div>
        )}
        <div
          ref={viewerRef}
          className="w-full h-full"
          style={{ visibility: status === 'ready' ? 'visible' : 'hidden' }}
        />
      </div>
    </div>
  )
}

export const detailFields = [
  { label: 'Category', key: 'category' },
  { label: 'Information', key: 'information' },
  { label: 'SMILES', key: 'smiles', mono: true },
]

function CompoundCard({ mol }) {
  return (
    <div className="flex-1 min-w-0 space-y-3">
      <div>
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{mol.name}</h3>
        <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
          <FormulaDisplay formula={mol.formula} />
        </p>
      </div>

      <CompoundStructure mol={mol} />

      {detailFields.map(({ label, key, mono }) => (
        <div key={key}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          {mol[key] ? (
            <p className={`text-sm text-gray-800 dark:text-gray-200 mt-0.5 ${mono ? 'font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs break-all' : ''}`}>
              {mol[key]}
            </p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 italic">--</p>
          )}
        </div>
      ))}

      {mol.id && <CompoundFacts compoundId={mol.id} compact />}

      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Links</p>
        <div className="flex flex-wrap gap-3 text-sm mt-0.5">
          {mol.wikipediaUrl ? (
            <a href={mol.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Wikipedia</a>
          ) : <span className="text-gray-400 dark:text-gray-500 italic">--</span>}
          {mol.pubchemUrl && (
            <a href={mol.pubchemUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">PubChem</a>
          )}
          {mol.wikidataId && (
            <a href={`https://www.wikidata.org/wiki/${mol.wikidataId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              Wikidata ({mol.wikidataId})
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CompareModal({ compounds, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const [compA, compB] = compounds

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Compare Compounds</h2>
          <button
            onClick={onClose}
            aria-label="Close comparison"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none px-2"
          >
            &times;
          </button>
        </div>

        {/* Side-by-side cards */}
        <div className="flex flex-col md:flex-row gap-6 p-5 max-h-[80vh] overflow-y-auto">
          <CompoundCard mol={compA} />
          <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 self-stretch" />
          <hr className="md:hidden border-gray-200 dark:border-gray-700" />
          <CompoundCard mol={compB} />
        </div>
      </div>
    </div>
  )
}
