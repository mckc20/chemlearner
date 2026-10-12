/* eslint-disable react/prop-types */
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'
import CompoundFacts from './CompoundFacts'

export default function CompoundDetails({ compound }) {
  const { language } = useLanguage()
  const links = [
    ['Wikipedia', compound.wikipediaUrl],
    ['PubChem', compound.pubchemUrl],
    [`Wikidata (${compound.wikidataId})`, compound.wikidataId && `https://www.wikidata.org/wiki/${compound.wikidataId}`],
  ].filter(([, href]) => href)

  return <div className="compound-details">
    <dl className="compound-fields">
      {['category', 'information', 'smiles'].map(key => <div key={key}>
        <dt>{t(language, `field.${key}`)}</dt>
        <dd className={key === 'smiles' && compound[key] ? 'compound-smiles' : ''}>{compound[key] || <span className="compound-empty">{t(language, 'field.empty')}</span>}</dd>
      </div>)}
    </dl>
    {compound.id && <CompoundFacts compoundId={compound.id} compact />}
    <section className="compound-links" aria-label={t(language, 'field.links')}>
      <h3>{t(language, 'field.links')}</h3>
      <div>{links.length ? links.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name}</a>) : <span className="compound-empty">{t(language, 'field.empty')}</span>}</div>
    </section>
  </div>
}
