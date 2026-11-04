# Claims: core-web-vitals-small-site

Bench files are in `editorial/core-web-vitals-small-site/bench/`: `build.sh` (seven builds), `lh.sh` + `lh-run.mjs` (simulated runs, `lighthouse.jsonl`), `lh-devtools.sh` (DevTools runs, `lighthouse-devtools.jsonl`), `analyse.mjs` (medians, `results.tsv`, `results-devtools.tsv`).

| # | Claim (as written in the post) | Source | What the source says |
|---|---|---|---|
| 1 | Home LCP 6.1 s → 1.9 s (simulated); 2.49 → 2.37 s (DevTools) | ours: bench/results.tsv and bench/results-devtools.tsv, rows `/ b0-start`, `/ b6-main` | 6079 → 1861 ms; 2485 → 2367 ms |
| 2 | in eleven days | ours: `git log -1 --format=%ad 40d42bb` (2026-10-24) and 06f8a4e (2026-11-04) | 24 Oct to 4 Nov |
| 3 | Post LCP fell by half in both modes; TBT dropped to almost nothing in both | ours: results.tsv post 5479 → 2159 ms; results-devtools.tsv post 6363 → 3120 ms; TBT columns | simulated 146–361 → ≤8 ms; DevTools 456–521 → 49–53 ms |
| 4 | Start → build 6: TBT 456–521 → about 50 ms (DevTools), 146–361 → under 10 ms (simulated); image builds bounce 175–361 ms on the post; falls for good at builds 4 and 6 | ours: results-devtools.tsv, results.tsv TBT columns | DevTools 493/456/521 → 62/71/53; simulated 295/146/361 → 2/7/3; post b0–b4: 361, 175, 314, 241, 196 |
| 5 | Median CLS 0 to 0.003 in both modes; no single run above 0.005 | ours: results.tsv, results-devtools.tsv cls; max over all 141 rows of both jsonl files | max median 0.003; max run 0.00501 |
| 6 | LCP, INP, CLS; good = 2.5 s, 200 ms, 0.1; 75th percentile; mobile and desktop separately | https://web.dev/articles/vitals | "within 2.5 seconds", "200 milliseconds or less", "0.1 or less", "75th percentile of page loads, segmented across mobile and desktop" |
| 7 | INP replaced FID on 12 March 2024 | https://web.dev/blog/inp-cwv-march-12 | "will replace First Input Delay on March 12" (2024) |
| 8 | Lighthouse 10+ weights: TBT 30%, LCP 25%, CLS 25%, FCP 10%, SI 10% | https://developer.chrome.com/docs/lighthouse/performance/performance-scoring | weights table for Lighthouse 10 |
| 9 | TBT "often correlates" with good INP; not a substitute | https://web.dev/articles/tbt | "a low TBT often correlates with a low INP"; lab proxy, not a substitute |
| 10 | Lighthouse can't measure INP on a page load (no clicks) | https://web.dev/articles/lab-and-field-data-differences | lab tests can't predict when users interact, so can't measure INP directly |
| 11 | CrUX inclusion needs a popularity threshold Google doesn't publish | https://developer.chrome.com/docs/crux/methodology | minimum number of visitors; the exact number is not disclosed |
| 12 | CrUX data covers a 28-day window | https://developer.chrome.com/docs/crux/api | "28-day rolling average of aggregated metrics" |
| 13 | 530 counted pageviews in the week of 23–29 Oct 2026 | ours: BLOG-PLAN.md "Readers and what they use" (GoatCounter log count, own and headless traffic excluded) | "530 counted pageviews in 7 days" |
| 14 | web.dev INP quote "It's entirely possible, however, that you don't have field data." | https://web.dev/articles/inp | same sentence |
| 15 | Lab = one device, one network, one location, empty cache; no scroll or click | https://web.dev/articles/lab-and-field-data-differences ; https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data | "a single device", "a single network", "a single geographic location"; cold caches; DebugBear: doesn't scroll or interact |
| 16 | Lighthouse's mobile network profile is slower than most real connections, so lab LCP tends to look worse | https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data | default mobile profile much slower than typical connections; lab often worse for LCP |
| 17 | Lighthouse 13.5.0, Chrome 156, 105 simulated runs (median of 5), 36 DevTools runs (median of 3), 141 in all | ours: lighthouse.jsonl `lh`, `chrome` fields; `wc -l` = 105 | "13.5.0", "Chrome/156.0.0.0" |
| 18 | Median of 5 runs recommended | https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md | "The median Lighthouse score of 5 runs is twice as stable as 1 run" |
| 19 | Build dates 24, 24, 25, 25, 27, 28 Oct, 4 Nov | ours: `git log -1 --date=short` for 40d42bb, 5a0b2e3, fd33e24, 2368247, c2a29e1, d1da61d, 06f8a4e | as listed |
| 20 | vendor.js 479 KB → 104 KB; dropped 374 KB | ours: build files `assets/build/js/vendor.js` in b0 and b3 | 478,685 B → 104,398 B |
| 21 | main.js 123 KB → 19 KB | ours: `assets/build/js/main.js` b4 vs b5 | 123,436 B → 18,741 B |
| 22 | Results table (all cells) | ours: bench/results.tsv | medians as printed |
| 23 | Post LCP element: parallax background set by a script; 380 → 209 → 146 KB; today a 21 KB `<img>` | ours: lighthouse.jsonl `lcpEl` and `imgs` for the post, i=0, b0/b1/b4/b6 | photo-1507332194683 jpeg 380,163 B, 209,465 B; .webp 145,740 B; cover-d3f524-1200.webp 20,667 B, selector `picture > img.post-cover` |
| 24 | Cap: −1.26 s; WebP covers: −0.30 s; post LCP now 2.16 s | ours: results.tsv post rows | 5479→4219; 3152→2853; 2159 ms |
| 25 | WebP build −0.47 s on the post; two card images (about 180 KB) stopped loading; only `width`/`height` changed on their tags | ours: results.tsv post b1→b2 (4219→3754 ms; img 398→218 KB); built HTML of b1 and b2 for the post | the two `<img>` tags differ only by `width`, `height`, `data-dim` |
| 26 | 0×0 images can make the browser load everything; Chrome loads lazy images within a distance of the viewport | https://web.dev/articles/browser-level-image-lazy-loading | images default to "0×0 pixels", browser may "decide to load everything"; thresholds 1250 px / 2500 px |
| 27 | Home and About LCP elements are text; with DevTools throttling they appear with the first paint at 2.2–2.5 s in every build | ours: lighthouse.jsonl lcpEl (`p.site-lead` on home, text in `#post-container` on About); results-devtools.tsv lcp vs fcp | home LCP 2485/2529/2495/2367 = FCP; About LCP 2202–2240, FCP 2092–2142 |
| 28 | 504 KB PNG logo beside a testimonial, 32 px tall, in our repository since 2021; the two modes disagreed about it in the WebP test | https://buffermint.com/articles/webp-avif-real-site-lcp/ (our earlier post) and b0 build file `assets/build/img/logos/shas-logo.png` | 503,731 B |
| 32 | The full Vue build compiled the page in the browser on every load; only the search box used it | ours: buffermint-landing STATUS.md (Vue 2 removal entry, 2026-10-28) | "main.js shipped the full Vue build … compiled every page's `<main id="app">` at runtime" |
| 33 | Simulated FCP 1.35 s (home, post), 1.65 s (About) in all seven builds | ours: results.tsv fcp | 1352–1355; 1652–1655 |
| 35 | Google: CWV "are used by our ranking systems"; most relevant content "even if the page experience is sub-par"; perfect score "may not be the best use of your time" | https://developers.google.com/search/docs/appearance/page-experience | same phrases |
| 36 | 2025 Almanac: 48% of mobile sites pass; good LCP 62%, INP 77%, CLS 81%; median mobile TBT 1,916 ms, +58% | https://almanac.httparchive.org/en/2025/performance | as written; July 2025 data |
| 37 | Our worst build's TBT 521 ms in DevTools mode | ours: results-devtools.tsv post b0 | 521 ms |
| 38 | Simulated 4.6–6.1 s home LCP for six builds, 1.86 s at build 7 | ours: results.tsv home b0–b6 | 6079 … 4581; 1861 |
| 39 | Simulated throttling estimates a slow load from a fast one and can be inaccurate | https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md | simulated throttling models a throttled load from an unthrottled one, with "inherent inaccuracy" |
| 40 | DevTools mode: post 6.36 → 3.12 s, still above 2.5 s | ours: results-devtools.tsv post | 6363 → 3120 ms |
| 41 | DevTools: main-thread work on the post 2.59 s → 1.83 s (start → build 6) | ours: results-devtools.tsv mainthread_ms | 2586 → 1827 |
| 42 | DevTools: home score 81 → 94 (start → build 6) with LCP, FCP, CLS flat | ours: results-devtools.tsv home | score 81 → 94; LCP 2485 → 2495; FCP 2485 → 2495; CLS 0 |
| 43 | Build 4 cut stylesheets from 49 to 40 KB transferred; simulated FCP unchanged | ours: results.tsv css_kb, fcp | 49 → 40 (home), 49 → 41; FCP 1353 |
| 44 | First paint barely moved in either mode | ours: results.tsv fcp (1352–1355, 1652–1655); results-devtools.tsv fcp (home 2485 → 2367, About 2092 → 2142, post 2069 → 2084) | largest change 0.12 s |
| 45 | Home weight 682 → 144 KB when the section went (build 6 → 7) | ours: results.tsv total_kb | 682 → 144 |
