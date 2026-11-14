# Claims: gmail-bulk-sender-requirements

Our own data: DNS lookups from buffermint-vps on 2026-11-15 by lane t-20261115-blog-post. Scripts in `survey/` next to this file (run with `python3 -I`):
1. Sample: `curl "https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&numericFilters=created_at_i%3E%3D1790812800,created_at_i%3C1793491200,points%3E%3D10&hitsPerPage=1000"` (1 Oct 2026 00:00 UTC to 1 Nov 2026 00:00 UTC, 10+ points): 300 hits, nbHits 300. Hosts minus code hosts, app stores, social sites and free hosting subdomains (list in the one-liner kept in research notes: github.com, gitlab.com, youtube.com, apps.apple.com, play.google.com, huggingface.co, arxiv.org, codeberg.org, npmjs.com, pypi.org, Chrome Web Store, news.ycombinator.com, twitter.com, x.com, medium.com, substack.com, vercel.app, netlify.app, github.io, pages.dev, itch.io, producthunt.com, reddit.com, addons.mozilla.org, crates.io, docs.google.com, VS Code marketplace, fly.dev, onrender.com, replit.app, lovable.app, streamlit.app), `www.` stripped: 165 hosts in `survey/domains.txt`, 165 distinct registrable domains.
2. `survey.py domains.txt survey.json`: `dig +short` MX and TXT (SPF) at the registrable domain; DMARC TXT at `_dmarc.<host>`, then `_dmarc.<registrable domain>`.
3. `analyze.py survey.json`: counts below. "Mail domain" = a non-null MX or an SPF record.
4. `dkim.py survey.json dkim.json`: TXT and CNAME at `<sel>._domainkey.<domain>` for google, resend, selector1, s1, k1, default, mail, dkim, sig1, protonmail, fm1, zmail; MX at `send.<domain>`. `control.py dkim.json`: the same lookups for a made-up selector `zq7xk2bm` and host; domains answering are wildcard and excluded (7 for DKIM, 7 for `send.` MX).

