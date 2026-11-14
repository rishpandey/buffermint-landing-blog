---
title: "Gmail bulk sender requirements, with Yahoo's and Outlook's rules"
seo_description: "Gmail bulk sender requirements next to Yahoo's and Outlook's, from their own pages, the DNS records a small SaaS needs, and what 165 new product domains publish."
keyword: gmail bulk sender requirements
author: Rishabh Pandey
show_meta: true
section: postContent
published: true
date: 2026-11-15
extends: _layouts.post
---

Gmail's bulk sender requirements apply once a domain sends about 5,000 messages a day to personal Gmail accounts: SPF and DKIM, a DMARC record (a policy of `none` is enough), a From domain that aligns with one of them, one-click unsubscribe on marketing mail, and a spam rate under 0.3%. Yahoo asks for nearly the same list without giving a number, and Outlook.com has asked for the authentication half since May 2025. A small SaaS is usually far below 5,000 a day, but Google counts every subdomain under your main domain together and never lets a domain drop back out, so the cheap move is to meet the bulk rules from your first email.

To see how new products actually do, we looked up the DNS of the 165 product domains that reached 10 points on Show HN in October 2026. Of the 121 that handle email at all, 42 (35%) publish no DMARC record, the one bulk requirement anyone can check from outside. Below: the rules side by side as of November 2026, where the three providers disagree, what we found in those domains, the DNS records to publish, and how to check yours.

## Gmail bulk sender requirements next to Yahoo's and Outlook's

