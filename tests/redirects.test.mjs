// Merged posts (BLOG-PLAN.md, "Old posts"): the weaker post is removed and its URL answers 301 to the stronger one.
// Redirects live in buffermint-pages/static/_redirects (Pages reads only /_redirects; publish.sh joins it in). These
// checks hold the built site to that: a merged post is gone from the build, its sitemap and feed; its target is built;
// the pages repo next to this one (when it's there) answers 301 for it; and no link in the built site points at an
// /articles/ URL that is neither a built post nor redirected.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { join, relative } from 'node:path';
import { root, build, htmlFiles } from './helpers.mjs';

export const MERGED = {
  'micro-saas-is-the-future': 'launch-your-micro-saas-product',
  '5-reasons-why-building-your-mvp-is-a-challenge': 'when-is-the-right-time-to-launch-an-mvp',
  'why-speed-to-market-matters-for-your-saas-product-launch': 'when-is-the-right-time-to-launch-an-mvp',
  'the-ultimate-guide-to-launching-your-startup-from-idea-to-reality': 'launching-a-saas-product-as-a-non-technical-founder',
  'things-to-know-before-launching-your-first-tech-startup': 'launching-a-saas-product-as-a-non-technical-founder',
  'how-to-be-an-excellent-client-and-help-your-technical-partners-do-their-best-work': 'launching-a-saas-product-as-a-non-technical-founder',
  'how-ai-and-machine-learning-is-changing-the-saas-space': 'ai-feature-cost-per-user',
  'the-4-types-of-products-which-type-should-you-build': 'how-to-get-successful-startup-ideas',
  'your-strategy-is-a-voyage': 'how-to-achieve-a-product-market-fit-with-your-product',
};

// Moved pages (owner decision D4, 2026-11-03, PLAN.md item 11): old path -> new path. Unlike a merged post, nothing on
// the site may still link to the old path; the 301 is only for links from outside.
export const MOVED = {
  '/articles/10-micro-saas-ideas-in-2021-copy': '/articles/micro-saas-ideas',
  '/our-pricing': '/',
};

const PAGES = join(root, '../buffermint-pages');
const PAGES_REDIRECTS = join(PAGES, 'static/_redirects');
const isPost = (slug) => existsSync(join(build, 'articles', slug, 'index.html')) || existsSync(join(build, 'articles', `${slug}.html`));
const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

// Which pages rules this landing commit will be published with. bin/landing-autopublish publishes landing main once
// it's verified, and publish.sh reads static/_redirects from the pages working tree. So landing main (or a detached
// release checkout) is held to rules present both on pages origin/main (merged, so they survive the next checkout) and
// in the pages working tree (what publish.sh reads): verify fails until the pages side is merged and checked out, and
// the deletions can't go live as 404s. A git error counts as main (fail closed). A lane branch is checked against the
// pages working tree only (the same lane branch there). Rules are returned as one text per source; each must pass.
export function pagesRulesText(landingDir = root, pagesDir = PAGES) {
  const file = join(pagesDir, 'static/_redirects');
  const tree = { from: 'the buffermint-pages checkout', text: existsSync(file) ? readFileSync(file, 'utf8') : '' };
  let branch;
  try { branch = git(landingDir, 'rev-parse', '--abbrev-ref', 'HEAD').trim(); } catch { branch = 'HEAD'; }
  if (branch !== 'main' && branch !== 'HEAD') return [tree];
  let merged = '';
  try { merged = git(pagesDir, 'show', 'origin/main:static/_redirects'); } catch { /* no rules there yet */ }
  return [{ from: 'buffermint-pages origin/main', text: merged }, tree];
}

const onMain = () => {
  try { return ['main', 'HEAD'].includes(git(root, 'rev-parse', '--abbrev-ref', 'HEAD').trim()); } catch { return true; }
};

function parseRules({ from, text }) {
  const rules = new Map();
  rules.from = from;
  for (const line of text.split('\n')) {
    const l = line.trim();
    if (!l || l.startsWith('#')) continue;
    const [src, to, code] = l.split(/\s+/);
    if (!rules.has(src)) rules.set(src, { to, code }); // first match wins
  }
  return rules;
}

