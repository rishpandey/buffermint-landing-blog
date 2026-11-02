// Cover: the same public-domain photo (NASA AS11-40-5903, already our heic-to-jpg cover) cut into three strips, each really encoded in the format it names.
// Usage (repo root): node make-cover.mjs <node_modules-with-sharp> <out-base>
import { createRequire } from 'node:module'; import fs from 'node:fs'; import path from 'node:path';
const [modules, out] = process.argv.slice(2);
const sharp = createRequire(path.join(modules, 'x.js'))('sharp');
const src = 'source/assets/img/uploads/heic-to-jpg-cover.jpeg';
const r = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'sweep.json'))).rows.find((x) => x.file === path.basename(src));
const kb = (n) => `${Math.round(n / 1000)} KB`;
const w = r.variants.find((v) => v.fmt === 'webp' && v.q === 80), a = r.variants.find((v) => v.fmt === 'avif' && v.q === 50);
const T = [['JPEG', r.jpeg, null], ['WebP q80', w.bytes, (s) => s.webp({ quality: 80 })], ['AVIF q50', a.bytes, (s) => s.avif({ quality: 50 })]];
const W = 1600, H = 840, S = Math.floor(W / 3); const parts = [];
for (let i = 0; i < 3; i++) {
  const left = i * S, width = i === 2 ? W - left : S;
  let input = await sharp(src).png().toBuffer();
  if (T[i][2]) input = await sharp(await T[i][2](sharp(src)).toBuffer()).png().toBuffer();
  parts.push({ input: await sharp(input).extract({ left, top: 0, width, height: H }).toBuffer(), left, top: 0 });
  const svg = `<svg width="${width}" height="96"><rect width="100%" height="100%" fill="#000" fill-opacity=".62"/><text x="28" y="60" font-family="DejaVu Sans,sans-serif" font-size="34" fill="#fff">${T[i][0]} · ${kb(T[i][1])}</text></svg>`;
  parts.push({ input: Buffer.from(svg), left, top: H - 96 });
  if (i) parts.push({ input: await sharp({ create: { width: 3, height: H, channels: 3, background: '#fff' } }).png().toBuffer(), left, top: 0 });
}
const img = sharp({ create: { width: W, height: H, channels: 3, background: '#000' } }).composite(parts);
const buf = await img.png().toBuffer();
await sharp(buf).jpeg({ quality: 78, mozjpeg: true }).toFile(`${out}.jpeg`);
await sharp(buf).webp({ quality: 78 }).toFile(`${out}.webp`);
console.log(T.map((t) => t[1]), fs.statSync(`${out}.jpeg`).size, fs.statSync(`${out}.webp`).size);
