/* eslint-disable react/prop-types */
import { profileText } from '../i18n/elementProfile'

export default function AtomDiagram({ model, profile, onChange, language, children }) {
  const tr = key => profileText(language, key)
  const { shells, protons, neutrons, electrons } = model
  const particles = Math.min(protons + neutrons, 60)
  return <div className="atom-model">
    <div className="atom-visualization">
    <svg viewBox="0 0 320 320" role="img" aria-label={`${tr('protons')}: ${protons}; ${tr('neutrons')}: ${neutrons}; ${tr('electrons')}: ${electrons}. ${tr('model')}`}>
      <g aria-hidden="true">
        {shells.map((count, index) => {
          const radius = shells.length === 1 ? 110 : 52 + index * 78 / (shells.length - 1)
          return <g key={index} className={profile.shell === index + 1 ? 'atom-shell selected' : 'atom-shell'}>
            <circle cx="160" cy="160" r={radius} className="atom-orbit" onClick={() => onChange({ shell: index + 1 })} />
            <g className="atom-electrons" style={{ animationDuration: `${22 + index * 4}s`, animationPlayState: profile.paused ? 'paused' : 'running' }}>
              {Array.from({ length: count }, (_, electron) => {
                const angle = (electron / count) * Math.PI * 2 + index
                return <circle key={electron} cx={160 + radius * Math.cos(angle)} cy={160 + radius * Math.sin(angle)} r="3" className="atom-electron" />
              })}
            </g>
          </g>
        })}
        {Array.from({ length: particles }, (_, index) => {
          const radius = 3.5 * Math.sqrt(index)
          const angle = index * 2.39996
          const proton = index < Math.round(particles * protons / (protons + neutrons))
          return <circle key={index} cx={160 + radius * Math.cos(angle)} cy={160 + radius * Math.sin(angle)} r="3.1" className={proton ? 'atom-proton' : 'atom-neutron'} />
        })}
      </g>
    </svg>
    <button type="button" className="profile-icon-control atom-motion-control" aria-label={tr(profile.paused ? 'resume' : 'pause')} title={tr(profile.paused ? 'resume' : 'pause')} onClick={() => onChange({ paused: !profile.paused })}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        {profile.paused ? <path d="m10 8 6 4-6 4Z" fill="currentColor" strokeLinejoin="round" /> : <path d="M9 8v8m6-8v8" strokeLinecap="round" />}
      </svg>
    </button>
    </div>
    {children}
    <dl className="atom-counts" aria-live="polite">
      {Object.entries({ protons, neutrons, electrons }).map(([key, count]) => <div key={key}><dt>{tr(key)}</dt><dd data-testid={`atom-${key}`}>{count}</dd></div>)}
    </dl>
    <div className="shell-controls" aria-label={tr('selectShell')}>
      {shells.map((count, index) => <button key={index} type="button" aria-pressed={profile.shell === index + 1} onFocus={() => onChange({ shell: index + 1 })} onClick={() => onChange({ shell: index + 1 })}>{tr('shell')} {index + 1}: {count}</button>)}
    </div>
  </div>
}
