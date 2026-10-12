// Original bilingual teaching notes. Factual basis: the linked PubChem element
// records (including their Jefferson Lab/LANL/CIAAW references), retrieved 2026-10-12.
// The two halves of every field are English | German.
import exampleCitations from './example-citations.json'
const notes = `
1~Water and organic matter|Wasser und organische Stoffe~Ammonia manufacture and fuel cells|Ammoniakherstellung und Brennstoffzellen~Greek: water-former|Griechisch: Wasserbildner
2~Natural gas and stars|Erdgas und Sterne~Cryogenic cooling and leak detection|Tieftemperaturkühlung und Lecksuche~Greek: Sun|Griechisch: Sonne
3~Brines and silicate minerals|Salzlaken und Silikatminerale~Rechargeable batteries and glass|Akkus und Glas~Greek: stone|Griechisch: Stein
4~Beryl and other minerals|Beryll und andere Minerale~Special alloys and X-ray windows|Speziallegierungen und Röntgenfenster~The mineral beryl|Das Mineral Beryll
5~Borate minerals|Boratminerale~Borosilicate glass and detergents|Borosilikatglas und Waschmittel~Borax|Borax
6~Living matter, carbonates, graphite and diamond|Lebewesen, Carbonate, Graphit und Diamant~Steel, electrodes and organic materials|Stahl, Elektroden und organische Werkstoffe~Latin: charcoal|Lateinisch: Holzkohle
7~Air and nitrogen-containing compounds|Luft und stickstoffhaltige Verbindungen~Fertilizers and protective atmospheres|Düngemittel und Schutzgas~Greek: nitre-former|Griechisch: Salpeterbildner
8~Air, water and oxides|Luft, Wasser und Oxide~Medical oxygen and steelmaking|Medizinischer Sauerstoff und Stahlherstellung~Greek: acid-former, an early chemical interpretation|Griechisch: Säurebildner, eine frühe chemische Deutung
9~Fluorite and fluorapatite|Fluorit und Fluorapatit~Fluoropolymers and fluoride compounds|Fluorpolymere und Fluoridverbindungen~Latin: to flow|Lateinisch: fließen
10~Trace constituent of air|Spurenbestandteil der Luft~Illuminated signs|Leuchtreklame~Greek: new|Griechisch: neu
11~Rock salt and seawater|Steinsalz und Meerwasser~Chemical synthesis and sodium compounds|Chemische Synthese und Natriumverbindungen~Soda; the symbol comes from natrium|Soda; das Symbol stammt von Natrium
12~Seawater, dolomite and magnesite|Meerwasser, Dolomit und Magnesit~Light alloys and flares|Leichtmetalllegierungen und Leuchtmittel~Magnesia, a Greek region|Magnesia, eine griechische Region
13~Bauxite and aluminosilicates|Bauxit und Alumosilikate~Packaging, construction and transport|Verpackungen, Bau und Verkehr~Latin: alum|Lateinisch: Alaun
14~Silica and silicate minerals|Siliciumdioxid und Silikatminerale~Semiconductors and solar cells|Halbleiter und Solarzellen~Latin: flint|Lateinisch: Feuerstein
15~Phosphate minerals and living matter|Phosphatminerale und Lebewesen~Fertilizers and phosphoric acid|Düngemittel und Phosphorsäure~Greek: light-bearer|Griechisch: Lichtträger
16~Sulfides, sulfates and native sulfur|Sulfide, Sulfate und gediegener Schwefel~Sulfuric acid and rubber vulcanization|Schwefelsäure und Vulkanisation von Gummi~Latin: sulphur|Lateinisch: sulphur
17~Chlorides in seawater and rock salt|Chloride in Meerwasser und Steinsalz~Water treatment and PVC manufacture|Wasseraufbereitung und PVC-Herstellung~Greek: pale green|Griechisch: blassgrün
18~About one percent of air|Etwa ein Prozent der Luft~Welding shielding gas and lamps|Schutzgas beim Schweißen und Lampen~Greek: inactive|Griechisch: untätig
19~Potash minerals and living cells|Kalisalze und lebende Zellen~Fertilizers and potassium compounds|Düngemittel und Kaliumverbindungen~Potash; the symbol comes from kalium|Pottasche; das Symbol stammt von Kalium
20~Limestone, gypsum and bones|Kalkstein, Gips und Knochen~Cement, lime and metallurgy|Zement, Kalk und Metallurgie~Latin: lime|Lateinisch: Kalk
21~Dispersed in minerals including thortveitite|Verteilt in Mineralen, etwa Thortveitit~Special aluminium alloys|Spezielle Aluminiumlegierungen~Scandinavia|Skandinavien
22~Rutile and ilmenite|Rutil und Ilmenit~Aircraft alloys, implants and oxide pigments|Flugzeuglegierungen, Implantate und Oxidpigmente~The Titans of Greek mythology|Die Titanen der griechischen Mythologie
23~Vanadium-bearing ores|Vanadiumhaltige Erze~Steel alloys and catalysts|Stahllegierungen und Katalysatoren~Vanadis, a name of the goddess Freyja|Vanadis, ein Name der Göttin Freyja
24~Chromite|Chromit~Stainless steel and protective coatings|Edelstahl und Schutzschichten~Greek: colour|Griechisch: Farbe
25~Manganese oxide ores|Manganoxiderze~Steelmaking and batteries|Stahlherstellung und Batterien~Magnesia, through historical mineral names|Magnesia, über historische Mineralnamen
26~Iron ores such as hematite and magnetite|Eisenerze wie Hämatit und Magnetit~Steel and machinery|Stahl und Maschinen~An old Germanic name; Fe comes from ferrum|Alter germanischer Name; Fe stammt von ferrum
27~Usually with nickel and copper ores|Meist zusammen mit Nickel- und Kupfererzen~Battery materials and high-temperature alloys|Batteriewerkstoffe und Hochtemperaturlegierungen~German: Kobold|Deutsch: Kobold
28~Sulfide ores and laterites|Sulfiderze und Laterite~Stainless steel and batteries|Edelstahl und Batterien~German miners' term Kupfernickel|Bergmannsbezeichnung Kupfernickel
29~Copper ores and native copper|Kupfererze und gediegenes Kupfer~Electrical wiring and plumbing|Elektrische Leitungen und Rohrleitungen~Latin name associated with Cyprus|Lateinischer Name mit Bezug auf Zypern
30~Sphalerite|Zinkblende~Galvanizing steel and making brass|Verzinken von Stahl und Messingherstellung~German: Zink|Deutsch: Zink
31~Trace component of bauxite and zinc ores|Spurenbestandteil von Bauxit und Zinkerzen~Compound semiconductors and LEDs|Verbindungshalbleiter und LEDs~Latin: Gaul|Lateinisch: Gallien
32~Trace component of zinc ores and coal|Spurenbestandteil von Zinkerzen und Kohle~Optical fibres and infrared optics|Glasfasern und Infrarotoptik~Latin: Germany|Lateinisch: Deutschland
33~Arsenic-bearing sulfide minerals|Arsenhaltige Sulfidminerale~Compound semiconductors|Verbindungshalbleiter~An ancient name for arsenic minerals|Alter Name für Arsenminerale
34~Trace component of sulfide ores|Spurenbestandteil von Sulfiderzen~Glass manufacture and electronic materials|Glasherstellung und elektronische Werkstoffe~Greek: Moon|Griechisch: Mond
35~Seawater and concentrated brines|Meerwasser und konzentrierte Salzlaken~Bromine-containing chemicals|Bromhaltige Chemikalien~Greek: stench|Griechisch: Gestank
36~Trace constituent of air|Spurenbestandteil der Luft~Special lamps and lasers|Speziallampen und Laser~Greek: hidden|Griechisch: verborgen
37~Lithium and potassium minerals|Lithium- und Kaliumminerale~Atomic clocks and research|Atomuhren und Forschung~Latin: deep red, referring to spectral lines|Lateinisch: dunkelrot, nach Spektrallinien
38~Celestite and strontianite|Coelestin und Strontianit~Red fireworks and ferrite magnets|Rotes Feuerwerk und Ferritmagnete~Strontian, Scotland|Strontian in Schottland
39~Rare-earth minerals|Seltenerdminerale~Phosphors, ceramics and lasers|Leuchtstoffe, Keramik und Laser~Ytterby, Sweden|Ytterby in Schweden
40~Zircon|Zirkon~Nuclear fuel cladding and ceramics|Kernbrennstoffhüllen und Keramik~The mineral zircon|Das Mineral Zirkon
41~Niobium-bearing minerals such as pyrochlore|Niobminerale wie Pyrochlor~Superconducting alloys and special steels|Supraleitende Legierungen und Spezialstähle~Niobe of Greek mythology|Niobe aus der griechischen Mythologie
42~Molybdenite|Molybdänit~Steel alloys and catalysts|Stahllegierungen und Katalysatoren~Greek: lead, reflecting early mineral confusion|Griechisch: Blei, wegen früherer Mineralverwechslungen
43~Produced artificially; traces occur in uranium ores|Künstlich hergestellt; Spuren in Uranerzen~Technetium-99m in medical imaging; the table lists ground states|Technetium-99m in der Bildgebung; die Tabelle zeigt Grundzustände~Greek: artificial|Griechisch: künstlich
44~Platinum-group ores|Erze der Platingruppe~Catalysts and electrical contacts|Katalysatoren und elektrische Kontakte~Latin: Ruthenia|Lateinisch: Ruthenien
45~Platinum-group ores|Erze der Platingruppe~Catalytic converters|Abgaskatalysatoren~Greek: rose, referring to salt colours|Griechisch: Rose, nach der Farbe von Salzen
46~Platinum-group ores|Erze der Platingruppe~Catalysts and electronics|Katalysatoren und Elektronik~The asteroid Pallas|Der Asteroid Pallas
47~Silver ores and native silver|Silbererze und gediegenes Silber~Electrical contacts, jewellery and mirrors|Elektrische Kontakte, Schmuck und Spiegel~An old Germanic name; Ag comes from argentum|Alter germanischer Name; Ag stammt von argentum
48~By-product of zinc refining|Nebenprodukt der Zinkgewinnung~Special batteries and semiconductor materials|Spezialbatterien und Halbleiterwerkstoffe~Latin: cadmia, a zinc ore|Lateinisch: cadmia, ein Zinkerz
49~Trace component of zinc ores|Spurenbestandteil von Zinkerzen~Transparent conductive coatings|Transparente leitfähige Beschichtungen~Indigo spectral lines|Indigofarbene Spektrallinien
50~Cassiterite|Kassiterit~Solder and protective coatings|Lötmittel und Schutzüberzüge~An old Germanic name; Sn comes from stannum|Alter germanischer Name; Sn stammt von stannum
51~Stibnite|Antimonit~Alloys and flame-retardant compounds|Legierungen und flammhemmende Verbindungen~Medieval Latin: antimonium; Sb from stibium|Mittellateinisch: antimonium; Sb von stibium
52~Telluride minerals and copper-refining residues|Telluridminerale und Rückstände der Kupferraffination~Solar cells and thermoelectric materials|Solarzellen und thermoelektrische Werkstoffe~Latin: Earth|Lateinisch: Erde
53~Brines and iodate deposits|Salzlaken und Iodatlagerstätten~Iodized salt and medical compounds|Jodsalz und medizinische Verbindungen~Greek: violet|Griechisch: violett
54~Trace constituent of air|Spurenbestandteil der Luft~Lamps, ion propulsion and medical uses|Lampen, Ionenantriebe und medizinische Anwendungen~Greek: stranger|Griechisch: fremd
55~Pollucite and related minerals|Pollucit und verwandte Minerale~Atomic clocks|Atomuhren~Latin: sky blue, referring to spectral lines|Lateinisch: himmelblau, nach Spektrallinien
56~Barite and witherite|Baryt und Witherit~Drilling fluids and barium compounds|Bohrspülungen und Bariumverbindungen~Greek: heavy|Griechisch: schwer
57~Rare-earth minerals such as monazite|Seltenerdminerale wie Monazit~Optical glass and battery alloys|Optische Gläser und Batterielegierungen~Greek: hidden|Griechisch: verborgen
58~Monazite and bastnäsite|Monazit und Bastnäsit~Glass polishing and catalysts|Glaspolitur und Katalysatoren~The dwarf planet Ceres|Der Zwergplanet Ceres
59~Rare-earth minerals|Seltenerdminerale~Magnets and coloured glass|Magnete und farbiges Glas~Greek: green twin|Griechisch: grüner Zwilling
60~Rare-earth minerals|Seltenerdminerale~Strong permanent magnets and lasers|Starke Dauermagnete und Laser~Greek: new twin|Griechisch: neuer Zwilling
61~Artificial production; only traces in nature|Künstliche Herstellung; nur Spuren in der Natur~Special nuclear batteries and research|Spezielle Nuklearbatterien und Forschung~Prometheus of Greek mythology|Prometheus aus der griechischen Mythologie
62~Rare-earth minerals|Seltenerdminerale~Permanent magnets and neutron absorption|Dauermagnete und Neutronenabsorption~The mineral samarskite|Das Mineral Samarskit
63~Rare-earth minerals|Seltenerdminerale~Phosphors in displays and lighting|Leuchtstoffe in Anzeigen und Beleuchtung~Europe|Europa
64~Rare-earth minerals|Seltenerdminerale~MRI contrast compounds and neutron absorption|MRT-Kontrastverbindungen und Neutronenabsorption~Johan Gadolin|Johan Gadolin
65~Rare-earth minerals|Seltenerdminerale~Green phosphors and magnetic alloys|Grüne Leuchtstoffe und Magnetlegierungen~Ytterby, Sweden|Ytterby in Schweden
66~Rare-earth minerals|Seltenerdminerale~Heat-resistant permanent magnets|Temperaturbeständige Dauermagnete~Greek: hard to obtain|Griechisch: schwer zugänglich
67~Rare-earth minerals|Seltenerdminerale~Lasers and magnetic research|Laser und Magnetismusforschung~Latin name for Stockholm|Lateinischer Name von Stockholm
68~Rare-earth minerals|Seltenerdminerale~Optical-fibre amplifiers and lasers|Glasfaserverstärker und Laser~Ytterby, Sweden|Ytterby in Schweden
69~Rare-earth minerals|Seltenerdminerale~Lasers and portable X-ray sources|Laser und tragbare Röntgenquellen~Thule, an ancient northern place name|Thule, ein antiker Ortsname im Norden
70~Rare-earth minerals|Seltenerdminerale~Lasers and atomic-clock research|Laser und Atomuhrenforschung~Ytterby, Sweden|Ytterby in Schweden
71~Rare-earth minerals|Seltenerdminerale~Detector crystals and radiopharmaceuticals|Detektorkristalle und Radiopharmaka~Lutetia, the Latin name for Paris|Lutetia, der lateinische Name von Paris
72~Zirconium minerals|Zirkoniumminerale~Nuclear control rods and microelectronics|Kernreaktor-Steuerstäbe und Mikroelektronik~Hafnia, the Latin name for Copenhagen|Hafnia, der lateinische Name von Kopenhagen
73~Tantalite and related minerals|Tantalit und verwandte Minerale~Capacitors and corrosion-resistant equipment|Kondensatoren und korrosionsbeständige Geräte~Tantalus of Greek mythology|Tantalos aus der griechischen Mythologie
74~Wolframite and scheelite|Wolframit und Scheelit~Hard cutting tools and high-temperature parts|Harte Schneidwerkzeuge und Hochtemperaturbauteile~Swedish: heavy stone; W from wolfram|Schwedisch: schwerer Stein; W von Wolfram
75~Trace component of molybdenum ores|Spurenbestandteil von Molybdänerzen~Turbine alloys and catalysts|Turbinenlegierungen und Katalysatoren~Latin name for the Rhine|Lateinischer Name des Rheins
76~Platinum-group ores|Erze der Platingruppe~Special hard alloys and research|Spezielle Hartlegierungen und Forschung~Greek: smell|Griechisch: Geruch
77~Platinum-group ores|Erze der Platingruppe~Spark plugs and high-temperature equipment|Zündkerzen und Hochtemperaturgeräte~Greek: rainbow|Griechisch: Regenbogen
78~Platinum-group ores and native metal|Erze der Platingruppe und gediegenes Metall~Catalysts, jewellery and electrodes|Katalysatoren, Schmuck und Elektroden~Spanish: little silver|Spanisch: kleines Silber
79~Native gold and gold-bearing ores|Gediegenes Gold und goldhaltige Erze~Jewellery and electronic contacts|Schmuck und elektronische Kontakte~An old Germanic name; Au comes from aurum|Alter germanischer Name; Au stammt von aurum
80~Cinnabar|Zinnober~Special lamps and instruments; many uses are restricted|Speziallampen und Instrumente; viele Anwendungen sind eingeschränkt~The planet Mercury; Hg means liquid silver|Der Planet Merkur; Hg bedeutet flüssiges Silber
81~Trace component of sulfide ores|Spurenbestandteil von Sulfiderzen~Special detectors and optical materials|Spezialdetektoren und optische Werkstoffe~Greek: green shoot, referring to a spectral line|Griechisch: grüner Spross, nach einer Spektrallinie
82~Galena|Galenit~Lead-acid batteries and radiation shielding|Bleiakkus und Strahlenschutz~An old Germanic name; Pb comes from plumbum|Alter germanischer Name; Pb stammt von plumbum
83~Bismuth ores and refining by-products|Bismuterze und Raffinationsnebenprodukte~Low-melting alloys and medical compounds|Niedrigschmelzende Legierungen und medizinische Verbindungen~German: Wismut|Deutsch: Wismut
84~Trace decay products in uranium ores|Zerfallsprodukte in Spuren in Uranerzen~Specialized research and historical heat sources|Spezialforschung und historische Wärmequellen~Poland|Polen
85~Trace decay products; artificial production|Zerfallsprodukte in Spuren; künstliche Herstellung~Research into targeted radionuclide therapy|Forschung zur gezielten Radionuklidtherapie~Greek: unstable|Griechisch: instabil
86~Radioactive decay in rocks and soil|Radioaktiver Zerfall in Gesteinen und Böden~Tracer studies and radiation research|Tracerstudien und Strahlungsforschung~Derived from radium|Abgeleitet von Radium
87~Trace decay products of actinium|Zerfallsprodukte von Actinium in Spuren~Atomic-physics research|Atomphysikalische Forschung~France|Frankreich
88~Trace component of uranium ores|Spurenbestandteil von Uranerzen~Special radiopharmaceuticals and research|Spezielle Radiopharmaka und Forschung~Latin: ray|Lateinisch: Strahl
89~Trace component of uranium ores; artificial production|Spuren in Uranerzen; künstliche Herstellung~Research and targeted radionuclide therapy|Forschung und gezielte Radionuklidtherapie~Greek: ray|Griechisch: Strahl
90~Monazite and thorium minerals|Monazit und Thoriumminerale~Nuclear-fuel research|Kernbrennstoffforschung~Thor, the Norse god|Thor, der nordische Gott
91~Trace component of uranium ores|Spurenbestandteil von Uranerzen~Scientific research|Wissenschaftliche Forschung~Greek: before actinium|Griechisch: vor Actinium
92~Uraninite and other uranium minerals|Uraninit und andere Uranminerale~Nuclear fuel|Kernbrennstoff~The planet Uranus|Der Planet Uranus
93~Nuclear reactions; traces in uranium ores|Kernreaktionen; Spuren in Uranerzen~Nuclear research and isotope production|Kernforschung und Isotopenproduktion~The planet Neptune|Der Planet Neptun
94~Mainly artificial production; natural traces|Überwiegend künstliche Herstellung; natürliche Spuren~Nuclear fuel and spacecraft heat sources|Kernbrennstoff und Wärmequellen für Raumsonden~Pluto|Pluto
95~Artificial production in nuclear reactors|Künstliche Herstellung in Kernreaktoren~Ionization smoke detectors and research|Ionisationsrauchmelder und Forschung~The Americas|Amerika
96~Artificial production in nuclear reactors|Künstliche Herstellung in Kernreaktoren~Research and analytical radiation sources|Forschung und analytische Strahlungsquellen~Marie and Pierre Curie|Marie und Pierre Curie
97~Artificial production|Künstliche Herstellung~Synthesis of heavier elements|Synthese schwererer Elemente~Berkeley, California|Berkeley in Kalifornien
98~Artificial production|Künstliche Herstellung~Neutron sources and research|Neutronenquellen und Forschung~California|Kalifornien
99~Artificial production|Künstliche Herstellung~Scientific research|Wissenschaftliche Forschung~Albert Einstein|Albert Einstein
100~Artificial production|Künstliche Herstellung~Scientific research|Wissenschaftliche Forschung~Enrico Fermi|Enrico Fermi
101~Artificial production|Künstliche Herstellung~Scientific research|Wissenschaftliche Forschung~Dmitri Mendeleev|Dmitri Mendelejew
102~Artificial production|Künstliche Herstellung~Scientific research|Wissenschaftliche Forschung~Alfred Nobel|Alfred Nobel
103~Artificial production|Künstliche Herstellung~Scientific research|Wissenschaftliche Forschung~Ernest Lawrence|Ernest Lawrence
104~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Ernest Rutherford|Ernest Rutherford
105~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Dubna, Russia|Dubna in Russland
106~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Glenn Seaborg|Glenn Seaborg
107~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Niels Bohr|Niels Bohr
108~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Latin name for Hesse|Lateinischer Name von Hessen
109~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Lise Meitner|Lise Meitner
110~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Darmstadt, Germany|Darmstadt in Deutschland
111~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Wilhelm Conrad Röntgen|Wilhelm Conrad Röntgen
112~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Nicolaus Copernicus|Nikolaus Kopernikus
113~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Nihon, a Japanese name for Japan|Nihon, ein japanischer Name für Japan
114~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Flerov Laboratory of Nuclear Reactions|Flerow-Laboratorium für Kernreaktionen
115~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Moscow region|Region Moskau
116~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Lawrence Livermore National Laboratory|Lawrence Livermore National Laboratory
117~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Tennessee|Tennessee
118~Artificial production, atom by atom|Künstliche Herstellung, Atom für Atom~Scientific research|Wissenschaftliche Forschung~Yuri Oganessian|Juri Oganessjan
`
export const editorial = Object.fromEntries(notes.trim().split('\n').map(line => {
  const [number, ...fields] = line.split('~')
  return [number, Object.fromEntries(['occurrence', 'uses', 'origin'].map((key, index) => {
    const [en, de] = fields[index].split('|')
    return [key, { en, de, source: `https://pubchem.ncbi.nlm.nih.gov/element/${number}` }]
  }))]
}))

