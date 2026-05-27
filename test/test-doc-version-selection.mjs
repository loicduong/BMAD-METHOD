/**
 * Docs Version Selection Tests
 *
 * Usage: node test/test-doc-version-selection.mjs
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { materializeVersionedDocs, selectLatestPatchPerMinor } from '../tools/prepare-doc-versions.mjs';

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

  assertVersionedDocsUseDottedVersionSlugs();

  console.log('');
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  process.exit(failed === 0 ? 0 : 1);
}

function assertVersionedDocsUseDottedVersionSlugs() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-doc-versions-'));

  try {
    const currentDocsDir = path.join(tempDir, 'current-docs');
    const versionSourcesDir = path.join(tempDir, 'version-sources');
    const outputDocsDir = path.join(tempDir, 'content-docs');
    const versionDocsDir = path.join(versionSourcesDir, '6.8.0', 'docs');

    fs.mkdirSync(path.join(currentDocsDir, 'how-to'), { recursive: true });
    fs.writeFileSync(path.join(currentDocsDir, 'index.md'), '---\ntitle: Current\n---\n\nCurrent docs\n');
    fs.writeFileSync(path.join(currentDocsDir, 'how-to', 'install.md'), '---\ntitle: Install\n---\n\nInstall\n');

    fs.mkdirSync(path.join(versionDocsDir, 'vi-vn'), { recursive: true });
    fs.writeFileSync(path.join(versionDocsDir, 'index.md'), '---\ntitle: Versioned\n---\n\nVersioned docs\n');
    fs.writeFileSync(path.join(versionDocsDir, 'roadmap.mdx'), '---\ntitle: Roadmap\n---\n\nRoadmap\n');
    fs.writeFileSync(path.join(versionDocsDir, 'vi-vn', 'index.md'), '---\ntitle: Vietnamese\n---\n\nVietnamese docs\n');

    materializeVersionedDocs({
      currentDocsDir,
      versionSourcesDir,
      outputDocsDir,
      versions: [{ version: '6.8.0', tag: 'v6.8.0' }],
      locales: ['vi-vn'],
    });

    assertEqual(
      readSlug(path.join(outputDocsDir, '6.8.0', 'index.md')),
      '6.8.0',
      'adds explicit dotted version slug to archived root index',
    );
    assertEqual(
      readSlug(path.join(outputDocsDir, '6.8.0', 'roadmap.mdx')),
      '6.8.0/roadmap',
      'adds explicit dotted version slug to archived MDX pages',
    );
    assertEqual(
      readSlug(path.join(outputDocsDir, 'vi-vn', '6.8.0', 'index.md')),
      'vi-vn/6.8.0',
      'adds explicit locale-first dotted version slug to translated archived docs',
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function readSlug(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return /^slug:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m.exec(content)?.slice(1).find(Boolean)?.trim();
}

runTests();
