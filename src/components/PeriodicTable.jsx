/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'
import { elementName, familyNames } from '../data/periodicElements'
import PeriodicGrid from './PeriodicGrid'
import PeriodicQuizSetupDialog from './PeriodicQuizSetupDialog'
import SectionHeader from './SectionHeader'

export default function PeriodicTable({ onStartQuiz, onSelectElement, selectedElement }) {
  const { language } = useLanguage()
  const [showQuizSetup, setShowQuizSetup] = useState(false)
  const [animatingElement, setAnimatingElement] = useState(null)
  const animationRef = useRef(null)
  const quizButtonRef = useRef(null)

  useEffect(() => () => {
    animationRef.current?.animation?.cancel?.()
    animationRef.current?.clone?.remove()
    clearTimeout(animationRef.current?.fallback)
  }, [])

  function selectElement(number, trigger) {
    if (animatingElement !== null) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !trigger.animate) {
      onSelectElement(number, trigger)
      return
    }

    const rect = trigger.getBoundingClientRect()
    const clone = trigger.cloneNode(true)
    const isMobile = window.matchMedia?.('(max-width: 700px)').matches
    const inset = isMobile ? 8 : 24
    const targetWidth = Math.min(1120, window.innerWidth - inset * 2)
    const targetHeight = Math.min(820, window.innerHeight - inset * 2)
    const targetLeft = (window.innerWidth - targetWidth) / 2
    const targetTop = (window.innerHeight - targetHeight) / 2
    Object.assign(clone.style, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: '0',
      zIndex: '80',
      pointerEvents: 'none',
      transformOrigin: 'center center',
      willChange: 'transform, opacity',
    })
    clone.setAttribute('aria-hidden', 'true')
    clone.removeAttribute('aria-pressed')
    clone.tabIndex = -1
    document.body.append(clone)
    setAnimatingElement(number)

    let completed = false
    const finish = () => {
      if (completed) return
      completed = true
      clearTimeout(animationRef.current?.flipTimer)
      clearTimeout(animationRef.current?.fallback)
      clone.remove()
      animationRef.current = null
      setAnimatingElement(null)
      onSelectElement(number, trigger)
    }
    animationRef.current = { clone }
    try {
      const flip = clone.animate([
        { transform: 'perspective(700px) rotateY(0deg)' },
        { transform: 'perspective(700px) rotateY(180deg)' },
      ], { duration: 300, easing: 'ease-in', fill: 'forwards' })
      animationRef.current.animation = flip
      animationRef.current.flipTimer = setTimeout(() => {
        if (completed) return
        flip.cancel()
        clone.style.transform = 'rotateY(180deg)'
        clone.style.background = 'rgb(var(--surface-raised))'
        clone.style.borderColor = 'rgb(var(--border-strong))'
        clone.querySelectorAll('*').forEach(child => { child.style.visibility = 'hidden' })
        const expand = clone.animate([
          { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: '10px' },
          { left: `${targetLeft}px`, top: `${targetTop}px`, width: `${targetWidth}px`, height: `${targetHeight}px`, borderRadius: '16px' },
        ], { duration: 520, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'forwards' })
        animationRef.current.animation = expand
        expand.onfinish = finish
      }, 300)
      animationRef.current.fallback = setTimeout(finish, 950)
    } catch {
      finish()
    }
  }

  const closeQuizSetup = useCallback(() => {
    setShowQuizSetup(false)
    queueMicrotask(() => quizButtonRef.current?.focus())
  }, [])

  return (
    <section aria-labelledby="periodic-table-title" className="periodic-table-section space-y-6">
      <SectionHeader
        title={t(language, 'periodic.title')}
        description={t(language, 'periodic.description')}
        headingId="periodic-table-title"
        actions={<button ref={quizButtonRef} type="button" onClick={() => setShowQuizSetup(true)} className="primary-button inline-flex items-center">{t(language, 'periodic.quiz')}</button>}
      />

      <PeriodicGrid label={t(language, 'periodic.title')} renderCell={(element) => (
        <button
          type="button"
          onClick={event => selectElement(element.number, event.currentTarget)}
          data-element-number={element.number}
          aria-label={`${element.number} ${elementName(element, language)} (${element.symbol})`}
          aria-pressed={selectedElement === element.number}
          className={`element-cell element-cell--${element.family} ${selectedElement === element.number ? 'element-cell--selected' : ''} ${animatingElement === element.number ? 'element-cell--animating' : ''}`}
        >
          <span className="element-cell__number">{element.number}</span>
          <span className="element-cell__symbol">{element.symbol}</span>
          <span className="element-cell__name">{elementName(element, language)}</span>
        </button>
      )} />
      <PeriodicFamilyLegend language={language} />

      {showQuizSetup && <PeriodicQuizSetupDialog onCancel={closeQuizSetup} onStart={onStartQuiz} />}


    </section>
  )
}

export function PeriodicFamilyLegend({ language }) {
  return (
    <div className="periodic-family-legend" role="list" aria-label={t(language, 'periodic.legend')}>
      {Object.entries(familyNames[language]).map(([family, name]) => (
        <div className="periodic-family-legend__item" role="listitem" key={family}>
          <span className={`periodic-family-legend__swatch element-cell--${family}`} aria-hidden="true" />
          <span>{name}</span>
        </div>
      ))}
    </div>
  )
}
