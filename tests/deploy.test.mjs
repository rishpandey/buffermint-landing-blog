// Review fix 2: deploy.sh installs from the lockfiles on every deploy, not only when vendor/ or node_modules/ is missing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root } from './helpers.mjs';

const lines = readFileSync(join(root, 'deploy.sh'), 'utf8').split('\n');

test('composer and yarn install run unconditionally, yarn from the frozen lockfile', () => {
  assert.ok(lines.includes('composer install --no-dev --no-interaction -q'), 'composer install line');
  assert.ok(lines.includes('yarn install --frozen-lockfile --silent'), 'yarn install line');
  assert.equal(lines.filter((l) => /\|\|\s*(composer|yarn) install|&&\s*(composer|yarn) install/.test(l)).length, 0, 'no conditional installs');
});

test('installs come before the build', () => {
  const at = (re) => lines.findIndex((l) => re.test(l));
  assert.ok(at(/^yarn install/) < at(/^yarn run prod/));
  assert.ok(at(/^composer install/) < at(/jigsaw build production/));
});

// BM-383: with ALLOW_DIRTY=1 a moved brand pointer passed the dirty check and the build gated on the wrong brand commit.
// Runs deploy.sh's own sync lines in a scratch repo whose brand submodule sits on a newer commit than the recorded one.

// Scratch-repo git: none of the caller's GIT_* variables (a hook's GIT_DIR would aim at this repo), no global or system config.
const scratchEnv = () => {
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')));
  return { ...env, LC_ALL: 'C', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'protocol.file.allow', GIT_CONFIG_VALUE_0: 'always' };
};
const sh = (cwd, file, args) => execFileSync(file, args, { cwd, encoding: 'utf8', env: scratchEnv() }).trim();
const git = (cwd, ...args) => sh(cwd, 'git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'init.defaultBranch=main', ...args]);
const at = (re) => lines.findIndex((l) => re.test(l));
const syncStart = at(/^# build against the brand commit/);
const syncEnd = at(/brand submodule is still not at/);

// A site repo recording brand commit one, with brand commit two available. Returns paths and both commits.
function scratch(t) {
  const tmp = mkdtempSync(join(tmpdir(), 'bm383-'));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  const brand = join(tmp, 'brand-src');
  const site = join(tmp, 'site');
  mkdirSync(brand);
  mkdirSync(site);
  git(brand, 'init', '-q');
  writeFileSync(join(brand, 'v'), '1');
  git(brand, 'add', 'v');
  git(brand, 'commit', '-qm', 'one');
  const recorded = git(brand, 'rev-parse', 'HEAD');
  writeFileSync(join(brand, 'v'), '2');
  git(brand, 'commit', '-qam', 'two');
  const newer = git(brand, 'rev-parse', 'HEAD');
  git(site, 'init', '-q');
  git(site, 'submodule', 'add', '-q', brand, 'brand');
  git(join(site, 'brand'), 'checkout', '-q', recorded);
  git(site, 'add', 'brand');
  git(site, 'commit', '-qm', 'record brand one');
  return { site, recorded, newer, run: () => {
    // never run an empty script: missing markers would make the behaviour tests pass on nothing (review)
    assert.ok(syncStart >= 0 && syncEnd > syncStart, 'sync block markers found in deploy.sh');
    return sh(site, 'bash', ['-euo', 'pipefail', '-c', lines.slice(syncStart, syncEnd + 1).join('\n')]);
  } };
}

test('the brand sync runs after the dirty check and before the build and SEO gate', () => {
  assert.ok(syncStart >= 0 && syncEnd > syncStart, 'sync block found');
  assert.ok(syncStart > at(/ALLOW_DIRTY:-/), 'after the dirty check');
  for (const re of [/^yarn run prod/, /jigsaw build production/, /seo-check\.mjs/]) assert.ok(syncEnd < at(re), `before ${re}`);
  assert.equal(lines.filter((l) => /\|\|\s*git submodule update/.test(l)).length, 0, 'unconditional');
});

test('deploy.sh puts a moved brand pointer back on the commit HEAD records', (t) => {
  const { site, recorded, newer, run } = scratch(t);
  git(join(site, 'brand'), 'checkout', '-q', newer);
  assert.match(run(), new RegExp(`checked out .${recorded}`), "the log names the recorded commit");
  assert.equal(git(join(site, 'brand'), 'rev-parse', 'HEAD'), recorded);
});

test('deploy.sh also undoes a staged but uncommitted brand bump', (t) => {
  const { site, recorded, newer, run } = scratch(t);
  git(join(site, 'brand'), 'checkout', '-q', newer);
  git(site, 'add', 'brand');
  assert.match(run(), new RegExp(`not at the commit HEAD records: checking out ${recorded}`));
  assert.equal(git(join(site, 'brand'), 'rev-parse', 'HEAD'), recorded);
});

test('deploy.sh says nothing and changes nothing when brand is already on the recorded commit', (t) => {
  const { site, recorded, run } = scratch(t);
  assert.equal(run(), '');
  assert.equal(git(join(site, 'brand'), 'rev-parse', 'HEAD'), recorded);
});
