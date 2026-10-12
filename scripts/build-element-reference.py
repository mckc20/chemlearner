"""Build the offline reference from locally downloaded PubChem, NIST and IAEA snapshots.
Usage: python3 scripts/build-element-reference.py /path/to/snapshots
Expected: chem-elements.json, chem-nist.csv, chem-isotopes.csv, chem-reference/1..118.json.
No network access; see doc/element-reference.md for retrieval and editorial policy.
"""
import csv, json, re, sys
from pathlib import Path
from decimal import Decimal
ROOT = Path(__file__).resolve().parent.parent
raw = Path(sys.argv[1])
output = Path(sys.argv[2]) if len(sys.argv)>2 else ROOT/'src/data/elements/reference.json'
rows = json.loads((raw/'chem-elements.json').read_text())['Table']
summary = {int(r['Cell'][0]):dict(zip(rows['Columns']['Column'],r['Cell'])) for r in rows['Row']}
isotopes = list(csv.DictReader((raw/'chem-isotopes.csv').open()))
nist = {}
for row in csv.DictReader((raw/'chem-nist.csv').open()):
    r = {k:v.strip('="') for k,v in row.items() if k and v}
    if r.get('At. num') and r.get('Ion Charge'):
        nist[int(r['At. num']),int(r['Ion Charge'])] = r.get('Ground Shells (a)','')
symbols = {r['Symbol']:z for z,r in summary.items()}

def expand(config, trail=()):
    core = re.search(r'\[([A-Za-z]+)\]',config)
    result = []
    if core:
        z = symbols[core[1]]
        assert z not in trail
        result = expand(nist.get((z,0)) or summary[z]['ElectronConfiguration'],trail+(z,))
        config = config[core.end():]
    for n,l,count in re.findall(r'(\d)([spdf])(\d*)',config):
        result.append({'n':int(n),'l':l,'count':int(count or 1)})
    return sorted(result,key=lambda x:(x['n'],'spdf'.index(x['l'])))

