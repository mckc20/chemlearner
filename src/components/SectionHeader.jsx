/* eslint-disable react/prop-types */
export default function SectionHeader({ number, title, description, headingId, actions }) {
  return (
    <header className="section-header">
      <span className="section-header__number">{number}</span>
      <span className="section-header__rule" aria-hidden="true" />
      {actions ? (
        <div className="section-header__title-row">
          <h1 id={headingId} className="section-header__title">{title}</h1>
          <div className="section-header__actions">{actions}</div>
        </div>
      ) : (
        <h1 id={headingId} className="section-header__title">{title}</h1>
      )}
      {description && <p className="section-header__description">{description}</p>}
    </header>
  )
}
