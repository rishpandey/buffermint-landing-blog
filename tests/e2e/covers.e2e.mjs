// BM-396: covers carry their headline, so no page may crop one. In headless Chromium at desktop and phone size, each
// cover on a post, the blog list and the home page shows its full frame, and the post's headline sits clear of the
// cover. Run through bin/one-chrome (tests/covers.test.mjs does that). Serves build_production/ on a local port.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright-core';
import { build } from '../helpers.mjs';

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  let path = join(build, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
  res.end(readFileSync(path));
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const origin = `http://127.0.0.1:${server.address().port}`;

const sizes = {
  desktop: { viewport: { width: 1280, height: 800 } },
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};
const pages = {
  '/': '.site-post img',
  '/articles': '.feature-cover img, .article-card img.card-img-top',
  '/articles/merchant-of-record-fees': 'img.post-cover, .article-card img.card-img-top',
  '/articles/launching-a-saas-product-as-a-non-technical-founder': 'img.post-cover',
  '/articles/10-micro-saas-ideas-in-2021-copy': 'img.post-cover',
};

const browser = await chromium.launch();
try {
  for (const [size, options] of Object.entries(sizes)) {
    const context = await browser.newContext(options);
    await context.route('**/*', (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
    const page = await context.newPage();
    for (const [url, selector] of Object.entries(pages)) {
      await page.goto(origin + url);
      const covers = page.locator(selector), n = await covers.count();
      assert.ok(n > 0, `${size} ${url}: has covers`);
      for (let i = 0; i < n; i++) {
        const c = covers.nth(i);
        await c.scrollIntoViewIfNeeded();
        await c.evaluate((img) => img.decode());
        const s = await c.evaluate((img) => {
          const b = img.getBoundingClientRect();
          return { name: img.currentSrc, natural: img.naturalWidth / img.naturalHeight, shown: b.width / b.height, width: b.width, overflow: b.right > innerWidth + 1 || b.left < -1 };
        });
        assert.ok(Math.abs(s.shown / s.natural - 1) < 0.02, `${size} ${url} ${s.name}: frame ${s.shown.toFixed(3)} against image ${s.natural.toFixed(3)}, so it's cropped`);
        assert.equal(s.overflow, false, `${size} ${url} ${s.name} stays on the screen`);
        assert.ok(s.width >= 280, `${size} ${url} ${s.name}: ${s.width}px wide is too small to read`);
      }
      if (url.startsWith('/articles/')) {
        const gap = await page.evaluate(() => document.querySelector('img.post-cover').getBoundingClientRect().top - document.querySelector('h1').getBoundingClientRect().bottom);
        assert.ok(gap > 60, `${size} ${url}: the cover sits ${gap}px below the title`);
      }
    }
    await context.close();
  }
  console.log('covers e2e passed');
} finally {
  await browser.close();
  server.close();
}
