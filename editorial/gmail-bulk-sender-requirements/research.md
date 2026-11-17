# Research: Gmail, Yahoo and Outlook sender rules for a SaaS's email

## Question
Reader: a founder or developer of a small SaaS that sends sign-up confirmations, password resets, receipts and maybe a newsletter, often from a transactional provider (Resend, Postmark, SES, SendGrid) plus a mailbox at Google Workspace or elsewhere. They want to know: which of the big three mailbox providers' rules apply to them at their volume, what exactly each provider requires (and where they differ), what DNS records to publish, and how to check them, as of November 2026.

Target keyword: `gmail bulk sender requirements`. Demand from `keywords.json` (Content studio, run 2026-11-15): band high, score 100, best rank 1, suggested on both Google and Bing (13 lists), informational intent. Content studio found no matching Wikipedia article ("Email" was off-topic and ignored), so there's no topic-interest figure. Autosuggest proves the phrase is typed, never how often, so the post gives no volume. BLOG-PLAN.md also has `dmarc` as a level-2 head term with 690 HN mentions and 16,517 Wikipedia views a month (2026-10-29).

Why topic 16: topic 12 is still blocked (needs logged-in accounts on 8 apps); 13–15 are published; 16 is the next `next` topic.

What's newer since the plan (2026-10-29): DMARC has a new core RFC, RFC 9989 (May 2026), which obsoletes RFC 7489 and drops the `pct` tag. Gmail's FAQ says enforcement on non-compliant traffic ramped up from November 2025, including permanent rejections.

## Sources
- https://support.google.com/a/answer/81126 (Google, Email sender guidelines; read 2026-11-15): all senders: SPF or DKIM, valid forward and reverse DNS, TLS, spam rate in Postmaster Tools under 0.3%, RFC 5322 formatting, don't impersonate Gmail From headers. Over 5,000 messages/day: SPF and DKIM, DMARC (policy may be none), From aligned with the SPF or the DKIM domain, one-click unsubscribe plus a visible unsubscribe link for marketing and subscribed mail. Monitoring section: keep under 0.10%, never reach 0.30%. Unauthenticated mail may be junked or rejected with a 5.7.26 error.
- https://support.google.com/a/answer/14229414 (Google, Email sender guidelines FAQ; read 2026-11-15): "Starting in November 2025, Gmail is ramping up its enforcement on non-compliant traffic", temporary (4.7.x) and permanent (5.7.x) rejections. Bulk = close to 5,000 or more to personal Gmail accounts in 24 hours, counted per primary domain (subdomains roll up; their example solarmora.com + promotions.solarmora.com); once a bulk sender, permanently. Above 0.3% spam rate: no mitigation until under 0.3% for seven consecutive days. Unsubscribes: recommends within 48 hours (the requirements table lists not honouring them within 48 hours as an issue).
- https://support.google.com/mail/answer/14668346 (Google, Postmaster Tools dashboards; read 2026-11-15): Compliance status checks for all senders (SPF and DKIM, DNS records, formatting, encryption, user-reported spam rate) and bulk only (DMARC, one-click unsubscribe, honour unsubscribe); applies to primary domains only; changes can take up to 7 days to show.
- https://senders.yahooinc.com/best-practices/ (Yahoo Sender Hub; read 2026-11-15): all senders: SPF or DKIM, spam rate under 0.3%, valid forward/reverse DNS, RFC 5321/5322. Bulk: SPF and DKIM, DMARC at least p=none and passing, rua recommended, From aligned with SPF or DKIM domain (relaxed OK), one-click List-Unsubscribe (RFC 8058 POST highly recommended, mailto acceptable), visible unsubscribe link, honour unsubscribes within 2 days. Yahoo gives no volume number for "bulk".
- https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730 (Microsoft Defender for Office 365 blog, posted 2 April 2025, updated end of April 2025; read 2026-11-15): applies to outlook.com, hotmail.com, live.com; domains sending over 5,000 emails a day; SPF must pass, DKIM must pass, DMARC at least p=none aligned with SPF or DKIM (preferably both). Recommended: valid From/Reply-To, working unsubscribe link, list hygiene. From 5 May 2025 non-compliant mail goes to Junk; rejection code given as "550; 5.7.515 Access denied…"; rejection at a later date.
- https://www.rfc-editor.org/rfc/rfc8058.html (IETF, RFC 8058, January 2017; read 2026-11-15): List-Unsubscribe with one HTTPS URI plus List-Unsubscribe-Post: List-Unsubscribe=One-Click; a valid DKIM signature must cover both headers (h=); the POST must not need cookies or auth; receivers need the user's consent before posting.
- https://www.rfc-editor.org/rfc/rfc9989.html (IETF, RFC 9989, May 2026; read 2026-11-15): DMARC now Standards Track; obsoletes RFC 7489 and RFC 9091; DNS tree walk replaces the Public Suffix List for the organizational domain; `pct` removed, `t=y` test flag added; new `np` (non-existent subdomain policy) and `psd` tags.
- https://docs.aws.amazon.com/ses/latest/dg/mail-from.html (AWS, SES developer guide; read 2026-11-15): default MAIL FROM is a subdomain of amazonses.com; a custom MAIL FROM subdomain needs one MX `10 feedback-smtp.<region>.amazonses.com` and TXT `v=spf1 include:amazonses.com ~all`; for SPF to satisfy DMARC the From domain must match the MAIL FROM domain; the subdomain shouldn't be used for sending or receiving.
- https://resend.com/docs/add-a-domain and https://resend.com/docs/dashboard/domains/introduction (Resend docs; read 2026-11-15): Return-Path defaults to `send.example.com`; "We strongly recommend sending emails from a subdomain"; exact records come from the dashboard.