test('a merged post is gone from the build, the sitemap and the feed; its target is built', () => {
  const sitemap = readFileSync(join(build, 'sitemap.xml'), 'utf8');
  const feed = readFileSync(join(build, 'feed.xml'), 'utf8');
  for (const [from, to] of Object.entries(MERGED)) {
    assert.ok(!existsSync(join(root, 'source/_posts', `${from}.blade.md`)), `source/_posts/${from}.blade.md still exists`);
    assert.ok(!isPost(from), `articles/${from} is still built`);
    assert.ok(!new RegExp(`/articles/${from}/?<`).test(sitemap), `${from} is still in sitemap.xml`);
    assert.ok(!new RegExp(`/articles/${from}(?![\\w-])`).test(feed), `${from} is still in feed.xml`);
    assert.ok(isPost(to), `the merge target articles/${to} isn't built`);
  }
});

test('buffermint-pages answers 301 from each merged post to its target', (t) => {
  if (!existsSync(join(PAGES, '.git'))) {
    // on main this is the release gate, so it fails closed; elsewhere there is nothing to compare against
    if (onMain()) assert.fail(`${PAGES} must be checked out next to this repo to verify landing main`);
    return t.skip(`${PAGES} is not checked out next to this repo`);
  }
  for (const rules of pagesRulesText().map(parseRules)) {
    for (const [from, to] of Object.entries(MERGED)) {
      for (const path of [`/articles/${from}`, `/articles/${from}/`]) {
        assert.deepEqual(rules.get(path), { to: `/articles/${to}`, code: '301' }, `${path} in static/_redirects of ${rules.from} (merge and check out the pages side first)`);
      }
    }
  }
});

const isPage = (path) => path === '/' ? existsSync(join(build, 'index.html'))
  : existsSync(join(build, path.slice(1), 'index.html')) || existsSync(join(build, `${path.slice(1)}.html`));
// an href, a <loc>, an Atom <id>/<link> or a JSON url to the path (absolute or root-relative), with or without a slash
const linksTo = (text, path) => new RegExp(`(?:https?://(?:www\\.)?buffermint\\.com)?${path}/?(?=["'<#?\\s]|$)`, 'm').test(text);

test('a moved page is gone from the build, the sitemap, the feed and the search index; its new path is built', () => {
  const files = ['sitemap.xml', 'feed.xml', 'index.json'].map((f) => [f, readFileSync(join(build, f), 'utf8')]);
  for (const [from, to] of Object.entries(MOVED)) {
    assert.ok(!isPage(from), `${from} is still built`);
    assert.ok(isPage(to), `${to} (the new home of ${from}) isn't built`);
    for (const [name, text] of files) assert.ok(!linksTo(text, from), `${from} is still in ${name}`);
  }
  assert.ok(!existsSync(join(root, 'source/_pages/our-pricing.md')), 'source/_pages/our-pricing.md still exists');
  assert.ok(existsSync(join(root, 'source/_posts/micro-saas-ideas.blade.md')), 'the micro-SaaS ideas post moved away');
  assert.match(readFileSync(join(build, 'sitemap.xml'), 'utf8'), /buffermint\.com\/articles\/micro-saas-ideas</, 'micro-saas-ideas is not in sitemap.xml');
});

test('no page in the built site links to a moved page\'s old path', () => {
  const found = [];
  for (const file of htmlFiles()) {
    const html = readFileSync(file, 'utf8');
    for (const from of Object.keys(MOVED)) if (linksTo(html, from)) found.push(`${relative(build, file)} → ${from}`);
  }
  assert.deepEqual(found, []);
});

test('buffermint-pages answers 301 from each moved page to its new path', (t) => {
  if (!existsSync(join(PAGES, '.git'))) {
    if (onMain()) assert.fail(`${PAGES} must be checked out next to this repo to verify landing main`);
    return t.skip(`${PAGES} is not checked out next to this repo`);
  }
  for (const rules of pagesRulesText().map(parseRules)) {
    for (const [from, to] of Object.entries(MOVED)) {
      for (const path of [from, `${from}/`]) {
        assert.deepEqual(rules.get(path), { to, code: '301' }, `${path} in static/_redirects of ${rules.from} (merge and check out the pages side first)`);
      }
    }
  }
});