const appearances = {
  colourlessGas: ['Colourless gas', 'Farbloses Gas'], silvery: ['Silvery metallic solid', 'Silbrig-metallischer Feststoff'],
  carbon: ['Graphite is dark; diamond can be transparent. Appearance depends on allotrope.', 'Graphit ist dunkel; Diamant kann durchsichtig sein. Das Aussehen hängt von der Modifikation ab.'],
  boron: ['Dark solid in crystalline form', 'Dunkler Feststoff in kristalliner Form'], silicon: ['Grey, lustrous crystalline solid', 'Grauer, glänzender kristalliner Feststoff'],
  phosphorus: ['White, red or black allotropes', 'Weiße, rote oder schwarze Modifikationen'], sulfur: ['Yellow solid', 'Gelber Feststoff'],
  fluorine: ['Pale yellow gas', 'Blassgelbes Gas'], chlorine: ['Yellow-green gas', 'Gelbgrünes Gas'], bromine: ['Red-brown liquid', 'Rotbraune Flüssigkeit'],
  iodine: ['Dark, lustrous solid; violet vapour', 'Dunkler, glänzender Feststoff; violetter Dampf'], copper: ['Reddish metallic solid', 'Rötlicher metallischer Feststoff'],
  gold: ['Yellow metallic solid', 'Gelber metallischer Feststoff'], mercury: ['Silvery liquid', 'Silbrige Flüssigkeit'],
}
const appearanceKeys = { 5: 'boron', 6: 'carbon', 9: 'fluorine', 14: 'silicon', 15: 'phosphorus', 16: 'sulfur', 17: 'chlorine', 29: 'copper', 35: 'bromine', 53: 'iodine', 79: 'gold', 80: 'mercury' }
for (const z of [1, 2, 7, 8, 10, 18, 36, 54, 86]) appearanceKeys[z] = 'colourlessGas'
for (const z of [3, 4, 11, 12, 13, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 77, 78, 81, 82, 88, 89, 90, 91, 92, 93, 94]) appearanceKeys[z] = 'silvery'
export function appearance(number, language) { return appearances[appearanceKeys[number]]?.[language === 'de' ? 1 : 0] ?? null }
export function appearanceSource(number) { return appearanceKeys[number] ? `https://pubchem.ncbi.nlm.nih.gov/element/${number}` : null }

