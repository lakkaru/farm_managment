// gatsby-node.js
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/^\/dashboard/)) {
    page.matchPath = "/dashboard/*"
    createPage(page)
  }
}
const fs = require('fs');
const path = require('path');

exports.onPostBuild = async ({ reporter }) => {
  try {
    const publicDir = path.join(__dirname, 'public');
    const webmanifestPath = path.join(publicDir, 'manifest.webmanifest');
    const jsonPath = path.join(publicDir, 'manifest.json');
    if (fs.existsSync(webmanifestPath)) {
      const data = fs.readFileSync(webmanifestPath, 'utf8');
      if (data && data.trim().length > 0) {
        fs.writeFileSync(jsonPath, data, 'utf8');
        reporter.info(`manifest.json created from manifest.webmanifest (${jsonPath})`);
      } else {
        reporter.warn(`manifest.webmanifest is empty; skipping manifest.json write.`);
      }
    } else {
      reporter.warn('manifest.webmanifest not found; cannot create manifest.json');
    }
  } catch (e) {
    reporter.panicOnBuild('Failed to copy manifest.webmanifest to manifest.json', e);
  }
};
