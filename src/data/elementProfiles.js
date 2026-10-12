import reference from './elements/reference.json'
import { elements } from './periodicElements'

export const referenceVersion = reference.version
export const referenceRetrievedAt = reference.retrievedAt
export const elementProfiles = reference.elements
export const profileTabs = ['overview', 'structure', 'properties', 'isotopes']

export function initialProfile(atomicNumber, previous = {}) {
  const element = elementProfiles[atomicNumber]
  return {
    atomicNumber, isotopeId: element.defaultIsotope, charge: 0,
    tab: previous.tab ?? 'overview', shell: null, paused: previous.paused ?? false, libraryExpanded: false,
  }
}

export function atomModel(profile) {
  const element = elementProfiles[profile.atomicNumber]
  const isotope = element.isotopes.find(item => item.id === profile.isotopeId) ?? element.isotopes.find(item => item.id === element.defaultIsotope)
  const configuration = profile.charge === 0 ? element.configuration : element.ions.find(item => item.charge === profile.charge)
  if (!configuration) throw new Error('Unsupported ion configuration')
  const shells = []
  for (const { n, count } of configuration.subshells) shells[n - 1] = (shells[n - 1] ?? 0) + count
  return {
    element, isotope, configuration, shells: Array.from(shells, count => count ?? 0),
    protons: profile.atomicNumber, neutrons: isotope.massNumber - profile.atomicNumber,
    electrons: profile.atomicNumber - profile.charge,
  }
}

export function orbitalBoxes({ l, count }) {
  const boxes = Array(2 * 'spdf'.indexOf(l) + 1).fill('')
  for (let i = 0; i < count; i++) boxes[i % boxes.length] += i < boxes.length ? '↑' : '↓'
  return boxes
}

export function abbreviatedConfiguration(subshells) {
  const core = [86, 54, 36, 18, 10, 2].find(z => {
    const occupied = elementProfiles[z].configuration.subshells
    return occupied.reduce((sum, term) => sum + term.count, 0) < subshells.reduce((sum, term) => sum + term.count, 0)
      && occupied.every(term => subshells.some(item => item.n === term.n && item.l === term.l && item.count === term.count))
  })
  if (!core) return { core: null, terms: subshells }
  const occupied = elementProfiles[core].configuration.subshells
  return { core: elements[core - 1].symbol, terms: subshells.filter(term => !occupied.some(item => item.n === term.n && item.l === term.l)) }
}

/** Strict formula grammar. Return symbols only when the entire formula is understood. */
export function formulaElements(formula) {
  if (typeof formula !== 'string' || !formula || formula.length > 500) return null
  let input = formula.trim().replace(/[₀-₉]/g, digit => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)))
  input = input.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻]$/, '').replace(/\^\d*[+-]$/, '').replace(/[+-]$/, '')
  const valid = new Set(elements.map(element => element.symbol))
  const found = new Set()
  let index = 0
  function number() {
    const start = index
    while (/\d/.test(input[index] ?? '') && index < input.length) index++
    return start === index || Number(input.slice(start, index)) > 0
  }
  function group(closing, depth = 0) {
    if (depth > 20) return false
    let count = 0
    while (index < input.length && input[index] !== closing && !/[.·]/.test(input[index])) {
      if ('(['.includes(input[index])) {
        const end = input[index++] === '(' ? ')' : ']'
        if (!group(end, depth + 1) || input[index++] !== end || !number()) return false
      } else {
        const match = /^[A-Z][a-z]?/.exec(input.slice(index))
        if (!match || !valid.has(match[0])) return false
        found.add(match[0]); index += match[0].length
        if (!number()) return false
      }
      count++
    }
    return count > 0
  }
  if (!group(null)) return null
  while (/[.·]/.test(input[index] ?? '') && index < input.length) {
    index++
    if (!number() || !group(null)) return null
  }
  return index === input.length ? found : null
}
