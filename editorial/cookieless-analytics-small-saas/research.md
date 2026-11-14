# Research: cookieless analytics for a small SaaS (GoatCounter vs Plausible vs Umami)

## Question
Reader: a founder of a small SaaS or a small site who wants visitor numbers without Google Analytics and without a consent banner, and is choosing between the three best-known open-source, cookie-free tools. They need to know: what each costs at small-site traffic, what self-hosting really takes, what "cookieless" does and doesn't mean for the consent rules in the EU and the UK, and what numbers they give up.

Target keyword: `cookieless analytics`. Demand from `keywords.json` (Content studio, run 2026-11-14): band high, score 100, best rank 1, suggested on both Google and Bing (7 lists); `cookieless web analytics` the same (high, 100, both engines). Related: `google analytics cookieless` (high, 64, Bing), `best cookieless analytics` (medium, 55, Google, commercial intent), `cookieless analytics free` (medium, 49), `cookieless analytics tools` (medium, 48). Content studio found no matching Wikipedia article ("Customer data platform" was off-topic and ignored), so there's no topic-interest figure. Autosuggest proves the phrases are typed, never how often, so the post gives no volume. BLOG-PLAN.md also has `plausible analytics` at level 4 with 44 HN mentions (2026-10-29).

Why topic 15: topic 12 is still blocked (needs logged-in accounts on 8 apps); 13 and 14 are published; 15 is the next `next` topic.

## Sources
- https://plausible.io/data-policy (read 2026-11-14; page says updated November 2026): visitor ID = hash(daily_salt + website_domain + ip_address + user_agent); salt "rotated and deleted every 24 hours"; raw IP and UA never stored; country/region/city derived from IP. Claims no banner or consent needed; names PECR among the rules it complies with.
- https://plausible.io/#pricing (read 2026-11-14): Starter $9/month up to 10k monthly pageviews; Growth $14 and Business $19 (prices shown at the 10k tier); 30-day trial, no card; yearly billing gives 2 months free. The page doesn't list higher-tier prices in text.
- https://plausible.io/docs/subscription-plans (read 2026-11-14): pageviews and custom events (outbound clicks, downloads, form submissions, 404s, manual events) all count toward the monthly limit; Starter is one site, one user; funnels and Stats API only on Business.
- https://plausible.io/self-hosted-web-analytics (read 2026-11-14): Community Edition is AGPLv3, released twice a year; funnels, user journeys, ecommerce revenue goals, SSO and the sites API not in CE; CE gets basic bot filtering while Cloud also excludes ~32K data-centre IP ranges; "infrastructure you maintain, not software you install once".
- https://github.com/plausible/community-edition (read 2026-11-14; v3.2.1, released 2026-05-15 per the GitHub releases API): "At least 2 GB of RAM is recommended for running ClickHouse and Plausible without fear of OOMs"; CPU must support SSE 4.2 or NEON (ClickHouse); Docker Compose.
- https://umami.is/pricing (read 2026-11-14): Hobby $0, 100K events/month, 1 site, 6 months retention; Pro $20, 1M events, up to 20 sites, 2 years, $0.00003 per extra event; Business $200, 10M events, 5 years. Each pageview and each stored event property counts as an event. Cloud servers in the US and EU.
- https://docs.umami.is/docs/install (read 2026-11-14): self-host needs Node.js 20.19+ (22 LTS recommended) and PostgreSQL 12.14+; no RAM figure.
- https://github.com/umami-software/umami (read 2026-11-14; latest release v3.5.0, 2026-11-12): `src/lib/collection-session.ts` builds the session ID as uuid(websiteId, ip, userAgent, salt, …); `src/lib/crypto.ts` `getSalt`: unset SALT_ROTATION = monthly rotation (day/week/month configurable, or a fixed string = no rotation).
- https://www.goatcounter.com/help/sessions (read 2026-11-14): session key = concat(siteID, User-Agent, IP), kept in memory mapped to a random UUID for 8 hours; IP and UA "never stored to the database or disk"; sessions can be turned off.
- https://www.goatcounter.com/help/gdpr (read 2026-11-14): "should probably be safe" without a GDPR consent notice; legitimate interest; author says "I am not a lawyer"; the page doesn't discuss ePrivacy.
- https://www.goatcounter.com/ (read 2026-11-14): hosted service free "for reasonable public usage"; open source, self-host for any purpose; "~3.5KB" claim. Latest release v2.7.0 (2025-12-15, GitHub releases API), the version we run.
- https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications (read 2026-11-14; dated 11 June 2020): consent exemption for audience measurement if users are informed and can object, purpose limited to audience measurement/A/B testing, no cross-checking with other data, scope limited to one publisher, last byte of the IP truncated, tracker lifetime ≤13 months; "Most large audience measurement offerings do not fall within the scope of the exemption."
- https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf (read 2026-11-14; Guidelines 2/2023 v2.0, "Adopted on 7 October 2024"): Art. 5(3) ePD covers information "regardless of whether or not it is personal data" (para 10, quoting the CJEU); for dynamically built tracking pixels the JavaScript is the instruction and collecting the identifiers is "gaining of access" (para 51); IP-only tracking can fall under 5(3) unless the entity can ensure the IP doesn't come from the user's equipment (para 55); applicability "does not systematically mean that consent needs to be collected" (para 56).
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/ (read 2026-11-14): UK statistical-purposes exception (PECR Schedule A1): sole purpose collecting statistics to improve the service; clear and comprehensive information; a "simple and free" means to object; third parties only as processors; aggregate output.
- https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2026/02/key-aspects-of-the-data--use-and-access--act-take-effect.html (read 2026-11-14): the cookie consent change for statistical cookies took effect on 5 February 2026; an opt-out is still required.

