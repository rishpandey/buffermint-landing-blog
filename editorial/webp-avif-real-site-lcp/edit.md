# Edit: webp-avif-real-site-lcp

Separate pass after the draft, reading it against the bench files, in the workflow's order.

## Changes
- Opening: already answers the question, but "to within a millisecond" was false (4,579 to 4,581 ms is a 2 ms spread). Cut.
- Opening: "overstated" assumed one mode is right. The Lighthouse doc warns about both, so it now says the two modes disagree.
- Units: page weights came from a script dividing by 1,024 while logo and upload sizes were in thousands. All figures are now KB = 1,000 bytes (683 and 183 KB, not 667 and 178).
- Run count: 75 was wrong; 60 + 5 + 6 + 15 = 86.
- Removed a garbled comparison in the home section that wasn't true as written. It now says 500 KB off the page, about eight times the 62 KB WebP took off the post.
- "the page doesn't use a single image from the uploads folder" was too strong: the HTML references uploads, and none loaded in any run. Reworded to what we measured.
- Almanac paragraph: cut "the field hasn't moved" and "most sites still have the easy saving left". One year of shares supports neither.
- Old-claim section: added the home page split, where the two commits were about even. The draft's general statement held only for the post.
- JavaScript cut: "375 KB" had no single source (STATUS says 479 to 104, the commit says 469 to 104). Now "more than 350 KB", true of both.
- Tightened the closing line; headings kept because each states its finding.

## Content studio
See the last section of this file after `content-studio check`.
