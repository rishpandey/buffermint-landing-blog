# Research: WebP and AVIF on a real site

## Question
Reader: a small-site owner or SaaS founder who has been told to "convert images to WebP" to fix a slow page. They want to know how much it saves and whether it moves LCP.

Target keyword: `convert images to webp`. Demand from `keywords.json` (Content studio, 2026-11-02): band high, on Google and Bing autosuggest, best rank 1, score 100. Wikipedia "WebP" averages 10,224 views a month, down 14% on the period before it. Autosuggest shows the phrase is searched, not how often, so the post gives no volume. Question forms that came back: "how to convert images to webp format", "does shopify convert images to webp", "how to convert images to webp in wordpress".

Why topic 13 and not 12: topic 12 (EXIF) is the top `todo`, but its test needs logged-in accounts on 8 apps, which a lane doesn't have. It stays `todo` with that note.

## Sources
- https://developers.google.com/speed/webp : lossy WebP 25-34% smaller than comparable JPEG at equal SSIM; lossless 26% smaller than PNG. Page updated 2025-08-07. A vendor figure from the format's maker.
- https://web.dev/articles/optimize-lcp : LCP splits into TTFB, load delay, load duration, render delay. Says load duration is often not the bottleneck, and that a smaller image can just move the time into render delay. Updated 2025-03-31.
- https://web.dev/articles/lcp : good is 2.5 s or less, poor over 4.0 s; background images loaded with url() are candidates.
- https://caniuse.com/webp : 97.18% global; Chrome 32, Edge 18, Firefox 65, Safari 16.0 (read 2026-11-02).
- https://caniuse.com/avif : 96.35% global; Chrome 85, Edge 121, Firefox 93, Safari 16.4 (read 2026-11-02).
- https://almanac.httparchive.org/en/2024/media : mobile format shares JPEG 32.4%, PNG 28.4%, WebP 12%, AVIF 1.0%; 68% of mobile pages have an image LCP. The 2025 chapter URL returned 404, so 2024 is the newest we read.
- https://jakearchibald.com/2020/avif-has-landed/ : one F1 photo, JPEG 74.4 kB, WebP 43 kB, AVIF 18.2 kB; AVIF renders all-or-nothing. Hand-tuned, one image, 2020.
- https://blog.cloudflare.com/generate-avif-images-with-image-resizing/ : AVIF can be half the size of JPEG and WebP; encoding can take seconds per image (2020).
- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring : LCP is 25% of the score, TBT 30%.

## Disagreements
Google's 25-34% is at equal SSIM on its own corpus. Our shipped copies fell 40% (3.0 to 1.8 MB) but were not made at a matched SSIM, so that number can't be compared with Google's until we score them. Archibald's AVIF is under half of WebP on a hand-tuned image, Cloudflare says "half", and blogs found by search say 20-50% with no method. Search found no controlled AVIF vs WebP benchmark in those blogs, so none of them is cited.

## New angle
To be filled from the measurements in `bench/` (matched-SSIM sweep on all our JPEGs; Lighthouse JPEG vs WebP vs AVIF on the same build; the old 10.3 to 7.0 s claim split by commit).

## Outline
To be written once the results are in: the outline depends on what the measurements show.
