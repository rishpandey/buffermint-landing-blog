# Fact-check: webp-avif-real-site-lcp

Review lane t-20261103-blog-post-finish-review, 2026-11-03, a fresh session that didn't write the post. content-factcheck.json read first: all external links 200; its 9 blockers are our own figures, each checked below. Every `ours:` row was rerun (analyse-sweep.js, analyse-outliers.js, analyse-lighthouse.js, plus medians computed directly from all four .jsonl files); every URL was fetched today.

| # | Verdict | Evidence |
|---|---|---|
| 1 | verified | medians rerun: post jpeg/webp 3,003/2,704 ms (lighthouse.jsonl), 4,126/3,748 ms (devtools-post) |
| 2 | verified | home medians 4,580 / 4,581 / 4,579 ms |
| 3 | verified | logo medians: simulated 4,596 to 2,161 ms; DevTools 2,563 to 2,409 ms, 5 runs per label per file |
| 4 | verified | sweep.json: 65 rows, sum 4,265,300 bytes |
| 5 | verified | encode-sweep.mjs SETS and `effort: 4`; sweep.json sharp "0.35.5" |
| 6 | verified | every row `lh` 13.5.0, `chrome` Chrome/156.0.0.0; 5 rows per label and page; four tests listed match the four data sets |
| 7 | verified | wc -l: 60 + 15 + 10 + 10 = 95 |
| 8 | verified | analyse-outliers.js rerun: all 12 rows match (sums, %, median SSIM, bigger counts) |
| 9 | verified | 1,617,097 vs 2,746,302 bytes = 41.1% smaller; SSIM 0.9781 vs 0.9755 |
| 10 | verified | developers.google.com/speed/webp: "25-34% smaller than comparable JPEG images at equivalent SSIM quality index" (fetched 2026-11-03) |
| 11 | verified | analyse-sweep.js t=0.98: n 50, medw 0.3146, w 0.1659, a 0.4956, aw 0.3953; thirds -3.4 / 69.3 / 10.8 |
| 12 | verified | Cloudflare post: "images can reduce to half the size of JPEG and WebP" |
| 13 | verified | shipped 51, 3,779,497 to 2,198,080 bytes = 41.8% |
| 14 | verified | shipped median SSIM 0.97475; 4 below 0.95; worst photo-1555580399 0.886, its w90 0.902, a70 0.951 |
| 15 | verified | product-to-market-fit-feature-image.jpeg 186,891; webp q80 124,846 (0.9675); avif q50 73,218 (0.9680); same files loaded in the post runs |
| 16 | verified | 3,003 / 2,704 / 2,403; 4,126 / 3,748 / 3,507 ms |
| 17 | verified | post lcpEl: section.py-12 (hero) with resourceLoadDelay subpart; the hero image is the only upload over 20 KB loaded |
| 18 | verified | web.dev/articles/lcp: "A good LCP value is 2.5 seconds or less" |
| 19 | verified | throttling.md: "Throughput: 1.6Mbps down / 750 Kbps up", latency 150ms |
| 20 | verified | 20,000 x 8 / 1,638,400 = 97.7 ms; 62,045 x 8 / 1,638,400 = 303 ms |
| 21 | verified | optimize-lcp: shortening load duration "wouldn't actually improve LCP because the time would just shift to the element render delay" |
| 22 | verified | home lcpEl selector p.site-lead |
| 23 | verified | 0 of 15 home runs (jpeg/webp/avif) load an uploads URL; article-card and feature-card `<img loading="lazy">`; built index.html cards use a webp `<source>` |
| 24 | verified | Almanac 2024 Media, Figure 5.4: 68% of mobile pages whose LCP element has an image |
| 25 | verified | imgBytes 556,040; shas-logo 503,938 transferred; `file`: 1467 x 1467; build HTML `height="32"` in site-quote; git first commit 2021-07-01 (39aea61) |
| 26 | verified | logo totals 682,680 and 182,759; 5 rows per label per file |
| 27 | verified | scores 84/99, 93/95 (medians); 154 / 2,435 = 0.063, about a sixteenth |
| 28 | verified | throttling.md: "inherent inaccuracy"; DevTools network throttling "isn't highly accurate" |
| 29 | verified | 682,680 - 182,759 = 499,921; post webp saved 327,033 - 265,051 = 61,982; ratio 8.1 |
| 30 | verified | STATUS.md 2026-10-25 entry: "Lighthouse 12.2.1 ... LCP 10.3 → 7.0 s ... LCP 8.5 → 5.0 s" |
| 31 | verified | fd33e24 (WebP copies, also markup and headings) and 2368247 (vendor.js 469 → 104 KB) |
| 32 | verified | h-before/h-webp/h-vendor: home 5,712/5,183/4,733, post 4,353/3,846/3,080; splits 0.77 and 0.50 s post, 0.53 and 0.45 s home ("about even") |
| 33 | verified | analyse-sweep.js ms/MP 128 and 1,793 (ratio 14.0); the decode note is in the post |
| 34 | verified | caniuse data (Fyrd/caniuse fulldata, 2026-11-03): avif 96.33 + 0.02 partial = 96.35; webp 97.08 + 0.10 = 97.18 |
| 35 | verified | Archibald: AVIF lacks progressive rendering; Cloudflare: AVIF images "don't show anything on screen until they're fully" downloaded |
| 36 | verified | Almanac 2024: JPEG 32.4%, WebP 12%, AVIF 1.0% (mobile) |
| 37 | fixed | added by this review: the post said "almost nothing landed near it"; recomputed per-image savings, 3 of 50 in 25-34%; the post now says so |
| 38 | fixed | added by this review: the opening said "We tested this on buffermint.com"; lh-run.mjs loads 127.0.0.1 copies via serve.mjs, so it now says "copies of buffermint.com, served from our own server" |

Copying: searched two distinctive sentences ("a high setting spends bytes preserving detail the JPEG had already thrown away", "every 20 KB off your LCP image is worth about 0.1 s"): no matches. The figures are our own measurements.

## Editor

Read as the target reader: a small-site owner told to "convert images to WebP".
- The opening answers the question in its first two sentences (it depends on the LCP element) and gives both results. Kept.
- Changed: "We tested this on buffermint.com" claimed a live-site test; it was a lab test of build copies on our server. Now says so up front (the methods section already did).
- Changed: "almost nothing landed near it" was vague; replaced with the counted 3 of 50.
- The new angle is real and not in any source: a 12-setting quality sweep on 65 real images, a one-variable format test on two page types, the logo result with two throttling modes disagreeing 16x, and a retracted figure of our own. Not generic, not one-source (7 external publishers plus our data).
- Public-copy rule: neutral; tool links are practical steps in the how-to list, no funnel language.
- Dates: front matter 2026-11-03 is the day of the last rerun, not in the future; "November 2026" for the tests and "as of November 2026" for Can I use match the bench and read dates; Almanac 2024 is named as the newest chapter read.
- Notes outside the post synced: research.md now gives 0.15 s and the 3.78 to 2.20 MB shipped figures next to the older ones.
