// Facts derived from quiz questions and their correct answers.
// Keyed by compoundId → array of fact strings.

export const COMPOUND_FACTS = {
  // Acetic Acid (default-1)
  'default-1': [
    'The typical concentration of acetic acid in household table vinegar is 5-8%.',
    'The IUPAC name for acetic acid is ethanoic acid.',
    'Acetic acid is the primary product of acetous fermentation (oxidation of ethanol).',
    'The freezing point of pure (glacial) acetic acid is about 16.6\u00B0C.',
    'Pure acetic acid is called "glacial" because it freezes into ice-like crystals just below room temperature.',
    'Acetic acid is classified as a weak organic acid.',
    'The functional group present in acetic acid is the carboxyl group (-COOH).',
    'The approximate pH of household vinegar is 2.4.',
    'Acetic acid reacts with baking soda (sodium bicarbonate) to produce carbon dioxide gas.',
    'Vinegar was first documented in Ancient Babylon (circa 5000 BC).',
  ],

  // Ammonia Solution (default-2)
  'default-2': [
    'The common German-derived name for ammonia solution is Salmiac spirit (Salmiakgeist).',
    'The approximate pH of a typical household ammonia solution is 11-12.',
    'Ammonia solution is easily identified by its strong pungent odor.',
    'Ammonium nitrate is a common fertilizer produced from ammonia.',
    'In the Haber-Bosch process, ammonia is synthesized from nitrogen and hydrogen.',
    'Ammonia solution is an effective household cleaning agent because it cuts through grease and grime.',
    'Mixing ammonia solution with bleach (sodium hypochlorite) can produce dangerous chloramine gas.',
    'Ammonium hydroxide is classified as a weak base.',
    'The Haber-Bosch process revolutionized ammonia production in the early 20th century.',
    'Smelling salts, historically used to revive people who fainted, release ammonia gas.',
  ],

  // Calcium Hydroxide (default-3)
  'default-3': [
    'The common name for calcium hydroxide is slaked lime.',
    'Calcium hydroxide is produced by adding water to calcium oxide (CaO) \u2014 quicklime.',
    'In lime mortar, calcium hydroxide reacts with CO\u2082 over time, hardening into calcium carbonate.',
    'In water treatment, calcium hydroxide is used primarily to adjust (raise) pH levels.',
    'The approximate pH of a saturated calcium hydroxide solution (limewater) is 12.4.',
    'Limewater is a classic test for carbon dioxide.',
    'When carbon dioxide is bubbled through limewater, it turns milky/cloudy white.',
    'In some Latin American cuisines, calcium hydroxide is used in the preparation of corn tortillas (nixtamalization).',
    'Calcium hydroxide is a strong base, but only slightly soluble in water.',
    'The process of converting quicklime to slaked lime by adding water is called slaking.',
  ],

  // Carbonic Acid (default-4)
  'default-4': [
    'Carbonic acid is formed when carbon dioxide dissolves in water.',
    'Carbonic acid is classified as a weak diprotic acid.',
    'The fizz in carbonated mineral water is caused by dissolved carbon dioxide coming out of solution.',
    'The approximate pH of carbonated water is 3.0\u20134.0.',
    'Carbonic acid plays a critical role in the chemical weathering of limestone and rocks.',
    'In human blood, the carbonic acid/bicarbonate system functions as a pH buffer system.',
    'Carbonic anhydrase is the enzyme in red blood cells that catalyzes the conversion of CO\u2082 and water to carbonic acid.',
    'When a carbonated drink is left open, carbonic acid decomposes back into CO\u2082 and water, causing the drink to go flat.',
    'Stalactites and stalagmites in caves are formed through the action of carbonic acid on limestone (calcium carbonate).',
    'Joseph Priestley first produced artificially carbonated water in 1767.',
  ],

  // Citric Acid (default-5)
  'default-5': [
    'Citric acid is found in the highest concentration in lemons and limes.',
    'Citric acid plays a central role in the Krebs cycle (citric acid cycle).',
    'In the food industry, citric acid is commonly assigned the E number E330.',
    'The primary industrial method for producing citric acid today is fermentation using the mold Aspergillus niger.',
    'Citric acid is a triprotic acid that can donate 3 hydrogen ions per molecule.',
    'In household use, citric acid is commonly used as a natural descaler and limescale remover.',
    'At room temperature, pure citric acid exists as a white crystalline solid.',
    'Carl Wilhelm Scheele first isolated citric acid from lemon juice in 1784.',
    'In food preservation, citric acid works by lowering pH to inhibit bacterial growth and acting as an antioxidant.',
    'The approximate pH of pure lemon juice (rich in citric acid) is 2.0\u20132.5.',
  ],

  // Hydrochloric Acid (default-6)
  'default-6': [
    'The historical name for hydrochloric acid is muriatic acid (spirit of salt).',
    'Human gastric juice contains approximately 0.3% HCl.',
    'Hydrochloric acid is classified as a strong monoprotic acid.',
    'The approximate pH of 1M hydrochloric acid is 0.',
    'Hydrochloric acid is made by dissolving hydrogen chloride gas (HCl) in water.',
    'In the stomach, hydrochloric acid activates pepsinogen to pepsin and kills pathogens.',
    'When hydrochloric acid reacts with limestone (CaCO\u2083), carbon dioxide gas is produced.',
    'Aqua regia, which can dissolve gold, is a mixture of hydrochloric acid and nitric acid.',
    'The 8th-century alchemist Jabir ibn Hayyan (Geber) is often credited with the discovery of hydrochloric acid.',
    'Hydrochloric acid is widely used industrially for steel pickling (removing rust and scale from metal).',
  ],

  // Nitric Acid (default-7)
  'default-7': [
    'The historical alchemical name for nitric acid is aqua fortis (strong water).',
    'When concentrated nitric acid contacts skin, it turns the skin yellow (xanthoproteic reaction).',
    'Nitric acid is a key raw material in the production of ammonium nitrate fertilizer.',
    'The industrial production of nitric acid uses the Ostwald process.',
    'Nitric acid is classified as a strong monobasic acid and powerful oxidizing agent.',
    'Fuming nitric acid is yellow to reddish-brown in color, due to dissolved NO\u2082.',
    'TNT (trinitrotoluene) is manufactured using nitric acid in a process called nitration.',
    'Nitric acid in the atmosphere contributes to acid rain.',
    'The boiling point of pure nitric acid is 83\u00B0C.',
    'When copper metal is dissolved in concentrated nitric acid, brown nitrogen dioxide (NO\u2082) gas is produced.',
  ],

  // Nitroglycerin (default-8)
  'default-8': [
    'Nitroglycerin was invented in 1847 by Ascanio Sobrero.',
    'Alfred Nobel stabilized nitroglycerin by mixing it with diatomaceous earth to create dynamite.',
    'In medicine, nitroglycerin is used to treat angina pectoris (chest pain from heart disease).',
    'Nitroglycerin works as a vasodilator by releasing nitric oxide (NO) in the body.',
    'At room temperature, pure nitroglycerin is a colorless to pale yellow oily liquid.',
    'Pure nitroglycerin is extremely dangerous because it is sensitive to shock, heat, and friction, causing spontaneous detonation.',
    'The detonation velocity of nitroglycerin is approximately 7,700 m/s.',
    'Nitroglycerin is chemically classified as an organic nitrate ester.',
    'Nitroglycerin is synthesized from glycerol using concentrated nitric acid and sulfuric acid.',
    'A common side effect experienced by workers in nitroglycerin factories is severe headaches (due to vasodilation).',
  ],

  // Phosphoric Acid (default-9)
  'default-9': [
    'Phosphoric acid is a key ingredient in cola beverages.',
    'Phosphoric acid can donate 3 hydrogen ions, making it a triprotic acid.',
    'Phosphoric acid is classified as a moderate/weak triprotic acid.',
    'The largest industrial use of phosphoric acid is in the production of phosphate fertilizers.',
    'In dentistry, phosphoric acid is used for etching enamel before applying sealants or bonding agents.',
    'The approximate pH of a cola drink (containing phosphoric acid) is 2.5\u20133.5.',
    'At room temperature, pure phosphoric acid exists as a colorless crystalline solid (melting point ~42\u00B0C).',
    'In the food industry, phosphoric acid is assigned the E number E338.',
    'Phosphoric acid is industrially produced by the "wet process," which involves treating phosphate rock with sulfuric acid.',
    'Excessive consumption of phosphoric acid in soft drinks has been linked to reduced bone density (interference with calcium absorption).',
  ],

  // Potassium Hydroxide (default-10)
  'default-10': [
    'The common name for potassium hydroxide is caustic potash.',
    'Potassium hydroxide is used as an electrolyte in alkaline batteries.',
    'Soft or liquid soap is produced when potassium hydroxide is used instead of sodium hydroxide.',
    'Potassium hydroxide is classified as a strong base.',
    'At room temperature, solid potassium hydroxide is a white, deliquescent solid that absorbs moisture from air.',
    'The approximate pH of a 1M KOH solution is 14.',
    'KOH is commonly used in food processing to make pretzels and process olives, cocoa, and other foods.',
    'Potassium hydroxide solution is used in the laboratory for absorbing carbon dioxide to test for other gases.',
    'When KOH pellets are left exposed to air, they absorb both water and carbon dioxide.',
    'In biodiesel production, potassium hydroxide is used as a catalyst in the transesterification reaction.',
  ],

  // Salt / Sodium Chloride (default-11)
  'default-11': [
    'Sodium chloride is held together by ionic bonds.',
    'Sodium chloride has a face-centered cubic (rock salt) crystal structure.',
    'The melting point of sodium chloride is 801\u00B0C.',
    'The word "salary" is derived from the Latin word "salarium," relating to salt used as payment for Roman soldiers.',
    'The human body requires sodium chloride for nerve impulse transmission and fluid balance.',
    'The approximate pH of a sodium chloride solution in water is 7 (neutral).',
    'In warm climates, salt is obtained from seawater by solar evaporation in salt pans.',
    'Electrolysis of brine (concentrated NaCl solution) produces chlorine gas, hydrogen gas, and sodium hydroxide.',
    'In cold climates, sodium chloride is spread on roads to lower the freezing point of water (de-icing).',
    'Approximately 3.5% of the Earth\u2019s ocean water is dissolved salt by weight.',
  ],

  // Sodium Carbonate (default-12)
  'default-12': [
    'The common name for sodium carbonate is washing soda (soda ash).',
    'Sodium carbonate is industrially produced using the Solvay process.',
    'The approximate pH of a sodium carbonate solution is 11\u201312 (strongly alkaline).',
    'In glass production, sodium carbonate is used as a flux to lower the melting point of silica (sand).',
    'Naturally occurring sodium carbonate deposits are found in evaporite lakes and are known as trona or natron.',
    'Ancient Egyptians used natron (natural sodium carbonate) for mummification (desiccating bodies).',
    'Sodium carbonate is used in laundry detergent because it softens hard water by precipitating calcium and magnesium ions.',
    'The chemical formula for sodium carbonate decahydrate (washing soda crystals) is Na\u2082CO\u2083\u00B710H\u2082O.',
    'When sodium carbonate reacts with hydrochloric acid, carbon dioxide gas is produced.',
    'Sodium bicarbonate (NaHCO\u2083), not to be confused with sodium carbonate, is commonly known as baking soda.',
  ],

  // Sodium Hydroxide / Lye (default-13)
  'default-13': [
    'The most common industrial name for sodium hydroxide is caustic soda.',
    'The traditional process of making soap using sodium hydroxide and fats is called saponification.',
    'The approximate pH of a 1M NaOH solution is 14.',
    'Sodium hydroxide is a strong base that fully dissociates in water.',
    'When solid NaOH dissolves in water, the reaction is highly exothermic (releases significant heat).',
    'In the food industry, NaOH is used to process pretzels, giving them their characteristic brown crust.',
    'Sodium hydroxide is industrially produced primarily by chloralkali electrolysis of brine.',
    'Drain cleaners commonly contain NaOH because it dissolves organic matter such as hair and grease.',
    'At room temperature, NaOH typically takes the form of a white, waxy solid (flakes, pellets, or granules).',
    'Sodium hydroxide readily absorbs CO\u2082 from air, gradually converting to sodium carbonate.',
  ],

  // Sulphuric Acid (default-14)
  'default-14': [
    'The historical name for sulphuric acid is oil of vitriol.',
    'Sulphuric acid is called the "king of chemicals" because it is the most widely produced industrial chemical in the world.',
    'The industrial production of sulphuric acid uses the contact process.',
    'Sulphuric acid is a diprotic acid, meaning it can donate 2 protons per molecule.',
    'Concentrated sulphuric acid is a powerful dehydrating agent that chars sugar to carbon by removing water (creating a "carbon snake").',
    'Sulphuric acid is used in lead-acid batteries (car batteries).',
    'The boiling point of concentrated sulphuric acid is 337\u00B0C.',
    'When diluting sulphuric acid, the safe practice is to add acid to water slowly while stirring.',
    'Concentrated sulphuric acid has a density of approximately 1.84 g/mL.',
    'In the atmosphere, sulphuric acid aerosols formed from volcanic SO\u2082 emissions can cause global cooling by reflecting sunlight.',
  ],

  // Water (default-15)
  'default-15': [
    'The pH of pure water at 25\u00B0C is 7.',
    'Water is called the "universal solvent" because it dissolves more substances than any other common liquid.',
    'Unlike most substances, the solid form of water (ice) is less dense than its liquid form.',
    'Water reaches its maximum density at 4\u00B0C.',
    'The high boiling point of water (100\u00B0C) compared to similar-sized molecules is due to strong hydrogen bonding between molecules.',
    'A water molecule has a bent (V-shaped) geometry with a bond angle of approximately 104.5\u00B0.',
    'Approximately 71% of the Earth\u2019s surface is covered by water.',
    'Water\u2019s high surface tension allows insects like water striders to walk on its surface.',
    'Water\u2019s unusually high specific heat capacity means it resists changes in temperature, moderating climate.',
    'In photosynthesis, water is a source of electrons and hydrogen, split by light energy and releasing O\u2082.',
  ],

  // Aspirin (default-16)
  'default-16': [
    'Aspirin (acetylsalicylic acid) was first synthesized by Felix Hoffmann at Bayer in 1897.',
    'The name "Aspirin" was trademarked by Bayer, derived from "a" (acetyl) and "spirin" (from Spiraea, the plant genus).',
    'Aspirin works by irreversibly inhibiting the enzyme cyclooxygenase (COX), blocking prostaglandin production.',
    'Low-dose aspirin (75\u2013100 mg daily) is widely prescribed to reduce the risk of heart attacks and strokes.',
    'Aspirin belongs to the class of nonsteroidal anti-inflammatory drugs (NSAIDs).',
    'The melting point of aspirin is approximately 135\u00B0C.',
    'Aspirin can cause Reye\u2019s syndrome in children and teenagers recovering from viral infections.',
    'Hippocrates described using willow bark (containing salicin, a precursor to aspirin) for pain relief around 400 BC.',
    'Aspirin is on the WHO\u2019s List of Essential Medicines as one of the most important medications needed in a basic health system.',
    'At room temperature, aspirin is a white crystalline powder with a slightly bitter taste.',
  ],

  // Methyl Formate (default-17)
  'default-17': [
    'Methyl formate (HCOOCH\u2083) is the simplest ester, formed from methanol and formic acid.',
    'Methyl formate has a boiling point of only 31.5\u00B0C, making it highly volatile.',
    'It is used as a fumigant for stored grains and tobacco to kill insects and pests.',
    'Methyl formate is an important intermediate in the production of formic acid and formamide.',
    'In the atmosphere, methyl formate is produced naturally by the reaction of formaldehyde with methanol.',
    'Methyl formate is used as a blowing agent in the manufacture of polyurethane foam insulation.',
    'It has a pleasant ethereal or fruity odor at low concentrations.',
    'Methyl formate was historically used as a refrigerant before being replaced by safer alternatives.',
    'The flash point of methyl formate is \u221219\u00B0C, making it extremely flammable.',
    'In organic chemistry, methyl formate can serve as a carbonylation agent and a source of CO.',
  ],

  // Methanol (default-18)
  'default-18': [
    'Methanol is also known as wood alcohol because it was historically produced by the destructive distillation of wood.',
    'Methanol is the simplest alcohol, with the chemical formula CH\u2083OH.',
    'Ingesting as little as 10 mL of methanol can cause permanent blindness, and 30 mL can be fatal.',
    'Methanol poisoning is treated with ethanol or fomepizole, which compete for the enzyme alcohol dehydrogenase.',
    'Methanol is widely used as a racing fuel in some motorsport series (e.g. IndyCar) because its fires can be extinguished with water.',
    'Methanol burns with a nearly invisible pale blue flame, making methanol fires particularly dangerous.',
    'Industrial methanol is primarily produced from synthesis gas (CO + H\u2082) using a catalyst.',
    'The boiling point of methanol is 64.7\u00B0C.',
    'Methanol is a key feedstock for producing formaldehyde, acetic acid, and various plastics.',
    'Methanol can be used as a hydrogen carrier for fuel cell applications.',
  ],

  // Ethanol (default-19)
  'default-19': [
    'Ethanol (C\u2082H\u2085OH) is the intoxicating ingredient in alcoholic beverages such as beer, wine, and spirits.',
    'Ethanol is produced by yeast fermentation of sugars, a process known since at least 7000 BC in China.',
    'The boiling point of ethanol is 78.37\u00B0C.',
    'Ethanol is widely used as an antiseptic and disinfectant, typically at 70% concentration for maximum effectiveness.',
    'In Brazil, sugarcane ethanol is used as a major automotive fuel (flex-fuel vehicles).',
    'Ethanol is miscible with water in all proportions due to hydrogen bonding.',
    'Proof is a measure of alcohol content: 80 proof equals 40% ethanol by volume.',
    'Ethanol is metabolized in the liver by the enzyme alcohol dehydrogenase.',
    'Denatured alcohol is ethanol with additives (methanol, isopropanol) to make it undrinkable and tax-exempt.',
    'Absolute (anhydrous) ethanol is 99.5%+ pure and is used as a laboratory solvent.',
  ],

  // Sodium Bicarbonate (default-20)
  'default-20': [
    'Sodium bicarbonate (NaHCO\u2083) is commonly known as baking soda.',
    'When heated above 50\u00B0C, sodium bicarbonate decomposes into sodium carbonate, water, and carbon dioxide.',
    'Baking soda is used as a leavening agent: it reacts with acids to produce CO\u2082 gas, causing dough to rise.',
    'Sodium bicarbonate is an effective antacid that neutralizes excess stomach acid.',
    'A paste of baking soda and water is a traditional home remedy for insect bites and minor skin irritations.',
    'Sodium bicarbonate is used in fire extinguishers (Class B/C) as a dry chemical agent.',
    'The approximate pH of a sodium bicarbonate solution is 8.3 (mildly alkaline).',
    'Baking soda absorbs odors, which is why it is commonly placed in refrigerators.',
    'In medicine, sodium bicarbonate is given intravenously to treat metabolic acidosis.',
    'Sodium bicarbonate occurs naturally as the mineral nahcolite, found in evaporite deposits.',
  ],

  // Sodium Hypochlorite (default-21)
  'default-21': [
    'Sodium hypochlorite (NaClO) is the active ingredient in household liquid bleach.',
    'Household bleach typically contains 3\u20138% sodium hypochlorite.',
    'Sodium hypochlorite was first produced in 1789 by Claude Louis Berthollet in Paris.',
    'It is widely used to disinfect drinking water and swimming pools.',
    'Mixing bleach with ammonia produces toxic chloramine gas, which can cause severe lung damage.',
    'Mixing bleach with acids releases deadly chlorine gas.',
    'Sodium hypochlorite solutions decompose over time, especially when exposed to heat and light.',
    'In healthcare, dilute sodium hypochlorite (Dakin\u2019s solution) is used for wound irrigation.',
    'The bleaching action of sodium hypochlorite works by oxidizing chromophores (color-causing molecules).',
    'Sodium hypochlorite is also used in the food industry to sanitize fruits, vegetables, and food-contact surfaces.',
  ],

  // Sucrose (default-22)
  'default-22': [
    'Sucrose is a disaccharide composed of one glucose and one fructose unit linked by a glycosidic bond.',
    'Table sugar is extracted primarily from sugarcane and sugar beets.',
    'Sucrose has a molecular weight of 342.3 g/mol.',
    'The melting point of sucrose is 186\u00B0C; above this it decomposes (caramelization).',
    'Sucrose does not reduce Fehling\u2019s or Benedict\u2019s solution because it has no free anomeric carbon (it is a non-reducing sugar).',
    'Global sugar production exceeds 180 million tonnes annually.',
    'The enzyme sucrase (invertase) breaks sucrose into glucose and fructose in the small intestine.',
    'Sucrose was first crystallized from sugarcane juice in India around 500 AD.',
    'Caramelization of sucrose begins at approximately 160\u00B0C, producing hundreds of flavor and color compounds.',
    'Sucrose increases the boiling point of water; a saturated sugar solution boils at about 103\u00B0C.',
  ],

  // Fructose (default-23)
  'default-23': [
    'Fructose is a monosaccharide and the sweetest naturally occurring sugar.',
    'Fructose is approximately 1.7 times sweeter than sucrose (table sugar).',
    'Fructose has the same molecular formula as glucose (C\u2086H\u2081\u2082O\u2086) but a different structure (it is a ketose, not an aldose).',
    'High-fructose corn syrup (HFCS) is produced by converting glucose in corn syrup to fructose using the enzyme glucose isomerase.',
    'Fructose has a low glycemic index (about 19) compared to glucose (100).',
    'Fructose is metabolized primarily in the liver, unlike glucose which is used by all cells.',
    'Honey contains roughly 38% fructose and 31% glucose.',
    'French chemist Augustin-Pierre Dubrunfaut discovered fructose in 1847.',
    'Fructose is highly hygroscopic (absorbs moisture readily), which helps keep baked goods moist.',
    'Excessive fructose consumption has been linked to increased risk of fatty liver disease.',
  ],

  // Lactose (default-24)
  'default-24': [
    'Lactose is a disaccharide composed of galactose and glucose.',
    'Lactose makes up approximately 2\u20138% of milk by weight.',
    'Lactose intolerance affects an estimated 65\u201370% of the global adult population.',
    'The enzyme lactase, produced in the small intestine, is required to digest lactose.',
    'Lactose persistence (the ability to digest lactose in adulthood) evolved independently in European and East African pastoral populations.',
    'Lactose is used as a filler and binder in pharmaceutical tablets.',
    'Italian scientist Fabrizio Bartoletti first isolated lactose from milk in 1619.',
    'Lactose is a reducing sugar and gives a positive Benedict\u2019s test.',
    'In cheese-making, bacteria convert lactose to lactic acid, which is why aged cheeses are very low in lactose.',
    'Lactose is about 0.2\u20130.4 times as sweet as sucrose.',
  ],

  // Carbon Dioxide (default-25)
  'default-25': [
    'Carbon dioxide (CO\u2082) was the first gas to be identified as distinct from ordinary air, by Jan Baptist van Helmont around 1640.',
    'Atmospheric CO\u2082 concentration has risen from about 280 ppm (pre-industrial) to over 420 ppm today.',
    'CO\u2082 is a linear molecule with a bond angle of 180\u00B0.',
    'Solid carbon dioxide is called dry ice and sublimes at \u221278.5\u00B0C.',
    'Plants use CO\u2082 in photosynthesis to produce glucose and oxygen.',
    'CO\u2082 dissolved in water forms carbonic acid, which gives carbonated beverages their fizz.',
    'Carbon dioxide is used in fire extinguishers because it displaces oxygen and does not support combustion.',
    'At standard atmospheric pressure, CO\u2082 cannot exist as a liquid; it goes directly from solid to gas (sublimation).',
    'Joseph Priestley invented carbonated water in 1767 by dissolving CO\u2082 in water.',
    'CO\u2082 is about 1.5 times denser than air, which is why it can accumulate in low-lying areas.',
  ],

  // Methane (default-26)
  'default-26': [
    'Methane (CH\u2084) is the simplest alkane and the main component of natural gas (about 70\u201390%).',
    'Methane is a potent greenhouse gas, approximately 80 times more effective at trapping heat than CO\u2082 over a 20-year period.',
    'Alessandro Volta first identified methane in 1776 by collecting marsh gas from Lake Maggiore.',
    'Methane is odorless and colorless; the distinctive smell of natural gas comes from added odorants like mercaptans.',
    'Methane has a boiling point of \u2212161.5\u00B0C.',
    'Ruminant animals (cows, sheep) produce methane during digestion through enteric fermentation.',
    'Methane clathrates (ice-like structures trapping methane) exist in vast quantities on the ocean floor.',
    'Methane is the primary fuel used in gas stoves, furnaces, and power plants.',
    'The tetrahedral geometry of methane gives it a bond angle of 109.5\u00B0.',
    'Methane is also found in the atmospheres of Jupiter, Saturn, Uranus, and Neptune.',
  ],

  // Nitrous Oxide (default-27)
  'default-27': [
    'Nitrous oxide (N\u2082O) is commonly known as laughing gas due to the euphoria it produces when inhaled.',
    'Joseph Priestley first synthesized nitrous oxide in 1772.',
    'Nitrous oxide was first used as a dental anesthetic by Horace Wells in 1844.',
    'N\u2082O is the third most important long-lived greenhouse gas, after CO\u2082 and methane.',
    'Nitrous oxide is used as an oxidizer in rocket propulsion and in high-performance racing engines.',
    'In the food industry, nitrous oxide is used as a propellant in whipped cream dispensers.',
    'Nitrous oxide is approximately 300 times more potent than CO\u2082 as a greenhouse gas over a 100-year period.',
    'The largest source of anthropogenic N\u2082O emissions is agricultural soil management (nitrogen fertilizers).',
    'Nitrous oxide has a sweet, slightly metallic taste.',
    'At room temperature, N\u2082O is a colorless, non-flammable gas with a slightly sweet odor.',
  ],

  // Hydrogen Peroxide (default-28)
  'default-28': [
    'Hydrogen peroxide (H\u2082O\u2082) was discovered by Louis Jacques Th\u00E9nard in 1818.',
    'Household hydrogen peroxide is typically sold at a 3% concentration.',
    'Hydrogen peroxide decomposes into water and oxygen: 2H\u2082O\u2082 \u2192 2H\u2082O + O\u2082.',
    'The enzyme catalase in blood rapidly breaks down hydrogen peroxide, producing the characteristic fizzing on wounds.',
    'Concentrated hydrogen peroxide (above 70%) can be used as a rocket propellant (high-test peroxide).',
    'Bombardier beetles spray a boiling mixture of hydrogen peroxide and hydroquinone as a defense mechanism.',
    'Hydrogen peroxide is used in the textile and paper industries for bleaching.',
    'At high concentrations, hydrogen peroxide is a powerful oxidizer that can cause severe burns.',
    'Hair bleaching products typically use 6\u201312% hydrogen peroxide to oxidize melanin pigments.',
    'Pure hydrogen peroxide has a pale blue color and a boiling point of 150.2\u00B0C.',
  ],

  // Calcium Carbonate (default-29)
  'default-29': [
    'Calcium carbonate (CaCO\u2083) is the main component of limestone, marble, chalk, and eggshells.',
    'The White Cliffs of Dover are composed primarily of calcium carbonate (chalk).',
    'Calcium carbonate is the most widely used antacid (e.g., Tums).',
    'When calcium carbonate reacts with hydrochloric acid, it produces calcium chloride, water, and carbon dioxide gas.',
    'Calcium carbonate exists in three crystal forms: calcite, aragonite, and vaterite.',
    'Pearls are formed when mollusks coat irritants with layers of aragonite (a form of calcium carbonate).',
    'Calcium carbonate is used as a filler in paper, paints, plastics, and rubber.',
    'The thermal decomposition of calcium carbonate (calcination) at ~900\u00B0C produces quicklime (CaO) and CO\u2082.',
    'Calcium carbonate is nearly insoluble in pure water but dissolves in acidic water due to the formation of soluble calcium bicarbonate.',
    'About 4% of the Earth\u2019s crust is composed of calcium carbonate.',
  ],

  // Magnesium Hydroxide (default-30)
  'default-30': [
    'Magnesium hydroxide suspension in water is known as milk of magnesia.',
    'Milk of magnesia was first patented by Charles Henry Phillips in 1872.',
    'Magnesium hydroxide is used as an antacid to neutralize excess stomach acid (HCl).',
    'As a laxative, magnesium hydroxide works by drawing water into the intestines through osmosis.',
    'Magnesium hydroxide occurs naturally as the mineral brucite.',
    'Magnesium hydroxide is used as a flame retardant in plastics and rubber because it releases water when heated.',
    'The approximate pH of a magnesium hydroxide suspension is 10.5.',
    'Magnesium hydroxide has low solubility in water (only about 0.009 g/L at 25\u00B0C).',
    'In wastewater treatment, magnesium hydroxide is used to neutralize acidic industrial effluents.',
    'Magnesium hydroxide thermally decomposes at 350\u00B0C into magnesium oxide (MgO) and water.',
  ],

  // Trinitrotoluene (default-31)
  'default-31': [
    'Trinitrotoluene (TNT) was first prepared by German chemist Julius Wilbrand in 1863.',
    'TNT was not recognized as a practical explosive until 1902, when the German military began using it.',
    'TNT is relatively stable and insensitive to shock compared to other explosives like nitroglycerin.',
    'The energy released by 1 tonne of TNT (4.184 gigajoules) is used as a standard unit of explosive energy.',
    'TNT has a detonation velocity of approximately 6,900 m/s.',
    'TNT melts at 80.35\u00B0C, which allows it to be safely melted and poured into shell casings.',
    'TNT is manufactured by the sequential nitration of toluene using mixed nitric and sulfuric acids.',
    'Chronic exposure to TNT can cause liver damage and aplastic anemia.',
    'TNT produces a characteristic orange-yellow color when it explodes due to excess carbon in the detonation products.',
    'Nuclear weapon yields are measured in kilotons (kt) or megatons (Mt) of TNT equivalent.',
  ],

  // Deoxyribose (default-32)
  'default-32': [
    'Deoxyribose (2-deoxy-D-ribose) is a five-carbon sugar (pentose) that forms the sugar-phosphate backbone of DNA.',
    'Deoxyribose differs from ribose by having a hydrogen atom instead of a hydroxyl group at the 2\u2032 carbon.',
    'The "deoxy" in deoxyribose and DNA (deoxyribonucleic acid) refers to the missing oxygen at the 2\u2032 position.',
    'Phoebus Levene first identified deoxyribose in 1929.',
    'In DNA, deoxyribose connects to phosphate groups (at 3\u2032 and 5\u2032 carbons) and a nitrogenous base (at the 1\u2032 carbon).',
    'Deoxyribose exists predominantly in the furanose (five-membered ring) form in DNA.',
    'The absence of the 2\u2032 hydroxyl group in deoxyribose makes DNA more chemically stable than RNA.',
    'Deoxyribose is synthesized in cells from ribose by the enzyme ribonucleotide reductase.',
    'The molecular weight of deoxyribose is 134.13 g/mol.',
    'In the Watson-Crick model of DNA, two sugar-phosphate backbones of deoxyribose wind around each other in a double helix.',
  ],

  // Adenine (default-33)
  'default-33': [
    'Adenine is a purine nucleobase, one of the four bases in DNA (along with guanine, cytosine, and thymine).',
    'Adenine was first isolated by Albrecht Kossel in 1885 from pancreatic tissue.',
    'The name "adenine" comes from the Greek word "aden" meaning gland, as it was first found in glandular tissue.',
    'In DNA, adenine always pairs with thymine through two hydrogen bonds (Chargaff\u2019s rule).',
    'In RNA, adenine pairs with uracil instead of thymine.',
    'Adenine is a key component of adenosine triphosphate (ATP), the primary energy currency of cells.',
    'Adenine is also part of important coenzymes like NAD+, FAD, and coenzyme A.',
    'Adenine has a melting point of 360\u2013365\u00B0C (with decomposition).',
    'Adenine can be formed from hydrogen cyanide (HCN) under prebiotic conditions, suggesting a role in the origin of life.',
    'The purine ring of adenine consists of a fused pyrimidine and imidazole ring system.',
  ],

  // Guanine (default-34)
  'default-34': [
    'Guanine is a purine nucleobase found in both DNA and RNA.',
    'Guanine was first isolated from guano (bird excrement) in 1844, which gives it its name.',
    'In DNA, guanine pairs with cytosine through three hydrogen bonds, making G-C pairs stronger than A-T pairs.',
    'Guanine crystals give fish scales and some cosmetics their iridescent, silvery sheen.',
    'Guanine is the most easily oxidized of the four DNA bases, making it vulnerable to oxidative damage.',
    'The oxidation product of guanine, 8-oxoguanine, is a common marker of DNA damage and aging.',
    'Guanine is a component of GTP (guanosine triphosphate), which is essential for signal transduction and protein synthesis.',
    'Spider silk contains guanine crystals that contribute to its reflective properties.',
    'Guanine has very low solubility in water.',
    'In the genetic code, guanine-rich sequences can form special four-stranded structures called G-quadruplexes.',
  ],

  // Thymine (default-35)
  'default-35': [
    'Thymine is a pyrimidine nucleobase found exclusively in DNA, not in RNA.',
    'Thymine is also known as 5-methyluracil because it differs from uracil by a methyl group at the 5-position.',
    'Albrecht Kossel and Albert Neumann first isolated thymine from calf thymus glands in 1893.',
    'In DNA, thymine pairs with adenine through two hydrogen bonds.',
    'UV light can cause adjacent thymine bases in DNA to form thymine dimers, a common type of DNA damage.',
    'Thymine dimers can lead to mutations and skin cancer if not repaired by DNA repair mechanisms.',
    'The methyl group on thymine helps DNA repair enzymes distinguish between thymine and uracil (a deamination product of cytosine).',
    'In RNA, uracil replaces thymine because it is energetically cheaper to produce (no methylation required).',
    'Thymine has a molecular weight of 126.11 g/mol.',
    'The melting point of thymine is approximately 316\u00B0C (with decomposition).',
  ],

  // Cytosine (default-36)
  'default-36': [
    'Cytosine is a pyrimidine nucleobase found in both DNA and RNA.',
    'Cytosine was first discovered by Albrecht Kossel and Albert Neumann in 1894.',
    'In DNA, cytosine pairs with guanine through three hydrogen bonds.',
    'Cytosine can spontaneously deaminate to form uracil, a common source of point mutations in DNA.',
    'DNA methylation often occurs at cytosine bases (specifically at CpG sites), playing a key role in gene regulation.',
    '5-Methylcytosine is sometimes called the "fifth base" of DNA due to its importance in epigenetics.',
    'The deamination of 5-methylcytosine produces thymine rather than uracil, making this mutation harder to detect and repair.',
    'Cytosine has a molecular weight of 111.10 g/mol.',
    'Cytosine is the least stable of the four DNA bases and is most prone to spontaneous deamination.',
    'The melting point of cytosine is approximately 320\u2013325\u00B0C (with decomposition).',
  ],
}
