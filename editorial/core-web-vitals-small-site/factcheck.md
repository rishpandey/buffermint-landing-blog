# Fact-check: core-web-vitals-small-site

Review lane t-20261104-blog-post-review, 2026-11-14. Every row of `claims.md` checked: each URL opened on 2026-11-14 and compared with the post; every `ours:` number recomputed. `node bench/analyse.mjs` over `lighthouse.jsonl` (105 rows) and `lighthouse-devtools.jsonl` (36 rows) reproduces `results.tsv` and `results-devtools.tsv` byte for byte, and every cell of both tables in the post matches them (rounded to 0.01 s / whole ms / whole KB). Build dates from `git log` on the seven commits. `content-factcheck.json` read first: its 4 blockers are `ours:` numbers (141 runs, 1,600 px, 1,124 KB), all verified below.

| # | Verdict | Evidence |
|---|---|---|
| 1 | verified | results.tsv home b0 6079 → b6 1861 ms; results-devtools.tsv 2485 → 2367 ms |
| 2 | verified | 40d42bb 2026-10-24, 06f8a4e 2026-11-04: eleven days |
| 3 | verified | post simulated 5479 → 2159 (−61%), DevTools 6363 → 3120 (−51%); TBT ≤8 ms simulated, 49–53 ms DevTools at build 7 |
| 4 | fixed | DevTools build 6 TBT is 62/71/53 ms, not "about 50"; post now says "53 to 71 ms". Simulated post TBT only fell 241 → 196 at build 4/5, so "fell for good at build 4" became "fell at build 4 and almost vanished at build 6" |
| 5 | verified | max median CLS 0.003 (rounded 0.000 in tsv); max single run over all 141 rows 0.00501 |
| 6 | verified | web.dev/articles/vitals: "within 2.5 seconds", "200 milliseconds or less", "0.1. or less", "75th percentile of page loads, segmented across mobile and desktop devices"; updated 31 Oct 2024 |
| 7 | verified | web.dev/blog/inp-cwv-march-12: replaces FID on March 12; figure caption "March 12, 2024" |
| 8 | verified | performance-scoring page, Lighthouse 10 table: FCP 10, SI 10, LCP 25, TBT 30, CLS 25 |
| 9 | verified | web.dev/articles/tbt: "A low TBT often correlates with a low Interaction to Next Paint (INP)"; "not a substitute for INP in and of itself"; updated 15 Oct 2025 |
| 10 | verified | lab-and-field page: lab tests "cannot accurately predict when users will choose" to interact |
| 11 | verified | CrUX methodology: "minimum number of visitors"; "An exact number is not disclosed" |
| 12 | verified | CrUX API: "28-day rolling average of aggregated metrics" |
| 13 | verified | BLOG-PLAN.md "Our own traffic": 530 counted pageviews, 23–29 Oct 2026, GoatCounter log |
| 14 | verified | web.dev/articles/inp contains the exact sentence; updated 2 Sep 2025 |
| 15 | verified | lab-and-field: "A single device", "single network", "single geographic location", "cold cache"; DebugBear: waits for load instead of scrolling, doesn't use forms or buttons |
| 16 | verified | DebugBear (updated 23 Jan 2026): default settings "very slow"; "Typically the lab metrics are worse than the real user data" |
| 17 | verified | every jsonl row has lh 13.5.0, Chrome/156.0.0.0; 105 + 36 = 141 rows |
| 18 | verified | variability.md: "The median Lighthouse score of 5 runs is twice as stable as 1 run" |
| 19 | verified | git log dates: 5a0b2e3^ (=40d42bb) 24 Oct, 5a0b2e3 24 Oct, fd33e24 25 Oct, 2368247 25 Oct, c2a29e1 27 Oct, d1da61d 28 Oct, 06f8a4e 4 Nov |
| 20 | verified | 478,685 → 104,398 B (−374,287 B = 374 KB) as recorded; commit 2368247 message says 469 → 104 KB in its own units, consistent |
| 21 | verified | commit d1da61d message: "main.js 123,549 -> 18,741 B" (the bench's c2a29e1 build measured 123,436 B); both round to 123 KB → 19 KB; STATUS.md line 83: live main.js 18,741 B |
| 22 | verified | all 21 rows of the simulated table and 12 rows of the DevTools table match the tsv files |
| 23 | verified | lighthouse.jsonl post imgs: photo-1507332194683 jpeg 380,163 B (b0), 209,465 B (b1), .webp 145,740 B (b4); b6 cover webp 20,667 B; b0–b5 LCP element section.py-12 / jarallax container, b6 `picture > img.post-cover` |
| 24 | verified | 5479 − 4219 = 1260 ms; 3152 − 2853 = 299 ms; b1 also shrank 10-micro-saas-ideas.jpeg 232,918 → 106,955 B ("a second image") |
| 25 | fixed | jsonl b1 vs b2: **three** related-article card images stopped loading (61,794 + 106,955 + 11,376 = 180,125 B), not two. Post now says "Three card images" and "All three"; also says they gained a WebP `<picture>` source, since fd33e24's PostProcessHtml wraps them as well as adding width/height |
| 26 | verified | lazy-loading page: "image dimensions default to 0×0 pixels"; "the browser decides to load everything"; thresholds 1250 px (4G), 2500 px (3G or lower) |
| 27 | fixed | home DevTools LCP = FCP in all four builds; About LCP is 0.07–0.11 s after FCP, and DevTools ran 4 builds, not every build. Post now says "with the first paint or within about a tenth of a second of it … in all four builds we tested that way" |
| 28 | verified | our WebP post: "one PNG made up 504 KB … a logo beside a testimonial … displayed 32 pixels tall", and its two-mode table disagreeing; jsonl b0 shas-logo.png 503,938 B transferred |
| 32 | verified | STATUS.md Vue removal entry (2026-10-28, d1da61d "Blog search in plain JS, Vue 2 removed") |
| 33 | verified | results.tsv fcp: home and post 1352–1355 ms, About 1652–1655 ms, all 7 builds |
| 35 | verified | page-experience page: "Core Web Vitals are used by our ranking systems."; "even if the page experience is sub-par"; "may not be the best use of your time" |
| 36 | verified | Almanac 2025 performance (published 2026-01-15, July 2025 data): 48% mobile pass; LCP 62%, INP 77%, CLS 81%; median mobile TBT 1,916 ms, "up 58% from 1,209 milliseconds in 2024" |
| 37 | verified | results-devtools.tsv post b0 TBT 521 ms, the highest median in either file |
| 38 | verified | home simulated b0–b5 6079 … 4581 ms (4.6–6.1 s), b6 1861 ms |
| 39 | verified | throttling.md: simulation "based on the data observed in the initial unthrottled load", "inherent inaccuracy" |
| 40 | verified | results-devtools.tsv post 6363 → 3120 ms; 3.12 s > 2.5 s |
| 41 | verified | results-devtools.tsv mainthread post b0 2586, b5 1827 ms |
| 42 | verified | DevTools home score 81 → 94; LCP 2485 → 2495, FCP 2485 → 2495, SI 2492 → 2502, CLS 0: only TBT (493 → 62) moved |
| 43 | verified | results.tsv css_kb 49 → 40 (home), 49 → 41 (About, post) at b3; FCP 1353 unchanged |
| 44 | verified | largest FCP change in either mode is home DevTools 2485 → 2367 ms (0.12 s) |
| 45 | verified | results.tsv home total_kb b5 682, b6 144 |
| 46 | verified | Lighthouse 13.5.0 default-config.js lines 419–423: FCP 10, LCP 25, TBT 30, CLS 25, SI 10 (added by this review: "since Lighthouse 10" holds for the version we ran) |
| 47 | verified | shas-logo.png first added 2021-07-01 (added by this review) |

Copying: the five external quotes are each under 25 words, attributed and linked; I compared the post's paraphrases of web.dev (lab vs field, lazy loading), DebugBear and the throttling doc with the fetched source text: no sentence follows a source's wording. The bench sections are written from our own data.

## Editor

Read as the target reader: a founder with an orange PageSpeed score and no field data.
- **New angle is real.** Seven builds from our own git history, 141 Lighthouse runs in two throttling modes, all raw runs committed and reproducible. The two-mode split (text LCP flat under DevTools throttling while simulated claims 6.1 → 1.9 s; image LCP and TBT improving in both) isn't in any of the sources. Not generic, not one-source: 6 publishers plus our data.
- **Changed:** the card-image count (two → three) and the note that they also gained a WebP source; "about 50 ms" → "53 to 71 ms" (the build 6 numbers); "fell for good" → "fell … and almost vanished" (the simulated post TBT only fell 241 → 196 at builds 4–5); text LCP "with the first paint … in every build" → "within about a tenth of a second … in all four builds we tested that way". Each is a precision fix; the argument stands.
- **Kept:** the opening answers the question in its first paragraph; each section earns its place; the closing checklist is concrete and tied to what we measured. The internal tool links (resize, compress, JS minifier, CSS/HTML minifier) genuinely help those steps.
- **Public copy:** neutral. No products, no funnel; only the free tools and an earlier post are linked.
- **Dates:** dated 2026-11-05 (the owner kept it, 2026-11-14), two days after the WebP post. Our numbers are dated ("November 2026", "23 to 29 October 2026"); the Almanac figures carry "July 2025"; source pages carry their update dates. Nothing in the post goes stale by being read after 5 Nov.
