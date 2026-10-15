import { afterEach, expect, test, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { DEFAULTS } from '../data/defaultCompounds'
import { resolveCompound } from './pubchem'

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
})

test('all built-in compounds have a valid local SDF', () => {
  for (const compound of DEFAULTS) {
    const cid = compound.pubchemUrl.split('/').at(-1)
    const sdf = readFileSync(`public/structures/${cid}.sdf`, 'utf8')
    expect(sdf.startsWith(`${cid}\n`)).toBe(true)
    expect(sdf).toContain('M  END')
    expect(sdf).toContain('$$$$')
  }
})

test('loads a built-in 3D structure locally without contacting PubChem', async () => {
  const sdf = readFileSync('public/structures/311.sdf', 'utf8')
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => sdf })
  vi.stubGlobal('fetch', fetchMock)

  const compound = DEFAULTS.find(item => item.pubchemUrl.endsWith('/311'))
  const result = await resolveCompound(compound.formula, compound.smiles)

  expect(result.cid).toBe(311)
  expect(result.molblock).toBe(sdf)
  expect(fetchMock).toHaveBeenCalledOnce()
  expect(fetchMock.mock.calls[0][0]).toBe('/structures/311.sdf')
})

test('retries a temporary PubChem failure before returning an SDF', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ status: 503, ok: false })
    .mockResolvedValueOnce({ status: 200, ok: true, json: async () => ({ PropertyTable: { Properties: [{ CID: 311, IsomericSMILES: 'C(O)C' }] } }) })
    .mockResolvedValueOnce({ status: 503, ok: false })
    .mockResolvedValueOnce({ status: 200, ok: true, text: async () => 'citric acid SDF' })
  vi.stubGlobal('fetch', fetchMock)

  const result = await resolveCompound('C6H8O7', 'C(O)C')

  expect(result.cid).toBe(311)
  expect(result.molblock).toBe('citric acid SDF')
  expect(fetchMock).toHaveBeenCalledTimes(4)
  expect(fetchMock.mock.calls[2][0]).toContain('/cid/311/SDF?record_type=3d')
})
