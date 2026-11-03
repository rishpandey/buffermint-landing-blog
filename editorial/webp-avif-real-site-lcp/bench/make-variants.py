#!/usr/bin/env python3
# From build_production make three copies that differ only in which image format a browser is offered:
#   jpeg: <picture> WebP sources and image-set() WebP offers removed; webp: as built; avif: AVIF offered first, WebP next, JPEG last.
# Usage: make-variants.py <build_dir> <out_dir> <dir with name.avif files>
import os, re, shutil, sys
build, out, avifs = sys.argv[1:4]
UP = 'assets/img/uploads'
for v in ('jpeg', 'webp', 'avif'):
    d = os.path.join(out, v)
    shutil.rmtree(d, ignore_errors=True); shutil.copytree(build, d)
    if v == 'avif':
        for f in os.listdir(avifs):
            shutil.copy(os.path.join(avifs, f), os.path.join(d, UP, f))
    for root, _, files in os.walk(d):
        for f in files:
            if not f.endswith('.html'): continue
            p = os.path.join(root, f); s = open(p, encoding='utf8').read(); o = s
            if v == 'jpeg':
                s = re.sub(r'<source[^>]*type="image/webp"[^>]*>\s*', '', s)
                s = re.sub(r"\s*background-image:\s*image-set\([^;]*\);", '', s)
            elif v == 'avif':
                def src(m):
                    a = re.sub(r'\.webp"', '.avif"', m.group(0)).replace('image/webp', 'image/avif')
                    name = re.search(r'/([^/"]+)\.avif"', a).group(1)
                    return (a + m.group(0)) if os.path.exists(os.path.join(avifs, name + '.avif')) else m.group(0)
                s = re.sub(r'<source[^>]*type="image/webp"[^>]*>', src, s)
                def iset(m):
                    n = re.search(r"/([^/)]+)\.webp\)", m.group(0))
                    if not n or not os.path.exists(os.path.join(avifs, n.group(1) + '.avif')): return m.group(0)
                    return m.group(0).replace('image-set(', "image-set(url(/%s/%s.avif) type('image/avif'), " % (UP, n.group(1)), 1)
                s = re.sub(r"background-image:\s*image-set\([^;]*\);", iset, s)
            if s != o: open(p, 'w', encoding='utf8').write(s)
