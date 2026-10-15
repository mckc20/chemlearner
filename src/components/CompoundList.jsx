/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { t, tp } from '../i18n/translate'
import FormulaDisplay from './FormulaDisplay'
import CompoundCardImage from './CompoundCardImage'

const LAYOUT_STORAGE_KEY = 'chemlearner_compound_layout'
const IMAGE_STORAGE_KEY = 'chemlearner_compound_card_image'

function readPreference(key, fallback, values) {
  try {
    const value = localStorage.getItem(key)
    return values.includes(value) ? value : fallback
  } catch {
    return fallback
  }
}

export default function CompoundList({ compounds, onView, selectedIds, onSelectionChange }) {
  const { language } = useLanguage()
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [textFilter, setTextFilter] = useState('')
  const [layout, setLayout] = useState(() => readPreference(LAYOUT_STORAGE_KEY, 'table', ['table', 'grid']))
  const [cardImage, setCardImage] = useState(() => readPreference(IMAGE_STORAGE_KEY, 'skeleton', ['skeleton', '3d']))

  useEffect(() => {
    try { localStorage.setItem(LAYOUT_STORAGE_KEY, layout) } catch { /* Storage can be unavailable. */ }
  }, [layout])

  useEffect(() => {
    try { localStorage.setItem(IMAGE_STORAGE_KEY, cardImage) } catch { /* Storage can be unavailable. */ }
  }, [cardImage])

  useEffect(() => {
    setCategoryFilter('All')
    setTextFilter('')
  }, [language])

  // Build category list from the raw (English) category values for filtering
  const rawCategories = ['All', ...new Set(compounds.map(c => c.category))]
  const sorted = [...compounds].sort((a, b) =>
    a.name.localeCompare(b.name, language === 'de' ? 'de' : undefined, { sensitivity: 'base' })
  )
  const afterCategory = categoryFilter === 'All'
    ? sorted
    : sorted.filter(c => c.category === categoryFilter)
  const filtered = textFilter
    ? afterCategory.filter(c => {
        const q = textFilter.toLowerCase()
        return c.name.toLowerCase().includes(q)
          || c.formula.toLowerCase().includes(q)
          || c.category.toLowerCase().includes(q)
          || (c.information && c.information.toLowerCase().includes(q))
      })
    : afterCategory

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
      <div className="compound-list-toolbar mb-4">
        <div className="compound-list-filters">
          <label htmlFor="category-filter" className="text-sm text-gray-600 dark:text-gray-400">
            {t(language, 'list.categoryLabel')}
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="library-category-filter text-sm border rounded px-2 py-1"
          >
            {rawCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? t(language, 'list.categoryAll') : cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={textFilter}
            onChange={e => setTextFilter(e.target.value)}
            placeholder={t(language, 'list.filterPlaceholder')}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="compound-list-toolbar__right">
          {layout === 'grid' && filtered.length > 0 && (
            <label className="compound-list-select-visible">
              <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll} className="rounded" />
              <span>{t(language, 'list.selectAll')}</span>
            </label>
          )}
          <div className="compound-list-view-switch" role="group" aria-label={t(language, 'list.layoutLabel')}>
            <button type="button" aria-pressed={layout === 'table'} onClick={() => setLayout('table')}>
              {t(language, 'list.layoutTable')}
            </button>
            <button type="button" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}>
              {t(language, 'list.layoutGrid')}
            </button>
          </div>
          <label className="compound-list-image-setting">
            <span>{t(language, 'list.imageTypeLabel')}</span>
            <select value={cardImage} onChange={event => setCardImage(event.target.value)} aria-label={t(language, 'list.imageTypeLabel')}>
              <option value="skeleton">{t(language, 'list.imageSkeleton')}</option>
              <option value="3d">{t(language, 'list.image3d')}</option>
            </select>
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tp(language, 'list.compoundCount', filtered.length)}
            {selectedIds.size > 0 && ` · ${t(language, 'list.selected', { count: selectedIds.size })}`}
          </span>
        </div>
      </div>

      {layout === 'grid' ? (
        filtered.length === 0 ? (
          <p className="border-y border-gray-200 dark:border-gray-700 py-8 text-center text-gray-400 dark:text-gray-500">{t(language, 'list.noCompounds')}</p>
        ) : (
          <div className="compound-card-grid" role="list" aria-label={t(language, 'list.compoundGrid')}>
            {filtered.map(compound => (
              <article key={compound.id} role="listitem" className="compound-library-card">
                <button
                  type="button"
                  onClick={() => onView(compound)}
                  aria-label={t(language, 'list.openCompound', { name: compound.name })}
                  className="compound-library-card__open"
                >
                  <div className="compound-library-card__image">
                    <CompoundCardImage compound={compound} imageType={cardImage} />
                  </div>
                  <div className="compound-library-card__content">
                    <div className="compound-library-card__details">
                      {compound.name}
                      <div className="compound-library-card__formula"><FormulaDisplay formula={compound.formula} /></div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                        {compound.category}
                      </span>
                    </div>
                  </div>
                </button>
                <input
                  type="checkbox"
                  checked={selectedIds.has(compound.id)}
                  onChange={() => toggleSelect(compound.id)}
                  aria-label={t(language, 'list.selectOne', { name: compound.name })}
                  className="compound-library-card__select rounded"
                />
              </article>
            ))}
          </div>
        )
      ) : <div className="overflow-x-auto border-y border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="w-10 px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleSelectAll}
                  aria-label={t(language, 'list.selectAll')}
                  className="rounded"
                />
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-300">{t(language, 'table.name')}</th>
              <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-300">{t(language, 'table.formula')}</th>
              <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-300">{t(language, 'table.category')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">
                  {t(language, 'list.noCompounds')}
                </td>
              </tr>
            ) : (
              filtered.map(compound => (
                <tr
                  key={compound.id}
                  onClick={() => onView(compound)}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(compound.id)}
                      onChange={() => toggleSelect(compound.id)}
                      onClick={event => event.stopPropagation()}
                      aria-label={t(language, 'list.selectOne', { name: compound.name })}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900">
                    <button
                      className="compound-list__name hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-left"
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>}
    </div>
  )
}
