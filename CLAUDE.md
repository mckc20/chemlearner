# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ChemLearner 3D is a React web app for managing chemical molecule libraries, visualizing molecules in interactive 3D, and testing knowledge via quizzes. Deployed on Netlify.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Styling | Tailwind CSS (auto dark/light via `prefers-color-scheme`) |
| 3D Rendering | 3Dmol.js |
| Molecule Data | PubChem PUG REST (SDF molblocks fetched directly — no RDKit/WASM needed) |
| CSV Parsing | PapaParse |
| External API | PubChem PUG REST — no API key required; rate limit: 5 req/s, 400 req/min |
| Persistence | Browser `localStorage` |

## Dev Commands

Once scaffolded with Vite + React:

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm test             # Run all tests
npm test -- <file>   # Run a single test file
```

## Architecture

Three core modules:

**1. Library Management**
- Pre-loaded molecules: Water, Sulphuric Acid, Salt, Nitroglycerin
- CSV upload (PapaParse); validate for missing fields and duplicate Name/Formula
- All changes persisted to `localStorage`

**2. Molecular Resolution Pipeline**
Formula → PubChem API (async search → CID → SDF molblock) → 3Dmol.js (interactive render)
- 3D SDF preferred; falls back to 2D SDF for ionic compounds (e.g., NaCl)
- If PubChem returns multiple isomers, display: *"The formula [X] is ambiguous. Displaying the most common structure (Isomer A). Use a SMILES string for specific results."*

**3. Quiz Mode**
- User selects molecules via checkboxes in list view, then clicks "Start Quiz"
- Displays rotatable 3D model; user identifies Name or Formula from multiple-choice options

## CSV Data Schema

| Column | Description |
|---|---|
| `Name` | Common name (e.g. `Water`) |
| `Formula` | Chemical formula (e.g. `H2O`) |
| `Category` | Functional group or class (e.g. `Solvent`, `Acid`) |
| `Information` | Educational context (free text) |
| `WikipediaUrl` | Link to Wikipedia article |
| `PubchemUrl` | Link to PubChem compound page |
| `WikidataId` | Wikidata entity ID (e.g. `Q283`) |
| `SMILES` | SMILES notation (e.g. `O`) |

## Documentation

Project documentation lives in the `doc/` directory:

- **`doc/features/`** — Markdown files describing each implemented feature (one file per feature).
- **`doc/sessions/`** — Transcripts of the implementation sessions where features were built.

When implementing a new feature, create or update the corresponding feature doc and add a session transcript.
