import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">
            ChemLearner 3D
          </span>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Library</span>
            <span>Quiz</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Phase 1 scaffold — ready for Phase 2.
        </p>
      </main>
    </div>
  )
}
