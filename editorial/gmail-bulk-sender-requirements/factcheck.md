# Fact-check: gmail-bulk-sender-requirements

By t-20261115-blog-post-review on 2026-11-17. Every row of claims.md checked: each source page fetched on 2026-11-17 and searched for the quoted text; every `ours:` row rerun from the committed raw data and scripts (the HN query and sample.py reproduce `domains.txt` exactly). content-factcheck.json read first: its 6 blockers are our own survey numbers and figures with the link in the sentence above, all verified below.

| # | Verdict | Evidence |
|---|---|---|
| 1 | verified | Google FAQ 14229414 (opened 2026-11-17): "close to 5,000 messages or more to personal Gmail accounts within a 24-hour period" |
| 2 | verified | Google 81126 (opened 2026-11-17): 5,000+ section "Set up SPF and DKIM email authentication for your domain" |
| 3 | verified | Google 81126 (opened 2026-11-17): "Your DMARC enforcement policy can be set to none" |
| 4 | verified | Google 81126 (opened 2026-11-17): From "must be aligned with either the SPF domain or the DKIM domain" |
| 5 | verified | Google 81126 (opened 2026-11-17): "Marketing messages and subscribed messages must support one-click unsubscribe, and include a clearly visible unsubscribe link" |
| 6 | verified | Google 81126 (opened 2026-11-17): all-sender list "Keep spam rates reported in Postmaster Tools below 0.3%" |
| 7 | verified | Google 81126 (opened 2026-11-17): "below 0.10% and avoid ever reaching a spam rate of 0.30% or higher"; FAQ: "below 0.1%" and never "0.3% or higher" |
| 8 | verified | Google FAQ 14229414 (opened 2026-11-17): "eligible for mitigation when their spam rates remain below 0.3% for 7 consecutive days"; table: >0.3% → mitigations unavailable |
| 9 | verified | Google FAQ 14229414 (opened 2026-11-17): 2,500 from solarmora.com + 2,500 from promotions.solarmora.com = bulk, "same primary domain" |
| 10 | verified | Google FAQ 14229414 (opened 2026-11-17): exact quote present |
| 11 | verified | Google 81126 (opened 2026-11-17): all-sender list: SPF or DKIM, forward and reverse DNS (PTR), TLS, RFC 5322 |
| 12 | verified | Google FAQ 14229414 (opened 2026-11-17): "Starting November 2025, Gmail is ramping up its enforcement… temporary and permanent rejections"; 81126: spam or 5.7.26 rejection |
| 13 | fixed | Yahoo page gives no volume threshold, but it does give 0.3%, so "without giving a number" could be read as no spam-rate figure; now "without giving a volume threshold" |
| 14 | verified | Yahoo Sender Hub (opened 2026-11-17): "Implement SPF or DKIM at a minimum", "below 0.3%", forward and reverse DNS, "RFCs 5321 and 5322" |
| 15 | verified | Yahoo Sender Hub (opened 2026-11-17): "Implement both SPF & DKIM", "at least p=none - DMARC must pass" |
| 16 | verified | Yahoo Sender Hub (opened 2026-11-17): "Relaxed alignment is acceptable"; From aligned with SPF or DKIM domain |
| 17 | verified | Yahoo Sender Hub (opened 2026-11-17): one-click list-unsubscribe, visible link in body, "Honor unsubscribes within 2 days" |
| 18 | verified | Yahoo Sender Hub (opened 2026-11-17): "The Post (RFC 8058) method is highly recommended. The mail-to: method is acceptable" |
| 19 | verified | Yahoo Sender Hub (opened 2026-11-17): "Spam rate is calculated in our system based on mail delivered to the inbox" |
| 20 | fixed | Yahoo Sender Hub (opened 2026-11-17): "Beginning in February 2024, enforcement… will take effect"; the post said "rolled out", now "enforced from February 2024" |
| 21 | verified | Microsoft post 4399730 (opened 2026-11-17): applies to hotmail.com, live.com and outlook.com; "domains sending over 5,000 emails per day" |
| 22 | fixed | Microsoft post 4399730 (opened 2026-11-17): the 29 April update rejects non-compliant mail with "550; 5.7.515" from 5 May 2025; the Junk-folder sentence and "rejected in the future" note are in `<del>` on the page. The post said "Junk folder since 5 May 2025; rejection announced for a later date": now "Rejected with error 550 5.7.515 since 5 May 2025 (first announced as the Junk folder)" |
| 23 | verified | Microsoft post 4399730 (opened 2026-11-17): SPF "Must Pass", DKIM "Must Pass", DMARC "At least p=none and align with either SPF or DKIM (preferably both)" |
| 24 | verified | Microsoft post 4399730 (opened 2026-11-17): "Functional Unsubscribe Links" under recommendations; no deadline |
| 25 | verified | Microsoft post 4399730 (opened 2026-11-17) FAQ: "We advise moving gradually (none → quarantine → reject)" |
| 26 | verified | Microsoft post 4399730 (opened 2026-11-17): no complaint or spam-rate figure on the page |
| 27 | verified | Google FAQ 14229414 (opened 2026-11-17): "we recommend that you fulfill unsubscribe requests within 48 hours"; table row "Unsubscribe requests aren't honored within 48 hours" |
| 28 | verified | Google 81126 (opened 2026-11-17): both headers, List-Unsubscribe example with an https URL; RFC 8058 requires the HTTPS URI |
| 29 | verified | BLOG-PLAN.md lines 203 and 460 say search found 0.3% only on vendor sites |
| 30 | fixed | HN query reran 2026-11-17: nbHits 300. The sample kept scottbezek.blogspot.com and uberblok.storagebits.workers.dev, scored as Google's and Cloudflare's apex DNS though the post says free-hosting subdomains were dropped; added to SKIP in sample.py, now 163 domains (post, heading, description, Sources updated) |
| 31 | fixed | reran `analyze.py survey.json` on 2026-11-17 after the sample fix: mail_capable 117 (was 119; both dropped hosts were counted as mail domains with `v=spf1 -all`) |
| 32 | fixed | reran `analyze.py survey.json` on 2026-11-17 after the sample fix: 42/117 = 35.9%, post now 36% |
| 33 | fixed | reran `analyze.py survey.json` on 2026-11-17 after the sample fix: 75 / 40 / 16 / 19 / rua 42 = 64/34/14/16/36% |
| 34 | fixed | reran `analyze.py survey.json` on 2026-11-17 after the sample fix: 8 (6.8%), 1 (0.9%); rounded shares unchanged |
| 35 | fixed | reran `analyze.py survey.json` on 2026-11-17 after the sample fix: 87 / 13 / 7 = 74/11/6% |
| 36 | fixed | reran `extra.py survey.json dkim.json` on 2026-11-17 after the fixes: 30 (pug.sh has an SES bounce MX but wildcard DKIM, and was dropped before the SES test), 2 without DMARC, 19 of 28 at p=none |
| 37 | fixed | The post said "many domains only forward mail" and counted all 20 Cloudflare Email Routing domains, but 7 of them have a Resend DKIM key; reran `extra.py survey.json dkim.json` on 2026-11-17 after the fixes (`fwd_only`): 22 forward-only (11 Cloudflare, 11 Namecheap), 15 without DMARC; post rewritten to those numbers |
| 38 | verified | RFC 7208 §4.5: "more than one record, check_host() produces the \"permerror\" result" |
| 39 | verified | RFC 7208 §2.6.2 neutral "not asserting"; §2.6.5 softfail "weak statement"; §8.5 "SHOULD NOT reject the message based solely on this result" |
| 40 | fixed | `recheck.py` re-dug the 62 hits on 2026-11-17: 6 held no key (Fastmail `fm1` published with `p=` empty "Intentionally_Left_Blank_As_Per_DKIM_Rotation_BCP"; ulda.io Proton CNAME to a name with no TXT); dkim.py now needs a non-empty p=; reran `extra.py survey.json dkim.json` on 2026-11-17 after the fixes: 56 of 112 (50%), google 29, resend 20 |
| 41 | verified | Resend add-a-domain (opened 2026-11-17): "We strongly recommend sending emails from a subdomain" |
| 42 | verified | FAQ: primary-domain count; Postmaster 14668346 (opened 2026-11-17): "Compliance status dashboard data applies to primary domains only" |
| 43 | verified | SES mail-from guide (opened 2026-11-17): default "subdomain of amazonses.com"; MX "10 feedback-smtp.region.amazonses.com", TXT "v=spf1 include:amazonses.com ~all" |
| 44 | fixed | Resend: Return-Path "defaults to send.example.com" for the added domain; the post's setup adds mail.example.com, so the default is send.mail.example.com; post now says "a send. subdomain of the domain you add" |
| 45 | verified | reran `extra.py survey.json dkim.json` on 2026-11-17: send. MX 19, to amazonses 11 |
| 46 | verified | RFC 9989: adkim/aspf "default is \"r\""; relaxed = "same Organizational Domain" |
| 47 | verified | RFC 9989 header: May 2026, "Obsoletes: 7489, 9091" |
| 48 | verified | RFC 9989 Appendix A.6 "Removal of the \"pct\" Tag"; pct "historic" in registry; t=y test mode example |
| 49 | verified | RFC 9989 C.3: "reliance on a PSL has been replaced by a technique called a \"DNS Tree Walk\"" |
| 50 | verified | RFC 7208 §4.6.4: "MUST limit the total number of those terms to 10… If this limit is exceeded, the implementation MUST return \"permerror\"" |
| 51 | verified | RFC 8058 §3: one HTTPS URI, "List-Unsubscribe=One-Click"; "MUST NOT include cookies, HTTP authorization" |
| 52 | verified | RFC 8058: both headers "MUST be covered by the signature and included in the \"h=\" tag" |
| 53 | verified | Gmail help 29436 (opened 2026-11-17): More → Show original, "the full header shows" |
| 54 | verified | buffermint-tools src/privacy/_tools.json description matches; /tools/privacy/email-header-analyzer/ returns 200 live, not hidden |
| 55 | verified | buffermint-tools src/seo/_tools.json description matches; /tools/seo/email-subject-tester/ returns 200 live, not hidden |
| 56 | verified | Postmaster 14668346: all senders SPF and DKIM, DNS records, formatting, encryption, spam rate; bulk only DMARC, one-click, honor-unsubscribe; primary domains only; "up to 7 days" |
| 57 | verified | RFC 8058 January 2017; RFC 7208 April 2014; Microsoft post dated Apr 02, 2025, "April 29th Update", "Updated Apr 30, 2025" |
| 58 | verified | reran `analyze.py survey.json` on 2026-11-17: null_mx 2 |

