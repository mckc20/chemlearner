import { QUIZ_QUESTIONS_VERSION, DEFAULT_QUIZ_QUESTIONS } from '../data/defaultQuizQuestions.js'

const QUIZ_QUESTIONS_KEY = 'chemlearner_quiz_questions'
const QUIZ_VERSION_KEY = 'chemlearner_quiz_questions_version'
const DELETED_QUIZ_DEFAULTS_KEY = 'chemlearner_deleted_quiz_defaults'

function getStoredVersion() {
  const raw = localStorage.getItem(QUIZ_VERSION_KEY)
  return raw ? parseInt(raw, 10) : 0
}

function setStoredVersion(v) {
  localStorage.setItem(QUIZ_VERSION_KEY, String(v))
}

function loadQuizQuestions() {
  try {
    const raw = localStorage.getItem(QUIZ_QUESTIONS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse errors
  }
  return null
}

function saveQuizQuestions(questions) {
  localStorage.setItem(QUIZ_QUESTIONS_KEY, JSON.stringify(questions))
}

function loadDeletedDefaults() {
  try {
    const raw = localStorage.getItem(DELETED_QUIZ_DEFAULTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return []
}

// Fields to compare when checking if a question was user-modified
const COMPARE_FIELDS = ['question', 'options', 'correctIndex', 'moleculeId']

// Registry of version-specific migrations. Key = version they migrate TO.
const MIGRATIONS = {
  // Future migrations go here, e.g.:
  // 2: migrateV1toV2,
}

/**
 * Sync defaults: add new default questions, update untouched existing ones.
 */
function syncDefaults(questions) {
  const deletedDefaults = new Set(loadDeletedDefaults())
  const questionsMap = new Map(questions.map(q => [q.id, q]))

  for (const def of DEFAULT_QUIZ_QUESTIONS) {
    if (deletedDefaults.has(def.id)) continue

    const existing = questionsMap.get(def.id)
    if (!existing) {
      // New default — add it
      questions.push({ ...def, _userModified: false })
    } else if (existing._userModified !== true) {
      // Untouched default — overwrite with latest
      const idx = questions.findIndex(q => q.id === def.id)
      questions[idx] = { ...def, _userModified: false }
    }
    // If _userModified === true → leave alone
  }

  return questions
}

/**
 * Ensure all questions have the expected schema fields.
 */
function backfillSchemaFields(questions) {
  const schemaFields = {
    question: '',
    options: [],
    correctIndex: 0,
    moleculeId: '',
  }

  return questions.map(q => {
    let patched = q
    for (const [field, defaultValue] of Object.entries(schemaFields)) {
      if (patched[field] === undefined) {
        if (patched === q) patched = { ...q }
        patched[field] = defaultValue
      }
    }
    return patched
  })
}

/**
 * Main entry point. Call synchronously before React renders.
 */
export function runQuizQuestionsMigrations() {
  const storedVersion = getStoredVersion()

  if (storedVersion >= QUIZ_QUESTIONS_VERSION) return

  let questions = loadQuizQuestions()

  // First-time user: no stored data yet — just set version and return
  if (!questions) {
    setStoredVersion(QUIZ_QUESTIONS_VERSION)
    return
  }

  // Run version-specific migrations in order
  for (let v = storedVersion + 1; v <= QUIZ_QUESTIONS_VERSION; v++) {
    const migrate = MIGRATIONS[v]
    if (migrate) {
      questions = migrate(questions)
    }
  }

  // Sync defaults (add new, update untouched)
  questions = syncDefaults(questions)

  // Backfill any missing schema fields
  questions = backfillSchemaFields(questions)

  // Persist
  saveQuizQuestions(questions)
  setStoredVersion(QUIZ_QUESTIONS_VERSION)
}
