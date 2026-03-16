# Quiz Setup Screen

## Overview

An intermediate configuration screen between selecting molecules and starting a quiz. Users choose the quiz type and number of questions before starting.

## Flow

```
"Start Quiz" button → QuizSetup screen → QuizMode (with config)
```

The `activeView` state adds a new value: `'quiz-setup'`.

## Quiz Types

| ID | Label | Prompt | Options |
|---|---|---|---|
| `formula-from-name` | Formula from Name | Molecule name (text) | 4 formula choices (text) |
| `name-from-formula` | Name from Formula | Formula (text) | 4 name choices (text) |
| `name-from-structure` | Name from Structure | 3D model | 4 name choices (text) |
| `structure-from-name` | Structure from Name | Molecule name (text) | 4 small 3D viewers (2×2 grid) |
| `category-from-structure` | Category from Structure | 3D model | 4 category choices (text) |
| `general-knowledge` | General Knowledge | Question text | 4 text choices |

## Components

### `QuizSetup.jsx`
- Radio-button grid for selecting quiz type (6 options)
- Range slider for question count (1 to max 10)
- General Knowledge type is disabled when no GK questions exist for selected molecules
- Question count clamps when switching types
- Cancel returns to library, Start launches quiz with config

### Changes to Existing Components
- **App.jsx**: New `quiz-setup` view, `quizConfig` state, routing logic
- **QuizMode.jsx**: `buildQuiz` branches on all 6 quiz types; accepts `quizConfig` and `getQuestionsForMolecules` props
- **QuizQuestion.jsx**: Conditional rendering per type — text-only, structure-prompt, or structure-options (mini 3D viewers)
- **QuizResults.jsx**: Type label mapping for all 6 types
- **QuizHistory.jsx**: Quiz type shown in summary row, type labels in detail view

## Retry Behavior
- **From results screen**: Retry/Practice Mistakes reuse existing `quizConfig` (skip setup)
- **From history**: Retry/Practice Mistakes go through setup screen so user picks type