No checkable claim missing from the list was found. Copying: an 8-word-shingle comparison of the post against all 12 fetched source texts matched only titles (RFC and Microsoft post names) and a sample DMARC record; quotes are under 25 words and attributed.

## Editor

Read as a small-SaaS founder deciding what to put in DNS before the first sign-up email.
- **Changed:** the Outlook.com "What happens if you miss" cell. It said Junk since 5 May 2025 with rejection later; Microsoft's 29 April 2025 update (the old text is struck through on the page) rejects with `550 5.7.515` from 5 May. Because it is the one hard consequence in the table, getting it wrong would mislead readers about the risk. Yahoo's cell said "rolled out", the page says enforcement "take[s] effect": now "enforced". claims.md rows 20 and 22 and research.md updated.
- **New angle is real:** a three-provider table built from their own pages that names where they disagree (threshold, 0.3% vs 0.1%, 48 h vs 2 days, mailto vs POST), plus our own reproducible DNS survey of 165 Show HN product domains (35% of mail domains without DMARC, forwarder-only SPF, broken SPF) and a concrete record table. This couldn't be written without the research, and it isn't one-source.
- **Reader value:** concrete records, commands, a checklist and the RFC 9989 changes. No filler intro; the answer is in the first paragraph.
- **Public copy:** neutral. It links only live public tools (header analyzer, subject tester) where they genuinely help, names no unreleased product and describes no funnel. Survey domains aren't named.
- **Dates:** dated 2026-11-17 (owner's answer); rules marked "as of November 2026" and "read on 15 November 2026", which stays true; I re-read every source on 17 November and only the Microsoft cell had to change.
- **Survey corrected (from the code-review pass):** two free-hosting hosts out of the sample, only live DKIM keys counted, the SES tests run on wildcard-DKIM domains too, and the forwarder paragraph counts only forward-only domains. The headline moved from 35% to 36% without DMARC; the post's argument doesn't change. Raw 2026-11-15 results were filtered, not re-dug; the DKIM recheck is dated 17 November in the Sources.
- **Clarified:** Yahoo "no volume threshold" (it does give 0.3%); Resend's default bounce subdomain follows the domain you add; the H2 and intro no longer call the sample "new" products (it includes established companies).
- **Not changed:** the length (about 2,300 words) is in range. The tables are dense but that is what the reader came for.
