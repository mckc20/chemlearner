"""Check every bundled reference record against the archived source snapshots.

Usage: python3 scripts/audit-element-reference.py /path/to/snapshots
This validates provenance and transformations, not the accuracy of the publishers.
"""
import csv
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from decimal import Decimal
from pathlib import Path

root = Path(__file__).resolve().parent.parent
raw = Path(sys.argv[1])
manifest = json.loads((root/'src/data/elements/source-manifest.json').read_text())['sha256']
for name, expected in manifest.items():
    actual = hashlib.sha256((raw/name).read_bytes()).hexdigest()
    assert actual == expected, f'Snapshot hash mismatch: {name}'

reference = json.loads((root/'src/data/elements/reference.json').read_text())
with tempfile.TemporaryDirectory() as directory:
    generated = Path(directory)/'reference.json'
    subprocess.run([sys.executable, str(root/'scripts/build-element-reference.py'), str(raw), str(generated)], check=True, capture_output=True)
    assert generated.read_bytes() == (root/'src/data/elements/reference.json').read_bytes(), 'Bundled reference differs from reproducible build'

table = json.loads((raw/'chem-elements.json').read_text())['Table']
summary = {int(row['Cell'][0]): dict(zip(table['Columns']['Column'], row['Cell'])) for row in table['Row']}
isotope_rows = {(int(row['z']), int(row['z']) + int(row['n'])): row for row in csv.DictReader((raw/'chem-isotopes.csv').open())}

def info_text(info):
    value = info.get('Value', {})
    return '; '.join(item['String'] for item in value.get('StringWithMarkup', [])) or ' – '.join(str(item) for item in value.get('Number', []))

def all_sections(items):
    for item in items:
        yield item
        yield from all_sections(item.get('Section', []))

property_headings = {
    'atomicWeight': 'Atomic Weight', 'electronegativity': 'Electronegativity',
    'ionizationEnergy': 'Ionization Energy', 'electronAffinity': 'Electron Affinity',
    'atomicRadius': 'Atomic Radius', 'density': 'Density',
    'meltingPoint': 'Melting Point', 'boilingPoint': 'Boiling Point',
}
checked_properties = checked_isotopes = checked_ions = 0
assert len(reference['elements']) == 118
for key, element in reference['elements'].items():
    z = int(key)
    assert element['atomicNumber'] == z and element['symbol'] == summary[z]['Symbol']
    assert element['discovery'] == summary[z]['YearDiscovered']
    assert element['oxidationStates'] == summary[z]['OxidationStates']
    assert element['properties']['state']['value'] == (summary[z]['StandardState'] or None)
    record = json.loads((raw/'chem-reference'/f'{z}.json').read_text())['Record']
    sections = {section['TOCHeading']: section.get('Information', []) for section in all_sections(record['Section'])}
    for field, heading in property_headings.items():
        property_ = element['properties'][field]
        value = property_['value']
        if value is not None:
            # Bracketed integer weights are editorial representative mass numbers.
            original = value[1:-1] if property_.get('kind') == 'representative-mass-number' else value
            assert any(info_text(entry) == original for entry in sections.get(heading, [])), f'{z} {field}: value absent from PubChem snapshot'
            assert property_['source'].startswith('https://'), f'{z} {field}: missing source URL'
            checked_properties += 1
    assert element['defaultIsotope'] in {item['id'] for item in element['isotopes']}
    for isotope in element['isotopes']:
        row = isotope_rows[z, isotope['massNumber']]
        expected_mass = str(Decimal(row['atomic_mass']) / 1000000) if row['atomic_mass'] else None
        expected_uncertainty = str(Decimal(row['unc_am']) / 1000000) if row['unc_am'] else None
        assert isotope['mass'] == expected_mass and isotope['massUncertainty'] == expected_uncertainty
        assert isotope['abundance'] == (row['abundance'] or None)
        assert isotope['abundanceUncertainty'] == (row['unc_a'] or None)
        assert isotope['stable'] == (row['half_life'] == 'STABLE')
        assert isotope['halfLife'] == (row['half_life'] if row['half_life'] != 'STABLE' else None)
        assert isotope['halfLifeUnit'] == row['unit_hl']
        assert isotope['decayModes'] == [row[f'decay_{index}'] for index in range(1, 4) if row[f'decay_{index}']]
        assert isotope['evaluationDate'] == row['ENSDFpublicationcut-off']
        checked_isotopes += 1
    for configuration in [element['configuration'], *element['ions']]:
        electron_count = z - configuration.get('charge', 0)
        assert sum(term['count'] for term in configuration['subshells']) == electron_count
        assert configuration['source'].startswith('https://')
        if 'charge' in configuration:
            checked_ions += 1
    assert 'sources' not in element, f'{z}: unused imported source list remains'

print(f'Checked {len(manifest)} snapshot hashes, {checked_properties} populated properties, {checked_isotopes} isotopes and {checked_ions} ions across 118 elements.')

# Bundled example identities were resolved to PubChem CIDs on the retrieval date.
# Compare their formulas by composition, since PubChem often uses Hill order.
def composition(formula):
    totals = {}
    for part in re.split('[·.]', formula):
        match = re.fullmatch(r'(\d+)?((?:[A-Z][a-z]?\d*)+)', part)
        assert match, f'Unsupported example formula: {formula}'
        multiplier = int(match[1] or 1)
        for symbol, count in re.findall(r'([A-Z][a-z]?)(\d*)', match[2]):
            totals[symbol] = totals.get(symbol, 0) + multiplier * int(count or 1)
    return totals

citations = json.loads((root/'src/data/elements/example-citations.json').read_text())['compounds']
editorial = (root/'src/data/elements/editorial.js').read_text()
notes = editorial.split('const notes = `', 1)[1].split('`', 1)[0].strip().splitlines()
assert {int(line.split('~')[0]) for line in notes} == set(range(1, 119))
for line in notes:
    fields = line.split('~')
    assert len(fields) == 4 and all(len(field.split('|')) == 2 and all(field.split('|')) for field in fields[1:])
examples = editorial.split('const additionalExamples = `', 1)[1].split('`', 1)[0].strip().splitlines()
assert {line.split('~')[1] for line in examples} == set(citations)
for line in examples:
    _, key, formula, _, _ = line.split('~')
    citation = citations[key]
    assert citation['cid'] > 0 and citation['formula'] == formula
    assert composition(formula) == composition(citation['pubchemFormula']), key
print(f'Checked {len(notes)} bilingual note records and {len(examples)} bundled compound example identities and formulas against their recorded PubChem CIDs.')
