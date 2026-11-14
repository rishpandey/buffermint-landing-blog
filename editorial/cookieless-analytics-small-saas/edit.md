# Edit: cookieless-analytics-small-saas

Separate pass on 2026-11-14, after the draft was committed, reading the whole post as the target reader (a small-SaaS founder who wants visitor numbers without Google Analytics and without a banner).

## Changes
- **Opening checked against the question.** The first paragraph answers it: all three avoid cookies, none removes the EU consent question, pick by how you run it and how a visitor is counted. Kept; the second paragraph gives our measured numbers so the new angle shows at once. "answered each page view" became "answered each counted hit": the log counts events as well as page views.
- **Removed an unsourced claim.** "Before we did, our own testing showed up in the counts" had no measurement behind it (our early-day counts are higher, but we can't tell which hits were ours). Cut.
- **Removed a vague comparison.** "our measured site changes moved them far more than a few kilobytes of script could" wasn't a measurement. Now: the largest script is about 4 KB gzipped, so weight shouldn't decide; our Core Web Vitals post found images and our own JavaScript were what moved (that post's finding).
- **Umami's IP row made exact.** The draft said "no (hashed into the ID)"; checked `prisma/schema.prisma`: the session table has no IP column. The row says that, and the docs column says Umami's method is only in the source.
- **Hedging and framing.** "the tools' marketing" became "the tools' own pages" (it's their docs and policy pages, not ads). "That's an engineering checklist, not legal advice" became "the engineering checklist we work from; it isn't legal advice". "Plan around them rather than discovering them later" cut as filler.
- **SEO fixes from Content studio (first run: 88):** title was 65 characters, cut to 60 ("Cookieless analytics compared: GoatCounter, Plausible, Umami"); keyword added to the description and to the first `##` heading ("How cookieless analytics counts a visitor"); two long paragraphs split (Umami's salt; the EDPB paragraph before "So for a small SaaS…").
- **Source links in the sentence** for prices restated outside the pricing table (Umami Hobby, Plausible $9, the 100K in "Which one to pick") and for the 32K data-centre ranges, which now uses the page's own "32K".
- **Checked:** one idea per paragraph; headings say what each section finds or answers; no hype words or exclamation marks; dates are "as of November 2026" for prices and "14 November 2026" for our measurements; no product that isn't public is named; American spelling throughout ("recognises", "data-centre" and "licence" changed).
- **Links:** all external links were opened in research; internal links: /tools/, /tools/seo/privacy-policy-generator/, /tools/seo/utm-builder/ return 200 live; /articles/core-web-vitals-small-site/ is on main (merged in 1815da2) and builds locally, and goes live with the next landing publish.

## Code review pass (2026-11-14)
- The intro mixed windows: memory and CPU are since the last restart (24 Oct, 20 days), the hits and latency cover the whole log from 23 Oct (23 days); "used 33 MB over 20 days" read as a constant when it is the current value (peak 83.4 MB). Both now say which window they cover, and the start date is 23 Oct (first answered request in the log), not the restart.
- The checklist told readers cookieless usually means "tell and allow opt-out" but left out the CNIL's IP-truncation condition, which none of the three tools documents meeting. Added item 5 (claims row 51).
- "What we did on our side" listed an opt-out (`#bm-nostats`) that exists to keep our own visits out and isn't offered on a public page, and implied we meet the whole checklist. Now it lists only what we strip (item 6). A public privacy notice for buffermint.com is a Later item for the coordinator.
- claims.md rows 1, 2 and 4 quote the post's current wording.

## Content studio check
First run: SEO 88 (title length, keyword not in description or a `##` heading, 3 long paragraphs), fact-check 9 blockers. After the fixes, last run (committed): SEO 97, 0 failed; fact-check 5 blockers, 1 warning. They stay because:
- The 0.1%, 2,261/2,292, 3,000, and the script sizes are our own measurements. Their sources are `ours:` rows 3, 15, 16 and 29 in claims.md, which the tool can't read.
- The pricing table's numbers (100K, $9, 10k, $20, 1M) have their four source links in the line right under the table and in claims.md rows 20–23; the tool looks for a link in the same block.
- The warning ("the cited page doesn't show 3,000, $9, $108"): 3,000 is ours, $108 is 9 × 12 (claims row 25), and $9 is on plausible.io's pricing section, which renders the price with JavaScript, so the tool's fetch doesn't see it.
- The remaining long-paragraph warning counts the pricing table and a bullet list as paragraphs.
