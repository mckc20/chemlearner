# ChemLearner 3D — Implementation Plan

## Context

ChemLearner 3D is a fully implemented React web app for managing chemical compound libraries, visualizing compounds in interactive 3D, and testing knowledge via quizzes. Deployed on Netlify.

This document tracks what has been built across all phases. All phases are **complete**.

---

## Phase 1: Project Scaffold & Foundation ✅

**Goal:** Get a working React + Vite app with Tailwind CSS running locally.

### Implemented
1. Scaffolded with Vite + React
2. Installed core dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `papaparse`
3. 3Dmol.js and RDKit loaded via CDN in `index.html`
4. Configured Tailwind with `darkMode: 'media'` (auto dark/light via `prefers-color-scheme`)
5. Base layout shell: `App.jsx` with navigation bar (Library, History), main content area, footer with version info
6. Configured ESLint + Vitest with jsdom environment

**Critical files:** `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `src/main.jsx`, `src/App.jsx`

---

## Phase 2: Data Layer & Library Management ✅

**Goal:** Compounds stored in `localStorage`, pre-loaded defaults, library management.

### Implemented
1. Compound data schema: `{ id, name, formula, category, information, wikipediaUrl, pubchemUrl, wikidataId, smiles }`
2. `src/hooks/useCompoundLibrary.js` — custom hook managing state + localStorage sync
   - Pre-loads **36 default compounds** with educational facts, quiz questions, and external links
   - Data versioning (DATA_VERSION = 7) with migration system
3. `src/components/CompoundList.jsx` — responsive table with:
   - Category filter dropdown (dynamically built from data)
   - Text filter input (searches name, formula, category, information)
   - Per-row checkboxes with select-all header checkbox
   - Compound count display
   - Filter reset on language change
4. CSV **export** for selected compounds (full schema with proper escaping)
5. `src/data/defaultCompounds.js` — 36 compounds (Water, Sulphuric Acid, Salt, Nitroglycerin, Acetic Acid, Ammonia, Aspirin, Caffeine, Glucose, amino acids, DNA bases, and more)
6. `src/migrations/index.js` — data migration system (v0→v7) handling schema backfills, default syncing, and alphabetical sorting

**Critical files:** `src/hooks/useCompoundLibrary.js`, `src/components/CompoundList.jsx`, `src/data/defaultCompounds.js`, `src/migrations/index.js`

### Notes
- CSV import and manual "Add Compound" were removed in favor of a curated default library with CSV export
- `_userModified` flag tracks whether a user has edited a default compound, preventing migration overwrites

---

## Phase 3: Molecular Resolution Pipeline ✅

**Goal:** Given a formula or SMILES, render an interactive 3D molecule.

### Implemented
1. `src/services/pubchem.js`:
   - `resolveCompound(formula, smiles)` — SMILES-first lookup, formula fallback with async ListKey polling
   - 3D SDF preferred; 2D fallback for ionic compounds (e.g., NaCl)
   - Ambiguity detection: returns `isAmbiguous: true` when multiple isomers found
   - Cache in `localStorage` with 7-day TTL + app version validation
   - Rate limiting: 200ms throttle between requests (5 req/s)
2. `src/services/rdkit.js`:
   - `smilesToSvg(smiles)` — generates 2D skeletal structure SVGs via RDKit WASM (lazy-loaded singleton)
   - `molblockToSvg(molblock)` — alternative SVG generation from SDF molblocks
3. `src/components/CompoundViewer.jsx` — modal with:
   - Interactive 3D viewer via 3Dmol.js (ball-and-stick style)
   - Ambiguity warning banner
   - Formula display with proper subscripts/superscripts (`FormulaDisplay.jsx`)
   - Links to Wikipedia, PubChem, Wikidata
   - Expandable compound facts section
   - Escape key and click-outside to close
4. `src/components/CompareModal.jsx` — side-by-side dual compound comparison with 3D viewers
5. Clicking a compound name in the list opens `CompoundViewer`

**Critical files:** `src/services/pubchem.js`, `src/services/rdkit.js`, `src/components/CompoundViewer.jsx`, `src/components/CompareModal.jsx`, `src/components/FormulaDisplay.jsx`

---

## Phase 4: Quiz Mode ✅

**Goal:** Checkbox-select compounds, start quizzes using 3D models and educational content.

### Implemented
1. "Start Quiz" button in `CompoundList` — enabled when ≥2 compounds are checked
2. `src/components/QuizSetup.jsx` — quiz configuration screen with:
   - **6 quiz types** (significantly exceeding original 2):
     1. Formula-from-Name
     2. Name-from-Formula
     3. Name-from-Structure (3D model prompt)
     4. Structure-from-Name (visual multiple choice with mini-structures)
     5. Category-from-Structure
     6. General-Knowledge (fact-based questions from `defaultQuizQuestions.js`)
   - Question count slider (1–10)
   - Disabled state for GK type when no questions available
3. `src/components/QuizMode.jsx` — quiz engine with:
   - Fisher-Yates shuffle for question ordering
   - Three phases per question: question → feedback → results
   - Progress bar showing completion
   - Distractor pool selection with `pickDistractors()`
4. `src/components/QuizQuestion.jsx` — renders per question type:
   - Text options for Name/Formula questions
   - Mini-structure SVG options for visual questions
   - Color-coded feedback (green correct, red wrong)
5. `src/components/QuizResults.jsx` — results screen with:
   - Color-coded score (green ≥80%, amber ≥50%, red <50%)
   - Per-question breakdown with correct/wrong indicators
   - "Back to Library", "Retry", and "Practice Mistakes" buttons
6. `src/hooks/useQuizHistory.js` + `src/components/QuizHistory.jsx`:
   - Quiz history persisted to localStorage
   - Collapsible entries with score, date, quiz type
   - Retry and practice-mistakes from history
   - Localized date formatting (de-DE / en-US)
7. `src/data/defaultQuizQuestions.js` — 100+ general-knowledge questions across 36 compounds

**Critical files:** `src/components/QuizSetup.jsx`, `src/components/QuizMode.jsx`, `src/components/QuizQuestion.jsx`, `src/components/QuizResults.jsx`, `src/components/QuizHistory.jsx`, `src/hooks/useQuizHistory.js`, `src/data/defaultQuizQuestions.js`

---

## Phase 5: Polish & Deployment ✅

**Goal:** Production-ready build deployed to Netlify.

### Implemented
1. **Loading states**: Spinners for 3D structure resolution, SVG generation, quiz option loading
2. **Error handling**: Graceful fallbacks in CompoundStructure, MiniStructure, and quiz components
3. **Accessibility**: ARIA labels on checkboxes, modal close buttons, quiz answer buttons; Escape key closes modals; tab navigation
4. **Unit tests**:
   - `App.test.jsx` — renders app title
   - `hooks/useCompoundLibrary.test.js` — pre-load defaults, localStorage persistence
   - `migrations/index.test.js` — migration logic
   - `migrations/quizQuestions.test.js` — quiz question migrations
5. **Netlify deployment**: `netlify.toml` with build command, publish dir, and SPA redirect rule
6. **Internationalization (i18n)** — full English + German support:
   - `LanguageContext.jsx` with browser language detection and localStorage persistence
   - Translation files: `ui.en.js`, `ui.de.js`, `compounds.de.js`, `compoundFacts.de.js`, `quizQuestions.de.js`, `categories.de.js`
   - Translation functions: `t()`, `tp()` (plural), `translateCompound()`, `getTranslatedFacts()`, `translateQuestion()`
   - `LanguageSwitch` component (DE/EN toggle in header)
   - Filter reset on language change
7. **Build versioning**: Commit hash + Vienna-timezone timestamp in footer
8. **Performance**: Code splitting via Vite, lazy-loaded RDKit WASM, PubChem result caching (7-day TTL), 200ms API throttle, `useMemo` in QuizMode

**Critical files:** `netlify.toml`, `src/i18n/`, `src/components/LanguageSwitch.jsx`, `src/setupTests.js`

---

## Architecture Overview

```
src/
├── App.jsx                    # Main orchestrator (views: library, quiz-setup, quiz, history)
├── main.jsx                   # Entry point with LanguageProvider and migrations
├── components/
│   ├── CompoundList.jsx       # Library table with filters, selection, actions
│   ├── CompoundViewer.jsx     # 3D compound detail modal
│   ├── CompoundFacts.jsx      # Educational facts display
│   ├── CompareModal.jsx       # Side-by-side compound comparison
│   ├── FormulaDisplay.jsx     # Chemical formula rendering (subscripts/superscripts)
│   ├── LanguageSwitch.jsx     # DE/EN language toggle
│   ├── QuizSetup.jsx          # Quiz type and question count selection
│   ├── QuizMode.jsx           # Quiz engine (question flow, scoring)
│   ├── QuizQuestion.jsx       # Individual question rendering
│   ├── QuizResults.jsx        # Score and breakdown display
│   └── QuizHistory.jsx        # Past quiz results browser
├── hooks/
│   ├── useCompoundLibrary.js  # Compound CRUD + localStorage
│   ├── useQuizHistory.js      # Quiz history persistence
│   └── useQuizQuestions.js    # Quiz question management
├── services/
│   ├── pubchem.js             # PubChem API client (resolve, cache, rate limit)
│   └── rdkit.js               # RDKit WASM 2D SVG generation
├── data/
│   ├── defaultCompounds.js    # 36 pre-loaded compounds
│   └── defaultQuizQuestions.js # 100+ general-knowledge questions
├── i18n/
│   ├── LanguageContext.jsx    # Language state provider
│   ├── translate.js           # Translation lookup functions
│   ├── ui.en.js / ui.de.js   # UI string translations
│   ├── compounds.de.js        # German compound names/info
│   ├── compoundFacts.de.js    # German educational facts
│   ├── quizQuestions.de.js    # German quiz questions
│   └── categories.de.js       # German category names
└── migrations/
    ├── index.js               # Compound data migrations (v0–v7)
    └── quizQuestions.js        # Quiz question migrations
```

---

## Dependency Summary

```bash
npm install papaparse
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom
# 3Dmol.js and RDKit loaded via CDN script tags in index.html
```

## Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| PubChem rate limit (5 req/s) | Cache results in localStorage (7-day TTL); 200ms throttle between requests |
| PubChem async formula search | Poll ListKey until results ready; timeout after 30 attempts |
| Ionic compounds lack 3D conformers | Fall back to 2D SDF from PubChem |
| 3Dmol.js SSR issues | Guard with `useEffect` + `useRef`; never render server-side |
| RDKit WASM load time | Lazy-load on first use; singleton pattern prevents re-initialization |
| Data schema evolution | Migration system handles v0→v7 upgrades; `_userModified` protects user edits |
