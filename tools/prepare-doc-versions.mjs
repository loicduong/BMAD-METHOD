import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';

const PROJECT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'build', 'doc-version-sources');
const GIT_MAX_BUFFER = 50 * 1024 * 1024;

export function selectLatestPatchPerMinor(tags) {
  const latestByMinor = new Map();

  for (const tag of new Set(tags)) {
    const version = parseReleaseTag(tag);
    if (!version) continue;

    const key = `${version.major}.${version.minor}`;
    const current = latestByMinor.get(key);
    if (!current || semver.gt(version.version, current.version)) {
      latestByMinor.set(key, { ...version, tag });
    }
  }

  return [...latestByMinor.values()]
    .sort((left, right) => semver.rcompare(left.version, right.version))
    .map((version) => ({
      ...version,
      urlPath: `/${version.version}/`,
    }));
}

export function listVersionTags() {
  const output = execFileSync('git', ['tag', '--list', 'v*'], {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    maxBuffer: GIT_MAX_BUFFER,
  });

  return output
    .split(/\r?\n/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function prepareDocVersionSources(options = {}) {
  const outputDir = options.outputDir || DEFAULT_OUTPUT_DIR;
  const tags = options.tags || listVersionTags();
  const versions = selectLatestPatchPerMinor(tags);

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  for (const version of versions) {
    const versionDir = path.join(outputDir, version.version);
    exportTagPath(version.tag, 'docs', path.join(versionDir, 'docs'));
    exportTagPath(version.tag, 'website/public', path.join(versionDir, 'public'));
  }

  const metadata = versions.map(({ tag, version, major, minor, patch, urlPath }) => ({
    tag,
    version,
    major,
    minor,
    patch,
    urlPath,
  }));

  fs.writeFileSync(path.join(outputDir, 'versions.json'), `${JSON.stringify(metadata, null, 2)}\n`);

  return metadata;
}

export function materializeVersionedDocs({ currentDocsDir, versionSourcesDir, outputDocsDir, versions, locales = [] }) {
  fs.rmSync(outputDocsDir, { recursive: true, force: true });
  copyDirectoryRecursive(currentDocsDir, outputDocsDir);

  for (const version of versions) {
    const versionDocsDir = path.join(versionSourcesDir, version.version, 'docs');
    if (!fs.existsSync(versionDocsDir)) continue;
    copyDocsIntoVersionLayout({ sourceDocsDir: versionDocsDir, outputDocsDir, version: version.version, locales });
  }
}

export function writeVersionCollectionFiles({ versionsDir, versions }) {
  fs.rmSync(versionsDir, { recursive: true, force: true });
  fs.mkdirSync(versionsDir, { recursive: true });

  for (const version of versions) {
    fs.writeFileSync(path.join(versionsDir, `${version.version}.json`), `${JSON.stringify({}, null, 2)}\n`);
  }
}

function parseReleaseTag(tag) {
  if (typeof tag !== 'string' || !tag.startsWith('v')) return null;

  const version = tag.slice(1);
  if (!semver.valid(version) || semver.prerelease(version)) return null;

  const parsed = semver.parse(version);
  if (!parsed) return null;

  return {
    version,
    major: parsed.major,
    minor: parsed.minor,
    patch: parsed.patch,
  };
}

function exportTagPath(tag, sourcePath, destPath) {
  const files = listTagFiles(tag, sourcePath);
  if (files.length === 0) return;

  for (const filePath of files) {
    const relativePath = path.relative(sourcePath, filePath);
    const destFile = path.join(destPath, relativePath);
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    const content = execFileSync('git', ['show', `${tag}:${filePath}`], {
      cwd: PROJECT_ROOT,
      encoding: 'buffer',
      maxBuffer: GIT_MAX_BUFFER,
    });
    fs.writeFileSync(destFile, content);
  }
}

function copyDocsIntoVersionLayout({ sourceDocsDir, outputDocsDir, version, locales }) {
  fs.mkdirSync(path.join(outputDocsDir, version), { recursive: true });

  for (const entry of fs.readdirSync(sourceDocsDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDocsDir, entry.name);

    if (entry.isDirectory() && locales.includes(entry.name)) {
      copyDirectoryRecursive(sourcePath, path.join(outputDocsDir, entry.name, version));
      continue;
    }

    const destPath = path.join(outputDocsDir, version, entry.name);
    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

function copyDirectoryRecursive(sourceDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

function listTagFiles(tag, sourcePath) {
  try {
    const output = execFileSync('git', ['ls-tree', '-r', '--name-only', tag, '--', sourcePath], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      maxBuffer: GIT_MAX_BUFFER,
    });

    return output
      .split(/\r?\n/)
      .map((filePath) => filePath.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const versions = prepareDocVersionSources();
  console.log(`Prepared ${versions.length} docs version source(s).`);
  for (const version of versions) {
    console.log(`  ${version.tag} -> ${version.urlPath}`);
  }
}
