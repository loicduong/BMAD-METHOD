/**
 * Build Docs Static Tests
 *
 * Usage: node test/test-build-docs-static.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

function assert(condition, testName, errorMessage = '') {
  if (condition) {
    console.log(`${colors.green}\u2713${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}\u2717${colors.reset} ${testName}`);
    if (errorMessage) console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    failed++;
  }
}

function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Build Docs Static Tests');
  console.log(`========================================${colors.reset}\n`);

  const buildDocsPath = path.resolve('tools/build-docs.mjs');
  const content = fs.readFileSync(buildDocsPath, 'utf8');

  assert(
    /copyVersionedArtifacts\(\{\s*versions,\s*versionsFile,\s*siteDir\s*\}\)/s.test(content),
    'passes versionsFile into copyVersionedArtifacts',
  );

  assert(
    /async function copyVersionedArtifacts\(\{\s*versions,\s*versionsFile,\s*siteDir\s*\}\)/s.test(content),
    'copyVersionedArtifacts receives versionsFile explicitly',
  );

  assert(content.includes('BMAD_DOCS_CONTENT_DIR: getActiveDocsContentDir()'), 'passes active docs content dir to Astro');

  const astroConfig = fs.readFileSync(path.resolve('website/astro.config.mjs'), 'utf8');
  assert(astroConfig.includes('contentDir: process.env.BMAD_DOCS_CONTENT_DIR'), 'rehype markdown links receives explicit contentDir');

  console.log('');
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
