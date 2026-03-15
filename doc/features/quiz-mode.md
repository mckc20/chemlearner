# Quiz Mode

## Overview

Quiz Mode tests the user's knowledge of molecules in their library. Users select 2+ molecules from the library, then answer multiple-choice questions identifying each molecule's name or formula from its 3D structure.

## Flow

1. **Selection** — User checks molecules in the library table, clicks "Start Quiz"
2. **Questions** — One question per selected molecule, shuffled order. Each shows:
   - A prompt ("What is the **name/formula** of this molecule?")
   - An interactive 3D ball-and-stick model (3Dmol.js)
   - 2–4 multiple-choice option buttons
3. **Feedback** — After answering, correct option highlights green, wrong highlights red. "Next" button advances.
4. **Results** — Score summary (fraction + percentage, color-coded), per-question breakdown, and three actions:
   - **Back to Library** — returns to library view
   - **Retry** — restarts with same molecules, reshuffled questions and options
   - **Practice Mistakes** — starts new quiz with only incorrectly answered molecules

## Question Generation

- Question type (`name` or `formula`) is randomly chosen per question
- If a molecule's formula is shared by another selected molecule, the question defaults to `name` type to avoid ambiguity
- Distractors are drawn from the full molecule library (not just selected molecules), deduplicated
- Option count adapts: 2 options for 2 molecules, 3 for 3, 4 for 4+

## Quiz History

Completed quizzes are automatically saved to `localStorage` (key: `chemlearner_quiz_history`) and viewable in the "Quiz History" tab. Each entry shows:

- Date, score, question count
- Expandable per-question breakdown with molecule name, question type, user answer vs correct answer
- Actions: Retry, Practice Mistakes, Delete

If molecules have been deleted from the library since a quiz was taken, retry/practice-mistakes filters them out and warns if fewer than 2 remain.

## Files

| File | Purpose |
|---|---|
| `src/hooks/useQuizHistory.js` | localStorage persistence for quiz results |
| `src/components/QuizMode.jsx` | Quiz orchestrator: builds questions, manages state machine |
| `src/components/QuizQuestion.jsx` | Single question view with inline 3D viewer |
| `src/components/QuizResults.jsx` | Score summary with retry/practice-mistakes actions |
| `src/components/QuizHistory.jsx` | Historical quiz list with expandable detail |

## Data Model

```javascript
{
  id: 'quiz-{timestamp}',
  date: 'ISO string',
  score: number,
  total: number,
  questions: [{
    moleculeId, moleculeName, moleculeFormula,
    type: 'name' | 'formula',
    options: string[],
    correctIndex: number,
    userAnswer: number | null
  }]
}
```

## Edge Cases

- **PubChem fetch failure**: shows error with "Skip" button (counts as unanswered)
- **Exit mid-quiz**: returns to library, quiz is NOT saved
- **Retry with deleted molecules**: filters them out; shows alert if < 2 remain
- **Single mistake**: Practice Mistakes works with 1 molecule (distractors from full library)
