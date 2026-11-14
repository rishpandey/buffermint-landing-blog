# DNS survey: MX, SPF, DMARC for each domain (2026-11-15). Usage: python3 -I survey.py domains.txt out.json
import json, subprocess, sys
TWO = {'co.uk','com.au','co.jp','co.in','com.br','co.nz','org.uk','co.za','com.mx','com.tr','com.sg','co.kr'}
def org(d):
    p = d.split('.')
    return '.'.join(p[-3:]) if '.'.join(p[-2:]) in TWO else '.'.join(p[-2:])
def dig(name, t):
    r = subprocess.run(['dig', '+short', '+time=3', '+tries=2', t, name], capture_output=True, text=True)
    return [l for l in r.stdout.splitlines() if l and not l.startswith(';')]
def txt(name):
    return [''.join(part for part in l.split('"')[1::2]) for l in dig(name, 'TXT')]
out = []
for d in open(sys.argv[1]).read().split():
    o = org(d)
    rec = {'host': d, 'org': o}
    rec['mx'] = dig(o, 'MX')
    rec['spf'] = [t for t in txt(o) if t.lower().startswith('v=spf1')]
    dm = [t for t in txt('_dmarc.' + d) if t.lower().startswith('v=dmarc1')]
    if not dm and d != o:
        dm = [t for t in txt('_dmarc.' + o) if t.lower().startswith('v=dmarc1')]
    rec['dmarc'] = dm
    out.append(rec)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print(len(out))
