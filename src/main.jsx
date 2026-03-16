import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { runMigrations } from './migrations/index.js'
import { runQuizQuestionsMigrations } from './migrations/quizQuestions.js'

runMigrations()
runQuizQuestionsMigrations()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
