---
title: "Convert images to WebP? What it did to LCP on a real site"
seo_description: "We tested what happens when you convert images to WebP or AVIF: 65 images, 95 Lighthouse runs. A post loaded 0.3 s faster, our home page no faster. Here's why."
keyword: convert images to webp
featured_image: assets/img/uploads/webp-avif-real-site-lcp-cover.jpeg
featured_thumbnail: assets/img/uploads/webp-avif-real-site-lcp-cover.jpeg
author: Rishabh Pandey
show_meta: true
section: postContent
published: true
date: 2026-11-03
extends: _layouts.post
---

If you convert images to WebP, your page gets lighter. Whether it gets faster depends on one thing: what the browser counts as the largest thing on the page. We tested this on buffermint.com by changing nothing but the image format. On a blog post with a photo at the top, WebP took 0.3 to 0.4 seconds off Largest Contentful Paint (LCP). On our home page it took off nothing.

The largest gain on the home page came from a file our conversion never touched. And our two Lighthouse modes disagreed about the size of that gain: 2.4 seconds in one, 0.15 seconds in the other.

## What we tested

We ran four separate tests in November 2026:

- **Encoding.** The 65 JPEGs in our uploads folder at the time of the test, 4.27 MB in total, encoded as WebP at six quality settings and AVIF at six more, with sharp 0.35.5 at effort 4. We scored each copy with FFmpeg's SSIM, a 0-to-1 measure of how close it is to the reference image.
- **Format on one build.** Three copies of today's site, identical except for the format the browser is offered: JPEG, WebP or AVIF. We tested the home page and one post, five runs each, with Lighthouse 13.5.0 on mobile settings, and the post again with DevTools throttling.
- **One large file.** The home page with and without one oversized logo, five runs each in both Lighthouse throttling modes.
- **History.** We rebuilt the site at three old commits and ran the same pages, to split a claim from our own notes.

Two limits apply. The SSIM reference is our JPEG, not an uncompressed original, so it measures how much of what we already had survived. And all of this is lab data from one server. None of it comes from real visitors, so treat the gaps between formats as more reliable than the absolute times.

## The quality setting decides whether you save anything

Most guides pick a quality number and move on. Here's what every setting we tested did across all 65 images:

| Format and quality | Total size | Saved vs JPEG | Median SSIM | Images that got bigger |
|---|---|---|---|---|
| WebP 90 | 4.34 MB | −1.6% | 0.987 | 33 of 65 |
| WebP 85 | 3.35 MB | 21.5% | 0.981 | 17 |
| WebP 80 | 2.75 MB | 35.6% | 0.976 | 10 |
| WebP 75 | 2.28 MB | 46.6% | 0.968 | 8 |
| WebP 70 | 2.16 MB | 49.4% | 0.966 | 4 |
| WebP 60 | 1.93 MB | 54.7% | 0.961 | 4 |
| AVIF 70 | 2.91 MB | 31.8% | 0.992 | 8 |
| AVIF 60 | 2.27 MB | 46.8% | 0.986 | 5 |
| AVIF 55 | 1.89 MB | 55.6% | 0.982 | 0 |
| AVIF 50 | 1.62 MB | 62.1% | 0.978 | 0 |
| AVIF 45 | 1.34 MB | 68.6% | 0.972 | 0 |
| AVIF 35 | 0.91 MB | 78.7% | 0.958 | 0 |

WebP at quality 90 made our images heavier in total. Half of them grew. Our files had already been compressed as JPEGs, so a high setting spends bytes preserving detail the JPEG had already thrown away. Quality numbers also don't carry across formats: AVIF 50 scored higher than WebP 80 and came out 41% smaller.

