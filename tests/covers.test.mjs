// BM-46, BM-396: every post's cover and thumbnail is a full 1200 × 630 frame with a WebP copy, and the post page shows
// the whole cover (not a cropping band): the covers carry their headline. The rendered sizes are in e2e/covers.e2e.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { built, htmlFiles } from './helpers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const posts = join(root, 'source/_posts');
const field = (text, name) => text.match(new RegExp(`^${name}:\\s*(\\S+)`, 'm'))?.[1];
const jpegSize = (b) => {
  for (let i = 2; i < b.length;) {
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
};

for (const f of readdirSync(posts).filter((n) => n.endsWith('.blade.md'))) {
  test(`${f}: cover and thumbnail have the right size and a WebP copy`, () => {
    const text = readFileSync(join(posts, f), 'utf8');
    for (const [name, size] of [['featured_image', [1200, 630]], ['featured_thumbnail', [600, 315]]]) {
      const file = field(text, name);
      assert.ok(file, `${f} has ${name}`);
      assert.deepEqual(jpegSize(readFileSync(join(root, 'source', file))), size, file);
      assert.ok(existsSync(join(root, 'source', file.replace(/\.jpeg$/, '.webp'))), `${file} has a WebP copy`);
    }
  });
}

test('a post page shows its whole cover through <picture>, and no cropping band is left', () => {
  const pages = htmlFiles().filter((f) => /\/articles\/[^/]+\/index\.html$/.test(f)).map((f) => [f, readFileSync(f, 'utf8')]).filter(([, h]) => h.includes('og:type" content="article"'));
  assert.ok(pages.length >= 20, `found ${pages.length} posts`);
  for (const [file, html] of pages) {
    assert.ok(!html.includes('data-jarallax'), `${file}: no jarallax band`);
    const m = html.match(/<picture><source type="image\/webp" srcset="([^"]+)"><img [^>]*class="post-cover[^>]*>/);
    assert.ok(m, `${file}: the cover is an image with its WebP copy`);
    assert.ok(existsSync(built(m[1])), `${file}: ${m[1]} exists`);
  }
});

test('covers render uncropped at desktop and phone size', () => {
  const e2e = join(root, 'tests/e2e/covers.e2e.mjs'), lock = join(root, '../bin/one-chrome');
  const [cmd, args] = existsSync(lock) ? [lock, [process.execPath, e2e]] : [process.execPath, [e2e]];
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
