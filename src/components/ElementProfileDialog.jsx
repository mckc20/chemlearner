/* eslint-disable react/prop-types */
import { useEffect, useId, useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { profileText } from '../i18n/elementProfile'
import { elementName, elements, familyNames } from '../data/periodicElements'
import { atomModel, abbreviatedConfiguration, formulaElements, orbitalBoxes, profileTabs, referenceRetrievedAt, referenceVersion } from '../data/elementProfiles'
import { appearance, curatedExamples, editorial, referenceExamples } from '../data/elements/editorial'
import { elementSourceEntries, sourceEntryName } from '../data/elements/sourceCatalog'
import { DEFAULTS } from '../data/defaultCompounds'
import { translateCompound } from '../i18n/translate'
import { useDialog } from '../hooks/useDialog'
import AtomDiagram from './AtomDiagram'

function Source({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}
function chargeLabel(symbol, charge) { return charge ? `${symbol}${Math.abs(charge) === 1 ? '' : Math.abs(charge)}${charge > 0 ? '+' : '−'}` : symbol }

function Property({ name, property, tr }) {
  const value = property?.value
  let display = value
  if (name === 'state' && value) display = tr(({ Gas: 'gas', Solid: 'solid', Liquid: 'liquid', 'Expected to be a Solid': 'expectedSolid', 'Expected to be a Gas': 'expectedGas' })[value] ?? 'unknown')
  // Most upstream strings already carry units; retain their original uncertainty.
  const unit = property?.unit && value && !/[a-zA-Z°]/.test(value) ? property.unit : ''
  return <div className="profile-property">
    <dt>{tr(property?.kind === 'representative-mass-number' ? 'representativeMass' : name)}</dt>
    <dd>{value ? <>{display} {unit}</> : tr('unknown')}
      {property?.status === 'predicted' && <span className="profile-predicted">{tr('predicted')}</span>}
      {property?.conditions && <small>{tr(property.conditions)}</small>}
    </dd>
  </div>
}

function Configuration({ terms, selected, prefix }) {
  return <p className="configuration">{prefix && <span>[{prefix}] </span>}{terms.map(term => <span key={`${term.n}${term.l}`} className={selected === term.n ? 'shell-highlight' : ''} data-shell={term.n}>{term.n}{term.l}<sup>{term.count}</sup>{' '}</span>)}</p>
}

export default function ElementProfileDialog({ profile, onChange, onNavigate, onClose, compounds, onOpenCompound, returnFocus, restoreControl, onHelp }) {
  const { language } = useLanguage()
  const tr = key => profileText(language, key)
  const id = useId()
  const dialogRef = useDialog(onClose, returnFocus, node => [...node.querySelectorAll('[data-profile-control]')].find(control => control.dataset.profileControl === restoreControl))
  const model = useMemo(() => atomModel(profile), [profile])
  const { element, isotope, configuration, shells } = model
  const identity = elements[profile.atomicNumber - 1]
  const abbreviated = abbreviatedConfiguration(configuration.subshells)
  const matching = useMemo(() => compounds.filter(compound => formulaElements(compound.formula)?.has(identity.symbol)), [compounds, identity.symbol])
  const examples = (curatedExamples[profile.atomicNumber] ?? []).map(compoundId => compounds.find(compound => compound.id === compoundId) ?? DEFAULTS.find(compound => compound.id === compoundId)).filter(Boolean).concat(referenceExamples[profile.atomicNumber] ?? [])
  const citableExamples = examples.filter(example => example.source || DEFAULTS.some(item => item.id === example.id && item.name === example.name && item.formula === example.formula && item.pubchemUrl === example.pubchemUrl))
  const sourceEntries = elementSourceEntries(element, { examples: citableExamples })

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const handleChange = event => { if (event.matches) onChange({ paused: true }) }
    query?.addEventListener?.('change', handleChange)
    return () => query?.removeEventListener?.('change', handleChange)
  }, [onChange])

  function tabKey(event, tab) {
    let next = profileTabs.indexOf(tab)
    if (event.key === 'ArrowRight') next = (next + 1) % profileTabs.length
    else if (event.key === 'ArrowLeft') next = (next + profileTabs.length - 1) % profileTabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = profileTabs.length - 1
    else return
    event.preventDefault()
    onChange({ tab: profileTabs[next] })
    document.getElementById(`${id}-${profileTabs[next]}-tab`)?.focus()
  }
  function compoundButton(compound, prefix) {
    const available = compounds.some(item => item.id === compound.id)
    const localized = compound.nameDe && language === 'de' ? { ...compound, name: compound.nameDe } : translateCompound(language, compound)
    const control = `${prefix}-${compound.id}`
    return <li key={compound.id}>{available ? <button type="button" className={prefix === 'library' ? 'profile-compound-chip' : 'profile-link'} aria-label={`${localized.name} ${compound.formula}`} title={compound.formula} data-profile-control={control} onClick={() => onOpenCompound(compound, control)}>{localized.name}{prefix !== 'library' && <> <span className="profile-caption">{compound.formula}</span></>}</button> : <span>{localized.name} ({compound.formula}) — {tr('unavailable')}</span>}</li>
  }

  return <div className="dialog-scrim element-profile-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="element-profile-dialog" role="dialog" aria-labelledby={`${id}-title`} ref={dialogRef} tabIndex={-1}>
      <header className="element-profile-header">
        <div><p className="profile-eyebrow">{tr('atomicNumber')} {identity.number}</p><h2 id={`${id}-title`}>{elementName(identity, language)}</h2></div>
        <div className="profile-navigation">
          <a href="/help" onClick={onHelp} className="profile-icon-control" aria-label={tr('help')} title={tr('help')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6" strokeLinecap="round" /><circle cx="12" cy="7.5" r=".8" fill="currentColor" stroke="none" /></svg>
          </a>
          <button type="button" className="secondary-button" aria-label={tr('previous')} disabled={identity.number === 1} onClick={() => onNavigate(identity.number - 1)}>←</button>
          <button type="button" className="secondary-button" aria-label={tr('next')} disabled={identity.number === 118} onClick={() => onNavigate(identity.number + 1)}>→</button>
          <button type="button" className="secondary-button" aria-label={tr('close')} data-initial-focus onClick={onClose}>×</button>
        </div>
      </header>
      <div className="element-profile-body">
        <aside className="element-profile-identity">
          <div className={`profile-element-badge element-cell--${identity.family}`}><span>{identity.number}</span><strong>{identity.symbol}</strong><span>{elementName(identity, language)}</span></div>
          <AtomDiagram model={model} profile={profile} onChange={onChange} language={language}>
          <div className="profile-selectors">
            <label>{tr('isotope')}<select aria-label={tr('isotope')} value={isotope.id} onChange={event => onChange({ isotopeId: event.target.value })}>{element.isotopes.map(item => <option key={item.id} value={item.id}>{identity.symbol}-{item.massNumber}</option>)}</select></label>
            <label>{tr('charge')}<select aria-label={tr('charge')} value={profile.charge} onChange={event => onChange({ charge: Number(event.target.value), shell: null })}><option value={0}>{tr('neutral')}</option>{element.ions.map(ion => <option key={ion.charge} value={ion.charge}>{chargeLabel(identity.symbol, ion.charge)}</option>)}</select></label>
          </div>
          </AtomDiagram>
        </aside>
        <div className="element-profile-content">
          <div className="profile-tabs" role="tablist" aria-label={tr('tabs')}>{profileTabs.map(tab => <button key={tab} type="button" role="tab" id={`${id}-${tab}-tab`} aria-controls={`${id}-${tab}-panel`} aria-selected={profile.tab === tab} tabIndex={profile.tab === tab ? 0 : -1} onClick={() => onChange({ tab })} onKeyDown={event => tabKey(event, tab)}>{tr(tab)}</button>)}</div>
          <div className="profile-panel" role="tabpanel" id={`${id}-${profile.tab}-panel`} aria-labelledby={`${id}-${profile.tab}-tab`} tabIndex={0}>
            {profile.tab === 'overview' && <>
              <dl className="profile-facts">
                {Object.entries({ family: familyNames[language][identity.family], period: element.period, group: element.group ?? tr('unassigned'), block: element.block }).map(([key, value]) => <div key={key}><dt>{tr(key)}</dt><dd>{value}</dd></div>)}
              </dl>
              <dl className="profile-properties"><Property name="atomicWeight" property={element.properties.atomicWeight} tr={tr} /></dl>
              <dl className="profile-prose">
                <div><dt>{tr('appearance')}</dt><dd>{appearance(identity.number, language) ?? tr('unknown')}</dd></div>
                {['occurrence', 'uses', 'origin'].map(key => <div key={key}><dt>{tr(key)}</dt><dd>{editorial[identity.number]?.[key]?.[language] ?? tr('unknown')}</dd></div>)}
                <div><dt>{tr('discovery')}</dt><dd>{element.discovery === 'Ancient' ? tr('ancient') : element.discovery || tr('unknown')}</dd></div>
              </dl>
              <h3>{tr('examples')}</h3>{examples.length ? <ul className="profile-compounds">{examples.map(compound => compoundButton(compound, 'example'))}</ul> : <p>{tr('unknown')}</p>}
              <section className="profile-library" aria-labelledby={`${id}-library-title`}>
                <h3 id={`${id}-library-title`}>{tr('library')} · {matching.length}</h3>
                {matching.length ? <>
                  <ul id={`${id}-library-list`} className={`profile-compound-chips${profile.libraryExpanded ? ' profile-compound-chips--expanded' : ''}`}>
                    {(profile.libraryExpanded ? matching : matching.slice(0, 4)).map(compound => compoundButton(compound, 'library'))}
                  </ul>
                  {matching.length > 4 && <button type="button" className="profile-library-toggle" aria-expanded={Boolean(profile.libraryExpanded)} aria-controls={`${id}-library-list`} onClick={() => onChange({ libraryExpanded: !profile.libraryExpanded })}>
                    {profile.libraryExpanded ? tr('showFewerCompounds') : tr('showAllCompounds').replace('{count}', matching.length)}
                  </button>}
                </> : <p>{tr('noMatches')}</p>}
              </section>
            </>}
            {profile.tab === 'structure' && <>
              <h3>{tr('full')}</h3><Configuration terms={configuration.subshells} selected={profile.shell} />
              <h3>{tr('abbreviated')}</h3><Configuration terms={abbreviated.terms} prefix={abbreviated.core} selected={profile.shell} />
              {['predicted', 'derived'].includes(configuration.status) && <p className="profile-predicted">{tr(configuration.status)}</p>}
              <h3>{tr('orbitalsShort')}</h3>
              <div className="orbital-diagram">{configuration.subshells.map(term => <div key={`${term.n}${term.l}`} className={profile.shell === term.n ? 'orbital-term shell-highlight' : 'orbital-term'} data-shell={term.n} aria-label={`${term.n}${term.l}: ${term.count} ${tr('electrons')}`}><span>{term.n}{term.l}</span><span className="orbital-boxes" aria-hidden="true">{orbitalBoxes(term).map((arrows, index) => <span key={index}>{arrows || ' '}</span>)}</span></div>)}</div>
              <p aria-live="polite">{tr('selectedShell')}: {profile.shell ?? tr('none')}</p>
              <h3>{tr('outer')}: {shells.at(-1) ?? 0}</h3>{['d', 'f'].includes(element.block) && <p className="profile-caption">{tr('valenceShort')}</p>}
            </>}
            {profile.tab === 'properties' && <>
              <h3>{tr('bulk')}</h3><p className="profile-caption">{tr('bulkShort')}</p>
              <dl className="profile-prose"><div><dt>{tr('oxidationStates')}</dt><dd>{element.oxidationStates || tr('unknown')}</dd></div><div><dt>{tr('ions')}</dt><dd>{element.ions.length ? element.ions.map(ion => chargeLabel(identity.symbol, ion.charge)).join(', ') : tr('noIons')}</dd></div></dl>
              <dl className="profile-properties">{['electronegativity', 'ionizationEnergy', 'electronAffinity', 'atomicRadius', 'density', 'meltingPoint', 'boilingPoint', 'state'].map(name => <Property key={name} name={name} property={element.properties[name]} tr={tr} />)}</dl>
            </>}
            {profile.tab === 'isotopes' && <>
              <p className="profile-caption">{tr('isotopesShort')}</p>
              <div className="isotope-table-scroll" tabIndex={0}><table className="isotope-table"><caption>{elementName(identity, language)} — {tr('isotopes')}</caption><thead><tr>{['isotope', 'massNumber', 'mass', 'abundance', 'stability', 'halfLife', 'decay'].map(key => <th scope="col" key={key}>{tr(key)}</th>)}</tr></thead><tbody>{element.isotopes.map(item => <tr key={item.id} className={item.id === isotope.id ? 'isotope-selected' : ''}>
                <th scope="row"><button type="button" aria-pressed={item.id === isotope.id} onClick={() => onChange({ isotopeId: item.id })}>{identity.symbol}-{item.massNumber}</button></th>
                <td>{item.massNumber}</td><td>{item.mass ? <>{item.mass}{item.massUncertainty && <> ± {item.massUncertainty}</>}{item.massStatus === 'predicted' && <small className="profile-predicted">{tr('predicted')}</small>}</> : tr('unknown')}</td>
                <td>{item.abundance ?? tr('unknown')}{item.abundanceUncertainty && ` ± ${item.abundanceUncertainty}`}</td>
                <td>{item.stable ? tr('stable') : item.halfLife ? tr('radioactive') : tr('unknown')}</td>
                <td>{item.stable ? '—' : item.halfLife ? `${item.halfLifeOperator ?? ''}${item.halfLife}${item.halfLifeUncertainty ? `(${item.halfLifeUncertainty})` : ''} ${item.halfLifeUnit}` : tr('unknown')}</td>
                <td>{item.decayModes.join(', ') || (item.stable ? '—' : tr('unknown'))}</td>
              </tr>)}</tbody></table></div>
            </>}
          </div>
          <details className="profile-sources"><summary>{tr('sources')}</summary><p>{tr('version')} {referenceVersion} · {tr('retrieved')}: {referenceRetrievedAt}. {tr('sourcesIntro')}</p><ul>{sourceEntries.map(entry => <li key={entry.href}><Source href={entry.href}>{sourceEntryName(entry, language)}</Source><span> — {entry.fields.map(field => tr(field)).join(', ')}</span></li>)}</ul><p><a href="/help#element-data-sources" onClick={onHelp}>{tr('sourcesHelp')}</a></p></details>
        </div>
      </div>
    </section>
  </div>
}
