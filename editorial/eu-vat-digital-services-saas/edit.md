# Edit: eu-vat-digital-services-saas

Separate pass after the draft (2026-11-21), reading the whole post as an editor in the workflow's order: does the opening answer the question, does each section earn its place, filler and hedging, hype, one idea per paragraph, headings, links.

## Opening
The first paragraph answers the search: non-EU sellers owe VAT from the first consumer sale, the €10,000 threshold is for one-country EU sellers only, B2B is reverse charge. Kept. The second paragraph says what we added (two worked examples, the fee arithmetic, VIES availability), so a reader knows why this page and not the Commission's.

## Changes
1. **Removed "the script is in our repository so you can rerun it".** True of the editorial folder, but the post gives no link and the reader can't act on it. Replaced with "Your own mix will differ, but the steps don't."
2. **Removed "it's owed even if you forgot to charge it".** Not in any source we read; it stays out rather than going unsourced. The sentence now says only that charged VAT passes through your account.
3. **Location evidence example.** The draft said "the country of the card's issuing bank". Art. 24f lists bank details, the billing address and IP address; changed to "the billing address and the customer's bank details or IP address" (and the checklist to match).
4. **VIES timing.** "Within a second" was a guess. Measured three calls (0.47, 0.51, 0.47 s) and wrote the range.
5. **VIES architecture.** "VIES passes each lookup to the national tax administration" had no source. Replaced with the Commission's own wording (search engine, not a database; data from national databases; sometimes unavailable during back-ups), linked to the Your Europe VIES page, and added the reader's takeaway: unavailable is not invalid.
6. **"Most non-EU SaaS products show a price and add VAT"** was an unmeasured generalisation. Now it states the two options neutrally.
7. **Stripe Tax Complete tier.** The draft said the entry tier "caps you at 200 transactions"; the page we were served was in CA$ and may differ by country. Now "the entry tier Stripe showed us in November includes 200 transactions a month and four filings a year", with the $90 figure dated to our October US reading.
8. **"Collecting VAT numbers ... is something Stripe Billing already does"** went beyond what we read (Stripe's docs tie the reverse charge to Stripe Tax). Now a general statement that it's a one-time billing setup.
9. **ViDA.** The draft's "mostly widen what one registration covers" was our interpretation; replaced with the Commission's description.
10. **OSS exclusion.** The draft said "three quarters of unresolved reminders"; the page says three consecutive reminders, each unresolved 10 days (the "quarters" wording is the payment rule). Fixed.
11. **"It doubles if you also sell to UK consumers"** was hype; now "it adds a second registration".
12. **Consumer-vs-business without a VAT number.** "A business customer without one is treated as a consumer" stated a legal rule we hadn't sourced; now it says what Stripe does.
13. **The closing line of the MoR section** now says what the gap is measured against (Stripe with Billing and Tax Basic, consumer sales), since for B2B-only sellers the gap stays.
14. **Date.** The draft used today's date, 2026-11-21, but topic 17's post already has that date and `tests/posts.test.mjs` wants posts 2+ days apart and no future date. Set to 2026-11-23 (Monday, the blog's Mon/Wed/Fri rhythm), as the owner chose for the same clash on 2026-11-14 and 2026-11-17. The post's "read 21 November 2026" dates stay true.

## Kept on purpose
- Paddle is the one MoR named in the fee table: it's the MoR whose tax-handling page we read, and the full six-provider comparison is linked. These are payment providers the reader evaluates, not products that compete with ours.
- The population weighting is an assumption, said as one in the post.
- Headings say what the section finds or does ("The €10,000 threshold is not for non-EU sellers"); "Who owes what, in one table" stays because the table is the finding.

## Content studio check
First run (2026-11-21): SEO score 85, 0 failed; fact check 14 blockers, 3 warnings. Fixed:
15. Put the keyword's wording in the opening ("EU VAT on digital services starts earlier than most founders expect") and in a heading ("Who owes EU VAT on digital services, in one table"). The exact phrase "eu vat digital services" without "on" isn't natural English, so the density warning stays.
16. Linked Irish Revenue in the opening's €10,000 sentence and inside the threshold-conditions sentence; added a source line under the decision table; linked Paddle's and Stripe's pricing in the closing line of the MoR section (3 blockers gone).
17. Split the VIES paragraph (over 120 words) in two.

Last run: SEO score 91, 0 failed; fact check 11 blockers, 3 warnings. Why they stay:
- **The 11 blockers** are all our own numbers: the $29 example and its $34,800 / $7,400 / $1,850, the 21.27% and 21.91% averages, the €29 table and its €1.95 / 8%, the per-sale fee table and its $31 and $205 totals, and the checklist's 21–22%. Each comes from `vat-math.py` over the Your Europe rates, Eurostat's population file and the October 2026 price lists, and each is a `ours:` row in `claims.md` (rows 10, 15, 33, 34, 38, 40, 43). The decision-table €10,000 cell is sourced by the line under the table. The tool can't read `claims.md`, as the workflow notes.
- **Warning €100,000:** the post links EUR-Lex, which refused both our fetcher and the tool's; the figure is in Art. 24b as read in the LawPlayer mirror (claims row 23).
- **Warning 2.9% / 1.5% / 0.7% / 0.5%:** from our October 2026 reading of Stripe's US pricing (the page now geolocates; we were served Canadian prices); the post dates the reading.
- **Warning $90 / $1,080:** $90 is the October US reading, $1,080 is 12 × $90; the post says so.
- Readability warnings (21 words a sentence, 2 paragraphs over 120 words: the checklist and the Sources list) stay: both are lists the tool counts as one paragraph.

## After the poll finished (resumed session, 2026-11-21)

18. The poll ran on to 10:06 UTC (24 checks). Belgium and Finland were Unavailable in every one, so the VIES paragraph now reports the full two hours rather than only the first check (claims row 30 updated).
