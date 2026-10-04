/* eslint-disable react/prop-types */
import { useState } from 'react'
import SectionHeader from './SectionHeader'

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

const periodGroups = [
  [1, 18],
  [1, 2, 13, 14, 15, 16, 17, 18],
  [1, 2, 13, 14, 15, 16, 17, 18],
  Array.from({ length: 18 }, (_, index) => index + 1),
  Array.from({ length: 18 }, (_, index) => index + 1),
  [1, 2, ...Array.from({ length: 15 }, (_, index) => index + 4)],
  [1, 2, ...Array.from({ length: 15 }, (_, index) => index + 4)],
]

function getCategory(number, group) {
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

const mainElements = []
for (let period = 1; period <= 7; period += 1) {
  let number = period === 1 ? 1 : [3, 11, 19, 37, 55, 87][period - 2]
  const groups = periodGroups[period - 1]
  for (const group of groups) {
    if ((period === 6 && number === 57) || (period === 7 && number === 89)) number += 15
    const element = elementNames[number - 1]
    if (element) mainElements.push({ ...element, period, group, category: getCategory(number, group) })
    number += 1
  }
}

const detachedElements = elementNames
  .map((element, index) => ({ ...element, number: index + 1 }))
  .filter(element => (element.number >= 57 && element.number <= 71) || (element.number >= 89 && element.number <= 103))
  .map(element => ({
    ...element,
    period: element.number < 72 ? 8 : 9,
    group: (element.number < 72 ? element.number - 56 : element.number - 88),
    category: element.number < 72 ? 'lanthanoid' : 'actinoid',
  }))

const categoryLabels = {
  alkali: 'Alkali metal', alkaline: 'Alkaline earth metal', transition: 'Transition metal',
  'post-transition': 'Post-transition metal', metalloid: 'Metalloid', nonmetal: 'Nonmetal',
  halogen: 'Halogen', noble: 'Noble gas', lanthanoid: 'Lanthanide', actinoid: 'Actinide',
}

export default function PeriodicTable() {
  const [selected, setSelected] = useState(null)

  return (
    <section aria-labelledby="periodic-table-title" className="space-y-6">
      <SectionHeader number="03" title="Periodic table" description="Select an element to see its details." headingId="periodic-table-title" />

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[900px] space-y-2">
          <div className="periodic-grid">
            {mainElements.map(element => (
              <button
                key={element.number}
                type="button"
                onClick={() => setSelected(element)}
                aria-label={`${element.number} ${element.name} (${element.symbol})`}
                aria-pressed={selected?.number === element.number}
                className={`element-cell element-cell--${element.category} ${selected?.number === element.number ? 'element-cell--selected' : ''}`}
                style={{ gridColumn: element.group, gridRow: element.period }}
              >
                <span className="element-cell__number">{element.number}</span>
                <span className="element-cell__symbol">{element.symbol}</span>
                <span className="element-cell__name">{element.name}</span>
              </button>
            ))}
          </div>
          <div className="periodic-grid periodic-grid--detached">
            {detachedElements.map(element => (
              <button
                key={element.number}
                type="button"
                onClick={() => setSelected(element)}
                aria-label={`${element.number} ${element.name} (${element.symbol})`}
                aria-pressed={selected?.number === element.number}
                className={`element-cell element-cell--${element.category} ${selected?.number === element.number ? 'element-cell--selected' : ''}`}
                style={{ gridColumn: element.group + 3 }}
              >
                <span className="element-cell__number">{element.number}</span>
                <span className="element-cell__symbol">{element.symbol}</span>
                <span className="element-cell__name">{element.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="border-y border-gray-200 dark:border-gray-700 py-4 flex items-center gap-4" aria-live="polite">
          <div className={`element-detail element-cell--${selected.category}`}>
            <span className="element-cell__number">{selected.number}</span>
            <span className="element-cell__symbol">{selected.symbol}</span>
          </div>
          <div>
            <h2 className="font-semibold">{selected.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{categoryLabels[selected.category]}</p>
          </div>
        </div>
      )}
    </section>
  )
}
