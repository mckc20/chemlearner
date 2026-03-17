import { useState, useRef } from 'react'
import Papa from 'papaparse'

const REQUIRED_COLUMNS = ['Name', 'Formula', 'Category', 'Information', 'WikipediaUrl', 'PubchemUrl', 'WikidataId', 'SMILES']

export default function CSVUploader({ onImport }) {
  const [status, setStatus] = useState(null) // { type: 'success'|'error', message }
  const [errors, setErrors] = useState([])
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file) return
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setStatus({ type: 'error', message: 'Please upload a .csv file.' })
      setErrors([])
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const headers = results.meta.fields ?? []
        const missing = REQUIRED_COLUMNS.filter(col => !headers.includes(col))
        if (missing.length > 0) {
          setStatus({
            type: 'error',
            message: `CSV is missing required column(s): ${missing.join(', ')}`,
          })
          setErrors([])
          return
        }

        const { imported, errors: rowErrors } = onImport(results.data)
        setErrors(rowErrors)

        if (imported === 0 && rowErrors.length > 0) {
          setStatus({ type: 'error', message: 'No compounds imported due to errors below.' })
        } else if (imported > 0 && rowErrors.length > 0) {
          setStatus({
            type: 'success',
            message: `Imported ${imported} compound${imported !== 1 ? 's' : ''}. ${rowErrors.length} row${rowErrors.length !== 1 ? 's' : ''} skipped.`,
          })
        } else if (imported > 0) {
          setStatus({
            type: 'success',
            message: `Successfully imported ${imported} compound${imported !== 1 ? 's' : ''}.`,
          })
        } else {
          setStatus({ type: 'error', message: 'CSV contained no valid rows to import.' })
        }

        // Reset file input so the same file can be re-selected
        if (inputRef.current) inputRef.current.value = ''
      },
      error(err) {
        setStatus({ type: 'error', message: `Failed to parse CSV: ${err.message}` })
        setErrors([])
      },
    })
  }

  function handleChange(e) {
    handleFile(e.target.files?.[0])
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Drop a CSV file here, or{' '}
          <label className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
            browse
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleChange}
              className="sr-only"
              aria-label="Upload CSV file"
            />
          </label>
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Required columns: {REQUIRED_COLUMNS.join(', ')}
        </p>
      </div>

      {status && (
        <div
          className={`mt-3 px-3 py-2 rounded text-sm ${
            status.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </div>
      )}

      {errors.length > 0 && (
        <ul className="mt-2 space-y-1">
          {errors.map((err, i) => (
            <li key={i} className="text-xs text-red-600 dark:text-red-400">
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
