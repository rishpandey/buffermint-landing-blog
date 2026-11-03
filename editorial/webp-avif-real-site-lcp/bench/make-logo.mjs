// Copy a built variant and resize only the home page's oversized logo. Usage: node make-logo.mjs <node_modules-with-sharp> <variant-dir> <out-dir>
import { createRequire } from 'node:module'; import fs from 'node:fs'; import path from 'node:path';
const [modules, from, to] = process.argv.slice(2);
const sharp = createRequire(path.join(modules, 'x.js'))('sharp');
fs.rmSync(to, { recursive: true, force: true }); fs.cpSync(from, to, { recursive: true });
const f = path.join(to, 'assets/build/img/logos/shas-logo.png');
const b = await sharp(f).resize({ height: 64 }).png({ compressionLevel: 9, palette: true }).toBuffer();
fs.writeFileSync(f, b); console.log('logo bytes', b.length);
