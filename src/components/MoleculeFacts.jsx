import { useState } from 'react'
import { MOLECULE_FACTS } from '../data/moleculeFacts'

export default function MoleculeFacts({ moleculeId, compact = false }) {
  const facts = MOLECULE_FACTS[moleculeId]
  const [expanded, setExpanded] = useState(false)

  if (!facts || facts.length === 0) return null

  const visibleCount = compact ? 3 : 5
  const displayed = expanded ? facts : facts.slice(0, visibleCount)
  const hasMore = facts.length > visibleCount

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
        Did you know?
      </p>
      <ul className="space-y-1.5">
        {displayed.map((fact, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="text-gray-400 dark:text-gray-500 select-none shrink-0">&bull;</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {expanded ? 'Show less' : `Show all ${facts.length} facts`}
        </button>
      )}
    </div>
  )
}
