# Fact-check: cookieless-analytics-small-saas

Review lane t-20261106-blog-post-review, 2026-11-14. Every row of `claims.md` checked: each URL opened on 2026-11-14 (WebFetch, curl for raw files, the EDPB PDF through `pdftotext`) and compared with the post; every `ours:` number re-measured on buffermint-vps the same afternoon. `content-factcheck.json` read first: its 5 blockers and 1 warning are all `ours:` measurements or calculations (0.1%, 2,261/2,292, ~3,000 a month, the script sizes) and the price table, all verified below. Re-measured later the same day, the live numbers had moved slightly as expected (memory 42.7 MB now, CPU 29 min 51 s, 2,314/2,283 hits, p95 8.3 ms, median day 51, because more hits had arrived); the post gives the values at the lane's measurement time and dates them 14 November, so they stand. Gzip sizes from stdin come out 8–10 B smaller than the post's (the lane's `gzip -9c <file>` stores the file name in the header); the plain sizes match exactly and the difference doesn't change any comparison.

| # | Verdict | Evidence |
|---|---|---|
| 1 | verified | `systemctl status goatcounter`: "active (running) since Sat 2026-10-24 23:35:08 IST"; stats.log's first day 2026-10-23 |
| 2 | verified | systemd: "peak: 83.4M", "max: 150M"; 33.3M at the lane's reading (42.7M at mine, same day) |
| 3 | verified | CPU 29 min 50.9 s over etime 20-17:26:45 = 0.10% of one core |
| 4 | verified | my rerun over stats.log: median 3.12 ms, p95 8.32 ms (lane: 3.11/7.98 earlier the same day) |
| 5 | verified | goatcounter.com/help/sessions: "concat(siteID, User-Agent, IP)", 8 hours in memory as sessionID → UUIDv4, "never stored to the database or disk" |
| 6 | verified | plausible.io/data-policy: "hash(daily_salt + website_domain + ip_address + user_agent)", "rotated and deleted every 24 hours", raw IP/UA not stored |
| 7 | verified | umami master `collection-session.ts`: `uuid(sourceId, ip, userAgent, sessionSalt, distinctId ?? '')`; `crypto.ts` getSalt: unset → `hash(startOfMonth(createdAt).toUTCString())`; `uuid` adds `secret()` = hash of the app secret |
| 8 | verified | `prisma/schema.prisma` model Session: no IP column |
| 9 | verified | follows from 5–7 (8 h window, daily salt, monthly salt); post says "that month" |
| 10 | verified | `goatcounter version`: v2.7.0; GitHub latest release v2.7.0 (2025-12-15); unit `-db sqlite+…` |
| 11 | verified | `nproc` 6; `free -m` total 11,671 MiB ≈ 11.4 GiB |
| 12 | verified | systemd peak 83.4M; unit file `MemoryMax=150M` |
| 13 | verified | `ps` RSS 24,212 KB at my reading (lane 23,164 KB); "23 MB" stands as the lane's dated reading |
| 14 | verified | `ls -la`: 29,273,880 bytes, one binary |
| 15 | verified | stats.log: 2,314 /count, 2,283 2xx by my later rerun; lane's 2,292/2,261 consistent with fewer hits at its time |
| 16 | verified | busiest day 464 on 2026-11-08 (same in my rerun); 23 days; 2,261/23×30 ≈ 2,950 |
| 17 | verified | /var/lib/goatcounter not readable by `agent`; post says it wasn't measured |
| 18 | verified | community-edition README: "At least **2 GB of RAM** is recommended for running ClickHouse and Plausible without fear of OOMs" |
| 19 | verified | docs.umami.is/docs/install: Node.js "version 20.19 or newer", PostgreSQL "minimum v12.14"; no RAM figure |
| 20 | verified | goatcounter.com: "offered for free for reasonable public usage", "self-host it for any purpose"; no prices |
| 21 | verified | plausible.io pricing: Starter $9 at 10k, 30-day trial, no free plan; subscription-plans: Starter one site, single user |
| 22 | verified | subscription-plans: custom events incl. outbound link clicks and file downloads count toward the limit |
| 23 | verified | umami.is/pricing: Hobby $0, 100K events, 1 site, 6 months; Pro $20, 1M, up to 20 sites, 2 years; each stored event property counts as an event |
| 24 | verified | self-hosted page: AGPLv3, CE "published twice a year" |
| 25 | verified | pricing toggle "2 months free"; 9 × 12 = 108 |
| 26 | verified | 1 pageview + 5 events = 6 counted units |
| 27 | verified | self-hosted page: funnels, user journeys, ecommerce revenue goals, SSO, sites API cloud-only; CE "Basic bot filtering"; Cloud "~32K data center IP ranges" |
| 28 | fixed | words verbatim on the page; the post used them without quote marks, so I quoted and linked them (see row 53) |
| 29 | verified | my curl of all three scripts and `buffermint-brand/dist/analytics.js`: 2,841 / 9,213 / 9,246 / 5,003 B exactly; gzip within the header's file-name bytes (see note above) |
| 30 | verified | goatcounter.com: "adds just ~3.5KB of extra data" |
| 31 | verified | analytics.js sends `location.pathname`, header comment "never the query string"; referrer only as origin + pathname of an external page |
| 32 | verified | data-policy: "you do not need cookie banners for analytics or to collect consent for tracking" |
| 33 | verified | umami.is/pricing: no cookies or personal data, "No cookie banners required" |
| 34 | verified | help/gdpr HTML: "it should <em>probably</em> be safe to add GoatCounter without a GDPR consent notice" (emphasis in the original); "I am not a lawyer"; no ePrivacy or PECR named |
| 35 | verified | EDPB 2/2023 is on the technical scope of Art. 5(3) ePD |
| 36 | verified | PDF cover: "Adopted on 7 October 2024" |
| 37 | verified | PDF line 192 (para 10): "regardless of whether or not it is personal data" |
| 38 | verified | para 51: "the distribution of the applicative logic (usually a JavaScript code) that constitutes the instruction"; collection "constitutes a 'gaining of access'" |
| 39 | verified | paras 54–55: IP-only tracking; 5(3) applies unless the entity can ensure the IP doesn't come from the user's equipment |
| 40 | verified | para 56: "does not systematically mean that consent needs to be collected"; "in each case it would have to be assessed". "In practice by national regulators" is the post's reading, phrased as such |
| 41 | verified | CNIL sheet 16: inform, allow objection; audience measurement and A/B only; no cross-checking; one publisher; truncate the last byte of the IP; tracer lifetime 13 months |
| 42 | verified | CNIL: "Most large audience measurement offerings do not fall within the scope of the exemption, regardless of their configuration" |
| 43 | verified | Clifford Chance: "Key provisions of the Data (Use and Access) Act … came into effect on 5 February 2026"; statistical cookies listed, opt-out still required |
| 44 | verified | ICO: "sole purpose", "with a view to making improvements", "clear and comprehensive information", "'simple and free' means to object", "a processor, not a joint controller", aggregate statistics |
| 45 | verified | buffermint-pages/functions/stats/count.js `forward()`: "Never the Referer … and never cookies" |
| 46 | verified | /etc/caddy/sites/buffermint.caddy, stats host `log` block: query string, Referer and cookies removed |
| 47 | verified | sentence removed; `#bm-nostats` not in the post |
| 48 | verified | count.js OUR_TRAFFIC userAgents: Lighthouse, Chrome-Lighthouse, HeadlessChrome, PTST, Playwright, Puppeteer; IP list |
| 49 | verified | all three pricing pages read 2026-11-14 show the stated prices |
| 50 | verified | GitHub releases API: plausible/analytics v3.2.1 (2026-05-15), umami v3.5.0 (2026-11-12) |
| 51 | verified | none of the sessions page, data policy, Umami pricing or collection-session.ts mentions truncating the IP; all use the full IP |
| 52 | verified | GitHub license API for umami-software/umami: MIT |
| 53 | verified | self-hosted page: "infrastructure you maintain, not software you install once" |

Copying: the distinctive sentences I compared (the visitor-ID explanations, the CNIL and ICO condition lists, the EDPB paragraphs) are paraphrased; the verbatim phrases are short, quoted and linked.

## Editor

Read as the target reader: a small-SaaS founder choosing a privacy-friendly analytics tool who wants to know the cost, the running effort and whether a banner is still needed.
- **New angle is real.** Our own GoatCounter footprint and per-hit latency from the live server, the "how long is one visitor" comparison (Umami's read from its source code, which no docs page states), script weights measured the same way the same day, and the consent picture from primary sources including the UK's February 2026 change. Not generic and not one-source: 8 publishers (GoatCounter, Plausible, Umami, GitHub, EDPB, CNIL, ICO, Clifford Chance) plus our data.
- **Changed:** quoted and linked Plausible's "infrastructure you maintain…" phrase (it was verbatim without quote marks); Umami's licence row now says MIT instead of a vague "open source". Both are small; the argument stands.
- **Kept:** the opening answers the question (cookieless ≠ no consent question in the EU) in its first paragraph; each section earns its place; the checklist is concrete and says it isn't legal advice. Tool links (privacy policy generator, UTM builder) genuinely help those steps; the CWV link is a real related post.
- **Public copy:** neutral. No unreleased products, no funnel; only the free tools and an earlier post are linked. The post doesn't claim our site meets its own checklist (no privacy page yet; handed to the coordinator as a Later item).
- **Dates:** dated 2026-11-14 (9 days after the previous post; passes the 2+ days rule). Prices "as of November 2026", our measurements dated 14 November, regulator documents with their adoption or effect dates.
