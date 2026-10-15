import { expect, test } from 'vitest'
import { DEFAULTS } from './defaultCompounds'
import { compoundProfiles, profileForCompound } from './compoundProfiles'
import { translateCompound } from '../i18n/translate'

test('every built-in compound has a bilingual sourced profile', () => {
  expect(Object.keys(compoundProfiles)).toHaveLength(DEFAULTS.length)
  for (const compound of DEFAULTS) {
    const profile = profileForCompound(compound)
    expect(profile, compound.id).toBeTruthy()
    for (const text of [profile.systematic, profile.form, ...Object.values(profile.overview), ...Object.values(profile.context), ...Object.values(profile.chemistry).filter(value => value?.en)]) {
      expect(text.en, compound.id).toBeTruthy()
      expect(text.de, compound.id).toBeTruthy()
    }
    expect(profile.overview.description.en).toBeTruthy()
    expect(profile.chemistry.bonding.en).toBeTruthy()
    expect(profile.sources.length).toBeGreaterThan(0)
    const supportedFields = new Set(profile.sources.flatMap(source => source.fields))
    for (const field of ['systematic', 'form', ...Object.keys(profile.overview), ...Object.keys(profile.chemistry), ...Object.keys(profile.context)]) {
      expect(supportedFields.has(field), `${compound.id}: ${field}`).toBe(true)
    }
    for (const source of profile.sources) {
      expect(source.url).toMatch(/^https:\/\//)
      expect(source.fields.length).toBeGreaterThan(0)
      expect(source.retrievedAt).toMatch(/^\d{4}-\d\d-\d\d$/)
    }
    for (const [name, property] of Object.entries(profile.properties)) {
      expect(['available', 'unavailable', 'inapplicable']).toContain(property.status)
      if (property.status === 'available') {
        expect(property.value).not.toBeNull()
        expect(supportedFields.has(name)).toBe(true)
        for (const sourceId of property.sourceIds) expect(profile.sources.some(source => source.id === sourceId)).toBe(true)
      }
    }
  }
})

test('forms, missing measurements, zero values and changed identities are explicit', () => {
  const byId = id => compoundProfiles[`default-${id}`]
  expect(byId(15).properties.melting.value).toBe(0)
  expect(byId(2).properties.mass.status).toBe('inapplicable')
  expect(byId(6).properties.boiling.status).toBe('inapplicable')
  expect(byId(25).properties.boiling.status).toBe('inapplicable')
  expect(byId(20).properties.melting.status).toBe('inapplicable')
  expect(byId(32).properties.melting.status).toBe('unavailable')
  const salt = DEFAULTS.find(compound => compound.id === 'default-11')
  expect(profileForCompound({ ...salt, formula: 'KCl' })).toBeNull()
  expect(profileForCompound({ ...salt, smiles: '[K+].[Cl-]' })).toBeNull()
  expect(profileForCompound({ ...salt, id: 'user-1' })).toBeNull()
  expect(profileForCompound({ ...salt, smiles: undefined, wikidataId: undefined })).toBeTruthy()
  expect(profileForCompound({ id: salt.id, formula: salt.formula })).toBeNull()
  const edited = { ...salt, formula: 'KCl', information: 'Edited' }
  expect(translateCompound('de', edited)).toBe(edited)
})
