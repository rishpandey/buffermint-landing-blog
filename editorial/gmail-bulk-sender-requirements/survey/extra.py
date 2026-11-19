# Derived counts for claims rows 36, 37, 40, 45 (2026-11-15). python3 -I extra.py survey.json dkim.json
import json, re, sys
s = {}
for r in json.load(open(sys.argv[1])): s.setdefault(r['org'], r)
d = json.load(open(sys.argv[2])); w = set(json.load(open(sys.argv[2] + '.wild.json')))
real = lambda r: [m for m in r['mx'] if not m.strip().endswith(' .')]
mail = {o for o, r in s.items() if (real(r) or r['spf']) and not (r['mx'] and not real(r))}
d = {o: v for o, v in d.items() if o in mail}
okd = {o: v for o, v in d.items() if o not in w}
# drop revoked or dangling selector hits found by recheck.py (review 2026-11-17)
import os
rv = json.load(open(sys.argv[2] + '.revoked.json')) if os.path.exists(sys.argv[2] + '.revoked.json') else {}
d = {o: dict(v, dkim=[x for x in v['dkim'] if x not in rv.get(o, [])]) for o, v in d.items()}
okd = {o: d[o] for o in okd}
print('mail domains', len(mail), 'probed', len(d), 'without wildcard DKIM', len(okd))
print('with a key at a common selector', sum(1 for v in okd.values() if v['dkim']),
      {k: sum(1 for v in okd.values() if k in v['dkim']) for k in ('google', 'resend', 's1', 'k1')})
sendmx = [o for o, v in d.items() if v['send_mx'] and o + '#mx' not in w]
print('send. MX', len(sendmx), 'to amazonses', sum(1 for o in sendmx if any('amazonses' in m for m in d[o]['send_mx'])),
      'with a Resend key', sum(1 for o in sendmx if 'resend' in d[o]['dkim']))
# selector hits count only without wildcard DKIM; the SES bounce MX and SPF tests don't depend on DKIM (review 2026-11-17)
tx = [o for o, v in d.items() if (o in okd and set(v['dkim']) & {'resend', 's1', 'k1'})
      or (o in sendmx and any('amazonses' in m for m in v['send_mx']))
      or 'amazonses' in ' '.join(s[o]['spf']).lower()]
pol = lambda o: (re.search(r'(?:^|;)\s*p\s*=\s*(\w+)', s[o]['dmarc'][0], re.I).group(1).lower() if s[o]['dmarc'] else None)
print('sending service seen', len(tx), 'no DMARC', sum(1 for o in tx if not s[o]['dmarc']), 'p=none', sum(1 for o in tx if pol(o) == 'none'))
cf = [o for o in mail if 'mx.cloudflare.net' in ' '.join(s[o]['mx']).lower()]
nc = [o for o in mail if 'spf.efwd.registrar-servers.com' in ' '.join(s[o]['spf']).lower()]
nc_only = [o for o in nc if s[o]['spf'][0].lower().count('include:') == 1 and not re.search(r'\b(ip4|ip6|a|mx)[:\s]', s[o]['spf'][0].lower())]
print('cloudflare MX', len(cf), 'namecheap SPF', len(nc), 'of which forwarder only', len(nc_only), 'overlap', len(set(cf) & set(nc)))
# forward-only (review 2026-11-17): SPF names only Cloudflare Email Routing or Namecheap forwarding, no other sender,
# no DKIM key at the probed selectors (wildcard domains excluded), no send. MX
fwd = {'include:_spf.mx.cloudflare.net': 'cloudflare', 'include:spf.efwd.registrar-servers.com': 'namecheap'}
def fwd_only(o):
    if len(s[o]['spf']) != 1: return None
    terms = [x for x in s[o]['spf'][0].lower().split()[1:] if not x.endswith('all')]
    if len(terms) != 1 or terms[0] not in fwd or o in w or d[o]['dkim'] or o in sendmx: return None
    return fwd[terms[0]]
fo = [fwd_only(o) for o in d]
print('forward only', sum(1 for x in fo if x), {k: fo.count(k) for k in ('cloudflare', 'namecheap')},
      'cloudflare MX with a sending service', sum(1 for o in cf if o in tx),
      'with a Resend key', sum(1 for o in cf if o in okd and 'resend' in d[o]['dkim']))
print('forward only without DMARC', sum(1 for o, x in zip(d, fo) if x and not s[o]['dmarc']))