test('every /articles/ link in the built site is a built post or a redirect (no 404s)', () => {
  const redirected = new Set(Object.keys(MERGED));
  const missing = [];
  for (const file of htmlFiles()) {
    const html = readFileSync(file, 'utf8');
    // absolute, root-relative and relative (articles/x, ../articles/x) links to a post
    for (const m of html.matchAll(/href=["'](?:https?:\/\/(?:www\.)?buffermint\.com\/|\/|(?:\.\.\/)*)articles\/([^"'#?/]+)\/?(?:[#?][^"']*)?["']/g)) {
      const slug = decodeURIComponent(m[1]);
      if (!isPost(slug) && !redirected.has(slug)) missing.push(`${relative(build, file)} → /articles/${slug}`);
    }
  }
  assert.deepEqual([...new Set(missing)], []);
});

test('refreshed and new posts link straight to the merged target, not through a redirect', () => {
  const dir = join(root, 'source/_posts');
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    const [, meta = '', body = ''] = readFileSync(join(dir, name), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/) ?? [];
    const date = meta.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? '';
    // the posts.test.mjs scope (refreshed, or dated from its cutoff on); posts left as they are keep their old links,
    // which the redirects cover. (Importing posts.test.mjs would run its tests a second time.)
    if (!/^updated:\s*\S/m.test(meta) && date && date < '2026-10-29') continue;
    for (const from of Object.keys(MERGED)) {
      assert.doesNotMatch(body, new RegExp(`/articles/${from}(?![\\w-])`), `${name} links to the merged ${from}`);
    }
  }
});

// pagesRulesText in throwaway repos: landing main is held to pages origin/main, a lane branch to the pages checkout
test('landing main is checked against pages origin/main; a lane branch against the pages checkout', (t) => {
  const tmp = mkdtempSync(join(tmpdir(), 'bm-redirects-'));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  const sh = (dir, ...args) => execFileSync('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { stdio: 'ignore' });
  const landing = join(tmp, 'landing'), pages = join(tmp, 'pages');
  for (const d of [landing, pages]) { mkdirSync(d); sh(d, 'init', '-q', '-b', 'main'); }
  writeFileSync(join(landing, 'a'), 'a'); sh(landing, 'add', 'a'); sh(landing, 'commit', '-qm', 'a');
  mkdirSync(join(pages, 'static'));
  writeFileSync(join(pages, 'static/_redirects'), '/old /on-main 301\n'); sh(pages, 'add', '-A'); sh(pages, 'commit', '-qm', 'main');
  sh(pages, 'update-ref', 'refs/remotes/origin/main', 'HEAD');
  writeFileSync(join(pages, 'static/_redirects'), '/old /on-lane 301\n'); // the lane's uncommitted or branch state

  const texts = () => pagesRulesText(landing, pages).map((x) => x.text);
  assert.deepEqual(texts(), ['/old /on-main 301\n', '/old /on-lane 301\n'], 'landing on main: pages origin/main and the pages checkout must both pass');
  sh(landing, 'checkout', '-q', '--detach');
  assert.equal(texts().length, 2, 'a detached release checkout is held like main');
  sh(landing, 'checkout', '-q', '-b', 'lane/x');
  assert.deepEqual(texts(), ['/old /on-lane 301\n'], 'a lane branch reads the pages checkout only');
  sh(pages, 'update-ref', '-d', 'refs/remotes/origin/main');
  sh(landing, 'checkout', '-q', 'main');
  assert.equal(texts()[0], '', 'no pages origin/main: no rules, so the 301 test fails');
  rmSync(join(pages, 'static/_redirects'));
  sh(pages, 'update-ref', 'refs/remotes/origin/main', 'HEAD');
  assert.equal(texts()[1], '', 'merged but not in the checkout publish.sh reads: the 301 test fails');
});
