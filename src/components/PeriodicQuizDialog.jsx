/* eslint-disable react/prop-types */
import { useEffect, useId, useRef } from 'react'

export default function PeriodicQuizDialog({ title, description, onCancel, children }) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    return () => { if (previous?.isConnected) previous.focus() }
  }, [])

  useEffect(() => {
    dialogRef.current?.querySelector('input, select, button')?.focus()
  }, [title])

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    }
    if (event.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll('input:not(:disabled), select:not(:disabled), button:not(:disabled)')
      const first = focusable?.[0]
      const last = focusable?.[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
  }

  return <div className="periodic-quiz-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onCancel() }}>
    <div ref={dialogRef} className="periodic-quiz-dialog surface-module" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} onKeyDown={handleKeyDown}>
      <h2 id={titleId} className="mb-5 text-xl font-semibold">{title}</h2>
      {description && <p id={descriptionId} className="mb-5">{description}</p>}
      {children}
    </div>
  </div>
}
