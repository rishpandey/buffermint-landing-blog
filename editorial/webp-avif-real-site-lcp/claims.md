# Claims: webp-avif-real-site-lcp

`bench/` means editorial/webp-avif-real-site-lcp/bench/. Medians are of the runs in the named file; KB = 1,000 bytes.

| # | Claim (as written in the post) | Source | What the source says |
|---|---|---|---|
| 1 | WebP took 0.3 to 0.4 s off LCP on a post | ours: bench/lighthouse.jsonl, bench/lighthouse-devtools-post.jsonl | jpeg vs webp medians: 3,003 to 2,704 ms simulated; 4,126 to 3,748 ms DevTools |
| 2 | Home page LCP unchanged by format | ours: bench/lighthouse.jsonl | medians 4,580 / 4,581 / 4,579 ms |
| 3 | The modes disagreed on the logo gain: 2.4 s in one, 0.15 s in the other | ours: bench/lighthouse-logo.jsonl, bench/lighthouse-devtools-logo.jsonl | medians original vs resized, 5 runs each, one session: simulated 4,596 - 2,161 = 2,435 ms; DevTools 2,563 - 2,409 = 154 ms |
| 4 | 65 JPEGs, 4.27 MB | ours: bench/sweep.json | 65 rows, sum 4,265,300 bytes |
| 5 | sharp 0.35.5, effort 4, six qualities each | ours: bench/encode-sweep.mjs, sweep.json | SETS and versions in the file |
| 6 | Lighthouse 13.5.0, Chrome 156, five runs per page; four tests | ours: bench/lighthouse.jsonl, the three other jsonl files, sweep.json | `lh`, `chrome` fields; 5 rows per label and page |
| 7 | 95 Lighthouse runs | ours: count of rows | lighthouse.jsonl 60 + lighthouse-devtools-post.jsonl 15 + lighthouse-logo.jsonl 10 + lighthouse-devtools-logo.jsonl 10 = 95 |
| 8 | Quality table (all 12 rows: WebP 90/85/80/75/70/60, AVIF 70/60/55/50/45/35) | ours: bench/analyse-outliers.js on sweep.json | per setting: sum of bytes, saving vs the 4,265,300-byte JPEG total, median SSIM, count of images larger than their JPEG |
| 9 | AVIF 50 is 41% smaller than WebP 80 at a higher SSIM | ours: same | 1,617,097 vs 2,746,302 bytes; 0.9781 vs 0.9755 |
| 10 | Lossy WebP 25-34% smaller than JPEG at equal SSIM | https://developers.google.com/speed/webp | "25-34% smaller" than comparable JPEG at equivalent SSIM |
| 11 | At SSIM 0.98: 50 of 65; WebP 31.5% median, 16.6% total; by size thirds about -3% / 69% / 11% median; AVIF 49.6% total, 39.5% lighter than WebP | ours: bench/analyse-sweep.js | t=0.98 row: n 50, medw 0.315 (even-count median: mean of the two middle values), w 0.166, a 0.496, aw 0.395; `third` lines: median saved -3.4 / 69.3 / 10.8 |
| 12 | Cloudflare's "half" | https://blog.cloudflare.com/generate-avif-images-with-image-resizing/ | AVIF can be half the size of JPEG and WebP |
| 13 | 51 copies, 3.78 to 2.20 MB, 41.8% | ours: bench/analyse-sweep.js | shipped sums 3,779,497 and 2,198,080 |
| 14 | Median shipped SSIM 0.975; 4 of 51 below 0.95; worst 0.886; q90 0.902; AVIF 70 0.951 | ours: bench/analyse-outliers.js | photo-1555580399-49e780f216b7.jpeg |
| 15 | Post hero 187 / 125 / 73 KB; SSIM 0.968 for WebP and AVIF | ours: bench/sweep.json | 186,891; 124,846 (0.9675); 73,218 (0.9680) |
| 16 | Post LCP table | ours: bench/lighthouse.jsonl, lighthouse-devtools-post.jsonl | 3,003 / 2,704 / 2,403; 4,126 / 3,748 / 3,507 ms |
| 17 | The photo is the post's LCP element | ours: bench/lighthouse.jsonl | LCP node is the hero section, with a resource load subpart |
| 18 | "good" line of 2.5 s | https://web.dev/articles/lcp | 2.5 s or less is good |
| 19 | Mobile preset assumes 1.6 Mbps | https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md | Slow 4G: 150 ms, 1.6 Mbps down |
| 20 | 20 KB is about 0.1 s; 62 KB about 0.3 s | ours: calculation | 20,000 x 8 / 1,638,400 = 97.7 ms; 62,045 x 8 / 1,638,400 = 303 ms |
| 21 | A smaller file can move the wait into render delay | https://web.dev/articles/optimize-lcp | load duration is often not the bottleneck; time can shift to render delay |
| 22 | Home LCP element is a paragraph | ours: bench/lighthouse.jsonl | selector p.site-lead |
| 23 | No upload image loaded on home; blog cards are WebP and lazy-loaded, Lighthouse doesn't scroll to them | ours: bench/lighthouse.jsonl; source/_partials/articles/article-card.blade.php, feature-card.blade.php | no `uploads` URL in `imgs` for jpeg, webp or avif (15 runs); card `<img>` has `loading="lazy"` |
| 24 | 68% of mobile pages have an image LCP | https://almanac.httparchive.org/en/2024/media | 68% on mobile |
| 25 | Images 556 KB; PNG 504 KB, 1,467 px square, 32 px tall; beside a testimonial; since 2021 | ours: bench/lighthouse.jsonl, build_production/index.html, `git log -- source/_assets/img/logos/shas-logo.png` | 556,040; 503,938 bytes; `height="32"`; site-quote figure; commit dated 2021-07-01 |
| 26 | Logo resized: 64 px, under 4 KB; 683 to 183 KB; five runs each in each mode, one session | ours: bench/make-logo.mjs output, bench/lighthouse-logo.jsonl, lighthouse-devtools-logo.jsonl | resize({height:64}) wrote 3,812 bytes in the bench run (3,862 when rerun on 2026-11-03 with another sharp install); 4,017 bytes transferred, headers included; totals 682,680 and 182,759; 5 rows per label per file |
| 27 | Logo table scores and LCP; "about a sixteenth" | ours: bench/lighthouse-logo.jsonl, lighthouse-devtools-logo.jsonl | median LCP/score: simulated 4,596 ms/84 and 2,161 ms/99; DevTools 2,563 ms/93 and 2,409 ms/95; 154 / 2,435 = 0.063 |
| 28 | Simulated is the default and models a load; "inherent inaccuracy"; DevTools "isn't highly accurate" | https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md | as quoted |
| 29 | 500 KB is about eight times what WebP took off the post | ours: calculation | 499,921 / 61,982 = 8.1 |
| 30 | Old claim 10.3 to 7.0 s, 8.5 to 5.0 s, Lighthouse 12.2.1 | ours: STATUS.md 2026-10-25 entry | as stated |
| 31 | Two commits; second cut more than 350 KB of JavaScript | ours: git fd33e24, 2368247; STATUS.md | vendor.js 479 (commit: 469) to 104 KB |
| 32 | History table | ours: bench/lighthouse.jsonl (h-before, h-webp, h-vendor) | 5,712 / 5,183 / 4,733; 4,353 / 3,846 / 3,080 ms |
| 33 | AVIF 1.8 s vs WebP 0.13 s per megapixel, about 14 times; over 3 s for a big photo | ours: bench/analyse-sweep.js | 1,793 and 128 ms/MP, timed from sharp(src) so JPEG decode is included; 3,134 ms on a 1600x1067 image at q50 |
| 34 | AVIF 96.35%, WebP 97.18% | https://caniuse.com/avif, https://caniuse.com/webp | read 2026-11-02 |
| 35 | AVIF shows nothing until fully arrived | https://jakearchibald.com/2020/avif-has-landed/ | no progressive rendering |
| 36 | WebP 12%, AVIF 1.0%, JPEG 32.4% of mobile images | https://almanac.httparchive.org/en/2024/media | mobile format shares |
