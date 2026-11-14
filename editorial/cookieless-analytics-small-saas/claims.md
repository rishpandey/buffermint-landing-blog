# Claims: cookieless-analytics-small-saas

Our own measurements were taken on buffermint-vps on 2026-11-14 by lane t-20261106-blog-post: `systemctl status goatcounter`, `ps -eo pid,user,rss,vsz,etime,args`, `/usr/local/bin/goatcounter version`, `ls -la /usr/local/bin/goatcounter`, `nproc`, `free -m`, and a `python3 -I` count over `/var/log/caddy/stats.log` (script reproduced at the end). Script sizes: `curl -sL <url>` then `wc -c` and `gzip -9c | wc -c`.

| # | Claim (as written in the post) | Source | What the source says |
|---|---|---|---|
| 1 | We've run GoatCounter on our own server since 23 October 2026; last restart 20 days ago | ours: first GoatCounter-answered request in /var/log/caddy/stats.log (2026-10-23 09:26 UTC, a 303 from stats.buffermint.com); `systemctl status goatcounter` | log starts 2026-10-23; "active (running) since Sat 2026-10-24 23:35:08 IST" |
| 2 | sits at 33 MB of memory (83 MB at its peak) since its last restart | ours: `systemctl status goatcounter` | "Memory: 33.3M (max: 150M, available: 116.6M, peak: 83.4M …)"; uptime 20 days 15 h |
| 3 | about 0.1% of one CPU core | ours: systemd "CPU: 29min 45.271s" over ps etime 20-15:42:33 | 1,785 s / 1,784,553 s = 0.10% |
| 4 | over 23 days of logs it answered each counted hit in a median of 3 milliseconds; 95th percentile 8.0 ms | ours: stats.log `duration` of 2xx /count requests | p50 3.11 ms, p95 7.98 ms, p99 16.72 ms |
| 5 | GoatCounter key = site + browser string + IP; 8 hours; in memory mapped to random ID; IP/UA never reach the database | https://www.goatcounter.com/help/sessions | "concat(siteID, User-Agent, IP)"; mapping kept 8 hours; IP and User-Agent "never stored to the database or disk" |
| 6 | Plausible = hash(daily salt + domain + IP + UA); salt rotated and deleted every 24 hours; raw IP not stored | https://plausible.io/data-policy | "hash(daily_salt + website_domain + ip_address + user_agent)"; "rotated and deleted every 24 hours"; "Raw IP addresses and User-Agent data are never stored" |
| 7 | Umami session ID = hash of site, IP, browser string, salt; salt changes at the start of each month unless SALT_ROTATION is set; derived from month start date and server secret | https://github.com/umami-software/umami `src/lib/collection-session.ts` line 111, `src/lib/crypto.ts` getSalt/uuid | `uuid(sourceId, ip, userAgent, sessionSalt, distinctId)`; getSalt: unset → `hash(startOfMonth(createdAt).toUTCString())`; uuid mixes in `secret()` (hash of the app secret) |
| 8 | Umami: no IP column in its session table | https://github.com/umami-software/umami `prisma/schema.prisma` model Session | columns: id, websiteId, browser, os, device, screen, language, country, region, city, distinctId, createdAt |
| 9 | Mon + Thu reader = one visitor in Umami, two in Plausible, two in GoatCounter | ours: calculation from rows 5–7 (https://www.goatcounter.com/help/sessions, https://plausible.io/data-policy, Umami source) | 8 h window and daily salt can't join days; monthly salt does within a month |
| 10 | GoatCounter 2.7.0, the current release, SQLite | ours: `goatcounter version` ("version=v2.7.0"), unit file `-db sqlite+…`; https://github.com/arp242/goatcounter/releases (latest v2.7.0, 2025-12-15) | as stated |
| 11 | server with 6 cores and 11.4 GB of RAM | ours: `nproc` = 6; `free -m` total 11,671 MiB | 11,671 MiB ≈ 11.4 GiB |
| 12 | Memory peak 83.4 MB, under a 150 MB limit we set | ours: systemd status; unit file `MemoryMax=150M` | as stated |
| 13 | Resident memory 23 MB | ours: `ps` RSS 23,164 KB | as stated |
| 14 | Program size 29 MB, one file | ours: `ls -la /usr/local/bin/goatcounter` | 29,273,880 bytes |
| 15 | Hits 23 Oct to 14 Nov: 2,261 answered of 2,292 | ours: stats.log count | 2,292 /count requests, 2,261 with 2xx |
| 16 | busiest day 464, median day 48; about 3,000 hits a month at that rate | ours: stats.log per-day count | max 464 (2026-11-08), median 48 over 23 days; 2,261 / 23 × 30 = 2,949 |
| 17 | We didn't measure the database's size | ours: `ls /var/lib/goatcounter` refused (Permission denied) | the data folder isn't readable from the lane account |
| 18 | Plausible CE runs ClickHouse; at least 2 GB of RAM recommended | https://github.com/plausible/community-edition | "At least 2 GB of RAM is recommended for running ClickHouse and Plausible without fear of OOMs" |
| 19 | Umami needs Node.js 20.19+ and PostgreSQL 12.14+; no RAM figure | https://docs.umami.is/docs/install | "Node.js version 20.19 or newer"; "PostgreSQL (minimum v12.14)"; no RAM stated |
| 20 | GoatCounter hosted free "for reasonable public usage"; open source, any purpose; no paid plan listed | https://www.goatcounter.com/ | "currently offered for free for reasonable public usage"; "self-host it for any purpose"; no prices |
| 21 | Plausible: no free plan (30-day trial); Starter $9/month up to 10k pageviews, 1 site | https://plausible.io/#pricing, https://plausible.io/docs/subscription-plans | Starter $9 at 10k; 30-day trial, no card; Starter "one site for a single user" |
| 22 | Plausible counts pageviews and custom events (outbound click, download) toward the limit | https://plausible.io/docs/subscription-plans | pageviews and custom events incl. outbound link clicks, file downloads count |
| 23 | Umami Hobby: 100K events, 1 site, 6 months; Pro $20, 1M events, 20 sites, 2 years; each saved event property counts | https://umami.is/pricing | table values; "each stored event property counts as one event" |
| 24 | Plausible CE AGPLv3, released twice a year | https://plausible.io/self-hosted-web-analytics | "AGPLv3"; "published twice per year" |
| 25 | $9 a month = $108 a year before the yearly discount of two months free | https://plausible.io/#pricing; calculation 9 × 12 | "2 months free" on yearly billing |
| 26 | five events per page view uses the allowance six times as fast | ours: calculation from https://plausible.io/docs/subscription-plans and https://umami.is/pricing | 1 pageview + 5 events = 6 counted |
| 27 | CE has no funnels, user journeys, ecommerce revenue goals, SSO or sites API; basic bot filtering; cloud excludes about 32K data-centre IP ranges | https://plausible.io/self-hosted-web-analytics | features "not available" in CE; Cloud excludes about 32K data center IP ranges |
| 28 | Plausible calls self-hosting infrastructure you maintain, not software you install once | https://plausible.io/self-hosted-web-analytics | "infrastructure you maintain, not software you install once" |
| 29 | Script sizes: Plausible 2,841 / 1,295; ours 5,003 / 2,145; GoatCounter 9,213 / 3,329; Umami 9,246 / 4,144 | ours: curl + gzip -9 on 2026-11-14 of plausible.io/js/script.js, buffermint-brand/dist/analytics.js, gc.zgo.at/count.js, cloud.umami.is/script.js | as stated |
| 30 | GoatCounter's claim of about 3.5 KB | https://www.goatcounter.com/ | "adds just ~3.5KB of extra data" |
| 31 | our sender never sends a page's query string | ours: buffermint-brand/assets/js/analytics.js `send()` | sends `p: path` (location.pathname), title, screen width, referrer origin+path |
| 32 | Plausible's data policy says no banners or consent needed | https://plausible.io/data-policy | "you do not need cookie banners for analytics or to collect consent for tracking" |
| 33 | Umami's pricing page says the same | https://umami.is/pricing | no cookies, no personal data, so no cookie consent banner needed |
| 34 | GoatCounter "should *probably* be safe"; "I am not a lawyer"; GDPR only | https://www.goatcounter.com/help/gdpr | same words; no mention of ePrivacy |
| 35 | Banner question comes from Art. 5(3) ePrivacy Directive | https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf | the guidelines are on the technical scope of Art. 5(3) ePD (storage of / access to information in terminal equipment) |
| 36 | EDPB Guidelines 2/2023 adopted 7 October 2024 | https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf (cover page) | "Adopted on 7 October 2024" |
| 37 | Protects information whether or not personal data | https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf para 10 | "regardless of whether or not it is personal data" (quoting the CJEU) |
| 38 | JS-built tracking request: sending the code is the instruction; collecting = "gaining of access" | https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf para 51 | "it is the distribution of the applicative logic (usually a JavaScript code) that constitutes the instruction"; "constitutes a 'gaining of access'" |
| 39 | Tracking based only on IP can fall under it | https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf paras 54–55 | IP-only tracking: 5(3) applies unless the entity can ensure the IP doesn't originate from the user's terminal |
| 40 | "does not systematically mean that consent needs to be collected"; exemptions case by case | https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf para 56 | same words; "in each case it would have to be assessed" |
| 41 | CNIL conditions: inform and allow objection; audience measurement / A/B only; no combining; one publisher; truncate last IP byte; trackers ≤13 months | https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications | list of conditions as stated |
| 42 | CNIL warns most large analytics products don't qualify | https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications | "Most large audience measurement offerings do not fall within the scope of the exemption" |
| 43 | UK statistical-purposes exception since 5 February 2026 | https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2026/02/key-aspects-of-the-data--use-and-access--act-take-effect.html | "Key changes that took effect on 5 February 2026": consent no longer needed for statistical cookies; opt-out still needed |
| 44 | ICO conditions: sole purpose to improve service; clear info; simple and free objection; third parties only as processors; aggregate | https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/ | "sole purpose"; "with a view to making improvements"; "clear and comprehensive information"; "simple and free" means to object; processor not joint controller; aggregate statistics |
| 45 | our proxy forwards only counting fields, never Referer or cookies | ours: buffermint-pages/functions/stats/count.js `forward()` | forwards p,t,r,e,s,b,rnd and UA/Accept/Accept-Language/IP only |
| 46 | stats access log strips query strings, Referer and cookies | ours: /etc/caddy/sites/buffermint.caddy, stats.buffermint.com `log { format filter … }` | uri query regexp-removed; Referer, Cookie, Set-Cookie deleted |
| 47 | (removed in the code-review pass: the `#bm-nostats` sentence is gone from the post) | ours: edit.md | — |
| 48 | we drop our server's IP and Lighthouse, headless Chrome, Playwright, Puppeteer UAs before GoatCounter | ours: count.js OUR_TRAFFIC | ips list; userAgents Lighthouse, Chrome-Lighthouse, HeadlessChrome, PTST, Playwright, Puppeteer |
| 49 | Prices "as of November 2026" | https://plausible.io/#pricing, https://umami.is/pricing, https://www.goatcounter.com/ (read 2026-11-14) | prices as listed on that date |
| 50 | Plausible CE v3.2.1; Umami v3.5.0 (Sources) | https://api.github.com/repos/plausible/analytics/releases/latest and https://api.github.com/repos/umami-software/umami/releases/latest (read 2026-11-14) | plausible/analytics v3.2.1 published 2026-05-15; umami v3.5.0 published 2026-11-12 |
| 51 | none of the three tools' pages we read says it truncates the last IP byte before use | ours: reading of https://www.goatcounter.com/help/sessions, https://plausible.io/data-policy, https://umami.is/pricing and Umami's collection-session.ts (2026-11-14) | GoatCounter uses the IP in its in-memory key; Plausible hashes the full ip_address; Umami hashes ip; none mentions truncation |

## Log count script (rows 4, 15, 16)
```
python3 -I: for each JSON line of /var/log/caddy/stats.log whose request.uri starts with "/count":
  count it; if 200 <= status < 300 count as answered, record duration and UTC day.
  percentiles from the sorted durations; per-day counts of answered requests.
```
