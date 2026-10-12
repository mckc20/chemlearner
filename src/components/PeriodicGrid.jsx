/* eslint-disable react/prop-types */
import { mainElements, detachedElements } from '../data/periodicElements'

export default function PeriodicGrid({ renderCell, label, prompt }) {
  return (
    <div className="overflow-x-auto pb-2" role="region" aria-label={label} tabIndex="0">
      <div className="min-w-[900px] space-y-2">
        <div className="periodic-grid">
          {prompt && <div className="periodic-quiz-prompt">{prompt}</div>}
          {mainElements.map(element => (
            <div key={element.number} className="periodic-slot" style={{ gridColumn: element.group, gridRow: element.period }}>
              {renderCell(element)}
            </div>
          ))}
        </div>
        <div className="periodic-grid periodic-grid--detached">
          {detachedElements.map(element => (
            <div key={element.number} className="periodic-slot" style={{ gridColumn: element.group + 3, gridRow: element.period - 7 }}>
              {renderCell(element)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
