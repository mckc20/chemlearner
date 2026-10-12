/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { helpContent } from '../i18n/help'
import { elementSourceCatalog } from '../data/elements/sourceCatalog'
import TopNavigation from './TopNavigation'

export default function HelpPage({ onNavigate }) {
  const { language } = useLanguage()
  const content = helpContent[language] ?? helpContent.en
  const headingRef = useRef(null)
  useEffect(() => {
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1))
    if (target) target.focus()
    else headingRef.current?.focus()
  }, [])

  return <div className="app-shell">
    <TopNavigation onNavigate={onNavigate} pathname="/help" />
    <main className="workspace-main help-page">
      <header className="help-header">
        <h1 ref={headingRef} tabIndex={-1}>{content.title}</h1>
        <p>{content.intro}</p>
      </header>
      <nav className="help-contents" aria-label={content.contents}>
        <h2>{content.contents}</h2>
        <ul>{content.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ul>
      </nav>
      {content.sections.map(section => <section className="help-section" key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} tabIndex={-1}>
        <h2 id={`${section.id}-title`}>{section.title}</h2>
        {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {section.providers && <ul className="help-source-list">{Object.entries(elementSourceCatalog).map(([id, provider]) => <li key={id}><a href={provider.url} target="_blank" rel="noopener noreferrer">{provider.name}</a>: {provider.role[language] ?? provider.role.en}</li>)}</ul>}
      </section>)}
      <a className="secondary-button inline-flex" href="/periodic-table" onClick={event => onNavigate(event, '/periodic-table')}>{content.back}</a>
    </main>
  </div>
}
