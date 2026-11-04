---
title: "Core Web Vitals on a small site: what moved ours, measured"
seo_description: "We rebuilt our site at seven points in its history and ran Lighthouse on each. What moved our Core Web Vitals, what didn't, and which numbers to trust."
keyword: core web vitals
author: Rishabh Pandey
show_meta: true
section: postContent
published: true
date: 2026-11-04
extends: _layouts.post
---

Our home page's Largest Contentful Paint (LCP) went from 6.1 seconds to 1.9 in eleven days, and its Lighthouse score from 72 to 99. Most of that gain came from deleting one old section of the page. The JavaScript work we spent the most care on took Total Blocking Time to zero but moved LCP by a fraction of a second. And one of the three Core Web Vitals, layout shift, never needed fixing at all.

We know which change did what because we rebuilt buffermint.com at seven points in its git history, served each copy the same way, and ran Lighthouse on all of them. This post gives the numbers, explains the one thing a small site can't measure, and ends with the order we'd fix things in next time.

## The three vitals, and the score that isn't one of them

Google's [Core Web Vitals](https://web.dev/articles/vitals) are three measurements of real visits:

| Vital | Measures | Good |
|---|---|---|
| Largest Contentful Paint (LCP) | when the biggest thing on screen appears | 2.5 s or less |
| Interaction to Next Paint (INP) | how fast the page responds to taps and clicks | 200 ms or less |
| Cumulative Layout Shift (CLS) | how much the layout jumps around | 0.1 or less |

