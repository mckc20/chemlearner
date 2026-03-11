# ChemLearner 3D — Phased Implementation Plan

## Context

The project currently exists only as documentation (README.md, CLAUDE.md) with no source code. This plan covers building the full React application from scaffold to deployment-ready state, following the architecture defined in the docs.

---

## Phase 1: Project Scaffold & Foundation

**Goal:** Get a working React + Vite app with Tailwind CSS running locally.

### Tasks
1. Scaffold with Vite: `npm create vite@latest chemlearner -- --template react`
2. Install core dependencies:
   - `tailwindcss`, `postcss`, `autoprefixer`
   - `papaparse`
   - `3dmol` (or load via CDN)
   - `@rdkit/rdkit` (or load via CDN script tag)
3. Configure Tailwind (`tailwind.config.js`, `postcss.config.js`, `index.css`)
4. Set up `darkMode: 'media'` in Tailwind config (auto dark/light via `prefers-color-scheme`)
5. Create base layout shell: `App.jsx` with top nav, main content area
6. Configure ESLint + Vitest for testing

**Critical files:** `vite.config.js`, `tailwind.config.js`, `src/main.jsx`, `src/App.jsx`

**Verify:** `npm run dev` renders a blank app with Tailwind styles applied; dark mode toggles with OS preference.

---

## Phase 2: Data Layer & Library Management

**Goal:** Molecules stored in `localStorage`, pre-loaded defaults, full CRUD.

### Tasks
1. Define molecule data schema: `{ id, name, formula, category, description }`
2. Create `src/hooks/useMoleculeLibrary.js` — custom hook managing state + localStorage sync
   - Pre-load 4 defaults on first run: Water (H₂O), Sulphuric Acid (H₂SO₄), Salt (NaCl), Nitroglycerin (C₃H₅N₃O₉)
   - Expose: `molecules`, `addMolecule`, `deleteMolecule`, `importFromCSV`
3. Create `src/components/MoleculeList.jsx` — table/card list with:
   - Category filter dropdown
   - Per-row checkboxes (for quiz selection)
   - Delete button per row
4. Create `src/components/CSVUploader.jsx` using PapaParse:
   - Validate required columns: Name, Formula, Category, Description
   - Check for duplicate Name or Formula — show inline error
   - On success, merge into library

**Critical files:** `src/hooks/useMoleculeLibrary.js`, `src/components/MoleculeList.jsx`, `src/components/CSVUploader.jsx`

**Verify:** Add/delete molecules, upload valid and invalid CSVs, refresh page — data persists.

---

## Phase 3: Molecular Resolution Pipeline

**Goal:** Given a formula or SMILES, render an interactive 3D molecule.

### Tasks
1. Create `src/services/pubchem.js`:
   - `fetchSmiles(formula)` → GET `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/formula/{formula}/property/IsomericSMILES/JSON`
   - Handle ambiguous (multiple isomers): return first result + set `isAmbiguous: true`
   - Respect rate limit (5 req/s) — add simple request queue/debounce
2. Create `src/services/rdkit.js`:
   - Lazy-load RDKit WASM via CDN
   - `smilesToMolblock(smiles)` → returns 3D SDF molblock string
3. Create `src/components/MoleculeViewer.jsx`:
   - Mount `3Dmol.js` viewer in a `div` ref
   - Accept `molblock` prop, call `viewer.addModel(molblock, 'sdf')` + `viewer.setStyle` + `viewer.zoomTo()` + `viewer.render()`
   - Show ambiguity warning banner when `isAmbiguous` is true: *"The formula [X] is ambiguous. Displaying the most common structure (Isomer A). Use a SMILES string for specific results."*
4. Wire into `MoleculeList`: clicking a molecule row opens `MoleculeViewer` in a modal or side panel

**Critical files:** `src/services/pubchem.js`, `src/services/rdkit.js`, `src/components/MoleculeViewer.jsx`

**Verify:** Click Water → 3D H₂O renders; click Nitroglycerin → 3D model renders; try an ambiguous formula → warning appears.

---

## Phase 4: Quiz Mode

**Goal:** Checkbox-select molecules, start a multiple-choice quiz using 3D models.

### Tasks
1. Add "Start Quiz" button to `MoleculeList` — enabled only when ≥2 molecules are checked
2. Create `src/components/QuizMode.jsx`:
   - Shuffle selected molecules into a question queue
   - Per question: render 3D model of molecule, show 4 multiple-choice answers (1 correct + 3 random from library)
   - Toggle between "identify Name" and "identify Formula" question types
   - Track score; show results summary at the end
3. Add "Exit Quiz" button to return to library view

**Critical files:** `src/components/QuizMode.jsx`

**Verify:** Select 3 molecules, start quiz, answer all questions, see score; quiz works for both name and formula question types.

---

## Phase 5: Polish & Deployment

**Goal:** Production-ready build deployed to Netlify.

### Tasks
1. Add loading states and error boundaries for API/WASM failures
2. Accessibility: keyboard nav, ARIA labels on interactive elements
3. Write unit tests for:
   - `useMoleculeLibrary` hook (CRUD, localStorage, CSV import validation)
   - `pubchem.js` (mock fetch, isomer handling)
   - Quiz scoring logic
4. Run `npm run build` — fix any build errors
5. Add `netlify.toml` with `[build] command = "npm run build"` and `publish = "dist"`
6. Deploy: push to GitHub, connect repo in Netlify dashboard

**Critical files:** `netlify.toml`, `src/**/*.test.js`

**Verify:** `npm run build` succeeds; deployed Netlify URL loads the app; all features work in production build.

---

## Dependency Summary

```bash
npm install papaparse
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react
# 3Dmol.js and RDKit.js loaded via CDN script tags in index.html (WASM bundles are large)
```

## Key Risks

| Risk | Mitigation |
|---|---|
| RDKit WASM slow to load | Show spinner; lazy-load only when viewer opens |
| PubChem rate limit (5 req/s) | Cache results in localStorage; debounce requests |
| 3Dmol.js SSR issues | Guard with `useEffect` + `useRef`; never render server-side |
