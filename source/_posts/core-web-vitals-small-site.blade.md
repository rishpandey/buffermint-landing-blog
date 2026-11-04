---
featured_image: assets/img/uploads/core-web-vitals-small-site-cover-2d4a31-1200.jpeg
featured_thumbnail: assets/img/uploads/core-web-vitals-small-site-cover-2d4a31-600.jpeg
title: "Core Web Vitals on a small site: what moved ours, measured"
seo_description: "We rebuilt our site at seven points in its history and ran Lighthouse 141 times. What moved our Core Web Vitals, what didn't, and which numbers to trust."
keyword: core web vitals
author: Rishabh Pandey
show_meta: true
section: postContent
published: true
date: 2026-11-05
extends: _layouts.post
---

Lighthouse told us our home page's Largest Contentful Paint (LCP) fell from 6.1 seconds to 1.9 in eleven days. Run a second way, with the slow connection applied during the load, the same pages went from 2.5 seconds to 2.4. Our home page barely changed. What we'd really improved was a blog post, whose LCP fell by half in both modes, and the JavaScript that blocked every page, which both modes saw drop to almost nothing. The third vital, layout shift, never needed fixing.

We know which change did what because we rebuilt buffermint.com at seven points in its git history, served each copy the same way, and ran Lighthouse 141 times. This post gives the numbers, shows which ones a small site can trust, and ends with the order we'd fix things in next time.

## The three vitals, and the score that isn't one of them

Google's [Core Web Vitals](https://web.dev/articles/vitals) are three measurements of real visits:

| Vital | Measures | Good |
|---|---|---|
| Largest Contentful Paint (LCP) | when the biggest thing on screen appears | 2.5 s or less |
| Interaction to Next Paint (INP) | how fast the page responds to taps and clicks | 200 ms or less |
| Cumulative Layout Shift (CLS) | how much the layout jumps around | 0.1 or less |

