// Owner decision D4 (2026-11-03, PLAN.md item 11): the home page carries no agency-era testimonials (Zen Mind Maps,
// Shas Illuminated) and their images are gone from the source; the "launch plan of about 45 days" line stays.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, build } from './helpers.mjs';

const home = () => readFileSync(join(build, 'index.html'), 'utf8');

test('the home page has no agency-era testimonials', () => {
  const html = home();
  for (const s of [/zenmindmap/i, /Zen Mind Maps?/i, /shasilluminated/i, /Shas Illuminated/i, /Nick Hoang/, /Yacov Metz/, /site-quote/]) {
    assert.doesNotMatch(html, s);
  }
  for (const img of ['logos/zmm-logo.png', 'logos/shas-logo.png', 'photos/nick.png', 'photos/yacov.jpeg']) {
    assert.ok(!existsSync(join(root, 'source/_assets/img', img)), `source/_assets/img/${img} is still in the source`);
    assert.ok(!html.includes(img), `the home page still loads ${img}`);
  }
});

test('the home page keeps the "launch plan of about 45 days" line', () => {
  assert.match(home(), /A launch plan of about 45 days/);
});
