/* eslint-disable react/prop-types */
import { useLanguage } from '../i18n/LanguageContext'
import { t } from '../i18n/translate'
import PeriodicQuizDialog from './PeriodicQuizDialog'
import { PeriodicQuizSetupForm } from './PeriodicQuizSettings'

export default function PeriodicQuizSetupDialog({ onCancel, onStart }) {
  const { language } = useLanguage()
  return <PeriodicQuizDialog title={t(language, 'periodicQuiz.setupTitle')} onCancel={onCancel}>
    <PeriodicQuizSetupForm onCancel={onCancel} onStart={onStart} />
  </PeriodicQuizDialog>
}