# Explicit editorial choices, not rounded atomic weights. These cover elements without
# a source abundance; use established long-lived / discovery isotopes for teaching.
representatives = {43:98,61:145,84:209,85:210,86:222,87:223,88:226,89:227,93:237,94:244,95:243,96:247,97:247,98:251,99:252,100:257,101:258,102:259,103:262,104:267,105:268,106:269,107:270,108:269,109:278,110:281,111:282,112:285,113:286,114:289,115:290,116:293,117:294,118:294}
educational = {1:[3],6:[14],9:[18],11:[22],15:[32],19:[40],27:[60],38:[90],43:[99],53:[131],55:[137],84:[210],86:[222],88:[226],90:[230,232],92:[234,235,238],94:[239],95:[241]}
ion_charges = {11:[1],12:[2],13:[3],19:[1],20:[2],26:[2,3],29:[1,2],30:[2],47:[1]}
result = {}
for z,s in summary.items():
    record = json.loads((raw/'chem-reference'/f'{z}.json').read_text())['Record']
    sections = {}
    def walk(items):
        for item in items:
            sections[item['TOCHeading']] = item.get('Information',[])
            walk(item.get('Section',[]))
    walk(record['Section'])
    refs = {r['ReferenceNumber']:r for r in record['Reference']}
    def text(info):
        v=info.get('Value',{})
        return '; '.join(x['String'] for x in v.get('StringWithMarkup',[])) or ' – '.join(str(x) for x in v.get('Number',[]))
    def prop(heading,unit='',match=None,conditions=None):
        entries=sections.get(heading,[])
        if match: entries=[e for e in entries if match.lower() in e.get('Name','').lower()]
        if heading == 'Ionization Energy':
            entries=sorted(entries,key=lambda e: 'NIST' not in refs.get(e.get('ReferenceNumber'),{}).get('SourceName',''))
        # Keep original value strings, including intervals and uncertainty notation.
        entry=next((e for e in entries if text(e)),{})
        value=text(entry)
        ref=refs.get(entry.get('ReferenceNumber'),{})
        status='unknown' if not value or value.lower() in ['unknown','n/a'] else ('predicted' if re.search(r'predict|estimat|theoret|calculat',value,re.I) or z>=104 else 'measured')
        source_name=ref.get('SourceName','PubChem')
        source=ref.get('URL',f'https://pubchem.ncbi.nlm.nih.gov/element/{z}')
        if 'Jefferson Lab' in source_name:
            # Direct current pages apply bot restrictions; PubChem retains the attribution.
            source=f'https://pubchem.ncbi.nlm.nih.gov/element/{z}'
        elif 'Los Alamos' in source_name:
            # Current LANL pages do not always show this historical value; PubChem does.
            source=f'https://pubchem.ncbi.nlm.nih.gov/element/{z}'
        return {'value':value or None,'unit':entry.get('Value',{}).get('Unit',unit),'status':status,'conditions':conditions,'source':source,'sourceName':source_name,'references':entry.get('Reference',[])}
    properties={
        'atomicWeight':prop('Atomic Weight'),
        'electronegativity':prop('Electronegativity','', 'Pauling'),
        'ionizationEnergy':prop('Ionization Energy','eV'),
        'electronAffinity':prop('Electron Affinity','eV'),
        'atomicRadius':prop('Atomic Radius','pm','Van der Waals'),
        'density':prop('Density','g/cm³',conditions='density-conditions-unspecified'),
        'meltingPoint':prop('Melting Point','K',conditions='pressure-unspecified'),
        'boilingPoint':prop('Boiling Point','K',conditions='pressure-unspecified'),
    }
    properties['atomicRadius']['definition']='van-der-waals'
    if z in representatives and z not in [90,91,92]:
        weight=properties['atomicWeight']
        if weight['value'] and re.fullmatch(r'\d+',weight['value']):
            weight['value']='['+weight['value']+']'
            weight['kind']='representative-mass-number'
            weight['status']='measured'
    # The source table lacks pressure/allotrope qualifiers: never silently assume them.
    if z==2: properties['meltingPoint']['conditions']='helium-pressure'
    if z==6: properties['meltingPoint']['conditions']='carbon-phase'
    properties['state']={'value':s['StandardState'] or None,'unit':'','status':'predicted' if z>=104 else 'measured','conditions':'standard-state','source':f'https://pubchem.ncbi.nlm.nih.gov/element/{z}','sourceName':'PubChem'}
    nuclides=[r for r in isotopes if r['z']==str(z)]
    natural=[r for r in nuclides if r['abundance'] and float(r['abundance'])>0]
    default=int(max(natural,key=lambda r:float(r['abundance']))['n'])+z if natural else representatives[z]
    selected={int(r['n'])+z for r in natural}|{default}|set(educational.get(z,[]))
    isotope_records=[]
    for a in sorted(selected):
        r=next(r for r in nuclides if int(r['n'])+z==a)
        mass=str(Decimal(r['atomic_mass'])/1000000) if r['atomic_mass'] else None
        uncertainty=str(Decimal(r['unc_am'])/1000000) if r['unc_am'] else None
        isotope_records.append({'id':f'{z}-{a}','massNumber':a,'mass':mass,'massUncertainty':uncertainty,'massStatus':'predicted' if r['me_systematics']=='Y' else ('measured' if mass else 'unknown'),'abundance':r['abundance'] or None,'abundanceUncertainty':r['unc_a'] or None,'stable':r['half_life']=='STABLE','halfLife':r['half_life'] if r['half_life']!='STABLE' else None,'halfLifeUnit':r['unit_hl'],'halfLifeUncertainty':r['unc_hl'],'halfLifeOperator':r['operator_hl'],'decayModes':[r[f'decay_{i}'] for i in range(1,4) if r[f'decay_{i}']],'source':'https://nds.iaea.org/relnsd/vcharthtml/VChartHTML.html','evaluationDate':r['ENSDFpublicationcut-off']})
    config=nist.get((z,0)) or s['ElectronConfiguration']
    subshells=expand(config)
    assert sum(x['count'] for x in subshells)==z,(z,config,subshells)
    ions=[]
    for charge in ion_charges.get(z,[]):
        conf=nist[z,charge]
        occ=expand(conf)
        assert sum(x['count'] for x in occ)==z-charge
        ions.append({'charge':charge,'subshells':occ,'source':f'https://physics.nist.gov/cgi-bin/ASD/ie.pl?spectra={s["Symbol"]}&units=1&format=0&shells_out=on','status':'measured'})
    # Apply the OpenStax ion-filling rule to the sourced noble-gas configurations.
    if z in [9,17]:
        target=10 if z==9 else 18
        ions.append({'charge':-1,'subshells':expand(summary[target]['ElectronConfiguration']),'source':'https://openstax.org/books/chemistry-atoms-first-2e/pages/3-4-electronic-structure-of-atoms-electron-configurations','status':'derived'})
    period=int(next((text(e) for e in sections.get('Element Period Number',[]) if text(e).isdigit()),str(next(i for i,end in enumerate([2,10,18,36,54,86,118],1) if z<=end))))
    group=None if 57<=z<=71 or 89<=z<=103 else int(re.match(r'\d+',next(text(e) for e in sections['Element Group Number']))[0])
    block='f' if group is None else ('s' if group<=2 or z==2 else 'd' if group<=12 else 'p')
    result[z]={'atomicNumber':z,'symbol':s['Symbol'],'period':period,'group':group,'block':block,'properties':properties,'oxidationStates':s['OxidationStates'],'discovery':s['YearDiscovered'],'defaultIsotope':f'{z}-{default}','isotopes':isotope_records,'configuration':{'subshells':subshells,'source':'https://physics.nist.gov/PhysRefData/ASD/ionEnergy.html' if (z,0) in nist else f'https://pubchem.ncbi.nlm.nih.gov/element/{z}','status':'predicted' if z>=104 else 'measured'},'ions':ions}
output.write_text(json.dumps({'version':2,'retrievedAt':'2026-10-12','elements':result},ensure_ascii=False,indent=2)+'\n')
print(f'Built {len(result)} elements; {sum(len(e["isotopes"]) for e in result.values())} isotopes')
