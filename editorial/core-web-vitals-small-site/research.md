# Research: Core Web Vitals on a small marketing site

## Question
Reader: a SaaS founder or small-site owner who ran PageSpeed Insights, saw a red or orange score, and wants to know what to fix first and whether it matters for search. Most of them have a site too small for Google to have field data on.

Target keyword: `core web vitals`. Demand from `keywords.json` (Content studio, 2026-11-04): band high on Google and Bing autosuggest, best rank 1, score 100; 91 related phrases. The Wikipedia article it matched is "Web performance": 6,434 views a month on average, 3.3 times the period before (October 2026 alone was 16,880, a spike we can't explain, so the post doesn't use it). Autosuggest shows that phrases are searched, never how often, so the post gives no volume. Phrases that fit this post: "core web vitals vs lighthouse", "core web vitals field data vs lab data", "why core web vitals assessment failed", "how to improve core web vitals", "does core web vitals affect seo".

Why topic 14: topic 12 (EXIF) is still blocked on logged-in accounts for 8 apps; 13 is published; 14 is the next `next` topic.

## Sources
- https://web.dev/articles/vitals : the three metrics are LCP, INP and CLS; good is LCP within 2.5 s, INP 200 ms or less, CLS 0.1 or less, judged at the 75th percentile of page loads, mobile and desktop separately. Updated 2024-10-31.
- https://web.dev/articles/inp : INP good ≤200 ms, needs improvement to 500 ms, poor above; best measured in the field; the page itself says "It's entirely possible, however, that you don't have field data." Updated 2025-09-02.
- https://web.dev/blog/inp-cwv-march-12 : INP replaced FID as a Core Web Vital on 12 March 2024 (Wagner, Viscomi).
- https://web.dev/articles/tbt : TBT sums the part of each main-thread task over 50 ms between FCP and TTI; aim under 200 ms on average mobile hardware; a low TBT "often correlates" with a low INP, but it is a lab proxy, not a substitute. Updated 2025-10-15.
- https://web.dev/articles/lab-and-field-data-differences : lab is one device, one network, one location, cold cache; field LCP can be faster from cache and bfcache; lab CLS covers only shifts during load; TBT misses some causes of INP.
- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring : Lighthouse 10+ weights: FCP 10%, SI 10%, LCP 25%, TBT 30%, CLS 25%; scores come from log-normal curves fitted to HTTP Archive data (25th percentile = 50, 8th percentile = 90); treat the score as a distribution.
- https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md : "The median Lighthouse score of 5 runs is twice as stable as 1 run"; resource contention and concurrent runs add variance; use the median.
- https://developer.chrome.com/docs/crux/methodology : pages and origins enter the Chrome UX Report only above a popularity threshold that Google doesn't publish, and only if indexable; below it they are left out.
- https://developer.chrome.com/docs/crux/api : 28-day collection period, updated daily; needs a Google Cloud API key.
- https://developers.google.com/search/docs/appearance/page-experience : "Core Web Vitals are used by our ranking systems"; Google shows the most relevant content "even if the page experience is sub-par"; a perfect score for SEO reasons "may not be the best use of your time".
- https://developers.google.com/search/docs/appearance/core-web-vitals : good CWV recommended "for success with Search".
- https://almanac.httparchive.org/en/2025/performance : July 2025 data; 48% of mobile and 56% of desktop sites pass all three; mobile good LCP 62%, INP 77%, CLS 81%; median mobile TBT 1,916 ms (+58% on 2024), desktop 92 ms. Published 2026-01-15.
- https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data : vendor (sells monitoring), updated 2026-01-23. Lighthouse's mobile profile is slower than most real connections, always cold, one location, no scrolling or clicks; says Lighthouse "shows how the slowest 5% - 10%" experience a site, against the 75th percentile in the field.

## Disagreements
- **Lab vs field, which is worse?** web.dev says field LCP is often better than lab because of caches and bfcache; DebugBear agrees on the network side but notes low-end devices can make field data worse. Both agree the lab result is not what Google ranks on.
- **How much CWV matters for ranking.** Google's own pages say both "used by our ranking systems" and that relevance wins even with sub-par experience. The older ranking-correlation studies (Searchmetrics, Perficient 2021) predate INP and use FID; we could not open the Perficient page (HTTP 429) or the Search Engine Land AI-visibility study (403), so the post cites none of them and leans on Google's statements.
- **The score vs the vitals.** Lighthouse's score weights TBT at 30%, but TBT is not a Core Web Vital; INP is, and Lighthouse can't measure it on a page load. A page can gain score points on TBT that no field metric shows, which is our case.

## New angle
Our own history, measured under one setup (bench/): buffermint.com rebuilt at seven commits from 2026-10-24 to today's main, each served the same way, Lighthouse 13.5.0 mobile (simulated throttling), home, About and one post whose text never changed, 5 runs each, medians. That splits our own changelog into what moved which metric. Plus: no field data exists for a site our size (below CrUX's threshold), so the lab is all a small site has, and we show which lab numbers to trust.

## Outline
- Opening: answer. What moved ours, in one line each; what didn't.
- The three vitals, and the score that isn't one of them (TBT, weights).
- Why a small site gets no field data (CrUX threshold, 28 days), and what to use instead.
- What we tested: seven builds, pages, tool, limits.
- Results table: score, LCP, TBT, CLS, bytes by build.
- What moved: each change with its numbers.
- What didn't move, and why.
- Does it matter for search: Google's words.
- A checklist for a small site, in order.
- Sources.
