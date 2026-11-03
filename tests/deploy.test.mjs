// Review fix 2: deploy.sh installs from the lockfiles on every deploy, not only when vendor/ or node_modules/ is missing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

test('deploy.sh puts the brand submodule back on the recorded commit before building', () => {
  const at = (re) => lines.findIndex((l) => re.test(l));
  const sync = at(/^git submodule update --init brand$/);
  assert.ok(sync > at(/ALLOW_DIRTY:-/), 'sync runs after the dirty check');
  assert.ok(sync < at(/^yarn run prod/) && sync < at(/jigsaw build production/) && sync < at(/seo-check\.mjs/), 'sync runs before the build and the SEO gate');
  assert.equal(lines.filter((l) => /\|\|\s*git submodule update/.test(l)).length, 0, 'sync is unconditional');

  const tmp = mkdtempSync(join(tmpdir(), 'bm383-'));
  const git = (cwd, ...args) => execFileSync('git', ['-c', 'protocol.file.allow=always', '-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'init.defaultBranch=main', ...args], { cwd, encoding: 'utf8' }).trim();
  try {
    const brand = join(tmp, 'brand-src');
    const site = join(tmp, 'site');
    execFileSync('mkdir', ['-p', brand, site]);
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
    git(join(site, 'brand'), 'checkout', '-q', newer); // the moved pointer
    assert.match(git(site, 'submodule', 'status', 'brand'), /^\+/);

    const script = lines.slice(at(/^# build against the brand commit/), sync + 1).join('\n');
    const out = execFileSync('bash', ['-euo', 'pipefail', '-c', script], {
      cwd: site, encoding: 'utf8',
      env: { ...process.env, GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'protocol.file.allow', GIT_CONFIG_VALUE_0: 'always' },
    });
    assert.match(out, new RegExp(`not at the recorded commit: checking out ${recorded}`));
    assert.equal(git(join(site, 'brand'), 'rev-parse', 'HEAD'), recorded);
    assert.match(git(site, 'submodule', 'status', 'brand'), new RegExp(`^${recorded} brand`));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
