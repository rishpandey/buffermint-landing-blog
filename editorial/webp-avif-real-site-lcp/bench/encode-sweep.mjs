// Encode every JPEG in source/assets/img/uploads as WebP and AVIF at several qualities, score each with FFmpeg SSIM against the JPEG.
// Usage (repo root): node editorial/webp-avif-real-site-lcp/bench/encode-sweep.mjs <path-to-node_modules-with-sharp> <out.json>
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const [modules, out] = process.argv.slice(2);
const sharp = createRequire(path.join(modules, 'x.js'))('sharp');
sharp.concurrency(2);
sharp.cache(false); // otherwise a rewritten temp file is read back from libvips' cache
const dir = 'source/assets/img/uploads';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sweep-'));
const SETS = [['webp', [60, 70, 75, 80, 85, 90]], ['avif', [35, 45, 50, 55, 60, 70]]];
const ssimOf = (a, b) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', a, '-i', b, '-lavfi', 'ssim', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = r.stderr.match(/All:([0-9.]+)/); if (!m) throw new Error(`no ssim for ${a}: ${r.stderr.slice(-300)}`);
  return Number(m[1]);
};
const rows = [];
const LIMIT = Number(process.env.LIMIT) || Infinity;
for (const f of fs.readdirSync(dir).filter((x) => /\.jpe?g$/i.test(x)).sort().slice(0, LIMIT)) {
  const src = path.join(dir, f);
  const meta = await sharp(src).metadata();
  const ref = path.join(tmp, 'ref.png');
  await sharp(src).rotate().toColourspace('srgb').flatten({ background: '#fff' }).png({ compressionLevel: 1 }).toFile(ref);
  const row = { file: f, width: meta.width, height: meta.height, jpeg: fs.statSync(src).size, variants: [] };
  const shipped = src.replace(/\.jpe?g$/i, '.webp');
  if (fs.existsSync(shipped)) {
    const p = path.join(tmp, 'c.png');
    await sharp(shipped).rotate().toColourspace('srgb').flatten({ background: '#fff' }).png({ compressionLevel: 1 }).toFile(p);
    row.shipped = { bytes: fs.statSync(shipped).size, ssim: ssimOf(ref, p) };
  }
  for (const [fmt, qs] of SETS) for (const q of qs) {
    const t = performance.now();
    const buf = await sharp(src).rotate()[fmt]({ quality: q, effort: 4 }).toBuffer();
    const ms = performance.now() - t;
    const p = path.join(tmp, 'c.png');
    await sharp(buf).toColourspace('srgb').flatten({ background: '#fff' }).png({ compressionLevel: 1 }).toFile(p);
    row.variants.push({ fmt, q, bytes: buf.length, ms: Math.round(ms), ssim: ssimOf(ref, p) });
  }
  rows.push(row); console.log(f, row.jpeg, row.shipped?.bytes ?? '-');
  fs.writeFileSync(out, JSON.stringify({ sharp: sharp.versions, rows }, null, 1));
}
fs.rmSync(tmp, { recursive: true });