A page passes when it meets all three at the 75th percentile of visits, with phones and desktops judged separately. INP [replaced First Input Delay](https://web.dev/blog/inp-cwv-march-12) on 12 March 2024, so advice that still talks about FID is out of date.

The Lighthouse score is a different thing. Since Lighthouse 10 it has been [built from five lab metrics](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring): Total Blocking Time (TBT) 30%, LCP 25%, CLS 25%, First Contentful Paint 10% and Speed Index 10%. TBT carries the most weight, and it isn't a Core Web Vital. It stands in for INP, which Lighthouse can't measure on a page load because nobody taps anything. [web.dev's TBT page](https://web.dev/articles/tbt) says a low TBT "often correlates" with a good INP, and that it is no substitute for measuring INP. So your score can rise through TBT while no vital moves.

## A small site gets no field data

Google ranks on field data: what Chrome users actually experienced, collected in the [Chrome UX Report](https://developer.chrome.com/docs/crux/methodology) (CrUX). A page or a site only gets into CrUX once it passes a popularity threshold, and Google doesn't publish the number. The data covers a [28-day window](https://developer.chrome.com/docs/crux/api), so even a site that qualifies waits weeks to see a fix show up.

Our site gets a few hundred counted pageviews a week (530 in the week of 23 to 29 October 2026, from our own GoatCounter logs). We don't expect to be near the threshold. If PageSpeed Insights shows no real-user data for your site, this is why, and the lab numbers under it are all you have. Even [web.dev's INP guide](https://web.dev/articles/inp) allows for this: "It's entirely possible, however, that you don't have field data."

Lab data has known gaps. A Lighthouse run is one device, one network and one location, starting with an empty cache, [as web.dev puts it](https://web.dev/articles/lab-and-field-data-differences). It doesn't scroll or tap, so it misses layout shifts further down and anything that happens after a click. [DebugBear notes](https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data) that Lighthouse's mobile network profile is slower than most real connections, so lab LCP tends to look worse than what visitors get. Use the lab to compare versions of your own page, not to grade it.

## What we tested

We rebuilt the site at seven commits, from 24 October 2026 to today's version, each from a clean checkout with the same build tools. We served each build from our own server with Brotli compression and ran Lighthouse 13.5.0 (Chrome 156) on its mobile settings: three pages, five runs each, 105 runs, taking the median as [Lighthouse's variability guide](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md) recommends. The pages were the home page, the About page and one blog post whose text didn't change in that period.

| Build | What changed |
|---|---|
| 1. Start (24 Oct) | the site as it was |
| 2. Image cap (24 Oct) | uploaded images resized to at most 1,600 px wide |
| 3. WebP (25 Oct) | WebP copies offered through `<picture>`, `width` and `height` on images, other markup fixes |
| 4. Vendor trim (25 Oct) | unused libraries dropped: `vendor.js` 479 KB → 104 KB |
| 5. WebP covers (27 Oct) | post cover backgrounds offered as WebP |
| 6. No Vue (28 Oct) | Vue 2 removed: `main.js` 123 KB → 19 KB |
| 7. Today (4 Nov) | new lightweight post covers; an old testimonial section removed from the home page |

Those 105 runs used Lighthouse's default, simulated throttling: it loads the page on a fast connection and estimates how long it would take on a slow phone. We then ran four of the builds again, three runs each, with DevTools throttling, which slows the connection and CPU during the load itself. Builds 3 and 7 each bundled several changes, so for those we name the part we think moved the numbers, and why.

## The results

Simulated throttling, median of five runs. Weight is what the page transferred during the test.

| Build | Home: score, LCP, TBT | About: score, LCP, TBT | Post: score, LCP, TBT | Home weight |
|---|---|---|---|---|
| 1. Start | 72, 6.08 s, 295 ms | 87, 3.78 s, 146 ms | 71, 5.48 s, 361 ms | 1,124 KB |
| 2. Image cap | 71, 5.70 s, 330 ms | 87, 3.71 s, 153 ms | 83, 4.22 s, 175 ms | 998 KB |
| 3. WebP | 75, 5.18 s, 257 ms | 89, 3.55 s, 139 ms | 82, 3.75 s, 314 ms | 818 KB |
| 4. Vendor trim | 79, 4.73 s, 210 ms | 96, 2.66 s, 83 ms | 88, 3.15 s, 241 ms | 718 KB |
| 5. WebP covers | 79, 4.73 s, 220 ms | 96, 2.66 s, 81 ms | 92, 2.85 s, 196 ms | 718 KB |
| 6. No Vue | 84, 4.58 s, 2 ms | 97, 2.48 s, 7 ms | 96, 2.70 s, 3 ms | 682 KB |
| 7. Today | 99, 1.86 s, 0 ms | 97, 2.41 s, 7 ms | 99, 2.16 s, 8 ms | 144 KB |

DevTools throttling, median of three runs:

| Build | Home: score, LCP, TBT | About: score, LCP, TBT | Post: score, LCP, TBT |
|---|---|---|---|
| 1. Start | 81, 2.49 s, 493 ms | 85, 2.20 s, 456 ms | 63, 6.36 s, 521 ms |
| 4. Vendor trim | 88, 2.53 s, 270 ms | 92, 2.21 s, 229 ms | 78, 4.14 s, 305 ms |
| 6. No Vue | 94, 2.50 s, 62 ms | 96, 2.21 s, 71 ms | 86, 3.82 s, 53 ms |
| 7. Today | 95, 2.37 s, 53 ms | 96, 2.24 s, 53 ms | 92, 3.12 s, 49 ms |

Median CLS was 0 to 0.003 everywhere, in both modes, and no single run went above 0.005.

## Where the two modes disagree: text LCP

On the home page and the About page, the largest element is text. With DevTools throttling, that text appeared with the first paint, at 2.2 to 2.5 seconds, in every build. Nothing we changed moved it, because nothing we changed was in its way.

Simulated throttling put the home page's LCP at 4.6 to 6.1 seconds for six builds, and then 1.86 s once build 7 deleted an old testimonial section. In [our WebP test](/articles/webp-avif-real-site-lcp/) we traced that to one 504 KB PNG in the section, a client logo shown 32 pixels tall, and saw the two modes disagree about it then too. The simulation estimates a slow load from a fast one, and [Lighthouse's throttling docs](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md) say it can be inaccurate. We didn't trace its reasoning. What we can say is that a large file on the page moved the simulated LCP of a paragraph by seconds, and the applied-throttling LCP of the same paragraph by almost nothing.

Deleting that section was still worth doing: it took the home page from 682 KB to 144 KB, which a visitor on a metered connection pays for. It just didn't make the headline appear sooner. If your lab LCP element is text and your simulated LCP is far behind your first paint, check it in DevTools mode before you rebuild anything.

## Where they agree: an image LCP got much faster

The blog post's LCP element was a photo, and both modes say it improved a lot: 5.48 to 2.16 s simulated, 6.36 to 3.12 s with DevTools throttling. In DevTools mode that's still above the 2.5-second line, so we can't call it good yet.

That photo was a parallax background. A script set it after the page loaded, so the browser couldn't start fetching it early. It weighed 380 KB at the start, 209 KB after the 1,600-pixel cap, and 146 KB as WebP. In simulated mode the cap took 1.26 s off (it also shrank a second image on the page) and WebP 0.30 s. Today the cover is an ordinary image element of 21 KB.

The WebP build also took 0.47 s off the post without touching that photo, which was still a JPEG then. Two card images further down stopped loading during the test, about 180 KB that the photo no longer had to share the connection with. Both already had `loading="lazy"`; the only change to their tags was the `width` and `height` we added. [web.dev explains why that matters](https://web.dev/articles/browser-level-image-lazy-loading): an image with no dimensions starts out as 0×0 pixels, so a whole row of them can look as if it fits on screen, and the browser may load them all. With real dimensions, the cards took up their space and fell outside the range Chrome loads ahead. Lazy loading without dimensions can quietly do nothing.

## TBT: the gain both modes saw

Between the start and build 6, TBT fell from 456 to 521 ms to about 50 ms in DevTools mode on all three pages, and from 146 to 361 ms to under 10 ms simulated. The simulated runs show where it happened: the image builds barely touched TBT, while dropping 374 KB of unused libraries (build 4) and then Vue (build 6) took almost all of it. The full Vue build had been compiling every page in the browser on each load, though only the blog search box used it. In DevTools mode, main-thread work on the post fell from 2.59 s at the start to 1.83 s at build 6.

This is the change most likely to matter for real visitors, as pages that answer taps sooner, which is INP. It's also the change our lab test can't fully show, because INP needs real taps. In the score it was worth the most: in DevTools mode the home page went from 81 to 94 between the start and build 6 with its LCP, first paint and layout shift all flat, so the rise came from TBT alone.

## What didn't move

- **Text LCP**, in DevTools mode, as above. Simulated First Contentful Paint also stayed at 1.35 s on the home page and the post, and 1.65 s on About, in all seven builds. What blocks our first paint is our stylesheet and fonts, and none of these changes touched them.
- **CLS** was never a problem in the lab. Setting `width` and `height` on images is still right, because it prevents shifts a visitor sees while scrolling, but it didn't change a lab number for us.

## Does any of this matter for search?

Some, but less than relevance. Google's page experience documentation says Core Web Vitals ["are used by our ranking systems"](https://developers.google.com/search/docs/appearance/page-experience), and in the same document that it shows the most relevant content "even if the page experience is sub-par". It adds that chasing a perfect score just for SEO "may not be the best use of your time". And for a site with no field data, Google has no Core Web Vitals data of its own to judge you on. Fix them for the visitors who arrive.

A failing grade is common. [The 2025 Web Almanac](https://almanac.httparchive.org/en/2025/performance) found 48% of mobile sites passed all three vitals in July 2025. LCP was the one most often missed: 62% had good LCP, 77% good INP and 81% good CLS. It put median mobile TBT at 1,916 ms, up 58% on the year before. Our worst build had a TBT of 521 ms in DevTools mode.

## The order we'd fix things in next time

1. **Find your LCP element.** Lighthouse and PageSpeed Insights both name it. If it's text, images won't speed it up. If it's an image, its size and how early it starts loading are most of your LCP.
2. **Sort the page's requests by size and open the biggest.** Our heaviest file was a logo nobody had looked at in years. If an image is far larger than it's shown, [resize it](/tools/photo/resize-image/) before you think about formats.
3. **Make the LCP image small and load it early.** Use an ordinary image element with `width` and `height`, not a background a script sets. Then compress it; our [image compressor](/tools/photo/image-compress/) runs in the browser.
4. **Stop loading what's below the fold.** Lazy-load images further down, with `width` and `height` set, so they don't compete with the LCP element.
5. **Delete JavaScript you don't use** before you optimize what you keep. It's the main lever on TBT, and so the best lab signal you have for INP. A [JavaScript minifier](/tools/dev/js-minifier/) or a [CSS and HTML minifier](/tools/dev/minifier/) helps once the dead code is gone.
6. **Run each test five times, and check big wins in DevTools mode too.** Compare versions of your own page, not one score against a target.
7. **Switch to field data when you get it.** Once PageSpeed Insights shows real-user data for your site, that is the number Google uses.

Our own next job is the first paint, the one number neither mode saw move.

## Sources

- web.dev: [Web Vitals](https://web.dev/articles/vitals) (the three metrics and thresholds, updated October 2024), [Interaction to Next Paint](https://web.dev/articles/inp) (updated September 2025), [Total Blocking Time](https://web.dev/articles/tbt) (updated October 2025), [Why lab and field data can be different](https://web.dev/articles/lab-and-field-data-differences), [Browser-level image lazy loading](https://web.dev/articles/browser-level-image-lazy-loading) and [INP becomes a Core Web Vital on March 12](https://web.dev/blog/inp-cwv-march-12).
- Chrome for Developers: [Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), [CrUX methodology](https://developer.chrome.com/docs/crux/methodology) and the [CrUX API](https://developer.chrome.com/docs/crux/api).
- Lighthouse on GitHub: [Score variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md) and [Network throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md).
- Google Search Central: [Understanding page experience](https://developers.google.com/search/docs/appearance/page-experience).
- HTTP Archive: [Web Almanac 2025, Performance](https://almanac.httparchive.org/en/2025/performance) (July 2025 data, published January 2026).
- DebugBear: [Why does Lighthouse lab data not match field data?](https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data) (updated January 2026; DebugBear sells monitoring).
- Our measurements: seven builds of buffermint.com from its git history; Lighthouse 13.5.0 and Chrome 156 on our server; 105 runs with simulated throttling and 36 with DevTools throttling, November 2026. Traffic from our GoatCounter logs.
