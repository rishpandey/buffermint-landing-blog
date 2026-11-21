# Edit: E-invoicing in France and the EU: what a small SaaS must do

Separate pass on 2026-11-21, after the draft, reading the whole post as an editor in the workflow's order.

## Checks
- **Does the opening answer the question?** Yes: paragraph 1 gives France's dates and the other three countries; paragraph 2 gives the answer most readers need (established vs not established); paragraph 3 says what we measured.
- **Does each section earn its place?** Table (the answer at a glance, with the "seller without an establishment" column no source has); France (the keyword, the three parts and the soft enforcement); Belgium/Germany/Poland (one paragraph each, each with its catch); Directory (our data); "What an e-invoice has to contain" (our rule count, worked example, the field list a reader can act on); outside the EU (the largest reader group); checklist. No section cut.
- **Filler, repetition, hedging:** cut "Here is what we found." Tightened the France "clear order" paragraph. The established/not-established point appears in the opening, the table and the outside-EU section on purpose (it is the main finding); each time it adds something.
- **Hype words:** none found ("gentlest" and "furthest, fastest" are comparisons the table supports).
- **One idea per paragraph:** split nothing; the Belgium paragraph is long but on one country.
- **Headings say what the section finds:** "France: receive now, send in 2027" and the others state the point; "What the Peppol Directory shows" kept.
- **Links work and help:** every government link opened on 2026-11-21. Internal links: /tools/dev/xml-formatter/, the three VAT calculators, /tools/everyday/invoice-generator/ (with the caveat that it makes a PDF, which is not an e-invoice in scope), /articles/merchant-of-record-fees.

## Changes
1. "Most of the 698 warnings flag elements that 'shall not be used'" → "Of the 698 warnings, 678 flag UBL elements an invoice 'should not include'": rechecked the .sch, the rule text says "should not include".
2. The VAT-block sentence said every case has 10–14 rules; Italy's split-payment block (B) has 2, so it now says "most VAT cases", and explains why a one-line invoice meets only a few dozen checks.
3. ViDA table row: "Details still to come from each country" (unsourced) → "Not settled on the Commission's page"; format column no longer says "real-time".
4. Directory paragraph: removed my guess that France's reform directory "is visible through Peppol"; now states only the count (990 of 1,000 use a France-specific scheme).
5. Method caveat: removed the unsourced claim that the access point always runs the official checks; now tells the reader to run them or make sure the provider does.
6. Field list: "enterprise number, which doubles as its Peppol address" → "the usual Peppol address there (scheme 0208, used by 599 of the first 1,000 Belgian directory entries)", backed by our sample.
7. ViDA paragraph: "without asking Brussels first" was my paraphrase; now "under the conditions it sets", with Poland's Council derogation as the before (MF page), and "Expect more countries" softened to "likely".
8. Outside-EU bullets: removed "they'll care that it's complete" and "often welcome" (guesses about customers); kept what the sources say.
9. Poland row: "tiny invoicers" → "under PLN 10,000 a month".
10. France order paragraph: "you should already have one" → "it has been required since September", and added e-reporting to the 2027 step.

## Changes after the code review
15. Worked example: the first script counted 36 "checks" with a duplicate (BR-S-02 = BR-CO-26 in its test) and R043 twice, and failed R043 when the buyer endpoint was missing, which the real rule (context `cbc:EndpointID[@schemeID='0208']`) never does. Rewrote `check-example.py`: 48 distinct fatal rules (added BR-21 to BR-27, BR-CO-04, BR-S-01/05/08/09/10), R043 only on 0208 identifiers, BR-CO-09 per identifier present, missing amounts fail the rule instead of crashing; `test_check_example.py` covers each. The post now says 48 rules, "2 rules failed", and explains R043 as the rule that catches a mistyped enterprise number.
16. France: the post implied a foreign seller has nothing to do in France. The DGFiP page for companies without a French establishment says they e-report when they charge French VAT themselves (not through the OSS), from 1 Sep 2027 for SMEs. Added a paragraph to the France section, a clause to the table and the outside-EU bullets, and the page to Sources; the B2B case now says the VAT-registered customer reports under the reverse charge.

## Content studio check
First run (2026-11-21): SEO score 85, 0 failed; fact check 11 blockers, 1 warning. Fixed:
11. Linked each country in the mandates table to its government page, and linked the €25,000 and €800,000 sentences to FPS Finance and the BMF FAQ (3 blockers gone).
12. Put the keyword in a heading ("E-invoicing in France: receive now, send in 2027").
13. Linked the Peppol Directory REST API docs where we say we queried it, and added them to Sources.
14. Split five paragraphs over 120 words (Belgium twice, Germany, the Directory paragraph, the ViDA paragraph); shortened the "receive deadlines" sentence.

Last run: SEO score 88, 0 failed (warnings: slug without the keyword, which we keep because the post is EU-wide; the exact phrase "e invoicing france" never appears because the post writes "e-invoicing in France"; average sentence 22 words; the mandates table counts as one long paragraph). Fact check: 8 blockers, 4 warnings.

Why the blockers stay: all 8 are our own numbers (the €49 worked example and its €10.29 / €59.29 sums, the Peppol Directory counts, the 1,000-result samples, and the checklist repeating the €800,000 and PLN 10,000 thresholds that are linked in the table). Each is sourced in claims.md (rows 12, 16, 38–40, 46). The tool can't read claims.md or our scripts.

Why the warnings stay: the €25,000, €800,000, PLN 200 million and PLN 10,000 figures are on the linked pages written in local number formats ("25.000 euro", "800.000 Euro", "200 mln zł", "10 000 zł"), which the checker doesn't match. The KPMG fines (€1,500 / €3,000 / €5,000) are on the KPMG page (read through a fetcher on 2026-11-21, written there as "EUR 1.500"). See claims.md rows 12, 16, 33, 35.
