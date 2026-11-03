// BM-403 (2026-11-03): `yarn audit` showed two highs in the dev-server chain (laravel-mix > webpack-dev-server):
// body-parser < 1.20.9 (DoS via trailing bytes) and follow-redirects 1.16.0–1.16.1 (credentials follow redirects).
// Both were fixed by refreshing the lockfile within the existing semver ranges, so nothing in package.json pins them;
// a later lockfile rewrite could bring the old versions back. This test reads yarn.lock and fails if it does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Not from helpers.mjs: that module needs a built site, and this check only reads yarn.lock.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimum safe version per package (the advisories' "patched in").
const MIN = { 'body-parser': '1.20.9', 'follow-redirects': '1.16.2' };

// Semver order for release versions; a prerelease sorts below its release (1.16.2-beta.0 < 1.16.2).
function cmp(a, b) {
  const [ra, prea] = a.split(/-(.*)/s);
  const [rb, preb] = b.split(/-(.*)/s);
  const pa = ra.split('.').map(Number);
  const pb = rb.split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  if (!prea !== !preb) return prea ? -1 : 1;
  return 0;
}

// The package a lockfile spec installs: `name@range`, `@scope/name@range`, or an alias `x@npm:name@range`.
function specName(spec) {
  const at = spec.indexOf('@', 1);
  if (at < 0) return null;
  const rest = spec.slice(at + 1);
  if (rest.startsWith('npm:')) return specName(rest.slice(4));
  return spec.slice(0, at);
}

// Every resolved version of `name` in a yarn v1 lockfile (one entry per range group).
export function lockVersions(lock, name) {
  const out = [];
  for (const block of lock.split(/\n\s*\n/)) {
    const head = block.split('\n').find((l) => l && !l.startsWith('#'));
    if (!head) continue;
    const specs = head.replace(/:$/, '').split(/,\s*/).map((s) => s.replace(/^"|"$/g, ''));
    if (!specs.some((s) => specName(s) === name)) continue;
    const m = block.match(/^\s+version "([^"]+)"/m);
    if (m) out.push(m[1]);
  }
  return out;
}

test('lockVersions reads yarn v1 entries, scoped and quoted', () => {
  const lock = '# yarn lockfile v1\n\n\n"body-parser@1.20.8", body-parser@~1.20.5:\n  version "1.20.8"\n\n' +
    'follow-redirects@^1.0.0:\n  version "1.16.2"\n\n"@x/body-parser@^1":\n  version "0.1.0"\n';
  assert.deepEqual(lockVersions(lock, 'body-parser'), ['1.20.8']);
  assert.deepEqual(lockVersions(lock, 'follow-redirects'), ['1.16.2']);
  assert.deepEqual(lockVersions(lock, '@x/body-parser'), ['0.1.0']);
  assert.equal(cmp('1.20.8', MIN['body-parser']) < 0, true);
  assert.equal(cmp('1.16.2-beta.0', '1.16.2') < 0, true);
  assert.equal(cmp('1.16.2', '1.16.2'), 0);
  assert.equal(cmp('1.16.3', '1.16.2') > 0, true);
});

test('lockVersions follows npm aliases and skips specs with no version', () => {
  const lock = '"bp@npm:body-parser@1.20.8":\n  version "1.20.8"\n\nbody-parsers:\n  version "9.9.9"\n';
  assert.deepEqual(lockVersions(lock, 'body-parser'), ['1.20.8']);
});

test('yarn.lock has no version with a known high advisory', () => {
  const lock = readFileSync(join(root, 'yarn.lock'), 'utf8');
  for (const [name, min] of Object.entries(MIN)) {
    const versions = lockVersions(lock, name);
    assert.ok(versions.length > 0, `${name} not found in yarn.lock (drop it from this test if it left the tree)`);
    for (const v of versions) assert.ok(cmp(v, min) >= 0, `${name}@${v} in yarn.lock is below ${min} (yarn audit high)`);
  }
});
