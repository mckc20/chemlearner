// Provider descriptions are shared by the profile citations and Help page.
import { appearanceSource, editorial } from './editorial'
export const elementSourceCatalog = {
  pubchem: {
    name: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov/docs/periodic-table-element-pages',
    role: {
      en: 'Element identity, classification, oxidation states, discovery, general properties and the basis for the short teaching notes.',
      de: 'Elementidentität, Einordnung, Oxidationszahlen, Entdeckung, allgemeine Eigenschaften und Grundlage der kurzen Lerntexte.',
    },
  },
  ciaaw: {
    name: 'CIAAW (IUPAC)', url: 'https://www.ciaaw.org/atomic-weights.htm',
    role: { en: 'Evaluated standard atomic weights.', de: 'Evaluierte Standardatomgewichte.' },
  },
  nist: {
    name: 'NIST Atomic Spectra Database', url: 'https://physics.nist.gov/PhysRefData/ASD/ionEnergy.html',
    role: { en: 'Atomic and positive-ion ground-state configurations and ionization energies.', de: 'Elektronenkonfigurationen von Atomen und positiven Ionen im Grundzustand sowie Ionisierungsenergien.' },
  },
  iaea: {
    name: 'IAEA LiveChart', url: 'https://iaea-nds.github.io/lc_api_notebook/',
    role: { en: 'Selected ground-state isotope masses, natural abundances and decay data.', de: 'Massen, natürliche Häufigkeiten und Zerfallsdaten ausgewählter Isotope im Grundzustand.' },
  },
  jlab: {
    name: 'Jefferson Lab', url: 'https://www.jlab.org/stem',
    role: { en: 'Many density and transition-temperature values, shown with Jefferson Lab attribution on PubChem element pages.', de: 'Viele Dichte- und Phasenübergangswerte, die auf PubChem-Elementseiten Jefferson Lab als Quelle nennen.' },
  },
  lanl: {
    name: 'Los Alamos National Laboratory', url: 'https://www.lanl.gov/science-engineering/periodic-table',
    role: { en: 'Many atomic-radius values and some transition temperatures, shown with LANL attribution in PubChem.', de: 'Viele Atomradien und einige Phasenübergangstemperaturen, bei PubChem mit LANL als Quelle gekennzeichnet.' },
  },
  openstax: {
    name: 'OpenStax Chemistry', url: 'https://openstax.org/books/chemistry-atoms-first-2e/pages/3-4-electronic-structure-of-atoms-electron-configurations',
    role: { en: 'The electron-filling rule used for the selected fluoride and chloride ion configurations.', de: 'Die Elektronenbesetzungsregel für die ausgewählten Konfigurationen von Fluorid- und Chloridionen.' },
  },
}

export function sourceProvider(sourceName = '', url = '') {
  if (sourceName.includes('CIAAW') || url.includes('ciaaw.org')) return 'ciaaw'
  if (sourceName.includes('Jefferson Lab') || url.includes('jlab.org')) return 'jlab'
  if (sourceName.includes('Los Alamos') || url.includes('lanl.gov')) return 'lanl'
  if (sourceName.includes('NIST') || url.includes('nist.gov')) return 'nist'
  if (url.includes('iaea.org')) return 'iaea'
  if (url.includes('openstax.org')) return 'openstax'
  return 'pubchem'
}

export function sourceLink(provider, url, atomicNumber) {
  if (provider === 'jlab') return `https://pubchem.ncbi.nlm.nih.gov/element/${atomicNumber}`
  // Current LANL pages do not always expose the historical property; PubChem does.
  if (provider === 'lanl') return `https://pubchem.ncbi.nlm.nih.gov/element/${atomicNumber}`
  if (provider === 'pubchem') {
    try {
      const parsed = new globalThis.URL(url)
      if (parsed.protocol === 'https:' && parsed.hostname === 'pubchem.ncbi.nlm.nih.gov') return parsed.href
    } catch { /* Fall back to the verified element record. */ }
    return `https://pubchem.ncbi.nlm.nih.gov/element/${atomicNumber}`
  }
  if (provider === 'iaea') return elementSourceCatalog.iaea.url
  if (provider === 'nist') return elementSourceCatalog.nist.url
  return url || elementSourceCatalog[provider].url
}

export function sourceEntryName(entry, language) {
  if (entry.providers.includes('pubchem') && entry.providers.length > 1) {
    const contributors = entry.providers.filter(provider => provider !== 'pubchem').map(provider => elementSourceCatalog[provider].name)
    return language === 'de' ? `PubChem (mit Angaben von ${contributors.join(', ')})` : `PubChem (with data from ${contributors.join(', ')})`
  }
  return entry.providers.map(provider => elementSourceCatalog[provider].name).join(' / ')
}

export function elementSourceEntries(element, { examples = [] } = {}) {
  const entries = new Map()
  const add = (provider, url, field) => {
    const href = sourceLink(provider, url, element.atomicNumber)
    if (!entries.has(href)) entries.set(href, { providers: [], href, fields: [] })
    const entry = entries.get(href)
    if (!entry.providers.includes(provider)) entry.providers.push(provider)
    if (!entry.fields.includes(field)) entry.fields.push(field)
  }
  const pubchem = `https://pubchem.ncbi.nlm.nih.gov/element/${element.atomicNumber}`
  for (const field of ['family', 'period', 'group', 'block', 'oxidationStates', 'discovery']) add('pubchem', pubchem, field)
  for (const field of ['occurrence', 'uses', 'origin']) add('pubchem', editorial[element.atomicNumber][field].source, field)
  if (appearanceSource(element.atomicNumber)) add('pubchem', appearanceSource(element.atomicNumber), 'appearance')
  for (const example of examples) {
    if (example.source || example.pubchemUrl) add('pubchem', example.source || example.pubchemUrl, 'examples')
  }
  for (const [field, property] of Object.entries(element.properties)) {
    if (property.value) add(sourceProvider(property.sourceName, property.source), property.source, field)
  }
  add(sourceProvider('', element.configuration.source), element.configuration.source, 'full')
  for (const ion of element.ions) add(sourceProvider('', ion.source), ion.source, 'ions')
  if (element.isotopes.length) add('iaea', element.isotopes[0].source, 'isotopes')
  return [...entries.values()]
}
