# ChemLearner 3D

> A minimalist, high-performance web application for managing chemical formulas, visualizing molecules in interactive 3D, and testing knowledge through dynamic quizzes.

---

## 🧪 Project Overview

ChemLearner 3D is a React-based web application deployed on Netlify. It allows users to:

- Manage a library of chemical formulas via CSV uploads
- Visualize molecules in interactive 3D
- Test their knowledge through a dynamic Quiz Mode

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React (Vite) |
| **Styling** | Tailwind CSS (Auto Dark/Light mode) |
| **3D Rendering** | 3Dmol.js |
| **Chemistry Engine** | RDKit.js (for coordinate generation) |
| **Data Parsing** | PapaParse (CSV) |
| **External API** | PubChem PUG REST (Formula → SMILES resolution) |
| **Persistence** | Browser `localStorage` |

---

## 📋 Data Schema (CSV Structure)

The application expects a CSV file with the following columns:

| Column | Description | Example |
|---|---|---|
| `Name` | Common name | `Water` |
| `Formula` | Chemical formula | `H2O` |
| `Category` | Functional group or class | `Solvent`, `Acid` |
| `Description` | Educational context or facts | *(free text)* |

---

## 🔄 Core Functionalities & User Flows

### 1. Library Management

- **Initial Load:** The app comes pre-loaded with a default set:
  - Water
  - Sulphuric Acid
  - Salt
  - Nitroglycerin
- **CSV Upload:** Users can import their own lists.
- **Validation:**
  - **Duplicates:** The app must prevent importing a formula or name that already exists in the library.
  - **Errors:** Show a detailed error message identifying the specific row and column if data is missing or malformed.
- **Persistence:** All changes (uploads/deletions) must persist across page refreshes using `localStorage`.

### 2. Molecular Resolution (Formula → 3D)

Because standard formulas (e.g., `C₂H₆O`) can be ambiguous, the app follows this pipeline:

1. **API Fetch:** Query the PubChem API using the formula string to retrieve the SMILES string.
2. **Ambiguity Handling:** If the API returns multiple isomers, display an informational message:
   > "The formula [X] is ambiguous. Displaying the most common structure (Isomer A). Use a SMILES string for specific results."
3. **3D Generation:**
   - Pass the SMILES to **RDKit.js** to generate a 3D Molblock.
   - Pass the Molblock to **3Dmol.js** for the final interactive rendering.

### 3. Quiz Mode

1. **Selection:** In the list view, users select specific molecules via checkboxes.
2. **Flow:** Clicking **"Start Quiz"** launches a specialized view.
3. **Logic:**
   - The app displays the 3D model (rotatable).
   - The user must correctly identify the molecule's **Name** or **Formula** from a list of options.

### 4. UI/UX Requirements

- **Aesthetic:** Minimalist "Lab" style.
- **Theme:** Automatic switching between Dark and Light modes based on system preferences (`prefers-color-scheme`).
- **Filtering:** A category-based filter to quickly sort through large molecule sets.
