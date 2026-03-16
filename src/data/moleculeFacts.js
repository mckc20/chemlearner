// Facts derived from quiz questions and their correct answers.
// Keyed by moleculeId → array of fact strings.

export const MOLECULE_FACTS = {
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
}
