import { describe, expect, test } from 'vitest'
import { elementProfiles } from '../elementProfiles'
import { referenceExamples } from './editorial'
import { elementSourceCatalog, elementSourceEntries } from './sourceCatalog'

describe('element citations', () => {
  test('every profile lists only cited, unique destinations', () => {
    for (const element of Object.values(elementProfiles)) {
      const entries = elementSourceEntries(element)
      expect(entries.map(entry => entry.href)).toEqual([...new Set(entries.map(entry => entry.href))])
      expect(entries.every(entry => entry.href.startsWith('https://') && entry.fields.length > 0)).toBe(true)
      expect(entries.some(entry => entry.providers.includes('iaea') && entry.fields.includes('isotopes'))).toBe(true)
      expect(entries.some(entry => entry.fields.includes('atomicWeight'))).toBe(Boolean(element.properties.atomicWeight.value))
      expect(entries.flatMap(entry => entry.providers).every(provider => provider in elementSourceCatalog)).toBe(true)
      expect(entries.flatMap(entry => entry.providers)).not.toContain('amdc')
      expect(entries.flatMap(entry => entry.providers)).not.toContain('iptei')
    }
  })

  test('attributed historical values use the exact PubChem element page and anions cite OpenStax', () => {
    const hydrogen = elementSourceEntries(elementProfiles[1])
    const pubchem = hydrogen.find(entry => entry.href === 'https://pubchem.ncbi.nlm.nih.gov/element/1')
    expect(pubchem.providers).toEqual(expect.arrayContaining(['pubchem', 'jlab', 'lanl']))
    expect(pubchem.fields).toEqual(expect.arrayContaining(['density', 'atomicRadius']))
    for (const z of [9, 17]) {
      expect(elementSourceEntries(elementProfiles[z]).some(entry => entry.providers.includes('openstax') && entry.fields.includes('ions'))).toBe(true)
    }
  })

  test('library example URLs cannot add unrelated destinations to the citations panel', () => {
    const entries = elementSourceEntries(elementProfiles[1], { examples: [{ pubchemUrl: 'javascript:alert(1)' }] })
    expect(entries.every(entry => entry.href.startsWith('https://'))).toBe(true)
    expect(entries.some(entry => entry.href === 'javascript:alert(1)')).toBe(false)
  })

  test('a standalone compound example has its own PubChem record in the panel', () => {
    const entries = elementSourceEntries(elementProfiles[3], { examples: referenceExamples[3] })
    expect(entries.some(entry => entry.href === referenceExamples[3][0].source && entry.fields.includes('examples'))).toBe(true)
  })
})
