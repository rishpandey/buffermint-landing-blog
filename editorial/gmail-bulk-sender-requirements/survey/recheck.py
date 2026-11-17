# Review 2026-11-17: re-dig every DKIM hit in dkim.json and keep only live keys (a non-empty p=, CNAMEs followed by dig).
# Revoked keys (p= empty, e.g. Fastmail's rotated-out fm1) and CNAMEs to a name with no key are written to <dkim.json>.revoked.json.
# python3 -I recheck.py dkim.json
import json, re, subprocess, sys
d = json.load(open(sys.argv[1])); w = set(json.load(open(sys.argv[1] + '.wild.json')))
def live(name):
    out = subprocess.run(['dig', '+short', '+time=3', '+tries=2', 'TXT', name], capture_output=True, text=True).stdout
    txt = ''.join(''.join(l.split('"')[1::2]) for l in out.splitlines())
    m = re.search(r'(?:^|;)\s*p=([^;]*)', txt)
    return bool(m and m.group(1).strip())
revoked = {o: [sel for sel in v['dkim'] if not live(f'{sel}._domainkey.{o}')] for o, v in d.items() if o not in w and v['dkim']}
revoked = {o: s for o, s in revoked.items() if s}
json.dump(revoked, open(sys.argv[1] + '.revoked.json', 'w'), indent=1)
print(len(revoked), revoked)