All three providers split their rules into a floor for everyone and a stricter set for high-volume senders. This table is built from each provider's own page, read on 15 November 2026: [Google's sender guidelines](https://support.google.com/a/answer/81126) and [FAQ](https://support.google.com/a/answer/14229414), [Yahoo's Sender Hub](https://senders.yahooinc.com/best-practices/) and [Microsoft's announcement for Outlook.com](https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730).

| Rule | Gmail | Yahoo | Outlook.com |
|---|---|---|---|
| Who counts as bulk | About 5,000+ a day to personal Gmail accounts, per primary domain; permanent once reached | No number given | Over 5,000 a day to outlook.com, hotmail.com and live.com |
| Everyone: authentication | SPF or DKIM | SPF or DKIM | No rule below 5,000 |
| Everyone: other | Forward and reverse DNS, TLS, RFC 5322 format, spam rate under 0.3% | Forward and reverse DNS, RFC 5321/5322, spam rate under 0.3% | — |
| Bulk: authentication | SPF and DKIM | SPF and DKIM | SPF and DKIM must pass |
| Bulk: DMARC | Required, `p=none` allowed | Required, at least `p=none`, must pass | At least `p=none` |
| Bulk: alignment | From aligned with SPF or DKIM domain | From aligned with SPF or DKIM domain (relaxed is fine) | Aligned with SPF or DKIM, both preferred |
| Bulk: unsubscribe | One-click (RFC 8058) plus a visible link, on marketing and subscribed mail | One-click List-Unsubscribe plus a visible link; honor within 2 days | A working unsubscribe link (recommended) |
| What happens if you miss | Spam folder, temporary or permanent rejection; enforcement stepped up from November 2025 | Not spelled out; rolled out from February 2024 | Junk folder since 5 May 2025; rejection announced for a later date |

The authentication rules apply to every message, password resets included. The unsubscribe rules apply only to marketing and subscribed mail, so a receipt doesn't need a `List-Unsubscribe` header, while a product newsletter does.

## Where the three providers disagree

- **The bulk threshold.** Google and Microsoft both say 5,000 a day, but Google counts per primary domain: its FAQ's example adds `promotions.solarmora.com` to `solarmora.com`. Senders that reach it once "are permanently considered bulk senders", so one busy launch day changes the rules for good. Yahoo never gives a number, which is the practical argument for meeting the bulk rules at any volume.
- **The spam rate.** Our plan for this post noted that the "0.3%" figure kept turning up only on email vendors' blogs. It is in Google's own pages: 0.3% is the limit in the requirements, and the guidelines add that you should stay below 0.1% and never reach 0.3%. Above 0.3%, the [FAQ](https://support.google.com/a/answer/14229414) says Google offers no mitigation until the rate has stayed under it for seven days in a row. Yahoo also says 0.3% and computes it on mail that reached the inbox. Microsoft gives no figure.
- **Unsubscribe speed.** Yahoo says honor unsubscribes within 2 days. Google's FAQ text "recommends" 48 hours, but its own requirements table lists missing that window as a compliance problem. Microsoft asks for a working link and sets no deadline. Treat 48 hours as the rule.
- **Mailto or HTTPS.** Yahoo accepts a `mailto:` unsubscribe and only "highly recommends" the RFC 8058 POST. Google asks for the one-click headers with an HTTPS URL. One implementation of [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058.html) satisfies both.
- **How hard DMARC must be.** All three accept `p=none`. Microsoft's own FAQ suggests moving on to `quarantine` and then `reject`, and DMARC vendors push the same way, but none of the three requires it.

## What 165 new product domains publish

On 15 November 2026 we took every Show HN story from October 2026 with at least 10 points from the [Hacker News search API](https://hn.algolia.com/api) (300 stories), dropped links to code hosts, app stores, social sites and free hosting subdomains, and kept 165 distinct domains. For each we looked up the MX, SPF and DMARC records with `dig`, then probed 12 common DKIM selector names. Domains that answer for a made-up name (wildcard DNS) were left out of the DKIM count. Most are small, new products; a handful are established companies.

| Of the 121 domains with an MX or SPF record | Count | Share |
|---|---|---|
| A DMARC record | 79 | 65% |
| ↳ `p=none` | 41 | 34% |
| ↳ `p=quarantine` | 16 | 13% |
| ↳ `p=reject` | 22 | 18% |
| ↳ asks for aggregate reports (`rua`) | 45 | 37% |
| No DMARC record | 42 | 35% |
| No SPF record | 8 | 7% |
| Two SPF records (invalid) | 1 | 1% |
| SPF ending in `~all` / `-all` / `?all` | 87 / 17 / 7 | 72% / 14% / 6% |

Three things stood out.

**The domains visibly set up to send app mail mostly do publish DMARC.** 29 domains showed a sending service in their DNS: a DKIM key at Resend's or SendGrid's usual selector, an Amazon SES bounce subdomain, or SES in their SPF. Only 2 of them had no DMARC record, and 20 of the 27 that had one sat at `p=none`. Sending providers walk you through these records when you add a domain, and it shows.

**Many domains only forward mail.** 20 receive through Cloudflare Email Routing and 14 more have SPF records that include Namecheap's forwarding service. That's a fine way to get replies to a personal inbox, but such an SPF record authorizes only the forwarder. The day the product starts sending sign-up emails from that domain, the sending service's records have to be added, and DMARC still has to be published.

**A few SPF records are broken or toothless.** One domain publishes two SPF records, which [RFC 7208](https://www.rfc-editor.org/rfc/rfc7208.html) treats as a permanent error: neither counts. Seven end in `?all`, which says nothing about unlisted servers. Most use `~all` (softfail). That's normal and fine once DKIM and DMARC are in place.

DKIM is harder to count from outside, because you need the selector name to find the key. At least 62 of the 114 mail domains without wildcard DNS (54%) have a key at one of the 12 names we tried, most often `google` (29) and `resend` (20). The real share is higher.

## The DNS records a small SaaS needs

Here is a typical setup: staff mail on Google Workspace or another mailbox host, app mail (sign-ups, resets, receipts) through a transactional service, and a newsletter through a marketing tool. Each sending stream gets its own subdomain, as [Resend's docs](https://resend.com/docs/add-a-domain) recommend. Subdomains don't escape Gmail's bulk count or its compliance view, both of which roll up to `example.com`. What you gain is separate DKIM keys and bounce handling for each stream, and you can switch one off without touching the other.

| Name | Type | Value | Why |
|---|---|---|---|
| `example.com` | MX | your mailbox host's servers | receive replies |
| `example.com` | TXT | `v=spf1 include:<mailbox host> ~all` | staff mail passes SPF |
| `<selector>._domainkey.example.com` | TXT or CNAME | key from your mailbox host | staff mail passes DKIM |
| `<selector>._domainkey.mail.example.com` | TXT or CNAME | key from your transactional service | app mail from `@mail.example.com` passes DKIM, aligned |
| `bounce.mail.example.com` | MX + TXT | the service's bounce host and `v=spf1 include:<service> ~all` | custom bounce (MAIL FROM) domain, so SPF aligns too |
| `<selector>._domainkey.news.example.com` | TXT or CNAME | key from your newsletter tool | newsletter passes DKIM, aligned |
| `_dmarc.example.com` | TXT | `v=DMARC1; p=none; rua=mailto:dmarc@example.com` | one policy for the domain and its subdomains, plus reports |

Two notes on that table:

- **The bounce subdomain is what makes SPF count.** Amazon SES, for example, uses a subdomain of `amazonses.com` as the bounce address unless you set your own, and [its guide](https://docs.aws.amazon.com/ses/latest/dg/mail-from.html) has you publish an MX record (`10 feedback-smtp.<region>.amazonses.com`) and `v=spf1 include:amazonses.com ~all` on a subdomain of yours. Resend does the same at `send.example.com` by default. In our sample, 19 domains had an MX record on a `send.` subdomain, 11 of them pointing at SES. With relaxed alignment, the default, `bounce.mail.example.com` aligns with `@mail.example.com` because both sit under `example.com`.
- **DMARC got a new RFC in May 2026.** [RFC 9989](https://www.rfc-editor.org/rfc/rfc9989.html) replaces RFC 7489. For a small sender, two changes matter: the `pct` tag is gone (use `t=y` for a test-mode policy), and receivers now find your organizational domain by walking up the DNS tree instead of using the Public Suffix List. Existing `p=none` records still work. Start at `p=none` with `rua` reports, read them for a few weeks, and move to `quarantine` once every service you use shows up as passing.

Keep the root SPF record to the services that really send as `example.com`. SPF allows at most 10 DNS lookups per check, and past that the result is a permanent error (RFC 7208, section 4.6.4). That's easy to reach if every tool you ever tried is still `include:`d.

## One-click unsubscribe, done right

For a newsletter or any subscribed mail, [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058.html) asks for two headers:

```
List-Unsubscribe: <https://example.com/u/7f3c9a>, <mailto:unsub@example.com?subject=7f3c9a>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

- The URL must be HTTPS and must work on a plain `POST` with no cookie, login or confirmation page. The mailbox provider sends the POST for the user, with a body of `List-Unsubscribe=One-Click`.
- The message's DKIM signature must cover both headers. If it doesn't, the RFC says the receiver shouldn't offer one-click at all. Most sending services sign them for you; check before you hand-roll headers.
- Put a visible unsubscribe link in the body too. Google and Yahoo both ask for it, and it can lead to a preferences page.
- Process the request at once, or well within the 48 hours above.

## How to check your own domain

1. **Look up your records.** `dig +short TXT example.com`, `dig +short TXT _dmarc.example.com` and `dig +short MX example.com` show what receivers see. One SPF record, one DMARC record, MX only if you receive mail.
2. **Send a real message to a Gmail address and read the headers.** In Gmail, "Show original" shows SPF, DKIM and DMARC results. Paste the raw headers into our [email header analyzer](/tools/privacy/email-header-analyzer/) to see each check, the signing domain and the route the message took, in your browser. You want `dmarc=pass`, and a DKIM `d=` that matches your From domain.
3. **Add the domain to Google Postmaster Tools.** Its [Compliance status dashboard](https://support.google.com/mail/answer/14668346) checks SPF and DKIM, DNS, formatting, encryption and spam rate for every sender, plus DMARC and unsubscribe for bulk senders. It reports on primary domains only, and a fix can take up to 7 days to show.
4. **Watch complaints, not just authentication.** The spam rate is the requirement you can't fix in DNS. Send only to people who asked, keep the From name recognizable, and make subject lines say what's inside. Our [subject line tester](/tools/seo/email-subject-tester/) flags spam-trigger words and shows how a subject cuts off in an inbox preview.

## The checklist

- [ ] SPF on every domain you send from, one record each, under 10 lookups
- [ ] DKIM keys from every service that sends as you, on the subdomain it sends from
- [ ] A custom bounce (MAIL FROM) subdomain on your transactional service
- [ ] `_dmarc` record at `p=none` with `rua` reports; tighten after reading them
- [ ] One-click unsubscribe (RFC 8058) and a visible link on marketing mail, handled within 48 hours
- [ ] TLS and reverse DNS: your sending service handles both; check them if you run your own mail server
- [ ] Domain added to Google Postmaster Tools; spam rate under 0.1%

## Sources

- Google, [Email sender guidelines](https://support.google.com/a/answer/81126), [Email sender guidelines FAQ](https://support.google.com/a/answer/14229414) and [Postmaster Tools dashboards](https://support.google.com/mail/answer/14668346) (read 15 November 2026)
- Yahoo, [Sender best practices](https://senders.yahooinc.com/best-practices/) (read 15 November 2026)
- Microsoft, [Strengthening the email ecosystem: Outlook's new requirements for high-volume senders](https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730), 2 April 2025, updated later that month
- IETF, [RFC 8058: Signaling one-click functionality for list email headers](https://www.rfc-editor.org/rfc/rfc8058.html), January 2017
- IETF, [RFC 9989: Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://www.rfc-editor.org/rfc/rfc9989.html), May 2026
- IETF, [RFC 7208: Sender Policy Framework (SPF)](https://www.rfc-editor.org/rfc/rfc7208.html), April 2014
- Amazon Web Services, [Using a custom MAIL FROM domain](https://docs.aws.amazon.com/ses/latest/dg/mail-from.html) (Amazon SES developer guide)
- Resend, [Add a domain](https://resend.com/docs/add-a-domain) (read 15 November 2026)
- Hacker News, [search API](https://hn.algolia.com/api) (Show HN stories, October 2026)
- Ours: DNS lookups with `dig` on 15 November 2026 for 165 domains from that list, with the scripts kept alongside this post's research notes
