/* eslint-disable react/prop-types */
import { useEffect, useId, useRef, useState } from 'react'
import { resolveCompound } from '../services/pubchem'
import { smilesToSvg } from '../services/rdkit'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../i18n/ThemeContext'
import { t } from '../i18n/translate'
import FormulaDisplay from './FormulaDisplay'
import CompoundDetails from './CompoundDetails'
import { useDialog } from '../hooks/useDialog'

export function CompoundStructure({ mol, onAmbiguous }) {
  const { language } = useLanguage()
  const { resolvedTheme } = useTheme()
  const viewerRef = useRef(null)
  const viewerInstanceRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [svgMarkup, setSvgMarkup] = useState(null)
  const [svgError, setSvgError] = useState(false)
  const molblockRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function renderSvg(smiles) {
      try {
        const svg = await smilesToSvg(smiles)
        if (!cancelled) setSvgMarkup(svg)
      } catch {
        if (!cancelled) setSvgError(true)
      }
    }

    async function resolve() {
      setStatus('loading')
      setErrorMsg('')
      setSvgMarkup(null)
      setSvgError(false)
      molblockRef.current = null
      if (mol.smiles) renderSvg(mol.smiles)
      try {
        const result = await resolveCompound(mol.formula, mol.smiles)
        if (cancelled) return
        molblockRef.current = result.molblock
        if (result.isAmbiguous && onAmbiguous) onAmbiguous(true)
        setStatus('ready')

        if (!mol.smiles && result.smiles) {
          renderSvg(result.smiles)
        } else if (!mol.smiles) {
          setSvgError(true)
        }
      } catch (err) {
        if (!cancelled) {
          if (!mol.smiles) setSvgError(true)
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

    const surfaceColor = window.getComputedStyle(document.documentElement).getPropertyValue('--surface-raised').trim().split(/\s+/).map(value => Number(value).toString(16).padStart(2, '0')).join('')
    const viewer = window.$3Dmol.createViewer(viewerRef.current, {
      backgroundColor: `#${surfaceColor}`,
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
  }, [status, resolvedTheme])

  // ResizeObserver
  useEffect(() => {
    if (!viewerRef.current || !viewerInstanceRef.current) return
    const el = viewerRef.current
    const observer = new window.ResizeObserver(() => {
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
      <div className="compound-structure-spinner animate-spin" />
      {t(language, 'structure.resolving')}
    </div>
  )

  const error = (
    <div className="flex flex-col items-center gap-1 px-4 text-center">
      <p className="text-sm font-medium text-red-600 dark:text-red-400">{t(language, 'structure.couldNotLoad')}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{errorMsg}</p>
    </div>
  )

  return (
    <div className="compound-structures">
      {/* 2D Structure */}
      <div className="compound-structure-panel compound-structure-panel--2d">
        <span className="compound-structure-label">2D</span>
        {!svgMarkup && !svgError && spinner}
        {svgMarkup && (
          <div
            className="compound-structure-svg"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        )}
        {svgError && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{t(language, 'structure.2dUnavailable')}</p>
        )}
      </div>

      {/* 3D Structure */}
      <div className="compound-structure-panel">
        <span className="compound-structure-label">3D</span>
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

function CompoundCard({ mol }) {
  return <article className="compound-comparison-card">
    <header><h3>{mol.name}</h3><div className="compound-formula-card"><FormulaDisplay formula={mol.formula} /></div></header>
    <CompoundStructure mol={mol} />
    <CompoundDetails compound={mol} />
  </article>
}

export default function CompareModal({ compounds, onClose }) {
  const { language } = useLanguage()
  const titleId = useId()
  const dialogRef = useDialog(onClose)
  return <div className="dialog-scrim element-profile-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <section ref={dialogRef} role="dialog" aria-labelledby={titleId} tabIndex={-1} className="element-profile-dialog compound-dialog">
      <header className="element-profile-header">
        <h2 id={titleId}>{t(language, 'compare.title')}</h2>
        <button type="button" onClick={onClose} aria-label={t(language, 'compare.closeLabel')} data-initial-focus className="secondary-button compound-close">×</button>
      </header>
      <div className="compound-comparison-body">{compounds.map(compound => <CompoundCard key={compound.id ?? compound.name} mol={compound} />)}</div>
    </section>
  </div>
}
