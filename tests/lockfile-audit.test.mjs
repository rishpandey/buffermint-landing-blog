// BM-403 (2026-11-03): `yarn audit` showed two highs in the dev-server chain (laravel-mix > webpack-dev-server):
// body-parser < 1.20.9 (DoS via trailing bytes) and follow-redirects 1.16.0–1.16.1 (credentials follow redirects).
// Both were fixed by refreshing the lockfile within the existing semver ranges, so nothing in package.json pins them;
// a later lockfile rewrite could bring the old versions back. This test reads yarn.lock and fails if it does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './helpers.mjs';

// Minimum safe version per package (the advisories' "patched in").
const MIN = { 'body-parser': '1.20.9', 'follow-redirects': '1.16.2' };

function cmp(a, b) {
  const pa = a.split('-')[0].split('.').map(Number);
  const pb = b.split('-')[0].split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
}

// Every resolved version of `name` in a yarn v1 lockfile (one entry per range group).
export function lockVersions(lock, name) {
  const out = [];
  for (const block of lock.split(/\n\s*\n/)) {
    const head = block.split('\n').find((l) => l && !l.startsWith('#'));
    if (!head) continue;
    const specs = head.replace(/:$/, '').split(/,\s*/).map((s) => s.replace(/^"|"$/g, ''));
    if (!specs.some((s) => s.slice(0, s.lastIndexOf('@')) === name)) continue;
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
});

test('yarn.lock has no version with a known high advisory', () => {
  const lock = readFileSync(join(root, 'yarn.lock'), 'utf8');
  for (const [name, min] of Object.entries(MIN)) {
    const versions = lockVersions(lock, name);
    assert.ok(versions.length > 0, `${name} not found in yarn.lock (drop it from this test if it left the tree)`);
    for (const v of versions) assert.ok(cmp(v, min) >= 0, `${name}@${v} in yarn.lock is below ${min} (yarn audit high)`);
  }
});
