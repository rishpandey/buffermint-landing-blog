# Build domains.txt from the HN Algolia API (Show HN, 1-31 Oct 2026 UTC, 10+ points). python3 -I sample.py showhn.json domains.txt
# showhn.json: curl -s "https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&numericFilters=created_at_i%3E%3D1790812800,created_at_i%3C1793491200,points%3E%3D10&hitsPerPage=1000"
import json, sys, urllib.parse
SKIP = ('github.com', 'gitlab.com', 'youtube.com', 'apps.apple.com', 'play.google.com', 'huggingface.co', 'arxiv.org',
        'codeberg.org', 'npmjs.com', 'pypi.org', 'chromewebstore.google.com', 'chrome.google.com', 'news.ycombinator.com',
        'twitter.com', 'x.com', 'medium.com', 'substack.com', 'vercel.app', 'netlify.app', 'github.io', 'pages.dev',
        'itch.io', 'producthunt.com', 'reddit.com', 'addons.mozilla.org', 'crates.io', 'docs.google.com',
        'marketplace.visualstudio.com', 'fly.dev', 'onrender.com', 'replit.app', 'lovable.app', 'streamlit.app',
        'blogspot.com', 'workers.dev')  # last two added in review 2026-11-17: free hosting, their apex DNS is the platform's
hits = json.load(open(sys.argv[1]))['hits']
doms = set()
for h in hits:
    u = h.get('url')
    if not u: continue
    n = (urllib.parse.urlparse(u).hostname or '').lower().removeprefix('www.')
    if any(n == x or n.endswith('.' + x) for x in SKIP): continue
    doms.add(n)
open(sys.argv[2], 'w').write('\n'.join(sorted(doms)) + '\n')
print(len(hits), 'stories,', len(doms), 'domains')
