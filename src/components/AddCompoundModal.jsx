import { useState } from 'react'

export default function AddCompoundModal({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [formula, setFormula] = useState('')
  const [category, setCategory] = useState('')
  const [information, setInformation] = useState('')
  const [wikipediaUrl, setWikipediaUrl] = useState('')
  const [pubchemUrl, setPubchemUrl] = useState('')
  const [wikidataId, setWikidataId] = useState('')
  const [smiles, setSmiles] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onAdd({
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
        <h2 className="text-lg font-semibold mb-4">Add Compound</h2>
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
            <label htmlFor="add-information" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Information</label>
            <textarea
              id="add-information"
              value={information}
              onChange={e => setInformation(e.target.value)}
              rows={3}
              placeholder="Educational context about the compound"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="add-smiles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SMILES</label>
            <input
              id="add-smiles"
              type="text"
              value={smiles}
              onChange={e => setSmiles(e.target.value)}
              placeholder="e.g. O"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
            />
          </div>
          <div>
            <label htmlFor="add-wikipedia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wikipedia URL</label>
            <input
              id="add-wikipedia"
              type="url"
              value={wikipediaUrl}
              onChange={e => setWikipediaUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="add-pubchem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PubChem URL</label>
            <input
              id="add-pubchem"
              type="url"
              value={pubchemUrl}
              onChange={e => setPubchemUrl(e.target.value)}
              placeholder="https://pubchem.ncbi.nlm.nih.gov/compound/..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="add-wikidata" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wikidata ID</label>
            <input
              id="add-wikidata"
              type="text"
              value={wikidataId}
              onChange={e => setWikidataId(e.target.value)}
              placeholder="e.g. Q283"
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
