# Molecular Resolution Pipeline

## Overview

Resolves chemical formulas into interactive 3D molecular visualizations using PubChem and 3Dmol.js.

## Pipeline

```
Formula → PubChem API (async formula search) → CID → SDF molblock → 3Dmol.js (3D render)
```

## Key Files

- `src/services/pubchem.js` — PubChem PUG REST integration
- `src/components/MoleculeViewer.jsx` — Modal viewer with 3Dmol.js rendering

## PubChem Integration (`pubchem.js`)

- **Async formula search**: PubChem's formula endpoint returns a `ListKey` (HTTP 202) that must be polled until results are ready.
- **Polling**: `pollListKey()` polls up to 30 times at 1-second intervals.
- **3D/2D SDF fallback**: Tries `?record_type=3d` first. Falls back to 2D SDF for ionic compounds (e.g., NaCl) that lack 3D conformers.
- **Rate limiting**: 200ms minimum between requests (PubChem limit: 5 req/s).
- **Caching**: Results cached in `localStorage` with `pubchem_cache_` prefix.
- **Ambiguity detection**: Sets `isAmbiguous: true` when multiple compounds match a formula.

## Dual-Panel Viewer (`MoleculeViewer.jsx`)

- Modal overlay with two side-by-side panels (stacked on mobile):
  - **Left panel — 2D Skeletal Formula**: Displays a 2D structure PNG fetched from PubChem's image API (`/rest/pug/compound/cid/{CID}/PNG`). Uses CSS `dark:invert` to handle dark mode for the black-on-white line art.
  - **Right panel — 3D Ball-and-Stick**: Renders SDF molblocks using 3Dmol.js. Ball-and-stick style (`stick: { radius: 0.15 }, sphere: { scale: 0.3 }`). Includes a `ResizeObserver` to handle container size changes from responsive layout shifts.
- Displays ambiguity warning banner when formula matches multiple isomers.
- Close via Escape key or clicking outside the modal.
- Shows loading spinner during resolution, error state on failure.
- The `resolveMolecule` function returns `cid` alongside `molblock` and `smiles` to enable the 2D image fetch.

## Verified Molecules

| Molecule | Formula | 3D/2D | Notes |
|---|---|---|---|
| Water | H2O | 3D | Red O + white H |
| Sulphuric Acid | H2SO4 | 3D | Yellow S center |
| Salt | NaCl | 2D fallback | Ionic compound, no 3D conformer |
| Nitroglycerin | C3H5N3O9 | 3D | Complex organic structure |

## Notes

- RDKit.js (`src/services/rdkit.js`) exists but is unused — PubChem provides SDF molblocks directly, avoiding WASM complexity.
- The 3D SDF 404 for ionic compounds is expected and handled gracefully via the 2D fallback.
