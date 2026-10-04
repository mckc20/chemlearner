/* eslint-disable react/prop-types */
import ThemeSwitch from './ThemeSwitch'

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <div className="landing-page__grid" aria-hidden="true" />

      <header className="landing-header">
        <a className="landing-brand" href="/" onClick={(event) => onNavigate(event, '/')}> 
          <span className="landing-brand__logo brand-logo" aria-hidden="true" />
          ChemLearner
        </a>
        <nav aria-label="Primary navigation">
          <div className="landing-actions">
            <a className="landing-library-tab" href="/compounds" onClick={(event) => onNavigate(event, '/compounds')}>
              Compound Library
              <span aria-hidden="true">↗</span>
            </a>
            <a className="landing-library-tab" href="/periodic-table" onClick={(event) => onNavigate(event, '/periodic-table')}>
              Periodic table
              <span aria-hidden="true">↗</span>
            </a>
            <ThemeSwitch />
          </div>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="landing-hero__eyebrow">A visual chemistry learning space</div>
        <h1>Explore molecular worlds.</h1>
        <p>Visualise compounds, uncover their structures, and learn about the pieces that make up our worlds.</p>
      </main>

      <div className="landing-page__caption">01 — Discover the structure behind the formula</div>
    </div>
  )
}
