const labels = {
  en: {
    tabs: 'Compound profile sections', overview: 'Overview', properties: 'Properties', chemistry: 'Chemistry', context: 'Context',
    commonName: 'Common name', systematic: 'Systematic name', formula: 'Formula', category: 'Compound class', form: 'Substance or form',
    description: 'In brief', appearance: 'Appearance', occurrence: 'Natural occurrence', uses: 'Everyday uses',
    mass: 'Molar mass', state: 'Physical state', melting: 'Melting / freezing point', boiling: 'Boiling point', density: 'Density', solubility: 'Water solubility',
    elements: 'Constituent elements', bonding: 'Bonding and structure', behavior: 'Acid / base behavior', production: 'Production', reactions: 'Characteristic reactions', smiles: 'SMILES',
    applications: 'Applications', biology: 'Biological role', environment: 'Environmental impact', hazards: 'Important hazards', history: 'History', nameOrigin: 'Familiar names',
    sources: 'Sources and data edition', fields: 'Supports', retrieved: 'Retrieved', version: 'Version', links: 'Reference links',
    unavailable: 'Not available', inapplicable: 'Not applicable', solid: 'Solid', liquid: 'Liquid', gas: 'Gas',
  },
  de: {
    tabs: 'Abschnitte des Verbindungsprofils', overview: 'Überblick', properties: 'Eigenschaften', chemistry: 'Chemie', context: 'Kontext',
    commonName: 'Gebräuchlicher Name', systematic: 'Systematischer Name', formula: 'Formel', category: 'Stoffklasse', form: 'Stoff oder Form',
    description: 'Kurzbeschreibung', appearance: 'Aussehen', occurrence: 'Natürliches Vorkommen', uses: 'Alltagsanwendungen',
    mass: 'Molare Masse', state: 'Aggregatzustand', melting: 'Schmelz- / Gefrierpunkt', boiling: 'Siedepunkt', density: 'Dichte', solubility: 'Wasserlöslichkeit',
    elements: 'Enthaltene Elemente', bonding: 'Bindung und Struktur', behavior: 'Säure- / Baseverhalten', production: 'Herstellung', reactions: 'Typische Reaktionen', smiles: 'SMILES',
    applications: 'Anwendungen', biology: 'Biologische Rolle', environment: 'Umweltwirkung', hazards: 'Wichtige Gefahren', history: 'Geschichte', nameOrigin: 'Bekannte Namen',
    sources: 'Quellen und Datenstand', fields: 'Belegt', retrieved: 'Abgerufen', version: 'Version', links: 'Weiterführende Links',
    unavailable: 'Nicht verfügbar', inapplicable: 'Nicht anwendbar', solid: 'Fest', liquid: 'Flüssig', gas: 'Gasförmig',
  },
}

const conditionDe = {
  '20 °C': '20 °C', '25 °C': '25 °C', '1 atm': '1 atm', '25 °C, 1 atm': '25 °C, 1 atm',
  '20 °C, 1 atm': '20 °C, 1 atm', 'room temperature': 'Raumtemperatur',
  '20 °C, pure': '20 °C, rein', 'pure': 'rein', 'anhydrous; decomposes': 'wasserfrei; zersetzt sich',
  'approximately 1 atm': 'ungefähr 1 atm', '20 °C, approximately 98% acid': '20 °C, ungefähr 98 % Säure',
  'approximately 98% acid': 'ungefähr 98 % Säure', 'approximately; may decompose': 'ungefähr; kann sich zersetzen',
  'pure; decomposes on heating': 'rein; zersetzt sich beim Erhitzen', '20 °C, calcite': '20 °C, Calcit',
  'approximately; decomposition depends on form': 'ungefähr; Zersetzung hängt von der Form ab',
}

export const compoundText = (language, key) => labels[language]?.[key] ?? labels.en[key] ?? key
export const localized = (language, value) => value?.[language] ?? value?.en ?? null
export const localizedCondition = (language, condition) => language === 'de' ? conditionDe[condition] ?? condition : condition
