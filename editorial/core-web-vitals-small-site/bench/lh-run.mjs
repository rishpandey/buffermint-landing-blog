// Lighthouse mobile (default simulated throttling) round-robin over variants and pages; one JSON line per run, plus LCP element and image bytes.
// Usage: node lh-run.mjs <lighthouse-cli.js> <chrome> <runs> <out.jsonl> variant=port ... -- /page ...
import { spawnSync } from 'node:child_process'; import fs from 'node:fs';
const [cli, chrome, runs, out, ...rest] = process.argv.slice(2);
const cut = rest.indexOf('--'); const vars = rest.slice(0, cut).map((x) => x.split('=')); const pages = rest.slice(cut + 1);
for (let i = 0; i < Number(runs); i++) for (const page of pages) for (const [v, port] of vars) {
  const tmp = `${process.env.LH_TMP || '/tmp'}/cwv-lh-${process.pid}.json`;
  const r = spawnSync('node', [cli, `http://127.0.0.1:${port}${page}`, '--quiet', '--output=json', `--output-path=${tmp}`, '--only-categories=performance', ...(process.env.LH_EXTRA ? process.env.LH_EXTRA.split(' ') : []), '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage'], { encoding: 'utf8', timeout: 180000, env: { ...process.env, CHROME_PATH: chrome } });
  if (r.status !== 0) { console.error(v, page, r.stderr.slice(0, 500)); continue; }
  const j = JSON.parse(fs.readFileSync(tmp, 'utf8')); const a = j.audits;
  const net = a['network-requests']?.details?.items ?? [];
  const img = net.filter((x) => x.resourceType === 'Image');
  const lcpEl = (a['largest-contentful-paint-element'] ?? a['lcp-breakdown-insight'])?.details;
  const row = { v, page, i, score: Math.round(j.categories.performance.score * 100), lcp: a['largest-contentful-paint'].numericValue, fcp: a['first-contentful-paint'].numericValue, tbt: a['total-blocking-time'].numericValue, cls: a['cumulative-layout-shift'].numericValue, si: a['speed-index'].numericValue, total: a['total-byte-weight'].numericValue, imgBytes: img.reduce((s, x) => s + (x.transferSize || 0), 0), ...Object.fromEntries(['Script', 'Stylesheet', 'Font', 'Document'].map((t) => [t.toLowerCase() + 'Bytes', net.filter((x) => x.resourceType === t).reduce((s, x) => s + (x.transferSize || 0), 0)])), requests: net.length, mainThread: a['mainthread-work-breakdown']?.numericValue, bootup: a['bootup-time']?.numericValue, imgs: img.map((x) => [x.url.replace(/^https?:\/\/[^/]+/, ''), x.transferSize]), lh: j.lighthouseVersion, chrome: j.environment?.hostUserAgent?.match(/Chrome\/[\d.]+/)?.[0], lcpEl: JSON.stringify(lcpEl ?? null).slice(0, 900), benchIndex: j.environment?.benchmarkIndex };
  fs.appendFileSync(out, JSON.stringify(row) + '\n'); console.log(v, page, i, row.score, Math.round(row.lcp), row.total);
}
