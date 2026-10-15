/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { resolveCompound } from '../services/pubchem'
import { smilesToSvg } from '../services/rdkit'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../i18n/ThemeContext'
import { t } from '../i18n/translate'

const IMAGE_WIDTH = 320
const IMAGE_HEIGHT = 180

function surfaceColor() {
  const rgb = window.getComputedStyle(document.documentElement)
    .getPropertyValue('--surface-raised').trim().split(/\s+/)
  return `#${rgb.map(value => Number(value).toString(16).padStart(2, '0')).join('')}`
}

export default function CompoundCardImage({ compound, imageType }) {
  const { language } = useLanguage()
  const { resolvedTheme } = useTheme()
  const imageRef = useRef(null)
  const viewerHostRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [svgMarkup, setSvgMarkup] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const element = imageRef.current
    if (!element) return
    if (!window.IntersectionObserver) {
      setVisible(true)
      return
    }
    const observer = new window.IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '160px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let cancelled = false
    let viewer = null
    let frameId = null
    setImageSrc(null)
    setSvgMarkup(null)
    setStatus('loading')

    async function renderImage() {
      try {
        let smiles = compound.smiles
        if (imageType === 'skeleton') {
          if (!smiles) smiles = (await resolveCompound(compound.formula)).smiles
          const svg = await smilesToSvg(smiles, IMAGE_WIDTH, IMAGE_HEIGHT)
          if (cancelled) return
          setSvgMarkup(svg)
          setStatus('ready')
          return
        }

        const structure = await resolveCompound(compound.formula, compound.smiles)
        if (cancelled) return
        if (!window.$3Dmol || !viewerHostRef.current) throw new Error('3D viewer unavailable')
        viewer = window.$3Dmol.createViewer(viewerHostRef.current, {
          backgroundColor: surfaceColor(),
        })
        viewer.addModel(structure.molblock, 'sdf')
        viewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.3 } })
        viewer.zoomTo({}, 0.8)
        viewer.render()
        frameId = window.requestAnimationFrame(() => {
          frameId = window.requestAnimationFrame(() => {
            if (cancelled) return
            try {
              setImageSrc(viewer.pngURI())
              setStatus('ready')
            } catch {
              setStatus('error')
            } finally {
              viewer.clear()
              viewer = null
            }
          })
        })
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    renderImage()
    return () => {
      cancelled = true
      if (frameId != null) window.cancelAnimationFrame(frameId)
      if (viewer) viewer.clear()
    }
  }, [compound.formula, compound.smiles, imageType, visible, resolvedTheme])

  const imageAlt = imageType === '3d'
    ? t(language, 'list.image3dAlt', { name: compound.name })
    : t(language, 'list.imageSkeletonAlt', { name: compound.name })

  return (
    <div ref={imageRef} className="compound-card-image" aria-busy={status === 'loading'}>
      {imageSrc && <img src={imageSrc} alt={imageAlt} />}
      {svgMarkup && <div className="compound-structure-svg" role="img" aria-label={imageAlt} dangerouslySetInnerHTML={{ __html: svgMarkup }} />}
      {status === 'loading' && <span className="compound-card-image__loading" aria-hidden="true"><span className="compound-structure-spinner animate-spin" /></span>}
      {status === 'error' && <span className="compound-card-image__unavailable">{t(language, 'list.structureUnavailable')}</span>}
      {imageType === '3d' && visible && <div ref={viewerHostRef} className="compound-card-image__renderer" aria-hidden="true" />}
    </div>
  )
}