Our own data (2026-11-14, buffermint-vps):
- goatcounter.service: GoatCounter v2.7.0 (go1.25.5), SQLite, running since 2026-10-24 (20 days 15 h). `ps` RSS 23,164 KB; systemd: memory 33.3M now, peak 83.4M, under a MemoryMax of 150M we set; CPU 29 min 45 s total; binary 29,273,880 bytes. VPS: 6 cores, 11.4 GiB RAM, shared with every other service. Database size not measured (data folder isn't readable by the lane's account).
- `/var/log/caddy/stats.log` (python3 -I over the JSON log, 2026-10-23 to 2026-11-14): 2,292 `/count` requests, 2,261 answered 2xx; GoatCounter answered in a median 3.11 ms, p95 7.98 ms, p99 16.72 ms. Busiest day 464 hits (8 Nov), median day 48. Our Caddy filter strips the whole query string, the Referer and cookies from that log since 23 Oct, so paths aren't in it.
- Our Pages Function proxy (`buffermint-pages/functions/stats/count.js`) drops our server's IPs and Lighthouse/headless/Playwright/Puppeteer user agents before GoatCounter, forwards only p/t/r/e/s/b/rnd and UA/Accept/Accept-Language/IP, never the Referer or cookies. Our `analytics.js` sends path (no query string), title, referrer and screen width; opt-out with `#bm-nostats` (localStorage, only when asked).
- Script weights fetched 2026-11-14 with curl, gzip -9: gc.zgo.at/count.js 9,213 B (3,329 gz); plausible.io/js/script.js 2,841 B (1,295 gz); cloud.umami.is/script.js 9,246 B (4,144 gz); our analytics.js 5,003 B (2,145 gz).

## Disagreements
- **Is "cookieless" enough to skip consent?** The three vendors say yes or "probably" (GoatCounter hedges: "should probably be safe", "I am not a lawyer"; Plausible and Umami say no banner is needed). The EDPB says Art. 5(3) is about any information read from the device, not cookies, and covers JavaScript-built beacons and even IP-only tracking (paras 51, 55); it leaves exemptions to national authorities (para 56). So the honest answer: in the EU it depends on the national regulator's exemption for audience measurement, which the CNIL grants under conditions (inform, opt-out, one site, no cross-checking, IP truncated). The vendors talk about GDPR; the ePrivacy question is separate and they mostly skip it.
- **The UK moved.** Since 5 Feb 2026 PECR has a statistical-purposes exception (ICO; Clifford Chance), so in the UK first-party analytics needs information and a simple opt-out, not consent. Older UK guides saying "analytics cookies need consent" are out of date.
- **Unique visitors don't mean the same thing.** GoatCounter: same IP+UA within 8 hours; Plausible: within a UTC day (daily salt); Umami: within a calendar month by default (monthly salt). Same traffic, different "visitors". Vendors present each as "unique visitors".
- **Self-hosting effort.** Plausible says self-hosting is a real commitment and recommends 2 GB RAM; Umami needs Node + Postgres; GoatCounter is one binary with SQLite. Our measurement shows GoatCounter at ~33 MB, which supports the light end, but at our small traffic only.

## New angle
1. Our measured GoatCounter footprint on a shared VPS over 20 days (RAM, peak, CPU, latency per hit, traffic handled), against Plausible CE's documented 2 GB recommendation and Umami's Node + Postgres stack.
2. A table of how long each tool treats one person as one visitor (8 h / 1 day / 1 month), read from docs and Umami's source, and what that does to a monthly "unique visitors" figure.
3. Script weights measured the same way on the same day.
4. A cost table at small-site traffic (our ~3,000 hits a month, then 10k and 100k), from the pricing pages, with the caveat that Plausible counts events and Umami counts event properties.
5. The consent picture as of Nov 2026, from primary sources: EDPB 2/2023 v2.0 (cookieless is still in Art. 5(3) scope), CNIL's exemption conditions, the UK's Feb 2026 exception. Plus what we do: no query string, no Referer, own traffic dropped, an opt-out.

## Outline
- Opening: the answer. All three avoid cookies, none of them makes the consent question disappear in the EU; pick by how you want to run it. Our GoatCounter numbers in one line.
- What "cookieless" means in each tool: the visitor ID table (inputs, how long, stored or not).
- What our GoatCounter costs to run: the measured footprint.
- Self-host or pay: cost table at three traffic levels and the self-host requirements.
- Script weight: measured table.
- Do you still need a banner? EU (ePrivacy, EDPB, CNIL conditions) and UK (Feb 2026 exception). A checklist.
- What these tools can't tell you: no cross-day identity (Plausible), no returning-visitor accuracy, referrers lost, ad blockers, bots; what we did about our own traffic.
- Which to pick: three short cases.
- Sources.
