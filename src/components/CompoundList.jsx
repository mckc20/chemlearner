import { useState } from 'react'
import FormulaDisplay from './FormulaDisplay'

export default function CompoundList({ compounds, onView, selectedIds, onSelectionChange }) {
  const [categoryFilter, setCategoryFilter] = useState('All')

  const categories = ['All', ...new Set(compounds.map(c => c.category))]
  const sorted = [...compounds].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )
  const filtered = categoryFilter === 'All'
    ? sorted
    : sorted.filter(c => c.category === categoryFilter)

  function toggleSelect(id) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange(next)
  }

  function toggleSelectAll() {
    if (filtered.every(c => selectedIds.has(c.id))) {
      const next = new Set(selectedIds)
      filtered.forEach(c => next.delete(c.id))
      onSelectionChange(next)
    } else {
      const next = new Set(selectedIds)
      filtered.forEach(c => next.add(c.id))
      onSelectionChange(next)
    }
  }

  const allFilteredSelected = filtered.length > 0 && filtered.every(c => selectedIds.has(c.id))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm text-gray-600 dark:text-gray-400">
            Category:
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} compound{filtered.length !== 1 ? 's' : ''}
          {selectedIds.size > 0 && ` · ${selectedIds.size} selected`}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="w-10 px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all visible compounds"
                  className="rounded"
                />
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Formula</th>
              <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Category</th>
              <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-300 hidden md:table-cell">Information</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">
                  No compounds found.
                </td>
              </tr>
            ) : (
              filtered.map(compound => (
                <tr
                  key={compound.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(compound.id)}
                      onChange={() => toggleSelect(compound.id)}
                      aria-label={`Select ${compound.name}`}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900 dark:text-gray-100">
                    <button
                      onClick={() => onView(compound)}
                      className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-left"
                    >
                      {compound.name}
                    </button>
                  </td>
                  <td className="px-3 py-3 font-mono text-gray-700 dark:text-gray-300">
                    <FormulaDisplay formula={compound.formula} />
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                      {compound.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {compound.information}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
