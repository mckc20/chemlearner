/* eslint-disable react/prop-types */
import { useId, useState } from 'react'
import { compoundTabs, profileForCompound } from '../data/compoundProfiles'
import { formulaElements } from '../data/elementProfiles'
import { elementName, elements } from '../data/periodicElements'
import { useLanguage } from '../i18n/LanguageContext'
import { compoundText, localized, localizedCondition } from '../i18n/compoundProfile'
import { t } from '../i18n/translate'

function ReferenceLinks({ compound, language }) {
  const links = [
    ['Wikipedia', compound.wikipediaUrl],
    ['PubChem', compound.pubchemUrl],
    [`Wikidata (${compound.wikidataId})`, compound.wikidataId && `https://www.wikidata.org/wiki/${compound.wikidataId}`],
  ].filter(([, href]) => href)
  return <section className="compound-links" aria-label={compoundText(language, 'links')}>
    <h3>{compoundText(language, 'links')}</h3>
    <div>{links.length ? links.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name}</a>) : <span className="compound-empty">{compoundText(language, 'unavailable')}</span>}</div>
  </section>
}

function LabeledText({ label, value }) {
  if (!value) return null
  return <div><dt>{label}</dt><dd>{value}</dd></div>
}

function Property({ name, property, language }) {
  const tr = key => compoundText(language, key)
  let value = property.value
  if (name === 'state' && value) value = tr(value)
  if (name === 'solubility' && value) value = localized(language, value)
  const display = property.status === 'available' ? <>{value}{property.unit ? ` ${property.unit}` : ''}</> : tr(property.status === 'inapplicable' ? 'inapplicable' : 'unavailable')
  return <div className="profile-property">
    <dt>{tr(name)}</dt>
    <dd>{display}{property.condition && <small>{localizedCondition(language, property.condition)}</small>}{property.note && <small>{localized(language, property.note)}</small>}</dd>
  </div>
}

export default function CompoundDetails({ compound, activeTab, onTabChange, onOpenElement }) {
  const { language } = useLanguage()
  const [localTab, setLocalTab] = useState('overview')
  const selected = activeTab ?? localTab
  const selectTab = onTabChange ?? setLocalTab
  const tr = key => compoundText(language, key)
  const profile = profileForCompound(compound)
  const id = useId()

  if (!profile) return <div className="compound-details">
    <dl className="compound-fields">{['category', 'information', 'smiles'].map(key => <div key={key}><dt>{t(language, `field.${key}`)}</dt><dd className={key === 'smiles' && compound[key] ? 'compound-smiles' : ''}>{compound[key] || <span className="compound-empty">{t(language, 'field.empty')}</span>}</dd></div>)}</dl>
    <ReferenceLinks compound={compound} language={language} />
  </div>

  function tabKey(event, tab) {
    let next = compoundTabs.indexOf(tab)
    if (event.key === 'ArrowRight') next = (next + 1) % compoundTabs.length
    else if (event.key === 'ArrowLeft') next = (next + compoundTabs.length - 1) % compoundTabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = compoundTabs.length - 1
    else return
    event.preventDefault()
    selectTab(compoundTabs[next])
    document.getElementById(`${id}-${compoundTabs[next]}-tab`)?.focus()
  }

  const symbols = formulaElements(compound.formula)
  const constituents = [...(symbols ?? [])].map(symbol => elements.find(element => element.symbol === symbol)).filter(Boolean)
  return <div className="compound-details">
    <div className="profile-tabs compound-profile-tabs" role="tablist" aria-label={tr('tabs')}>
      {compoundTabs.map(tab => <button key={tab} type="button" role="tab" id={`${id}-${tab}-tab`} aria-controls={`${id}-${tab}-panel`} aria-selected={selected === tab} tabIndex={selected === tab ? 0 : -1} onClick={() => selectTab(tab)} onKeyDown={event => tabKey(event, tab)}>{tr(tab)}</button>)}
    </div>
    <div className="profile-panel" role="tabpanel" id={`${id}-${selected}-panel`} aria-labelledby={`${id}-${selected}-tab`} tabIndex={0}>
      {selected === 'overview' && <>
        <dl className="profile-facts">
          <LabeledText label={tr('commonName')} value={compound.name} />
          <LabeledText label={tr('systematic')} value={localized(language, profile.systematic)} />
          <LabeledText label={tr('formula')} value={compound.formula} />
          <LabeledText label={tr('category')} value={compound.category} />
          <LabeledText label={tr('form')} value={localized(language, profile.form)} />
        </dl>
        <dl className="profile-prose">{['description', 'appearance', 'occurrence', 'uses'].map(key => <LabeledText key={key} label={tr(key)} value={localized(language, profile.overview[key])} />)}</dl>
      </>}
      {selected === 'properties' && <dl className="profile-properties">{['mass', 'state', 'melting', 'boiling', 'density', 'solubility'].map(key => <Property key={key} name={key} property={profile.properties[key]} language={language} />)}</dl>}
      {selected === 'chemistry' && <>
        <dl className="profile-prose">
          <div><dt>{tr('elements')}</dt><dd className="compound-element-links">{constituents.map((element, index) => {
            const control = `${compound.id}-${element.symbol}`
            return <span key={element.symbol}>{index > 0 && ', '}{onOpenElement ? <button type="button" className="profile-link" data-element-control={control} onClick={() => onOpenElement(element.number, control)}>{elementName(element, language)}</button> : elementName(element, language)}</span>
          })}</dd></div>
          <LabeledText label={tr('bonding')} value={localized(language, profile.chemistry.bonding)} />
          <LabeledText label={tr('behavior')} value={localized(language, profile.chemistry.behavior)} />
          <LabeledText label={tr('production')} value={localized(language, profile.chemistry.production)} />
          <LabeledText label={tr('smiles')} value={compound.smiles && <code className="compound-smiles">{compound.smiles}</code>} />
        </dl>
        {profile.chemistry.reactions?.length > 0 && <section className="compound-reactions"><h3>{tr('reactions')}</h3>{profile.chemistry.reactions.map(item => <div key={item.equation}><p className="compound-equation">{item.equation}</p><p>{localized(language, item.explanation)}</p></div>)}</section>}
      </>}
      {selected === 'context' && <dl className="profile-prose">{['applications', 'biology', 'environment', 'hazards', 'history', 'nameOrigin'].map(key => <LabeledText key={key} label={tr(key)} value={localized(language, profile.context[key])} />)}</dl>}
    </div>
    <details className="profile-sources compound-sources"><summary>{tr('sources')}</summary>
      <ul>{profile.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a> — {tr('fields')}: {source.fields.map(tr).join(', ')}. {tr('retrieved')}: {source.retrievedAt}. {tr('version')}: {source.version}.</li>)}</ul>
      <ReferenceLinks compound={compound} language={language} />
    </details>
  </div>
}
