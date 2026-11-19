import json, sys, re, collections
s = json.load(open(sys.argv[1]))
seen = {}
for r in s: seen.setdefault(r['org'], r)
R = list(seen.values())
def mxreal(r): return [m for m in r['mx'] if not m.strip().endswith(' .')]
def tag(rec, k):
    m = re.search(r'(?:^|;)\s*' + k + r'\s*=\s*([^;]+)', rec, re.I)
    return m.group(1).strip().lower() if m else None
C = collections.Counter()
# a null MX alone (RFC 7505: 'MX 0 .') declares the domain sends and receives no mail: not a mail domain
nullonly = lambda r: r['mx'] and not mxreal(r)
mailers = [r for r in R if (mxreal(r) or r['spf']) and not nullonly(r)]
nullmx = [r for r in R if r['mx'] and not mxreal(r)]
C['orgs'] = len(R); C['mail_capable(mx or spf)'] = len(mailers); C['null_mx'] = len(nullmx)
C['mx'] = sum(1 for r in R if mxreal(r))
for r in mailers:
    spf = r['spf']
    if not spf: C['spf_none'] += 1
    elif len(spf) > 1: C['spf_multiple'] += 1
    else:
        a = re.findall(r'([-~?+])all\b', spf[0].lower())
        C['spf_all_' + (a[-1] if a else 'missing')] += 1
    dm = r['dmarc']
    if not dm: C['dmarc_none'] += 1
    elif len(dm) > 1: C['dmarc_multiple'] += 1
    else:
        p = tag(dm[0], 'p'); C['dmarc_p_' + str(p)] += 1
        if tag(dm[0], 'rua'): C['dmarc_rua'] += 1
        pct = tag(dm[0], 'pct')
        if pct and pct != '100': C['dmarc_pct_lt100'] += 1
    ok = bool(spf) and len(spf) == 1 and bool(dm)
    C['spf_and_dmarc'] += ok
    if ok and tag(dm[0], 'p') in ('quarantine', 'reject'): C['spf_and_enforced_dmarc'] += 1
# MX provider
prov = collections.Counter()
for r in mailers:
    m = ' '.join(mxreal(r)).lower()
    p = 'google' if ('google' in m or 'googlemail' in m) else 'microsoft' if 'outlook.com' in m else 'zoho' if 'zoho' in m else 'proton' if 'proton' in m else 'fastmail' if 'messagingengine' in m else 'cloudflare' if 'mx.cloudflare.net' in m else 'improvmx' if 'improvmx' in m else 'none' if not m else 'other'
    prov[p] += 1
# SPF includes
inc = collections.Counter()
for r in mailers:
    for t in r['spf'][:1]:
        for i in re.findall(r'include:(\S+)', t.lower()):
            inc[i] += 1
print(json.dumps(C, indent=1)); print(prov.most_common()); print(inc.most_common(15))
