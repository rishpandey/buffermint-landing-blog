# Edit: core-web-vitals-small-site

Separate pass on 2026-11-04, after the draft and after the DevTools cross-check came in, reading the whole post as the target reader (a founder with an orange PageSpeed score and no field data).

## Changes
- **Rebuilt the story around the cross-check.** The first draft led with "home LCP 6.1 → 1.9 s, mostly from deleting one section". The 36 DevTools runs showed home LCP at 2.49 → 2.37 s and About flat at about 2.2 s, so that headline was a simulated-throttling effect. The opening, the results (a second table) and two new sections ("Where the two modes disagree: text LCP", "Where they agree: an image LCP got much faster") now say what both modes support and where they split. Leading with the simulated figure alone would have repeated the mistake the post warns about.
- **Opening answers the question in the first paragraph:** what moved (an image LCP, TBT), what didn't (text LCP, CLS). Fixed "the same pages went from 2.5 to 2.4" to "the same page went from 2.49 to 2.37", and cut "Our home page barely changed", which said it twice.
- **Removed an unsourced cause.** The draft said "what blocks our first paint is our stylesheet and fonts". We never measured that. It now says what we measured (build 4 cut the stylesheets from 49 to 40 KB and FCP didn't move) and that we haven't traced the cause.
- **TBT section made exact.** "The image builds barely touched TBT" hid real noise: the post's simulated TBT went 361, 175, 314 across builds 1–3. Now: TBT bounced without a trend in the image builds and fell for good at builds 4 and 6. The score claim (home 81 → 94 in DevTools mode) now says LCP, FCP and CLS were all flat, so TBT is the only cause, which the data shows.
- **Lazy loading paragraph added** after checking the built HTML: the two card images that stopped loading in build 3 differ only by `width`/`height`. Cited web.dev's lazy-loading page for the 0×0 mechanism rather than asserting it.
- **Cut** "because nothing we changed was in its way" (interpretation we can't show) and "for content reasons". "Client logo" became "a logo beside a testimonial", as our WebP post describes it. "Nobody had looked at in years" became "had sat in our repository since 2021", which the WebP post sources.
- **Closing line** said first paint never moved in either mode; DevTools home FCP moved 0.12 s, so it now says "barely moved".
- **Tests:** two `<img>` mentions in backticks tripped the alt-text check; reworded to "an ordinary image element". `date:` is 2026-11-05: the WebP post is dated 2026-11-03 and posts must be 2+ days apart (see the handoff on the future-date rule).
- **Headings** now state findings ("Where they agree: an image LCP got much faster", "TBT: the gain both modes saw"). Checked for hype words and exclamation marks: none. American spelling throughout.
- **Links:** every internal link points to a live page (/articles/webp-avif-real-site-lcp/, /tools/photo/resize-image/, /tools/photo/image-compress/, /tools/dev/js-minifier/, /tools/dev/minifier/); every external link was opened during research.

## Content studio check
First run: SEO 91 (warnings: keyword not in a `##` heading or the opening paragraph, 4 long paragraphs), fact-check 7 blockers, 2 warnings. Fixed: keyword added to the opening and the first heading; the two long prose paragraphs split; the Web Almanac figures now carry their link in the sentence (2 blockers); "larger than it's shown" reworded (read as an unsourced quote); "the best lab signal" reworded.

Second run (committed): SEO 97, 0 failed; fact-check 4 blockers, 1 warning. They stay because:
- "141 times", "1,600" (twice) and "1,124 KB" are our own measurements and build facts. Their sources are `ours:` rows in claims.md (17, 19/23, 22); the tool can't read claims.md or the bench files.
- The warning ("the best") is inside Google's own quoted words, "may not be the best use of your time", linked in the same paragraph.
- The remaining long-paragraph warning counts the build table and the numbered list as paragraphs.
