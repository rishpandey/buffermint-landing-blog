// Static server for a build folder with Brotli on text and long caching, close to what Cloudflare Pages sends (Brotli only when the client accepts it; quality 5 is our pick, not a measured match). node serve.mjs <dir> <port>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
const [root, port] = process.argv.slice(2);
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.gif': 'image/gif' };
const cache = new Map();
http.createServer((req, res) => {
  let p; try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  const base = path.resolve(root); let f = path.resolve(base, '.' + p);
  const rel = path.relative(base, f); if (rel.startsWith('..') || path.isAbsolute(rel)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('nf'); }
  const ext = path.extname(f); const type = T[ext] || 'application/octet-stream';
  let body = fs.readFileSync(f); const h = { 'content-type': type, 'cache-control': 'public, max-age=3600' };
  if (/text|json|xml|svg/.test(type) && /\bbr\b/.test(req.headers['accept-encoding'] ?? '')) { if (!cache.has(f)) cache.set(f, zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })); body = cache.get(f); h['content-encoding'] = 'br'; }
  res.writeHead(200, h); res.end(body);
}).listen(Number(port), '127.0.0.1');
