import fs from 'node:fs';

export function getDocVersions() {
  const versionsPath = process.env.BMAD_DOCS_VERSIONS_FILE;
  if (!versionsPath || !fs.existsSync(versionsPath)) {
    return {
      current: { label: 'Latest', version: process.env.BMAD_DOCS_CURRENT_VERSION || null },
      versions: [],
    };
  }

  try {
    return JSON.parse(fs.readFileSync(versionsPath, 'utf8'));
  } catch {
    return {
      current: { label: 'Latest', version: process.env.BMAD_DOCS_CURRENT_VERSION || null },
      versions: [],
    };
  }
}
