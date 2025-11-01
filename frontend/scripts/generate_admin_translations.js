const fs = require('fs');
const path = require('path');

function slugifyKey(s) {
  return String(s)
    .toLowerCase()
    .trim()
    // replace non-alphanumeric with underscore
    .replace(/[^a-z0-9]+/g, '_')
    // collapse multiple underscores
    .replace(/_+/g, '_')
    // trim underscores
    .replace(/^_+|_+$/g, '');
}

function extractObjectFromJsFile(filePath, varName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const idx = content.indexOf(varName);
  if (idx === -1) throw new Error(varName + ' not found in ' + filePath);
  const start = content.indexOf('{', idx);
  if (start === -1) throw new Error('Opening brace not found');
  let i = start;
  let depth = 0;
  for (; i < content.length; i++) {
    const ch = content[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const objText = content.substring(start, i + 1);
        // Try to safely evaluate the object text
        // Wrap in parentheses to form an expression
        try {
          // Replace // and /* comments crudely
          const noComments = objText.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
          const fn = new Function('return ' + noComments + ';');
          return fn();
        } catch (err) {
          throw new Error('Failed to evaluate administrative object: ' + err.message);
        }
      }
    }
  }
  throw new Error('Could not parse object');
}

function mergeTranslations(adminObj, enPath, siPath) {
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const siJson = JSON.parse(fs.readFileSync(siPath, 'utf8'));

  enJson.divisionalSecretariats = enJson.divisionalSecretariats || {};
  enJson.gnDivisions = enJson.gnDivisions || {};
  siJson.divisionalSecretariats = siJson.divisionalSecretariats || {};
  siJson.gnDivisions = siJson.gnDivisions || {};

  Object.keys(adminObj).forEach((districtName) => {
    const district = adminObj[districtName];
    const dslug = slugifyKey(districtName);
    enJson.divisionalSecretariats[dslug] = enJson.divisionalSecretariats[dslug] || {};
    enJson.gnDivisions[dslug] = enJson.gnDivisions[dslug] || {};
    siJson.divisionalSecretariats[dslug] = siJson.divisionalSecretariats[dslug] || {};
    siJson.gnDivisions[dslug] = siJson.gnDivisions[dslug] || {};

    const dss = district.divisionalSecretariats || [];
    dss.forEach((ds) => {
      const dsName = ds.name || ds;
      const dsslug = slugifyKey(dsName);
      // English: raw name
      enJson.divisionalSecretariats[dslug][dsslug] = dsName;
      // Sinhala placeholder: copy raw name (editorial review recommended)
      siJson.divisionalSecretariats[dslug][dsslug] = dsName;

      enJson.gnDivisions[dslug][dsslug] = enJson.gnDivisions[dslug][dsslug] || {};
      siJson.gnDivisions[dslug][dsslug] = siJson.gnDivisions[dslug][dsslug] || {};

      const gns = ds.gnDivisions || ds.gnDivisions || [];
      gns.forEach((gn) => {
        const gnName = gn;
        const gnslug = slugifyKey(gnName);
        enJson.gnDivisions[dslug][dsslug][gnslug] = gnName;
        siJson.gnDivisions[dslug][dsslug][gnslug] = gnName;
      });
    });
  });

  // Write back pretty-printed
  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf8');
  fs.writeFileSync(siPath, JSON.stringify(siJson, null, 2), 'utf8');
}

function main() {
  const backendFile = path.resolve(__dirname, '..', '..', 'backend', 'src', 'constants', 'administrativeDivisions.js');
  const enPath = path.resolve(__dirname, '..', 'src', 'i18n', 'locales', 'en.json');
  const siPath = path.resolve(__dirname, '..', 'src', 'i18n', 'locales', 'si.json');

  if (!fs.existsSync(backendFile)) {
    console.error('Administrative divisions file not found:', backendFile);
    process.exit(1);
  }
  if (!fs.existsSync(enPath) || !fs.existsSync(siPath)) {
    console.error('Locale files not found. Expected at:', enPath, siPath);
    process.exit(1);
  }

  console.log('Reading administrative divisions from', backendFile);
  const admin = extractObjectFromJsFile(backendFile, 'ADMINISTRATIVE_DIVISIONS');
  console.log('Merging translations into', enPath, 'and', siPath);
  mergeTranslations(admin, enPath, siPath);
  console.log('Merge complete. Please review si.json for Sinhala translations.');
}

if (require.main === module) main();
