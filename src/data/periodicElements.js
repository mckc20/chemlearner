const elementNames = `Hydrogen|H
Helium|He
Lithium|Li
Beryllium|Be
Boron|B
Carbon|C
Nitrogen|N
Oxygen|O
Fluorine|F
Neon|Ne
Sodium|Na
Magnesium|Mg
Aluminium|Al
Silicon|Si
Phosphorus|P
Sulfur|S
Chlorine|Cl
Argon|Ar
Potassium|K
Calcium|Ca
Scandium|Sc
Titanium|Ti
Vanadium|V
Chromium|Cr
Manganese|Mn
Iron|Fe
Cobalt|Co
Nickel|Ni
Copper|Cu
Zinc|Zn
Gallium|Ga
Germanium|Ge
Arsenic|As
Selenium|Se
Bromine|Br
Krypton|Kr
Rubidium|Rb
Strontium|Sr
Yttrium|Y
Zirconium|Zr
Niobium|Nb
Molybdenum|Mo
Technetium|Tc
Ruthenium|Ru
Rhodium|Rh
Palladium|Pd
Silver|Ag
Cadmium|Cd
Indium|In
Tin|Sn
Antimony|Sb
Tellurium|Te
Iodine|I
Xenon|Xe
Caesium|Cs
Barium|Ba
Lanthanum|La
Cerium|Ce
Praseodymium|Pr
Neodymium|Nd
Promethium|Pm
Samarium|Sm
Europium|Eu
Gadolinium|Gd
Terbium|Tb
Dysprosium|Dy
Holmium|Ho
Erbium|Er
Thulium|Tm
Ytterbium|Yb
Lutetium|Lu
Hafnium|Hf
Tantalum|Ta
Tungsten|W
Rhenium|Re
Osmium|Os
Iridium|Ir
Platinum|Pt
Gold|Au
Mercury|Hg
Thallium|Tl
Lead|Pb
Bismuth|Bi
Polonium|Po
Astatine|At
Radon|Rn
Francium|Fr
Radium|Ra
Actinium|Ac
Thorium|Th
Protactinium|Pa
Uranium|U
Neptunium|Np
Plutonium|Pu
Americium|Am
Curium|Cm
Berkelium|Bk
Californium|Cf
Einsteinium|Es
Fermium|Fm
Mendelevium|Md
Nobelium|No
Lawrencium|Lr
Rutherfordium|Rf
Dubnium|Db
Seaborgium|Sg
Bohrium|Bh
Hassium|Hs
Meitnerium|Mt
Darmstadtium|Ds
Roentgenium|Rg
Copernicium|Cn
Nihonium|Nh
Flerovium|Fl
Moscovium|Mc
Livermorium|Lv
Tennessine|Ts
Oganesson|Og`.split('\n').map((entry, index) => {
  const [name, symbol] = entry.split('|')
  return { number: index + 1, name, symbol }
})

// Names shared by both languages fall back to the English entry.
const germanNames = {
  1: 'Wasserstoff', 5: 'Bor', 6: 'Kohlenstoff', 7: 'Stickstoff', 8: 'Sauerstoff',
  9: 'Fluor', 11: 'Natrium', 14: 'Silicium', 15: 'Phosphor', 16: 'Schwefel',
  17: 'Chlor', 19: 'Kalium', 22: 'Titan', 24: 'Chrom', 25: 'Mangan', 26: 'Eisen',
  27: 'Kobalt', 29: 'Kupfer', 30: 'Zink', 33: 'Arsen', 34: 'Selen', 35: 'Brom',
  41: 'Niob', 42: 'Molybdän', 47: 'Silber', 50: 'Zinn', 51: 'Antimon', 52: 'Tellur',
  53: 'Iod', 57: 'Lanthan', 58: 'Cer', 59: 'Praseodym', 60: 'Neodym',
  73: 'Tantal', 74: 'Wolfram', 78: 'Platin', 80: 'Quecksilber', 82: 'Blei',
  83: 'Bismut', 85: 'Astat', 92: 'Uran', 117: 'Tenness',
}