A page passes when it meets all three at the 75th percentile of visits, with phones and desktops judged separately. INP [replaced First Input Delay](https://web.dev/blog/inp-cwv-march-12) on 12 March 2024, so older advice that talks about FID is out of date.

The Lighthouse score is a different thing. Since Lighthouse 10 it has been [built from five lab metrics](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring): Total Blocking Time (TBT) 30%, LCP 25%, CLS 25%, First Contentful Paint 10% and Speed Index 10%. TBT carries the biggest weight, and it isn't a Core Web Vital. It is the lab stand-in for INP, which Lighthouse can't measure on a page load because nobody clicks anything. [web.dev's TBT page](https://web.dev/articles/tbt) says a low TBT "often correlates" with a good INP and that TBT is not a substitute for it. So a change can lift your score through TBT while no vital moves. That happened to us.

## A small site gets no field data

Google ranks on field data: what Chrome users actually experienced, collected in the [Chrome UX Report](https://developer.chrome.com/docs/crux/methodology) (CrUX). A page or a whole site only gets into CrUX once it passes a popularity threshold, and Google doesn't publish the number. The data covers a [28-day window](https://developer.chrome.com/docs/crux/api), so even a site that qualifies waits weeks to see a fix show up.

Our site gets a few hundred counted pageviews a week (530 in the week of 23 to 29 October 2026, from our own GoatCounter logs). We don't expect to be anywhere near the threshold. If PageSpeed Insights shows "No Data" in its real-user section for your site, this is why, and the lab numbers below it are all you have. Even [web.dev's INP guide](https://web.dev/articles/inp) allows for this: "It's entirely possible, however, that you don't have field data."

Lab data has known gaps. A Lighthouse run is one device, one network and one location with an empty cache, [as web.dev puts it](https://web.dev/articles/lab-and-field-data-differences). It doesn't scroll or click, so it misses layout shifts lower down the page and anything that happens after a tap. [DebugBear notes](https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data) that Lighthouse's mobile network profile is slower than most real connections, so its LCP tends to look worse than what visitors get. Treat a lab number as a way to compare two versions of your own page, not as your score.

## What we tested

We rebuilt the site at seven commits, from 24 October 2026 to today's version, each one from a clean checkout with the same build tools. Then we served each build from our own server with Brotli compression and ran Lighthouse 13.5.0 (Chrome 156) on mobile settings: three pages, five runs each, 105 runs in all, taking the median as [Lighthouse's variability guide](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md) recommends. The pages were the home page, the About page and one blog post whose text didn't change in that period.

| Build | What changed |
|---|---|
| 1. Start (24 Oct) | the site as it was |
| 2. Image cap (24 Oct) | uploaded images resized to at most 1,600 px wide |
| 3. WebP (25 Oct) | WebP copies offered through `<picture>`, `width` and `height` on images, other markup fixes |
| 4. Vendor trim (25 Oct) | unused libraries dropped: `vendor.js` 479 KB → 104 KB |
| 5. WebP covers (27 Oct) | post cover backgrounds offered as WebP |
| 6. No Vue (28 Oct) | Vue 2 removed: `main.js` 123 KB → 19 KB |
| 7. Today (4 Nov) | new lightweight post covers; an old testimonial section removed from the home page |

The limits: this is lab data from one server, using the default simulated throttling, which estimates a slow phone load from a fast one. We cross-checked four of the builds with throttling applied during the load (below). And builds 3 and 7 bundled several changes each, so for those we name the part that moved the numbers and why we think so.

## The results

Median of five runs per page and build, simulated throttling. Weight is what the page transferred during the test.

| Build | Home: score, LCP, TBT | About: score, LCP, TBT | Post: score, LCP, TBT | Home weight |
|---|---|---|---|---|
| 1. Start | 72, 6.08 s, 295 ms | 87, 3.78 s, 146 ms | 71, 5.48 s, 361 ms | 1,124 KB |
| 2. Image cap | 71, 5.70 s, 330 ms | 87, 3.71 s, 153 ms | 83, 4.22 s, 175 ms | 998 KB |
| 3. WebP | 75, 5.18 s, 257 ms | 89, 3.55 s, 139 ms | 82, 3.75 s, 314 ms | 818 KB |
| 4. Vendor trim | 79, 4.73 s, 210 ms | 96, 2.66 s, 83 ms | 88, 3.15 s, 241 ms | 718 KB |
| 5. WebP covers | 79, 4.73 s, 220 ms | 96, 2.66 s, 81 ms | 92, 2.85 s, 196 ms | 718 KB |
| 6. No Vue | 84, 4.58 s, 2 ms | 97, 2.48 s, 7 ms | 96, 2.70 s, 3 ms | 682 KB |
| 7. Today | 99, 1.86 s, 0 ms | 97, 2.41 s, 7 ms | 99, 2.16 s, 8 ms | 144 KB |

CLS was between 0 and 0.003 in every build on every page.

## What moved LCP

**The post: its biggest image, and how it was loaded.** The post's LCP element was a parallax background photo. A script set it after the page loaded, so the browser couldn't start fetching it early. It weighed 380 KB at the start, 209 KB after the 1,600-pixel cap, and 146 KB as WebP. Each of those steps took time off: 1.26 s for the cap (which also shrank a second image on the page), 0.30 s for WebP. Today the cover is an ordinary `<img>` of 21 KB, and post LCP is 2.16 s.

The WebP build also took 0.47 s off the post without touching that photo, which was still a JPEG in that build. What changed was that two card images further down the page stopped loading during the test, about 180 KB the photo no longer had to share the connection with. Both already had `loading="lazy"`. The only change to their tags was the `width` and `height` we added. [web.dev explains why that matters](https://web.dev/articles/browser-level-image-lazy-loading): an image with no dimensions starts out as 0×0 pixels, so a whole row of them can look as if it fits on screen, and the browser may load them all. With real dimensions, the cards took up their space and fell outside the range Chrome loads ahead. Lazy loading without dimensions can quietly do nothing.

**The home page: one forgotten section.** The home page's LCP element is a paragraph of text, yet its LCP sat at 4.6 to 6.1 seconds for six builds while text first appeared at 1.35 s. In [our WebP test](/articles/webp-avif-real-site-lcp/) we traced most of that to one 504 KB PNG, a client logo beside a testimonial, shown 32 pixels tall. Build 7 removed the testimonial section for content reasons, and home LCP dropped from 4.58 to 1.86 s, with page weight down from 682 to 144 KB. Our WebP post also showed that throttling applied during the load put that saving at a fraction of the simulated figure, so the cross-check below matters.

**JavaScript, a little.** Dropping 374 KB of unused libraries took 0.45 to 0.9 s off LCP on each page. That was the largest LCP gain on the About page, which has no large images.

## What moved TBT, and only TBT

Removing Vue took TBT from 81 to 220 ms down to under 10 ms on all three pages. The full Vue build had been compiling the whole page in the browser on every load, even though only the blog search box used it. Main-thread work on the post fell from 1.2 s to 0.97 s.

The score rose 1 to 5 points. LCP moved by 0.15 to 0.18 s. Users would feel this as a page that answers taps sooner, which is INP, and our lab test can't measure INP. So this is the change most likely to matter for real visitors and the hardest for a small site to prove.

## What didn't move

- **First Contentful Paint** stayed at 1.35 s on the home page and the post, and 1.65 s on About, in all seven builds. Nothing we did touched what blocks the first paint: our stylesheet and fonts.
- **CLS** was never a problem in the lab. Adding `width` and `height` to images is still right, because it stops shifts a real visitor sees while scrolling, but it didn't change a lab number for us.
- **The About page** stopped improving at build 6, at 2.4 to 2.5 s.

## The cross-check

PLACEHOLDER-DEVTOOLS

## Does any of this matter for search?

Some, but less than relevance. Google's page experience documentation says Core Web Vitals ["are used by our ranking systems"](https://developers.google.com/search/docs/appearance/page-experience), and in the same document that it shows the most relevant content "even if the page experience is sub-par". It also says chasing a perfect score just for SEO "may not be the best use of your time". For a small site with no field data, Google can't see your vitals directly anyway. Fix them for the visitors who arrive.

You'd also be in common company with a failing grade. [The 2025 Web Almanac](https://almanac.httparchive.org/en/2025/performance) found 48% of mobile sites passed all three vitals in July 2025. LCP was the one most often missed: 62% had good LCP, 77% good INP and 81% good CLS. It put median mobile TBT at 1,916 ms, up 58% on the year before. Our worst build had a TBT of 361 ms.

## The order we'd fix things in next time

1. **Find your LCP element.** Lighthouse and PageSpeed Insights both name it. Everything else depends on what it is.
2. **Sort the page's requests by size and open the biggest.** Our biggest win was a file nobody had looked at in years. If an image is far larger than it's shown, [resize it](/tools/photo/resize-image/) before you think about formats.
3. **Make the LCP image small and load it early.** A plain `<img>` with `width` and `height`, not a background a script sets. Then compress it; our [image compressor](/tools/photo/image-compress/) runs in the browser.
4. **Stop loading what's below the fold.** Lazy-load images further down, with `width` and `height` set, so they don't compete with the LCP element.
5. **Delete JavaScript you don't use** before you optimize what you keep. It's the main lever on TBT, and so the best lab signal you have for INP. A [JavaScript minifier](/tools/dev/js-minifier/) or a [CSS and HTML minifier](/tools/dev/minifier/) helps once the dead code is gone, but removing it did more for us than minifying would.
6. **Measure each change five times, and the big ones in two throttling modes.** Compare versions of your own page, not one score against a target.
7. **Watch field data once you have it.** When PageSpeed Insights starts showing real-user data, that is the number Google uses.

Our remaining work is the first paint, the one number in our table that never moved.

## Sources

- web.dev: [Web Vitals](https://web.dev/articles/vitals) (the three metrics and thresholds, updated October 2024), [Interaction to Next Paint](https://web.dev/articles/inp) (updated September 2025), [Total Blocking Time](https://web.dev/articles/tbt) (updated October 2025), [Why lab and field data can be different](https://web.dev/articles/lab-and-field-data-differences), and [INP becomes a Core Web Vital on March 12](https://web.dev/blog/inp-cwv-march-12).
- web.dev: [Browser-level image lazy loading](https://web.dev/articles/browser-level-image-lazy-loading) (0×0 images and the distance Chrome loads ahead).
- Chrome for Developers: [Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), [CrUX methodology](https://developer.chrome.com/docs/crux/methodology) and the [CrUX API](https://developer.chrome.com/docs/crux/api).
- Lighthouse on GitHub: [Score variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md).
- Google Search Central: [Understanding page experience](https://developers.google.com/search/docs/appearance/page-experience) and [Core Web Vitals and Search](https://developers.google.com/search/docs/appearance/core-web-vitals).
- HTTP Archive: [Web Almanac 2025, Performance](https://almanac.httparchive.org/en/2025/performance) (July 2025 data, published January 2026).
- DebugBear: [Why does Lighthouse lab data not match field data?](https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data) (updated January 2026; DebugBear sells monitoring).
- Our measurements: seven builds of buffermint.com from its git history, Lighthouse 13.5.0 and Chrome 156 on our server, 105 runs with simulated throttling and 36 with DevTools throttling, November 2026; traffic from our GoatCounter logs.
