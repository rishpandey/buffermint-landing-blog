# Probe common DKIM selectors + send.<domain> for mail-capable orgs. python3 -I dkim.py survey.json out.json
import json, re, subprocess, sys
s = json.load(open(sys.argv[1])); seen = {}
for r in s: seen.setdefault(r['org'], r)
SEL = ['google', 'resend', 'selector1', 's1', 'k1', 'default', 'mail', 'dkim', 'sig1', 'protonmail', 'fm1', 'zmail']
def dig(n, t):
    return [l for l in subprocess.run(['dig', '+short', '+time=3', '+tries=2', t, n], capture_output=True, text=True).stdout.splitlines() if l and not l.startswith(';')]
out = {}
for o, r in seen.items():
    if not ([m for m in r['mx'] if not m.strip().endswith(' .')] or r['spf']): continue
    # a live key only: non-empty p= in the TXT (dig follows CNAMEs); review 2026-11-17, the first run also counted bare CNAMEs and empty p=
    hit = [sel for sel in SEL if re.search(r'(?:^|;)\s*p=[^;\s]', ''.join(''.join(l.split('"')[1::2]) for l in dig(f'{sel}._domainkey.{o}', 'TXT')))]
    send = dig('send.' + o, 'MX')
    out[o] = {'dkim': hit, 'send_mx': send}
json.dump(out, open(sys.argv[2], 'w'), indent=1)
import collections
c = collections.Counter(x for v in out.values() for x in v['dkim'])
print(len(out), sum(1 for v in out.values() if v['dkim']), c.most_common(), sum(1 for v in out.values() if v['send_mx']))
