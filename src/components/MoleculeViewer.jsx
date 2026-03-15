import { useEffect, useRef, useState } from 'react'
import { resolveMolecule } from '../services/pubchem'
import { smilesToSvg } from '../services/rdkit'
import FormulaDisplay from './FormulaDisplay'

export default function MoleculeViewer({ molecule, onClose }) {
  const viewerRef = useRef(null)
  const viewerInstanceRef = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'error' | 'ready'
  const [errorMsg, setErrorMsg] = useState('')
  const [isAmbiguous, setIsAmbiguous] = useState(false)
  const [svgMarkup, setSvgMarkup] = useState(null)
  const [svgError, setSvgError] = useState(false)
  const molblockRef = useRef(null)

  // Resolve formula → PubChem CID → 3D SDF molblock + RDKit 2D SVG
  useEffect(() => {
    let cancelled = false

    async function resolve() {
      try {
        const result = await resolveMolecule(molecule.formula)
        if (cancelled) return
        molblockRef.current = result.molblock
        setIsAmbiguous(result.isAmbiguous)
        setStatus('ready')

        // Generate 2D SVG via RDKit from SMILES
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
  }, [molecule.formula])

  // Mount 3Dmol.js viewer once molblock is ready
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

  // ResizeObserver for 3Dmol.js container
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

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{molecule.name}</h2>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400"><FormulaDisplay formula={molecule.formula} /></p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* Ambiguity warning */}
        {isAmbiguous && (
          <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
            The formula <FormulaDisplay formula={molecule.formula} /> is ambiguous. Displaying the most common structure (Isomer A). Use a SMILES string for specific results.
          </div>
        )}

        {/* Two-panel viewer area */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Left: 2D Skeletal Formula (RDKit SVG) */}
          <div className="relative w-full md:w-1/2 h-80 md:h-[28rem] border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center">
            <span className="absolute top-2 left-3 text-xs text-gray-400 dark:text-gray-500">2D Structure</span>
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                Resolving structure…
              </div>
            )}
            {status === 'error' && (
              <div className="flex flex-col items-center gap-1 px-6 text-center">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Could not load structure</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{errorMsg}</p>
              </div>
            )}
            {status === 'ready' && !svgMarkup && !svgError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
            {status === 'ready' && svgMarkup && (
              <div
                className="max-h-full max-w-full p-6 [&_svg]:w-full [&_svg]:h-full"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            )}
            {status === 'ready' && svgError && (
              <p className="text-xs text-gray-400 dark:text-gray-500">2D structure unavailable</p>
            )}
          </div>

          {/* Right: 3D Ball-and-Stick */}
          <div className="relative w-full md:w-1/2 h-80 md:h-[28rem] bg-white dark:bg-gray-800">
            <span className="absolute top-2 left-3 text-xs text-gray-400 dark:text-gray-500 z-10">3D Model</span>
            {status === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                Resolving structure…
              </div>
            )}
            {status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Could not load structure</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{errorMsg}</p>
              </div>
            )}
            {/* 3Dmol target div — always rendered so the ref is available */}
            <div
              ref={viewerRef}
              className="w-full h-full"
              style={{ visibility: status === 'ready' ? 'visible' : 'hidden' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
