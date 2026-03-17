# localStorage Data Migration System

## Overview

Version-based migration system that keeps default compounds up-to-date for returning users while preserving their customizations.

## Problem

Returning users never saw new or corrected default compounds because the app read stored data as-is from localStorage, ignoring changes to hardcoded defaults.

## Architecture

### Key concepts

- **`DATA_VERSION`** (integer in `src/data/defaultCompounds.js`) — bumped whenever defaults or schema change
- **Stored version** (`chemlearner_data_version` in localStorage) — compared against `DATA_VERSION` on load
- **`_userModified` flag** — set `true` on default compounds when user edits them; migrations skip these
- **`_deletedDefaults` list** (`chemlearner_deleted_compound_defaults`) — tracks default IDs the user deliberately deleted so they don't reappear

### Files

| File | Role |
|---|---|
| `src/data/defaultCompounds.js` | Single source of truth for DEFAULTS array and DATA_VERSION |
| `src/migrations/index.js` | Migration runner: `runMigrations()`, `syncDefaults()`, `backfillSchemaFields()` |
| `src/main.jsx` | Calls `runMigrations()` synchronously before React renders |
| `src/hooks/useCompoundLibrary.js` | Sets `_userModified: true` on edit; tracks deleted defaults |

### Migration flow (runs before React renders)

1. Compare stored version vs `DATA_VERSION`; skip if up-to-date
2. If no stored compounds (first-time user), just set version and return
3. Run version-specific migrations in order (e.g., v0→v1 backfills `_userModified`)
4. `syncDefaults()`: add new defaults, update untouched existing defaults, skip deleted/user-modified
5. `backfillSchemaFields()`: ensure all compounds have expected fields
6. Write updated data + new version to localStorage

## Developer workflow

To add new defaults or fix existing ones:

1. Edit `src/data/defaultCompounds.js` — add/modify compounds
2. Bump `DATA_VERSION`
3. That's it. `syncDefaults()` handles the rest automatically.

For schema changes (new fields), add a migration function to the `MIGRATIONS` registry in `src/migrations/index.js`.

## Tests

`src/migrations/index.test.js` covers:
- First-time users, already-migrated users
- v0→v1 _userModified inference (modified vs unmodified defaults)
- syncDefaults: new defaults, untouched updates, user-modified preservation, deleted defaults
- Schema backfill for incomplete compounds
- User-added compounds left untouched