| # | Claim (as written in the post) | Source | What the source says |
|---|---|---|---|
| 1 | Gmail bulk rules apply at about 5,000 messages a day to personal Gmail accounts | https://support.google.com/a/answer/14229414 | bulk sender = "close to 5,000 messages or more" to personal Gmail accounts "within a 24-hour period" |
| 2 | Bulk: SPF and DKIM | https://support.google.com/a/answer/81126 | 5,000+ section: set up SPF and DKIM |
| 3 | Bulk: a DMARC record, a policy of `none` is enough | https://support.google.com/a/answer/81126 | set up DMARC; enforcement policy can be set to none |
| 4 | Bulk: From domain aligned with SPF or DKIM domain | https://support.google.com/a/answer/81126 | From "must be aligned with either the SPF domain or the DKIM domain" |
| 5 | Bulk: one-click unsubscribe plus a visible link, on marketing and subscribed mail | https://support.google.com/a/answer/81126 | marketing and subscribed messages must support one-click unsubscribe and include a clearly visible unsubscribe link in the body |
| 6 | Spam rate under 0.3% (all senders, Gmail) | https://support.google.com/a/answer/81126 | keep spam rates reported in Postmaster Tools below 0.3% |
| 7 | Guidelines say stay below 0.1% and never reach 0.3% | https://support.google.com/a/answer/81126 ; https://support.google.com/a/answer/14229414 | "below 0.10%" and "avoid ever reaching a spam rate of 0.30% or higher"; FAQ: "below 0.1%", prevent reaching "0.3% or higher" |
| 8 | Above 0.3%, no mitigation until under it for seven days in a row | https://support.google.com/a/answer/14229414 | ineligible for mitigation above 0.3%; eligibility back after rate "remain below 0.3% for seven consecutive days" |
| 9 | Google counts every subdomain under the primary domain together; example promotions.solarmora.com + solarmora.com | https://support.google.com/a/answer/14229414 | messages from the same primary domain counted together; example solarmora.com and promotions.solarmora.com |
| 10 | Senders that reach it once "are permanently considered bulk senders" | https://support.google.com/a/answer/14229414 | "Senders who meet the above criteria at least once are permanently considered bulk senders" |
| 11 | Gmail all senders: SPF or DKIM; forward and reverse DNS; TLS; RFC 5322 format | https://support.google.com/a/answer/81126 | all-sender list: SPF or DKIM, valid forward and reverse DNS (PTR), TLS, RFC 5322 |
| 12 | Gmail: spam folder, temporary or permanent rejection; enforcement stepped up from November 2025 | https://support.google.com/a/answer/14229414 ; https://support.google.com/a/answer/81126 | "Starting in November 2025, Gmail is ramping up its enforcement on non-compliant traffic"; "temporary and permanent rejections"; 81126: may be marked as spam or rejected (5.7.26) |
| 13 | Yahoo asks for nearly the same list without giving a number | https://senders.yahooinc.com/best-practices/ | bulk requirements listed; page gives no volume threshold |
| 14 | Yahoo all senders: SPF or DKIM, forward/reverse DNS, RFC 5321/5322, spam rate under 0.3% | https://senders.yahooinc.com/best-practices/ | "Implement SPF or DKIM at a minimum"; "Keep your spam rate below 0.3%"; valid forward and reverse DNS; comply with RFCs 5321 and 5322 |
| 15 | Yahoo bulk: SPF and DKIM; DMARC at least p=none, must pass | https://senders.yahooinc.com/best-practices/ | "Implement both SPF & DKIM"; DMARC "at least p=none"; DMARC must pass |
| 16 | Yahoo: aligned with SPF or DKIM domain (relaxed is fine) | https://senders.yahooinc.com/best-practices/ | From aligned with SPF or DKIM domain; relaxed alignment acceptable |
| 17 | Yahoo: one-click List-Unsubscribe plus visible link; honor within 2 days | https://senders.yahooinc.com/best-practices/ | functioning one-click List-Unsubscribe; visible link in the body; "Honor unsubscribes within 2 days" |
| 18 | Yahoo accepts mailto and calls the RFC 8058 POST "highly recommended" | https://senders.yahooinc.com/best-practices/ | RFC 8058 POST "highly recommended", mailto acceptable |
| 19 | Yahoo computes the spam rate on mail that reached the inbox | https://senders.yahooinc.com/best-practices/ | spam rate calculated from mail delivered to the inbox |
| 20 | Yahoo: consequence not spelled out; rolled out from February 2024 | https://senders.yahooinc.com/best-practices/ | enforcement began February 2024, rolled out gradually |
| 21 | Outlook.com: over 5,000 a day to outlook.com, hotmail.com and live.com | Microsoft techcommunity post (URL in post) | consumer domains hotmail.com, live.com, outlook.com; domains "sending more than 5,000 emails per day" |
| 22 | Outlook has asked for the authentication half since May 2025; Junk folder since 5 May 2025; rejection announced for a later date | Microsoft techcommunity post | after 5 May 2025 non-compliant mail routed to Junk; rejection at a future date to be announced |
| 23 | Outlook: SPF and DKIM must pass; DMARC at least p=none aligned with SPF or DKIM, both preferred | Microsoft techcommunity post | SPF must pass; DKIM must pass; DMARC "at least p=none" aligned with SPF or DKIM (preferably both) |
| 24 | Outlook: working unsubscribe link (recommended), no deadline | Microsoft techcommunity post | recommended practices: functional unsubscribe link; no time limit given |
| 25 | Microsoft's FAQ suggests moving on to quarantine and then reject | Microsoft techcommunity post (FAQ) | move gradually from p=none to quarantine to reject |
| 26 | Microsoft gives no spam-rate figure | Microsoft techcommunity post | no complaint-rate number on the page |
| 27 | Google's FAQ says "we recommend" 48 hours, its table lists missing it as a compliance problem | https://support.google.com/a/answer/14229414 | "we recommend that you fulfil unsubscribe requests within 48 hours"; table: "Unsubscribe requests aren't honoured within 48 hours" |
| 28 | Google asks for the one-click headers with an HTTPS URL | https://support.google.com/a/answer/81126 | List-Unsubscribe-Post: List-Unsubscribe=One-Click and List-Unsubscribe with an HTTPS URL |
| 29 | Our plan noted the 0.3% figure turned up only on vendor blogs | ours: BLOG-PLAN.md topic 16 and line 460 ("search again found it only on vendor sites") | as stated |
| 30 | 165 product domains that reached 10 points on Show HN in October 2026; 300 stories | ours: step 1 | 300 hits; 165 domains |
| 31 | 121 handle email (MX or SPF) | ours: analyze.py `mail_capable` | 121 |
| 32 | 42 (35%) publish no DMARC record | ours: analyze.py `dmarc_none` | 42/121 = 34.7% |
| 33 | DMARC 79 (65%); p=none 41 (34%); quarantine 16 (13%); reject 22 (18%); rua 45 (37%) | ours: analyze.py | 41+16+22 = 79; 79/121 = 65.3%, 33.9%, 13.2%, 18.2%, 37.2% |
| 34 | No SPF 8 (7%); two SPF records 1 (1%) | ours: analyze.py `spf_none`, `spf_multiple` | 8/121 = 6.6%; 1/121 = 0.8% |
| 35 | SPF ending ~all 87 (72%), -all 17 (14%), ?all 7 (6%) | ours: analyze.py `spf_all_*` | 71.9%, 14.0%, 5.8% (1 more has no `all`) |
| 36 | 29 domains showed a sending service; only 2 had no DMARC; 20 of 27 at p=none | ours: one-liner over survey.json + dkim.json (resend/s1/k1 selector, `send.` MX at amazonses, or amazonses in SPF; wildcard excluded) | 29; 2 without DMARC; 20 p=none |
| 37 | 20 receive through Cloudflare Email Routing; 14 more include Namecheap's forwarding in SPF | ours: MX containing `mx.cloudflare.net` = 20; SPF including `spf.efwd.registrar-servers.com` = 14; overlap 0 | as stated |
| 38 | Two SPF records: RFC 7208 treats as a permanent error | https://www.rfc-editor.org/rfc/rfc7208.html §4.5 | more than one record → "permerror" |
| 39 | ?all is neutral; ~all softfail; RFC 7208 advises not rejecting on softfail alone | https://www.rfc-editor.org/rfc/rfc7208.html §2.6.3, §2.6.5, §8.5 | neutral = no assertion; softfail "weak statement"; receivers shouldn't reject solely on softfail |
| 40 | At least 62 of 114 mail domains without wildcard DNS (54%) have a key at one of 12 names; google 29, resend 20 | ours: control.py | 121 − 7 wildcard = 114; 62; google 29, resend 20 |
| 41 | Resend docs recommend sending from a subdomain | https://resend.com/docs/add-a-domain | "We strongly recommend sending emails from a subdomain" |
| 42 | Subdomains don't escape Gmail's bulk count or its compliance view | https://support.google.com/a/answer/14229414 ; https://support.google.com/mail/answer/14668346 | subdomains roll up to primary domain; compliance dashboard "applies to primary domains only" |
| 43 | SES uses a subdomain of amazonses.com unless you set your own; MX `10 feedback-smtp.<region>.amazonses.com` and `v=spf1 include:amazonses.com ~all` | https://docs.aws.amazon.com/ses/latest/dg/mail-from.html | as quoted in the guide's record table |
| 44 | Resend does the same at send.example.com by default | https://resend.com/docs/add-a-domain | Return-Path "defaults to `send.example.com`" |
| 45 | 19 domains had an MX on a send. subdomain, 11 pointing at SES | ours: control.py `send_mx`, `send_mx_amazonses` | 19; 11 |
| 46 | Relaxed alignment is the default; same organizational domain aligns | https://www.rfc-editor.org/rfc/rfc9989.html (§11.8 "default alignment (relaxed)", Appendix B.1.1 example 2) | identifiers "in relaxed alignment because they both have the same Organizational Domain" |
| 47 | RFC 9989, May 2026, replaces RFC 7489 | https://www.rfc-editor.org/rfc/rfc9989.html | May 2026; obsoletes RFC 7489 and RFC 9091 |
| 48 | pct removed; t=y for test mode | https://www.rfc-editor.org/rfc/rfc9989.html | Appendix A.6 "Removal of the 'pct' Tag"; `t` tag test mode |
| 49 | Organizational domain by DNS tree walk instead of the Public Suffix List | https://www.rfc-editor.org/rfc/rfc9989.html | "DNS Tree Walk" replaces PSL |
| 50 | SPF allows at most 10 DNS lookups; past that a permanent error (§4.6.4) | https://www.rfc-editor.org/rfc/rfc7208.html §4.6.4 | limit of 10 DNS-querying terms; exceeding → permerror |
| 51 | RFC 8058 headers; HTTPS; POST with no cookie or login; body List-Unsubscribe=One-Click | https://www.rfc-editor.org/rfc/rfc8058.html | List-Unsubscribe-Post: List-Unsubscribe=One-Click; one HTTPS URI; POST must not include cookies or authorization; body "List-Unsubscribe=One-Click" |
| 52 | DKIM signature must cover both headers, else receiver shouldn't offer one-click | https://www.rfc-editor.org/rfc/rfc8058.html | valid DKIM signature covering both headers in h=; otherwise no one-click |
| 53 | Gmail "Show original" shows the full header | https://support.google.com/mail/answer/29436 | More → Show original; "the full header is shown" |
| 54 | Email header analyzer: SPF, DKIM, DMARC results, sender mismatches, delivery hops; runs in the browser | ours: buffermint-tools `src/privacy/_tools.json` email-header-analyzer desc | "SPF, DKIM and DMARC results, sender mismatches, delivery hops and delays … Runs in your browser" |
| 55 | Subject tester flags spam-trigger words, capitals and length; phone and desktop previews | ours: buffermint-tools `src/seo/_tools.json` email-subject-tester desc | "phone and desktop inbox previews, length, spam-trigger words, capitals" |
| 56 | Postmaster Compliance status: SPF and DKIM, DNS, formatting, encryption, spam rate for all; DMARC and unsubscribe for bulk; primary domains only; up to 7 days | https://support.google.com/mail/answer/14668346 | as quoted in research.md |
| 57 | RFC 8058 January 2017; RFC 7208 April 2014; Microsoft post 2 April 2025, updated later that month | the three pages | as stated |