Our own data (2026-11-15, buffermint-vps, scripts in this folder's claims.md):
- Sample: every Show HN story created in October 2026 with 10+ points, from the HN Algolia API: 300 stories. Hosts other than code hosts, app stores, social sites and free hosting subdomains (github.com, *.vercel.app, *.github.io, etc.): 165 domains (all different registrable domains).
- `dig` for MX and SPF at the registrable domain and DMARC at `_dmarc.<host>` then the registrable domain.
- 121 of 165 publish an MX or an SPF record (117 an MX); 2 of those have only a null MX (declare no mail) and are left out, so 119 mail domains. Of those 119: no SPF 8, two SPF records 1 (an SPF permerror), SPF ending `~all` 87, `-all` 15, `?all` 7, no `all` 1. DMARC: none 42 (35%), p=none 40, quarantine 16, reject 21; rua on 44. (Updated after the code review; first count included the 2 null-MX domains.)
- Mail hosts: Google 40, Cloudflare Email Routing 20, Fastmail 7, Proton 3, Zoho 3, Microsoft 2, ImprovMX 2, other 40 (14 of the SPF records include Namecheap's forwarding, 13 with nothing else). Amazon SES appears in 9 SPF records.
- DKIM can't be listed from DNS without the selector; see the probe in claims.md (common selectors only, a lower bound).

## Disagreements
- **Is there a number for "bulk"?** Google and Microsoft say 5,000 a day (Google: to personal Gmail accounts, per primary domain, permanently once reached; Microsoft: per domain, to Outlook.com consumer addresses). Yahoo gives no number. So the safe reading for a SaaS: meet the bulk rules from day one; they cost an afternoon of DNS.
- **Spam rate: 0.1% or 0.3%?** The plan noted the 0.3% figure was found only on vendor blogs. It is in Google's own pages: 0.3% is the limit in the requirements, and the guidelines and FAQ say keep it under 0.1%. Yahoo also says 0.3%, computed on inbox-delivered mail. Microsoft gives no figure.
- **Unsubscribe speed.** Yahoo: within 2 days. Google: "recommend" within 48 hours in prose, but its table lists missing 48 hours as a non-compliance. Microsoft: a working link, no deadline.
- **Mailto unsubscribe.** Yahoo accepts mailto; Google's guidelines want the RFC 8058 POST headers (HTTPS). So implement RFC 8058.
- **DMARC p=none.** All three accept p=none as the minimum. Vendors (and Microsoft's own FAQ) push towards quarantine/reject; not required.
- **Outlook enforcement.** The Microsoft post says Junk from 5 May 2025 and rejection "at a future date", while also quoting a rejection code: ambiguous; say Junk now, rejection announced but not dated in the post. *(Resolved in review, 2026-11-17: in the page's HTML the Junk sentence and the "future date" note are struck through; the 29 April update rejects with 550 5.7.515 from 5 May 2025. The post says so.)*
- **Transactional vs marketing.** Unsubscribe rules apply to marketing and subscribed messages (Google, Yahoo); authentication applies to everything. A password reset needs SPF/DKIM/DMARC alignment but no unsubscribe header.

## New angle
1. Our own DNS survey of the 165 product domains launched on Show HN in October 2026: how many would pass the DNS half of the bulk rules (DMARC present: 77 of 119 mail domains, 65%; 42, 35%, have none), the SPF mistakes we saw, and which mail setups they use (many receive through forwarding services whose SPF only covers the forwarder).
2. One checklist reconciled from the three providers' own pages, with the disagreements shown (bulk threshold, unsubscribe speed, mailto, spam rate), and the 0.3% figure traced to Google's pages.
3. The DNS records a small SaaS needs, with transactional and marketing mail on separate subdomains (why: Google counts subdomains under the primary domain for the threshold, but spam complaints and reputation still sit with the sending domain; the SES/Resend MAIL FROM pattern), and the RFC 9989 changes (pct gone, t=y).

## Outline
- Opening: the answer. Below 5,000 a day only the basic rules bind, but Google counts per primary domain and bulk status is permanent, so set up the bulk rules from the start. Our survey number in one line.
- The rules side by side: table (all senders / bulk, Google, Yahoo, Microsoft).
- Where they disagree: bulk threshold, unsubscribe speed, mailto, spam-rate number.
- What we found in 165 Show HN product domains: DMARC, SPF errors, forwarding setups.
- The DNS records a small SaaS needs: worked example with app.example / mail subdomains, SPF, DKIM, DMARC; RFC 9989 notes.
- One-click unsubscribe, done right: RFC 8058 headers and the endpoint.
- How to check: Postmaster Tools compliance dashboard, send a test to Gmail and read the headers (our email header analyzer), dig.
- Checklist.
- Sources.