Compare formats at equal quality and the gap to the published figures gets clearer. [Google says](https://developers.google.com/speed/webp) lossy WebP is 25 to 34% smaller than JPEG at equal SSIM. We took the smallest copy of each image that reached SSIM 0.98, which 50 of the 65 images did in both formats. WebP saved 16.6% of total bytes. The median image saved 31.5%, which looks like a match for Google's range but isn't one, because almost nothing landed near it. Split by file size, the smallest third of images grew by about 3% at the median, the middle third saved 69%, and the largest third saved 11%. AVIF saved 49.6% of total bytes, and came out 39.5% lighter than WebP.

That AVIF figure is close to the "half" [Cloudflare reported](https://blog.cloudflare.com/generate-avif-images-with-image-resizing/) in 2020.

One setting also doesn't suit every image. When we tested, the site shipped 51 WebP copies, 3.78 MB down to 2.20 MB, or 41.8% lighter. The median copy scores 0.975, but 4 of the 51 fell below 0.95 and the worst scored 0.886. Even WebP at quality 90 only reached 0.902 on that photo, while AVIF at quality 70 reached 0.951. Spot-check your worst images by eye and not only the total saved.

## On a post, each format took time off LCP

The post has a large photo at the top, and that photo is its LCP element, the element LCP is timed on. Its size was 187 KB as JPEG, 125 KB as WebP and 73 KB as AVIF, with WebP and AVIF at almost the same SSIM (0.968). Median LCP in each Lighthouse mode:

| Post, LCP | JPEG | WebP | AVIF |
|---|---|---|---|
| Simulated throttling | 3.00 s | 2.70 s | 2.40 s |
| DevTools throttling | 4.13 s | 3.75 s | 3.51 s |

The two modes disagree on the absolute time by more than a second, and they nearly agree on the saving: 0.30 to 0.38 s for WebP, 0.60 to 0.62 s for AVIF. Only the AVIF run under simulated throttling beat the [2.5-second "good" line](https://web.dev/articles/lcp), so we wouldn't promise that from one lab figure.

There's a useful rule of thumb in those numbers. Lighthouse's mobile preset [assumes 1.6 Mbps](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md). At that speed, the 62 KB WebP saved takes about 0.3 s to download, which matches the simulated drop. So on that connection, **every 20 KB off your LCP image is worth about 0.1 s**, as long as the image download is what's holding LCP back. [web.dev's LCP guide](https://web.dev/articles/optimize-lcp) warns that often it isn't: a smaller file can simply move the wait into render delay.

## On the home page, nothing moved

Here are the home page results from the same test, simulated throttling:

| Home page | JPEG | WebP | AVIF |
|---|---|---|---|
| LCP | 4.58 s | 4.58 s | 4.58 s |
| Weight loaded in the test | 683 KB | 683 KB | 683 KB |

The reason is plain once you look. The LCP element on our home page is a paragraph of text, and the page didn't load a single image from the uploads folder during any run, so our format swap changed no file it fetched. The blog cards further down are WebP, but they're lazy-loaded and Lighthouse doesn't scroll to them. A visitor who scrolls does get the saving; it just can't affect LCP. [The HTTP Archive found](https://almanac.httparchive.org/en/2024/media) that 68% of mobile pages have an image as their LCP element. That leaves plenty of pages like ours, where the format change never reaches what loads first.

Lighthouse's request list showed where the weight was. Images came to 556 KB, and one PNG made up 504 KB of that: a logo beside a testimonial, 1,467 pixels square, displayed 32 pixels tall. It had been in our repository since 2021. We made a copy of the site with that one file resized to 64 pixels tall, under 4 KB, and tested both copies again in one session, five runs each in each mode:

| Home page | Original logo | Logo resized |
|---|---|---|
| Page weight | 683 KB | 183 KB |
| Simulated: LCP, score | 4.60 s, 84 | 2.16 s, 99 |
| DevTools throttling: LCP, score | 2.56 s, 93 | 2.41 s, 95 |

If we'd run only the default mode, we'd have reported that a logo cost us 2.4 seconds. With throttling applied during the load, the saving was 0.15 seconds, about a sixteenth as much. Simulated throttling is the default, and it models a load from an unthrottled one. [Lighthouse's own documentation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md) says that makes it fast and repeatable, with "inherent inaccuracy" and edge cases.

It says the network side of DevTools throttling "isn't highly accurate" either, so neither number is the truth. We didn't trace why they differ. But when a one-file fix looks too good, run it a second way before you believe it.

Resizing that logo still took 500 KB off the page, about eight times what WebP took off our test post. It needed someone to notice the file, not a new format.

## Our old number didn't survive

Our notes from October claimed home page LCP went from 10.3 to 7.0 s and a post from 8.5 to 5.0 s, after a change that added WebP. That change was two commits, and the second also cut more than 350 KB of JavaScript. Rebuilt and rerun today (simulated throttling, Lighthouse 13.5.0, where the old figures used 12.2.1):

| LCP | Before | After WebP commit | After JavaScript commit |
|---|---|---|---|
| Home | 5.71 s | 5.18 s | 4.73 s |
| Post | 4.35 s | 3.85 s | 3.08 s |

We couldn't reproduce the old absolute numbers, and we no longer know which post the old figure used. Today's split also isn't a clean test of WebP alone, because that first commit changed other things too, including page markup. What holds up is smaller and more useful: on the post, the JavaScript commit took off 0.77 s and the WebP commit 0.50 s, and on the home page they were about even. "We added WebP and LCP dropped 3 seconds" would have been the wrong story to tell.

## Is AVIF worth it?

For a site with a build step, we think so, with two conditions.

- **Encoding time.** At the same effort setting, AVIF took a median 1.8 seconds per megapixel against 0.13 for WebP, about 14 times longer, on our two-thread setup. Those times include reading the JPEG, so the gap in encoding alone is wider. A big photo took over 3 seconds. That's fine at build time and poor for on-demand conversion.
- **Support.** As of November 2026, [Can I use](https://caniuse.com/avif) puts AVIF at 96.35% of users and [WebP](https://caniuse.com/webp) at 97.18%. Keep a fallback in either case. A `<picture>` element offers AVIF, then WebP, then JPEG, and the browser takes the first it supports.

Two further notes. [Jake Archibald points out](https://jakearchibald.com/2020/avif-has-landed/) that AVIF shows nothing until the whole image has arrived, where a JPEG can appear progressively. And the [Web Almanac's 2024 figures](https://almanac.httparchive.org/en/2024/media) show how few sites have switched: WebP at 12% of mobile images and AVIF at 1.0%, against 32.4% for JPEG.

## How to convert images to WebP without wasting the work

1. **Find your LCP element first.** Run Lighthouse or PageSpeed Insights and read which element it names. If it's an image, every KB you take off it can count. If it's text, converting images won't speed that element up directly, so look at what else loads early.
2. **Sort the page's requests by size.** Fix the largest file before any format work. Ours was a logo, and it needed [resizing](/tools/photo/resize-image/), not converting.
3. **Don't start at quality 90.** Start at 75 to 80 for photos and compare file sizes. If a copy comes out bigger than the original, keep the original.
4. **Convert from your highest-quality original.** Each lossy pass costs quality, as we measured in [our HEIC to JPG test](/articles/heic-to-jpg-what-you-lose/). For a few files, our free [JPG to WebP](/tools/photo/jpg-to-webp/) and [PNG to WebP](/tools/photo/png-to-webp/) converters run in your browser, and [the image compressor](/tools/photo/image-compress/) covers the case where you need to keep the format.
5. **Keep a fallback** with `<picture>`, and set `width` and `height` so the page doesn't shift.
6. **Add AVIF at build time** if you can spare the encoding minutes. It was the largest format saving we measured.
7. **Check the change in two throttling modes**, and compare gaps, not absolute times.

That logo is next on our own list. Yours may be sitting on a page you haven't opened in years.

## Sources

- Google for Developers: [An image format for the Web](https://developers.google.com/speed/webp) (WebP compression figures, updated August 2025).
- web.dev: [Largest Contentful Paint](https://web.dev/articles/lcp) and [Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp) (thresholds, LCP subparts).
- Lighthouse on GitHub: [Network throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md) (simulated and DevTools throttling, Slow 4G preset).
- Can I use: [WebP](https://caniuse.com/webp) and [AVIF](https://caniuse.com/avif) (browser support, read November 2026).
- HTTP Archive: [Web Almanac 2024, Media](https://almanac.httparchive.org/en/2024/media) (format shares and LCP images).
- Jake Archibald: [AVIF has landed](https://jakearchibald.com/2020/avif-has-landed/) (2020).
- Cloudflare: [Generate AVIF images with Image Resizing](https://blog.cloudflare.com/generate-avif-images-with-image-resizing/) (2020).
- Our measurements: sharp 0.35.5, FFmpeg SSIM, Lighthouse 13.5.0 and Chrome 156 on our server, November 2026. Cover: one NASA public-domain photo (AS11-40-5903) with each strip made from a copy encoded in the format it names, then saved together as one image; sizes are for the whole photo.