// Identity links are deliberately independent of formula equivalence.
export const curatedExamples = {
  1: ['default-1', 'default-2'], 6: ['default-1', 'default-33'],
  7: ['default-2', 'default-33'], 8: ['default-1', 'default-2'],
  11: ['default-11', 'default-20'], 12: ['default-30'],
  15: ['default-9'], 16: ['default-14'], 17: ['default-11', 'default-6'],
  19: ['default-10'], 20: ['default-3'],
}

// Examples outside the default library remain informative, without guessing a
// library identity from their formulas. These IDs are reserved reference IDs.
const additionalExamples = `
3~lithium-carbonate~Li2CO3~Lithium carbonate~Lithiumcarbonat
4~beryllium-oxide~BeO~Beryllium oxide~Berylliumoxid
5~boric-acid~H3BO3~Boric acid~Borsäure
9~calcium-fluoride~CaF2~Calcium fluoride~Calciumfluorid
13~aluminium-oxide~Al2O3~Aluminium oxide~Aluminiumoxid
14~silicon-dioxide~SiO2~Silicon dioxide~Siliciumdioxid
21~scandium-oxide~Sc2O3~Scandium oxide~Scandiumoxid
22~titanium-dioxide~TiO2~Titanium dioxide~Titandioxid
23~vanadium-pentoxide~V2O5~Vanadium pentoxide~Vanadiumpentoxid
24~chromium-iii-oxide~Cr2O3~Chromium(III) oxide~Chrom(III)-oxid
25~manganese-dioxide~MnO2~Manganese dioxide~Mangandioxid
26~iron-iii-oxide~Fe2O3~Iron(III) oxide~Eisen(III)-oxid
27~cobalt-ii-chloride~CoCl2~Cobalt(II) chloride~Kobalt(II)-chlorid
28~nickel-ii-sulfate~NiSO4~Nickel(II) sulfate~Nickel(II)-sulfat
29~copper-ii-sulfate-pentahydrate~CuSO4·5H2O~Copper(II) sulfate pentahydrate~Kupfer(II)-sulfat-Pentahydrat
30~zinc-oxide~ZnO~Zinc oxide~Zinkoxid
31~gallium-arsenide~GaAs~Gallium arsenide~Galliumarsenid
32~germanium-dioxide~GeO2~Germanium dioxide~Germaniumdioxid
33~gallium-arsenide~GaAs~Gallium arsenide~Galliumarsenid
34~selenium-dioxide~SeO2~Selenium dioxide~Selendioxid
35~potassium-bromide~KBr~Potassium bromide~Kaliumbromid
37~rubidium-chloride~RbCl~Rubidium chloride~Rubidiumchlorid
38~strontium-carbonate~SrCO3~Strontium carbonate~Strontiumcarbonat
39~yttrium-oxide~Y2O3~Yttrium oxide~Yttriumoxid
40~zirconium-dioxide~ZrO2~Zirconium dioxide~Zirkoniumdioxid
41~niobium-pentoxide~Nb2O5~Niobium pentoxide~Niobpentoxid
42~molybdenum-disulfide~MoS2~Molybdenum disulfide~Molybdändisulfid
47~silver-nitrate~AgNO3~Silver nitrate~Silbernitrat
48~cadmium-sulfide~CdS~Cadmium sulfide~Cadmiumsulfid
49~indium-oxide~In2O3~Indium oxide~Indiumoxid
50~tin-iv-oxide~SnO2~Tin(IV) oxide~Zinn(IV)-oxid
51~antimony-trioxide~Sb2O3~Antimony trioxide~Antimontrioxid
52~tellurium-dioxide~TeO2~Tellurium dioxide~Tellurdioxid
53~potassium-iodide~KI~Potassium iodide~Kaliumiodid
54~xenon-difluoride~XeF2~Xenon difluoride~Xenondifluorid
55~caesium-chloride~CsCl~Caesium chloride~Caesiumchlorid
56~barium-sulfate~BaSO4~Barium sulfate~Bariumsulfat
57~lanthanum-oxide~La2O3~Lanthanum oxide~Lanthanoxid
58~cerium-dioxide~CeO2~Cerium dioxide~Cerdioxid
72~hafnium-dioxide~HfO2~Hafnium dioxide~Hafniumdioxid
73~tantalum-pentoxide~Ta2O5~Tantalum pentoxide~Tantalpentoxid
74~tungsten-carbide~WC~Tungsten carbide~Wolframcarbid
80~mercury-ii-sulfide~HgS~Mercury(II) sulfide~Quecksilber(II)-sulfid
82~lead-ii-sulfide~PbS~Lead(II) sulfide~Blei(II)-sulfid
83~bismuth-iii-oxide~Bi2O3~Bismuth(III) oxide~Bismut(III)-oxid
90~thorium-dioxide~ThO2~Thorium dioxide~Thoriumdioxid
92~uranium-dioxide~UO2~Uranium dioxide~Urandioxid
`
export const referenceExamples = Object.fromEntries(additionalExamples.trim().split('\n').map(line => {
  const [number, id, formula, name, nameDe] = line.split('~')
  const citation = exampleCitations.compounds[id]
  return [number, [{ id: `reference:${id}`, formula, name, nameDe, source: `https://pubchem.ncbi.nlm.nih.gov/compound/${citation.cid}` }]]
}))
