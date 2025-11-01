const fs = require('fs');
const path = require('path');

const enPath = path.resolve(__dirname, '..', 'frontend', 'src', 'i18n', 'locales', 'en.json');
const outDir = path.resolve(__dirname, 'translations');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.resolve(outDir, 'all_admin_strings.csv');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function quote(v) {
  if (v == null) return '';
  return '"' + String(v).replace(/"/g, '""') + '"';
}

const rows = [];
rows.push(['district_slug','district_name','level','ds_slug','ds_name','gn_slug','gn_name','key_path'].join(','));

const dsTree = (en.divisionalSecretariats) || {};
const gnTree = (en.gnDivisions) || {};

for (const districtSlug of Object.keys(dsTree)) {
  const districtName = districtSlug; // slug is key; english name not in this node, but we can find district display name in en.districts
  const districtDisplay = (en.districts && en.districts[districtSlug]) || districtSlug;

  const dsObj = dsTree[districtSlug] || {};
  // DS rows
  for (const dsSlug of Object.keys(dsObj)) {
    const dsName = dsObj[dsSlug];
    // Add DS row
    const dsKeyPath = `divisionalSecretariats.${districtSlug}.${dsSlug}`;
    rows.push([quote(districtSlug), quote(districtDisplay), 'ds', quote(dsSlug), quote(dsName), '', '', quote(dsKeyPath)].join(','));

    // GN rows for this DS
    const gnForDistrict = (gnTree[districtSlug] || {})[dsSlug] || {};
    for (const gnSlug of Object.keys(gnForDistrict)) {
      const gnName = gnForDistrict[gnSlug];
      const gnKeyPath = `gnDivisions.${districtSlug}.${dsSlug}.${gnSlug}`;
      rows.push([quote(districtSlug), quote(districtDisplay), 'gn', quote(dsSlug), quote(dsName), quote(gnSlug), quote(gnName), quote(gnKeyPath)].join(','));
    }
  }
}

fs.writeFileSync(outPath, rows.join('\n'), 'utf8');
console.log('Wrote', outPath, 'with', rows.length - 1, 'entries');
