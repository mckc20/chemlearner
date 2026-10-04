/* eslint-disable react/prop-types */
export default function ProgressPath({ current, total, label = 'steps' }) {
  const safeTotal = Math.max(0, total)
  const safeCurrent = Math.max(0, Math.min(current, safeTotal))
  const activeIndex = safeCurrent - 1
  const completedCount = Math.max(activeIndex, 0)
  return (
    <div className="flex items-center gap-4" aria-label={`${safeCurrent} of ${safeTotal} ${label}`}>
      <div className="progress-path" role="img" aria-label={`${safeCurrent} of ${safeTotal} ${label}`}>
        {Array.from({ length: safeTotal }, (_, index) => (
          <span className="inline-flex items-center" key={index}>
            <span
              className={`progress-node ${index < completedCount ? 'progress-node--complete' : ''} ${index === activeIndex ? 'progress-node--current' : ''}`}
              aria-hidden="true"
            />
            {index < safeTotal - 1 && <span className={`progress-connector ${index < completedCount ? 'progress-connector--complete' : ''}`} aria-hidden="true" />}
          </span>
        ))}
      </div>
      <span className="progress-count">{safeCurrent} / {safeTotal}</span>
    </div>
  )
}
