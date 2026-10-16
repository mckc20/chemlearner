/* eslint-disable react/prop-types */
import TopNavigation from './TopNavigation'

export default function LandingPage({ onNavigate, pathname }) {
  return (
    <div className="landing-page">
      <div className="landing-page__grid" aria-hidden="true" />

      <TopNavigation onNavigate={onNavigate} pathname={pathname} />

      <main className="landing-hero">
        <h1>Explore molecular worlds.</h1>
        <p>Visualise compounds, uncover their structures, and learn about the pieces that make up our worlds.</p>
      </main>

      <div className="landing-page__caption">01 — Discover the structure behind the formula</div>
    </div>
  )
}
