import { useState } from 'react'

export default function AddMoleculeModal({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [formula, setFormula] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onAdd({
      name: name.trim(),
      formula: formula.trim(),
      category: category.trim(),
      description: description.trim(),
    })
  }

  const isValid = name.trim() && formula.trim() && category.trim() && description.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Add Molecule</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              id="add-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Water"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="add-formula" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Formula</label>
            <input
              id="add-formula"
              type="text"
              value={formula}
              onChange={e => setFormula(e.target.value)}
              placeholder="e.g. H2O"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
            />
          </div>
          <div>
            <label htmlFor="add-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <input
              id="add-category"
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g. Solvent"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="add-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              id="add-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Educational context about the molecule"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
