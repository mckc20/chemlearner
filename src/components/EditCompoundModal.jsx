import { useState } from 'react'

export default function EditCompoundModal({ compound, onSave, onCancel }) {
  const [name, setName] = useState(compound.name)
  const [formula, setFormula] = useState(compound.formula)
  const [category, setCategory] = useState(compound.category)
  const [information, setInformation] = useState(compound.information)
  const [wikipediaUrl, setWikipediaUrl] = useState(compound.wikipediaUrl)
  const [pubchemUrl, setPubchemUrl] = useState(compound.pubchemUrl)
  const [wikidataId, setWikidataId] = useState(compound.wikidataId)
  const [smiles, setSmiles] = useState(compound.smiles)

  function handleSubmit(e) {
    e.preventDefault()
    onSave(compound.id, {
      name: name.trim(),
      formula: formula.trim(),
      category: category.trim(),
      information: information.trim(),
      wikipediaUrl: wikipediaUrl.trim(),
      pubchemUrl: pubchemUrl.trim(),
      wikidataId: wikidataId.trim(),
      smiles: smiles.trim(),
    })
  }

  const isValid = name.trim() && formula.trim() && category.trim() && information.trim() && wikipediaUrl.trim() && pubchemUrl.trim() && wikidataId.trim() && smiles.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Compound</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="edit-formula" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Formula</label>
            <input
              id="edit-formula"
              type="text"
              value={formula}
              onChange={e => setFormula(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
            />
          </div>
          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <input
              id="edit-category"
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="edit-information" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Information</label>
            <textarea
              id="edit-information"
              value={information}
              onChange={e => setInformation(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="edit-smiles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SMILES</label>
            <input
              id="edit-smiles"
              type="text"
              value={smiles}
              onChange={e => setSmiles(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
            />
          </div>
          <div>
            <label htmlFor="edit-wikipedia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wikipedia URL</label>
            <input
              id="edit-wikipedia"
              type="url"
              value={wikipediaUrl}
              onChange={e => setWikipediaUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="edit-pubchem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PubChem URL</label>
            <input
              id="edit-pubchem"
              type="url"
              value={pubchemUrl}
              onChange={e => setPubchemUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="edit-wikidata" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wikidata ID</label>
            <input
              id="edit-wikidata"
              type="text"
              value={wikidataId}
              onChange={e => setWikidataId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
