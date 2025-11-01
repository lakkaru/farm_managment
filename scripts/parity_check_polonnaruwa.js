const fs = require('fs');
const path = require('path');

// Load authoritative backend dataset
const ADMIN = require(path.resolve(__dirname, '..', 'backend', 'src', 'constants', 'administrativeDivisions.js')).ADMINISTRATIVE_DIVISIONS;
const pol = ADMIN['Polonnaruwa'];
if (!pol) {
  console.error('Polonnaruwa not found in ADMINISTRATIVE_DIVISIONS');
  process.exit(2);
}

// Load frontend locale files
const enPath = path.resolve(__dirname, '..', 'frontend', 'src', 'i18n', 'locales', 'en.json');
const siPath = path.resolve(__dirname, '..', 'frontend', 'src', 'i18n', 'locales', 'si.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const si = JSON.parse(fs.readFileSync(siPath, 'utf8'));

// Slugify function (matches generator rules: lowercase, replace non-alnum with underscore, collapse underscores)
function slug(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

function arrayToSlugSet(arr) {
  return new Set(arr.map(a => slug(a)));
}

const report = {
  ds: {
    backend_count: pol.divisionalSecretariats.length,
    en_missing: [],
    si_missing: [],
    en_extra: [],
    si_extra: [],
  },
  gn: {}
};

// Collect DS slugs from backend
const backendDS = pol.divisionalSecretariats.map(ds => ({ name: ds.name, slug: slug(ds.name), gn: ds.gnDivisions }));
// DS keys in locales
const enDSKeys = en.divisionalSecretariats && en.divisionalSecretariats.polonnaruwa ? Object.keys(en.divisionalSecretariats.polonnaruwa) : [];
const siDSKeys = si.divisionalSecretariats && si.divisionalSecretariats.polonnaruwa ? Object.keys(si.divisionalSecretariats.polonnaruwa) : [];
const enDSSet = new Set(enDSKeys);
const siDSSet = new Set(siDSKeys);

// Check DS parity
for (const ds of backendDS) {
  if (!enDSSet.has(ds.slug)) report.ds.en_missing.push({ name: ds.name, slug: ds.slug });
  if (!siDSSet.has(ds.slug)) report.ds.si_missing.push({ name: ds.name, slug: ds.slug });
}
for (const k of enDSKeys) {
  if (!backendDS.find(d => d.slug === k)) report.ds.en_extra.push(k);
}
for (const k of siDSKeys) {
  if (!backendDS.find(d => d.slug === k)) report.ds.si_extra.push(k);
}

// GN parity per DS
const enGNs = en.gnDivisions && en.gnDivisions.polonnaruwa ? en.gnDivisions.polonnaruwa : {};
const siGNs = si.gnDivisions && si.gnDivisions.polonnaruwa ? si.gnDivisions.polonnaruwa : {};

for (const ds of backendDS) {
  const dsReport = { en_missing: [], si_missing: [], en_extra: [], si_extra: [], backend_count: ds.gn.length };
  const backendGNSet = arrayToSlugSet(ds.gn);

  const enGNKeys = enGNs[ds.slug] ? Object.keys(enGNs[ds.slug]) : [];
  const siGNKeys = siGNs[ds.slug] ? Object.keys(siGNs[ds.slug]) : [];

  // missing: present in backend but not in locale
  for (const g of ds.gn) {
    const gslug = slug(g);
    if (!enGNKeys.includes(gslug)) dsReport.en_missing.push({ name: g, slug: gslug });
    if (!siGNKeys.includes(gslug)) dsReport.si_missing.push({ name: g, slug: gslug });
  }
  // extra: present in locale but not in backend
  for (const k of enGNKeys) {
    if (!backendGNSet.has(k)) dsReport.en_extra.push(k);
  }
  for (const k of siGNKeys) {
    if (!backendGNSet.has(k)) dsReport.si_extra.push(k);
  }

  report.gn[ds.slug] = dsReport;
}

console.log(JSON.stringify(report, null, 2));
