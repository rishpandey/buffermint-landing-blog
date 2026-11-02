// Make an AVIF for every upload that has a shipped .webp copy. Usage (repo root): node encode-avif.mjs <node_modules-with-sharp> <out-dir> <quality>
import { createRequire } from 'node:module';
import fs from 'node:fs'; import path from 'node:path';
const [modules, out, q] = process.argv.slice(2);
const sharp = createRequire(path.join(modules, 'x.js'))('sharp');
sharp.concurrency(2); sharp.cache(false);
const dir = 'source/assets/img/uploads';
let n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.webp'))) {
  const base = f.replace(/\.webp$/, '');
  const src = ['.jpeg', '.jpg', '.png'].map((e) => path.join(dir, base + e)).find((p) => fs.existsSync(p));
  if (!src) continue;
  await sharp(src).rotate().avif({ quality: Number(q), effort: 4 }).toFile(path.join(out, base + '.avif')); n++;
}
console.log('avif files', n, 'sharp', sharp.versions.sharp);
