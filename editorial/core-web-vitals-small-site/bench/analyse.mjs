// Medians per build and page from lighthouse.jsonl (lh-run.mjs output). node analyse.mjs [file]
import fs from 'node:fs';
const file = process.argv[2] ?? new URL('./lighthouse.jsonl', import.meta.url).pathname;
const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
// Even counts average the two middle values.
export const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length, h = n >> 1; return n % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
const g = new Map();
const label = (page) => (page.startsWith('/articles/') ? 'post' : page);
for (const r of rows) { const k = `${label(r.page)}\t${r.v}`; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
const keys = [...g.keys()].sort();
console.log(['page', 'build', 'n', 'score', 'lcp_ms', 'lcp_range', 'fcp_ms', 'tbt_ms', 'cls', 'si_ms', 'total_kb', 'js_kb', 'css_kb', 'img_kb', 'font_kb', 'req', 'mainthread_ms', 'lcp_element'].join('\t'));
for (const k of keys) {
  const R = g.get(k); const m = (f) => med(R.map(f));
  const lcps = R.map((r) => r.lcp);
  // lcpEl was stored clipped to 900 characters, so older rows can't be parsed as JSON: read the selector with a pattern instead.
  const el = R[0].lcpSelector ?? (R[0].lcpEl.match(/"selector":"((?:[^"\\]|\\.)*)"/)?.[1] ?? '(not recorded)');
  console.log([k, R.length, m((r) => r.score), Math.round(m((r) => r.lcp)), `${Math.round(Math.min(...lcps))}-${Math.round(Math.max(...lcps))}`, Math.round(m((r) => r.fcp)), Math.round(m((r) => r.tbt)), m((r) => r.cls).toFixed(3), Math.round(m((r) => r.si)), Math.round(m((r) => r.total) / 1000), Math.round(m((r) => r.scriptBytes) / 1000), Math.round(m((r) => r.stylesheetBytes) / 1000), Math.round(m((r) => r.imgBytes) / 1000), Math.round(m((r) => r.fontBytes) / 1000), m((r) => r.requests), Math.round(m((r) => r.mainThread)), el].join('\t'));
}
const r0 = rows[0]; console.log(`# Lighthouse ${r0.lh}, ${r0.chrome}, ${rows.length} runs, benchmarkIndex median ${Math.round(med(rows.map((r) => r.benchIndex)))} (range ${Math.min(...rows.map((r) => r.benchIndex))}-${Math.max(...rows.map((r) => r.benchIndex))})`);
