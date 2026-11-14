# Control: a random selector; domains answering it have wildcard DNS and are excluded. python3 -I control.py dkim.json
import json, subprocess, sys, collections
d = json.load(open(sys.argv[1]))
def dig(n, t):
    return [l for l in subprocess.run(['dig', '+short', '+time=3', '+tries=2', t, n], capture_output=True, text=True).stdout.splitlines() if l and not l.startswith(';')]
wild = set()
for o, v in d.items():
    if v['dkim'] or v['send_mx']:
        if dig(f'zq7xk2bm._domainkey.{o}', 'TXT') + dig(f'zq7xk2bm._domainkey.{o}', 'CNAME'): wild.add(o)
        if v['send_mx'] and dig(f'zq7xk2bm.{o}', 'MX'): wild.add(o + '#mx')
clean = {o: v for o, v in d.items() if o not in wild}
c = collections.Counter(x for v in clean.values() for x in v['dkim'])
sendmx = [o for o, v in d.items() if v['send_mx'] and o + '#mx' not in wild]
ses = [o for o in sendmx if any('amazonses' in m for m in d[o]['send_mx'])]
print('wildcard_dkim', len([w for w in wild if '#' not in w]), 'wildcard_mx', len([w for w in wild if '#' in w]))
print('domains', len(d), 'with_any_common_selector', sum(1 for v in clean.values() if v['dkim']), c.most_common())
print('send_mx', len(sendmx), 'send_mx_amazonses', len(ses))
json.dump(sorted(wild), open(sys.argv[1] + '.wild.json', 'w'))
