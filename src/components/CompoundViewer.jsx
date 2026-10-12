/* eslint-disable react/prop-types */
import { useId, useState } from 'react'
import { useDialog } from '../hooks/useDialog'
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'
import FormulaDisplay from './FormulaDisplay'
import CompoundDetails from './CompoundDetails'
import { CompoundStructure } from './CompareModal'

export default function CompoundViewer({ compound, onClose, returnFocus }) {
  const titleId = useId()
  const dialogRef = useDialog(onClose, returnFocus)
  const { language } = useLanguage()
  const [isAmbiguous, setIsAmbiguous] = useState(false)

  return <div className="dialog-scrim element-profile-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <section ref={dialogRef} role="dialog" aria-labelledby={titleId} tabIndex={-1} className="element-profile-dialog compound-dialog">
      <header className="element-profile-header">
        <h2 id={titleId}>{compound.name}</h2>
        <button type="button" onClick={onClose} aria-label={t(language, 'viewer.closeLabel')} data-initial-focus className="secondary-button compound-close">×</button>
      </header>
      <div className="compound-dialog-body">
        <aside className="compound-model-sidebar">
          <div className="compound-formula-card"><FormulaDisplay formula={compound.formula} /></div>
          {isAmbiguous && <p className="compound-ambiguity" role="status">{t(language, 'viewer.ambiguity', { formula: compound.formula })}</p>}
          <CompoundStructure key={compound.id ?? compound.formula} mol={compound} onAmbiguous={setIsAmbiguous} />
        </aside>
        <div className="compound-detail-content"><CompoundDetails compound={compound} /></div>
      </div>
    </section>
  </div>
}
