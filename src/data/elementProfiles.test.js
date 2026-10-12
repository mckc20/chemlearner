import { describe, expect, test } from 'vitest'
import { abbreviatedConfiguration, atomModel, elementProfiles, formulaElements, initialProfile, orbitalBoxes } from './elementProfiles'
import { elements } from './periodicElements'
import { curatedExamples, editorial, referenceExamples } from './elements/editorial'
import { DEFAULTS } from './defaultCompounds'

describe('bundled scientific reference', () => {
  test('all elements, selected isotopes and supported ions obey particle invariants', () => {
    expect(Object.keys(elementProfiles)).toHaveLength(118)
    for (const element of elements) {
      const record = elementProfiles[element.number]
      expect(record.symbol).toBe(element.symbol)
      expect(record.isotopes.some(item => item.id === record.defaultIsotope)).toBe(true)
      const natural = record.isotopes.filter(item => Number(item.abundance) > 0)
      if (natural.length) expect(record.defaultIsotope).toBe(natural.sort((a, b) => b.abundance - a.abundance)[0].id)
      for (const isotope of record.isotopes) {
        expect(isotope.massNumber).toBeGreaterThanOrEqual(element.number)
        for (const charge of [0, ...record.ions.map(item => item.charge)]) {
          const model = atomModel({ atomicNumber: element.number, isotopeId: isotope.id, charge })
          expect(model.protons).toBe(element.number)
          expect(model.neutrons).toBe(isotope.massNumber - element.number)
          expect(model.electrons).toBe(element.number - charge)
          expect(model.shells.reduce((a, b) => a + b, 0)).toBe(model.electrons)
          expect(model.configuration.subshells.reduce((sum, item) => sum + item.count, 0)).toBe(model.electrons)
          expect(new Set(model.configuration.subshells.map(term => `${term.n}${term.l}`)).size).toBe(model.configuration.subshells.length)
          for (const term of model.configuration.subshells) {
            expect(term.n).toBeGreaterThan('spdf'.indexOf(term.l))
            expect(term.count).toBeGreaterThan(0)
            expect(term.count).toBeLessThanOrEqual(2 * (2 * 'spdf'.indexOf(term.l) + 1))
            expect(orbitalBoxes(term).join('').length).toBe(term.count)
          }
        }
      }
      for (const [key, property] of Object.entries(record.properties)) {
        expect(['measured', 'predicted', 'unknown']).toContain(property.status)
        expect(property.source).toMatch(/^https?:/)
        expect(property).toHaveProperty('unit')
        if (['density', 'meltingPoint', 'boilingPoint', 'state'].includes(key)) {
          expect(property.conditions).toBeTruthy()
        } else {
          expect(property.conditions).toBeNull()
        }
      }
      for (const language of ['en', 'de']) for (const key of ['origin', 'occurrence', 'uses']) expect(editorial[element.number][key][language]).toBeTruthy()
    }
  })
  test('known isotope and configuration exceptions are retained', () => {
    expect(atomModel(initialProfile(1))).toMatchObject({ protons: 1, neutrons: 0, electrons: 1, shells: [1] })
    expect(atomModel({ ...initialProfile(6), isotopeId: '6-14' }).neutrons).toBe(8)
    expect(atomModel({ ...initialProfile(11), charge: 1 }).shells).toEqual([2, 8])
    expect(atomModel({ ...initialProfile(17), charge: -1 }).shells).toEqual([2, 8, 8])
    expect(atomModel(initialProfile(24)).shells).toEqual([2, 8, 13, 1])
    expect(atomModel(initialProfile(29)).shells).toEqual([2, 8, 18, 1])
    expect(atomModel({ ...initialProfile(26), charge: 2 }).shells).toEqual([2, 8, 14])
    expect(atomModel({ ...initialProfile(26), charge: 3 }).shells).toEqual([2, 8, 13])
    expect(atomModel({ ...initialProfile(29), charge: 1 }).shells).toEqual([2, 8, 18])
    expect(atomModel({ ...initialProfile(29), charge: 2 }).shells).toEqual([2, 8, 17])
    expect(abbreviatedConfiguration(atomModel(initialProfile(24)).configuration.subshells).core).toBe('Ar')
    expect(elementProfiles[57]).toMatchObject({ period: 6, group: null })
    expect(elementProfiles[89]).toMatchObject({ period: 7, group: null })
    expect(elementProfiles[118].configuration.status).toBe('predicted')
    expect(elementProfiles[118].properties.electronegativity.status).toBe('unknown')
    expect(initialProfile(118, { tab: 'isotopes', paused: true, charge: 2 })).toMatchObject({ tab: 'isotopes', paused: true, charge: 0, isotopeId: '118-294' })
  })
  test('explicit compound identities contain the curated element', () => {
    for (const [z, examples] of Object.entries(referenceExamples)) for (const example of examples) {
      expect(example.id).toMatch(/^reference:/)
      expect(formulaElements(example.formula).has(elementProfiles[z].symbol)).toBe(true)
    }
    for (const [z, ids] of Object.entries(curatedExamples)) for (const id of ids) {
      const compound = DEFAULTS.find(item => item.id === id)
      expect(compound).toBeDefined()
      expect(formulaElements(compound.formula).has(elementProfiles[z].symbol)).toBe(true)
    }
  })
})

test.each([
  ['Co', ['Co']], ['CO', ['C', 'O']], ['CO2', ['C', 'O']], ['Mg(OH)2', ['Mg', 'O', 'H']],
  ['K4[Fe(CN)6]', ['K', 'Fe', 'C', 'N']], ['CuSO4·5H2O', ['Cu', 'S', 'O', 'H']],
  ['CuSO4.5H2O', ['Cu', 'S', 'O', 'H']], ['H₂SO₄', ['H', 'S', 'O']], ['NH₄⁺', ['N', 'H']],
  ['Fe3+', ['Fe']], ['[Fe(CN)6]4-', ['Fe', 'C', 'N']], ['SO4^2-', ['S', 'O']],
])('parses supported formula %s', (input, expected) => expect([...formulaElements(input)]).toEqual(expected))

test.each(['co', 'Cobalt', 'NaCl?', 'C6H5R', '(CH2)n', 'Mg(OH', 'CuSO4·', 'Na0Cl', 'H2O(aq)', 'K[Fe(CN)6)', 'H2O / NaCl', '', null])('rejects unsupported formula %s completely', input => expect(formulaElements(input)).toBeNull())