const periodGroups = [
  [1, 18],
  [1, 2, 13, 14, 15, 16, 17, 18],
  [1, 2, 13, 14, 15, 16, 17, 18],
  Array.from({ length: 18 }, (_, index) => index + 1),
  Array.from({ length: 18 }, (_, index) => index + 1),
  [1, 2, ...Array.from({ length: 15 }, (_, index) => index + 4)],
  [1, 2, ...Array.from({ length: 15 }, (_, index) => index + 4)],
]

export const families = [
  'alkali', 'alkaline', 'transition', 'post-transition', 'metalloid',
  'nonmetal', 'halogen', 'noble', 'lanthanoid', 'actinoid',
]

export const familyNames = {
  en: {
    alkali: 'Alkali metal', alkaline: 'Alkaline earth metal', transition: 'Transition metal',
    'post-transition': 'Post-transition metal', metalloid: 'Metalloid', nonmetal: 'Nonmetal',
    halogen: 'Halogen', noble: 'Noble gas', lanthanoid: 'Lanthanide', actinoid: 'Actinide',
  },
  de: {
    alkali: 'Alkalimetall', alkaline: 'Erdalkalimetall', transition: 'Übergangsmetall',
    'post-transition': 'Post-Übergangsmetall', metalloid: 'Halbmetall', nonmetal: 'Nichtmetall',
    halogen: 'Halogen', noble: 'Edelgas', lanthanoid: 'Lanthanoid', actinoid: 'Actinoid',
  },
}

function getFamily(number, group) {
  if (number >= 57 && number <= 71) return 'lanthanoid'
  if (number >= 89 && number <= 103) return 'actinoid'
  if (group === 1 && number !== 1) return 'alkali'
  if (group === 2) return 'alkaline'
  if (group === 17) return 'halogen'
  if (group === 18) return 'noble'
  if (group >= 3 && group <= 12) return 'transition'
  if ([5, 14, 32, 33, 51, 52, 84].includes(number)) return 'metalloid'
  if ([1, 6, 7, 8, 15, 16, 34].includes(number)) return 'nonmetal'
  return 'post-transition'
}

export const mainElements = []
for (let period = 1; period <= 7; period += 1) {
  let number = period === 1 ? 1 : [3, 11, 19, 37, 55, 87][period - 2]
  for (const group of periodGroups[period - 1]) {
    if ((period === 6 && number === 57) || (period === 7 && number === 89)) number += 15
    const element = elementNames[number - 1]
    if (element) mainElements.push({ ...element, nameDe: germanNames[number] ?? element.name, period, group, family: getFamily(number, group) })
    number += 1
  }
}

export const detachedElements = elementNames
  .filter(element => (element.number >= 57 && element.number <= 71) || (element.number >= 89 && element.number <= 103))
  .map(element => ({
    ...element,
    nameDe: germanNames[element.number] ?? element.name,
    period: element.number < 72 ? 8 : 9,
    group: (element.number < 72 ? element.number - 56 : element.number - 88),
    family: element.number < 72 ? 'lanthanoid' : 'actinoid',
  }))

export const elements = [...mainElements, ...detachedElements].sort((a, b) => a.number - b.number)

export function elementName(element, language) {
  return language === 'de' ? element.nameDe : element.name
}

const nameVariants = {
  en: { 13: ['Aluminum'], 16: ['Sulphur'], 55: ['Cesium'] },
  de: { 13: ['Aluminum'], 14: ['Silizium'], 27: ['Cobalt'], 40: ['Zirkonium'], 53: ['Jod'], 55: ['Cäsium'], 83: ['Wismut'], 111: ['Röntgenium'] },
}

export function matchesElementName(answer, element, language) {
  const normalize = value => value.trim().normalize('NFC').toLocaleLowerCase(language)
  const names = [elementName(element, language), ...(nameVariants[language]?.[element.number] ?? [])]
  return names.some(name => normalize(answer) === normalize(name))
}
