# Derived counts for claims rows 36, 37, 40, 45 (2026-11-15). python3 -I extra.py survey.json dkim.json
import json, re, sys
s = {}
for r in json.load(open(sys.argv[1])): s.setdefault(r['org'], r)
d = json.load(open(sys.argv[2])); w = set(json.load(open(sys.argv[2] + '.wild.json')))
real = lambda r: [m for m in r['mx'] if not m.strip().endswith(' .')]
mail = {o for o, r in s.items() if (real(r) or r['spf']) and not (r['mx'] and not real(r))}
d = {o: v for o, v in d.items() if o in mail}
okd = {o: v for o, v in d.items() if o not in w}
print('mail domains', len(mail), 'probed', len(d), 'without wildcard DKIM', len(okd))
print('with a key at a common selector', sum(1 for v in okd.values() if v['dkim']),
      {k: sum(1 for v in okd.values() if k in v['dkim']) for k in ('google', 'resend', 's1', 'k1')})
sendmx = [o for o, v in d.items() if v['send_mx'] and o + '#mx' not in w]
print('send. MX', len(sendmx), 'to amazonses', sum(1 for o in sendmx if any('amazonses' in m for m in d[o]['send_mx'])))
tx = [o for o, v in okd.items() if set(v['dkim']) & {'resend', 's1', 'k1'}
      or (o in sendmx and any('amazonses' in m for m in v['send_mx']))
      or 'amazonses' in ' '.join(s[o]['spf']).lower()]
pol = lambda o: (re.search(r'(?:^|;)\s*p\s*=\s*(\w+)', s[o]['dmarc'][0], re.I).group(1).lower() if s[o]['dmarc'] else None)
print('sending service seen', len(tx), 'no DMARC', sum(1 for o in tx if not s[o]['dmarc']), 'p=none', sum(1 for o in tx if pol(o) == 'none'))
cf = [o for o in mail if 'mx.cloudflare.net' in ' '.join(s[o]['mx']).lower()]
nc = [o for o in mail if 'spf.efwd.registrar-servers.com' in ' '.join(s[o]['spf']).lower()]
nc_only = [o for o in nc if s[o]['spf'][0].lower().count('include:') == 1 and not re.search(r'\b(ip4|ip6|a|mx)[:\s]', s[o]['spf'][0].lower())]
print('cloudflare MX', len(cf), 'namecheap SPF', len(nc), 'of which forwarder only', len(nc_only), 'overlap', len(set(cf) & set(nc)))
