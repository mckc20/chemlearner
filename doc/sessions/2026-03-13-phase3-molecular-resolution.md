# Session: Phase 3 — Molecular Resolution Pipeline

**Date:** 2026-03-13

## Goal

Implement Phase 3 of the implementation plan: the Molecular Resolution Pipeline that resolves chemical formulas into interactive 3D visualizations.

## Starting State

- Phase 1 (scaffold) and Phase 2 (data layer, molecule library, CSV import) were already complete.
- `pubchem.js` existed with async ListKey polling logic.
- `rdkit.js` existed but was non-functional (CDN script not loading `initRDKitModule` global).
- `MoleculeViewer.jsx` existed but showed errors when clicking molecules.
- 3Dmol.js CDN was loaded in `index.html`.

## Issues Found & Fixed

### 1. RDKit.js Not Loading
- **Symptom:** "RDKit is not loaded. Make sure the CDN script is included."
- **Resolution:** RDKit was unnecessary — PubChem provides SDF molblocks directly via its `/SDF?record_type=3d` endpoint. The pipeline was simplified to skip RDKit entirely: Formula → PubChem → SDF → 3Dmol.js.

### 2. 3Dmol.js `zoomTo()` Crash
- **Symptom:** `TypeError: Cannot read properties of null (reading 'model')` at `zoomTo`.
- **Cause:** `viewer.zoomTo(null, 1.5)` — passing `null` as the first argument caused 3Dmol.js to fail internally.
- **Fix:** Changed to `viewer.zoomTo({}, 1.5)` (empty selection object = zoom to all atoms).

### 3. Ionic Compounds (NaCl) — No 3D Conformer
- **Symptom:** "Could not fetch 3D structure for CID 5234" — PubChem returns 404 for `?record_type=3d` on ionic compounds.
- **Fix:** Added 2D SDF fallback in `fetchSdf()` — tries 3D first, falls back to 2D if 3D returns non-OK status.

### 4. Molecule Rendering Too Small
- **Symptom:** Water molecule was barely visible as a tiny capsule shape.
- **Fix:** Changed from plain `stick` style to ball-and-stick (`stick: { radius: 0.15 }, sphere: { scale: 0.3 }`) and added zoom padding (`zoomTo({}, 1.5)`).

## Files Modified

- `src/services/pubchem.js` — Renamed `fetch3dSdf` → `fetchSdf`, added 2D SDF fallback.
- `src/components/MoleculeViewer.jsx` — Fixed `zoomTo` call, improved ball-and-stick rendering style.

## Verification

All 4 pre-loaded molecules tested via Playwright browser automation:
- Water (H2O) — 3D render OK
- Sulphuric Acid (H2SO4) — 3D render OK
- Salt (NaCl) — 2D fallback render OK
- Nitroglycerin (C3H5N3O9) — 3D render OK
