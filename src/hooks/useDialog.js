import { useEffect, useRef } from 'react'

/** Keep detail content and global navigation accessible while the workspace is inert. */
export function useDialog(onClose, returnFocus, initialFocus) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  const returnRef = useRef(returnFocus)
  const initialRef = useRef(initialFocus)
  initialRef.current = initialFocus
  closeRef.current = onClose
  returnRef.current = returnFocus
  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const node = ref.current
    const topbar = document.querySelector('.app-shell > .site-topbar')
    const backdrop = node.closest('.element-profile-backdrop')
    const updateTop = () => { if (backdrop) backdrop.style.top = `${topbar?.getBoundingClientRect().height ?? 0}px` }
    updateTop()
    const observer = window.ResizeObserver ? new window.ResizeObserver(updateTop) : null
    if (topbar) observer?.observe(topbar)
    window.addEventListener('resize', updateTop)
    const siblings = [...document.querySelectorAll('.app-shell > :not(.dialog-scrim):not(.site-topbar)')]
    const priorInert = siblings.map(item => item.inert)
    siblings.forEach(item => { item.inert = true })
    const focusable = (root = node) => [...root.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex="0"]')].filter(item => item.tabIndex >= 0 && !item.closest('[hidden]') && (!item.closest('details:not([open])') || item.tagName === 'SUMMARY')).sort((a, b) => a.compareDocumentPosition(b) & 2 ? 1 : -1)
    const initial = initialRef.current?.(node) ?? node.querySelector('[data-initial-focus]') ?? focusable()[0] ?? node
    initial.focus()
    const contains = target => node.contains(target) || topbar?.contains(target)
    function keydown(event) {
      if (event.key === 'Escape' && !topbar?.contains(event.target)) { event.preventDefault(); event.stopPropagation(); closeRef.current() }
      if (event.key === 'Tab') {
        const items = [...(topbar ? focusable(topbar) : []), ...focusable()]
        const index = items.indexOf(document.activeElement)
        const next = index < 0 ? (event.shiftKey ? items.at(-1) : items[0]) : items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]
        event.preventDefault()
        const target = next ?? node
        target.focus()
      }
    }
    function contain(event) { if (!contains(event.target)) (node.querySelector('[data-initial-focus]') ?? focusable()[0] ?? node).focus() }
    document.addEventListener('keydown', keydown)
    document.addEventListener('focusin', contain)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateTop)
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('focusin', contain)
      document.body.style.overflow = overflow
      siblings.forEach((item, index) => { item.inert = priorInert[index] })
      const target = typeof returnRef.current === 'function' ? returnRef.current() : returnRef.current ?? previous
      if (!topbar?.contains(document.activeElement) && target?.isConnected) target.focus()
    }
  }, [])
  return ref
}
