// Shared paths for the tests. They check the built site, so run `npm run prod && ./vendor/bin/jigsaw build production` first.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const build = join(root, 'build_production');

if (!existsSync(join(build, 'index.html'))) {
  throw new Error('build_production/ is missing: run `npm run prod && ./vendor/bin/jigsaw build production` first');
}

// A site path such as /assets/img/uploads/a.webp or assets/img/uploads/a.webp -> file in the build
export const built = (sitePath) => join(build, decodeURIComponent(sitePath.replace(/^\//, '')));

export function htmlFiles(dir = build) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

// The versioned path of a built asset from mix-manifest.json, e.g. /js/posts.js -> build_production/assets/build/js/posts.js
export function asset(name) {
  const manifest = JSON.parse(readFileSync(join(build, 'assets/build/mix-manifest.json'), 'utf8'));
  const versioned = manifest[name];
  if (!versioned) throw new Error(`${name} is not in mix-manifest.json`);
  return join(build, 'assets/build', versioned.split('?')[0]);
}

// The front matter is flat `key: value` lines (quoted or not, with an optional `# comment` as in BLOG-PLAN.md's
// template); that is all the posts use.
export function parsePost(text, file = 'post') {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: no front matter`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*?)\s*$/);
    if (!kv) continue;
    let v = kv[2];
    const quoted = v.match(/^"((?:[^"\\]|\\.)*)"\s*(?:#.*)?$/) ?? v.match(/^'((?:[^']|'')*)'\s*(?:#.*)?$/);
    if (quoted) v = quoted[1].replace(/\\"/g, '"').replace(/''/g, "'");
    else v = v.replace(/(^|\s+)#.*$/, '');
    meta[kv[1]] = v;
  }
  return { file, meta, body: m[2] };
}

// Hosts where each subdomain is a different publisher
const SHARED_HOSTS = /^(github\.io|substack\.com|medium\.com|blogspot\.com|wordpress\.com|pages\.dev|vercel\.app|netlify\.app|beehiiv\.com|dev\.to)$/;

// example.com, bbc.co.uk, alice.github.io: the last two labels; three when the second-level label is a short public
// suffix part (co.uk) or the host is shared by many publishers (github.io). A leading www. never counts.
export function siteOf(url) {
  const host = hostOf(url);
  if (!host) return null;
  const parts = host.replace(/^www\./, '').split('.');
  if (parts.length <= 2) return parts.join('.');
  const [sld, tld] = parts.slice(-2);
  const shortSuffix = tld.length === 2 && /^(co|com|org|net|gov|ac|edu|gob|go|or|ne)$/.test(sld);
  return parts.slice(shortSuffix || SHARED_HOSTS.test(`${sld}.${tld}`) ? -3 : -2).join('.');
}

export function hostOf(url) {
  try { return new URL(url).hostname.toLowerCase().replace(/\.$/, '') || null; } catch { return null; }
}

export const OUR_HOSTS = /^(www\.)?buffermint\.com$/i;

// Markdown and HTML links, as written: inline, reference-style definitions, autolinks and href (quoted or not)
export function links(text) {
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' '); // images are not links
  const out = [];
  for (const m of text.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) out.push(m[1]);
  for (const m of text.matchAll(/\bhref\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'>]+))/gi)) out.push(m[1] ?? m[2] ?? m[3]);
  for (const m of text.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/gm)) out.push(m[1]); // reference-style definitions
  for (const m of text.matchAll(/<(https?:\/\/[^>\s]+)>/g)) out.push(m[1]); // autolinks
  return out;
}

export const isAbsolute = (u) => /^https?:\/\//i.test(u);
export const isExternal = (u) => isAbsolute(u) && hostOf(u) && !OUR_HOSTS.test(hostOf(u));
export const isInternal = (u) => (u.startsWith('/') && !u.startsWith('//')) || (isAbsolute(u) && OUR_HOSTS.test(hostOf(u) ?? ''));
