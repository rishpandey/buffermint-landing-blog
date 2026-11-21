// Scripts kept with a post's research notes (editorial/<slug>/) back numbers in the post, so their own tests run in
// the check: every editorial/*/test_*.py is run with python3 -I. A post that cites a script's output stays backed
// only while the script still produces it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const editorial = join(root, 'editorial');
const suites = existsSync(editorial)
  ? readdirSync(editorial, { withFileTypes: true }).filter((d) => d.isDirectory()).flatMap((d) =>
    readdirSync(join(editorial, d.name)).filter((f) => /^test_.*\.py$/.test(f)).map((f) => join(editorial, d.name, f)))
  : [];

test('the eu-e-invoicing post has its script tests', () => {
  assert.ok(suites.some((s) => s.endsWith('eu-e-invoicing-2026-small-saas/test_check_example.py')));
});

for (const suite of suites) {
  test(`editorial script tests pass: ${suite.slice(root.length + 1)}`, () => {
    // -I ignores PYTHON* variables, so -B (not PYTHONDONTWRITEBYTECODE) keeps __pycache__ out of editorial/.
    const run = spawnSync('python3', ['-I', '-B', suite], { cwd: dirname(suite), encoding: 'utf8', timeout: 60_000 });
    assert.ifError(run.error);
    assert.equal(run.status, 0, `${run.stdout}\n${run.stderr}`);
  });
}
