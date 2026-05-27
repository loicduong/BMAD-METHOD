/**
 * Docs Version Selection Tests
 *
 * Usage: node test/test-doc-version-selection.mjs
 */

import { selectLatestPatchPerMinor } from '../tools/prepare-doc-versions.mjs';

const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, testName) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson === expectedJson) {
    console.log(`${colors.green}\u2713${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}\u2717${colors.reset} ${testName}`);
    console.log(`  ${colors.dim}expected ${expectedJson}, got ${actualJson}${colors.reset}`);
    failed++;
  }
}

function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Docs Version Selection Tests');
  console.log(`========================================${colors.reset}\n`);

  assertEqual(
    selectLatestPatchPerMinor(['v6.8.0', 'v6.8.2', 'v6.9.0', 'v6.9.1', 'v7.0.0']).map((version) => version.tag),
    ['v7.0.0', 'v6.9.1', 'v6.8.2'],
    'selects highest patch per major.minor and sorts descending',
  );

  assertEqual(
    selectLatestPatchPerMinor(['v6.9.1']).map((version) => version.urlPath),
    ['/6.9.1/'],
    'uses starlight-versions top-level URL shape',
  );

  assertEqual(
    selectLatestPatchPerMinor(['v7.0.0-next.0', 'v7.0.0', 'release-7.1.0', 'v7.1', 'v7.1.3']).map((version) => version.tag),
    ['v7.1.3', 'v7.0.0'],
    'ignores prerelease and non-v semver tags',
  );

  assertEqual(
    selectLatestPatchPerMinor(['v6.9.1', 'v6.9.1', 'v6.9.0']).map((version) => version.tag),
    ['v6.9.1'],
    'deduplicates repeated tags',
  );

  console.log('');
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
