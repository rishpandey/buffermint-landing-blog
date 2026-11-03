# Edit: webp-avif-real-site-lcp

Separate pass after the draft, reading it against the bench files, in the workflow's order.

## Changes
- Opening: already answers the question, but "to within a millisecond" was false (4,579 to 4,581 ms is a 2 ms spread). Cut.
- Opening: "overstated" assumed one mode is right. The Lighthouse doc warns about both, so it now says the two modes disagree.
- Units: page weights came from a script dividing by 1,024 while logo and upload sizes were in thousands. All figures are now KB = 1,000 bytes (683 and 183 KB, not 667 and 178).
- Run count: 75 was wrong, then 86; after the logo rerun it is 60 + 15 + 10 + 10 = 95 (description updated).
- Removed a garbled comparison in the home section that wasn't true as written. It now says 500 KB off the page, about eight times the 62 KB WebP took off the post.
- "the page doesn't use a single image from the uploads folder" was too strong: the HTML references uploads, and none loaded in any run. Reworded to what we measured.
- Almanac paragraph: cut "the field hasn't moved" and "most sites still have the easy saving left". One year of shares supports neither.
- Old-claim section: added the home page split, where the two commits were about even. The draft's general statement held only for the post.
- JavaScript cut: "375 KB" had no single source (STATUS says 479 to 104, the commit says 469 to 104). Now "more than 350 KB", true of both.
- Tightened the closing line; headings kept because each states its finding.

## Second pass (2026-11-03, after the logo rerun)
- Logo table: the old rows mixed a baseline from another session with 3 DevTools runs. Replaced with the rerun (bench/lighthouse-logo.jsonl, lighthouse-devtools-logo.jsonl: both copies, 5 runs each per mode, one session): simulated 4.60 s/84 to 2.16 s/99, DevTools 2.56 s/93 to 2.41 s/95. The text now says how the rerun was done.
- Opening: "about eight times" no longer held (2,435 vs 154 ms, ratio 16). Rather than a bigger multiplier, it now gives both savings, 2.4 s and 0.15 s, which a reader can judge directly. The body says "about a sixteenth".
- "the saving was 0.3 seconds" is now 0.15 s; "2.4 seconds" held (2,435 ms).
- "3.8 KB" for the resized logo: the bench wrote 3,812 bytes, a rerun with another sharp install 3,862. Now "under 4 KB", true of both.
- "500 KB ... about eight times what WebP took off our test post" kept: it compares bytes (499,921 / 61,982 = 8.1), not the modes, and the totals didn't change in the rerun.
- date: stays 2026-11-02: not in the future, 3 days after the previous post (tests need 2+), and it leaves 2026-11-04 free for the next post.

## Content studio
First run: score 85, 8 blockers, 1 failed. Fixed: keyword in the title and description, an Almanac link at the sentence that lacked one, "the best source" reworded, two long paragraphs split.
Seven blockers stay in the last run. All are our own measurements (the quality table, 41%, 29.4/16.6%, 49.6/39.5%, 41.8%, 1,467 px, 14 times), which the tool can't source because it doesn't read claims.md. Each has a row there: 8, 9, 11, 13, 25 and 33.
The slug warning stays: the slug says what the post found, and the keyword is in the title.

Rerun 2026-11-03 after the second pass: SEO score 94, 0 failed; 9 blockers, 0 warnings, every link 200. The 9 are the same own measurements, now split finer (16.6% and 29.4% separately) plus the size thirds (-3/69/11%) added in b41441b. All have claims.md rows (8, 9, 11, 13, 25, 33); the tool can't see them, as bin/content-studio sends no facts sheet.
