---
featured_image: assets/img/uploads/cookieless-analytics-small-saas-cover-47c522-1200.jpeg
featured_thumbnail: assets/img/uploads/cookieless-analytics-small-saas-cover-47c522-600.jpeg
title: "Cookieless analytics compared: GoatCounter, Plausible, Umami"
seo_description: "Cookieless analytics on our own server: GoatCounter at 33 MB of RAM, 3 ms a hit. How it compares with Plausible and Umami on cost, counting and consent."
keyword: cookieless analytics
author: Rishabh Pandey
show_meta: true
section: postContent
published: true
date: 2026-11-14
extends: _layouts.post
---

Cookieless analytics tools count your visitors without storing anything in their browser, and the three open-source ones most small sites look at, GoatCounter, Plausible and Umami, all do that. What they don't do is make the consent question go away in the EU: the regulators' guidance is about reading information from a visitor's device, not only cookies. Pick by how you want to run the tool and how you want "a visitor" counted, then check the consent conditions that apply where your readers are.

We've run GoatCounter on our own server since 23 October 2026. Since its last restart 20 days ago it has used about 0.1% of one CPU core and sits at 33 MB of memory (83 MB at its peak), and over 23 days of logs it answered each counted hit in a median of 3 milliseconds. Below are those numbers, how each tool decides who counts as one visitor, what each costs at small-site traffic, and where the law stood in November 2026.

## How cookieless analytics counts a visitor

None of the three sets a cookie. Each one recognizes a returning visitor on the server, from the visitor's IP address and browser string, for a limited time. That time differs, and it changes what "unique visitors" means on each dashboard.

| | GoatCounter | Plausible | Umami |
|---|---|---|---|
| Built from | site + browser string + IP | daily salt + domain + IP + browser string | site + IP + browser string + salt |
| Same person counts as one visitor for | 8 hours | one day (salt rotated every 24 hours) | one calendar month (default) |
| Raw IP stored | no | no | no IP column in its session table |
| Where it's documented | [sessions help page](https://www.goatcounter.com/help/sessions) | [data policy](https://plausible.io/data-policy) | the [source code](https://github.com/umami-software/umami) (no docs page) |

GoatCounter keeps the key in memory only, mapped to a random ID, and drops it after 8 hours; the IP and browser string never reach its database. Plausible hashes the inputs with a salt it rotates and deletes every 24 hours, so nobody can recompute yesterday's IDs.

Umami's session ID is a hash of the site, IP, browser string and a salt that, unless you set `SALT_ROTATION`, changes at the start of each month. That salt is derived from the month's start date and the server's secret, not a random value that is thrown away.

The practical result: someone who reads your blog on Monday and again on Thursday is one visitor that month in Umami, two in Plausible, and two in GoatCounter. Treat "unique visitors" as a tool-specific number. Compare it with itself over time, never with another tool's figure.

## What our GoatCounter costs to run

We self-host GoatCounter 2.7.0, the current release, with its built-in SQLite database, on a virtual server with 6 cores and 11.4 GB of RAM that also runs everything else we host. On 14 November 2026, after 20 days and 15 hours since its last restart (the hit counts below cover our whole log, from 23 October):

| Measure | Value |
|---|---|
| Memory now (systemd) | 33.3 MB |
| Memory peak | 83.4 MB, under a 150 MB limit we set |
| Resident memory (`ps`) | 23 MB |
| CPU time | 29 min 45 s in total, about 0.1% of one core |
| Program size | 29 MB, one file |
| Hits handled, 23 Oct to 14 Nov | 2,261 answered of 2,292 |
| Time per hit | median 3.1 ms, 95th percentile 8.0 ms |

The hit counts and timings come from our web server's access log for the stats host. The busiest day was 464 hits and the median day 48, so this is small-site traffic: about 3,000 hits a month at that rate. We didn't measure the database's size.

For comparison, Plausible's self-hosted Community Edition runs ClickHouse alongside the app, and its maintainers recommend [at least 2 GB of RAM](https://github.com/plausible/community-edition) to avoid running out of memory. Umami needs [Node.js 20.19 or newer and PostgreSQL 12.14 or newer](https://docs.umami.is/docs/install); it gives no RAM figure. If you already run a Postgres database, Umami adds little. If you have nothing, GoatCounter is the smallest thing to keep alive: one program and one file of data.

## Self-host or pay: what each costs at small-site traffic

Prices as of November 2026, from each tool's own page:

| | GoatCounter | Plausible | Umami |
|---|---|---|---|
| Free hosted option | yes, "for reasonable public usage" | no (30-day trial) | Hobby: 100K events a month, 1 site, 6 months of data |
| First paid plan | none listed | Starter $9 a month, up to 10k pageviews, 1 site | Pro $20 a month, 1M events, 20 sites, 2 years of data |
| What counts toward the limit | not stated | pageviews and custom events | pageviews, events and each saved event property |
| Self-hosted license | open source, any purpose | AGPLv3, releases twice a year | open source (self-host with Postgres) |

Sources: [GoatCounter](https://www.goatcounter.com/), [Plausible pricing](https://plausible.io/#pricing) and [plan docs](https://plausible.io/docs/subscription-plans), [Umami pricing](https://umami.is/pricing), [Plausible's self-hosting page](https://plausible.io/self-hosted-web-analytics).

At our traffic (about 3,000 hits a month), GoatCounter's hosted service and [Umami's Hobby plan](https://umami.is/pricing) cost nothing, and [Plausible](https://plausible.io/#pricing) costs $9 a month, or $108 a year before the yearly discount of two months free. Watch the meter on the paid plans: Plausible counts every custom event, such as an outbound click or a download, against the same limit as pageviews, and Umami counts each saved event property as an event too. A site that tracks five events per page view uses its allowance six times as fast.

Self-hosting Plausible also costs features. Its Community Edition has no funnels, user journeys, ecommerce revenue goals, SSO or sites API, gets only basic bot filtering, and ships twice a year. Plausible's own page calls it infrastructure you maintain, not software you install once.

## Script weight, measured the same day

We downloaded each tool's standard tracking script on 14 November 2026 and compressed it with `gzip -9`:

| Script | Size | Gzipped |
|---|---|---|
| Plausible `script.js` | 2,841 B | 1,295 B |
| Our own sender for GoatCounter | 5,003 B | 2,145 B |
| GoatCounter `count.js` | 9,213 B | 3,329 B |
| Umami `script.js` | 9,246 B | 4,144 B |

GoatCounter's own claim of about 3.5 KB matches its gzipped size. The largest is about 4 KB over the wire, so script weight shouldn't decide your choice; when we measured our own [Core Web Vitals](/articles/core-web-vitals-small-site/), images and our site's own JavaScript were what moved. We wrote our own sender instead of using `count.js` so that it never sends a page's query string, which on our [free tools](/tools/) can hold what someone typed.

## Do you still need a consent banner?

This is where the tools' own pages and the regulators' guidance part ways.

**What the vendors say.** Plausible's data policy says you don't need cookie banners or consent for its analytics. Umami's pricing page says the same. GoatCounter is more careful: its [GDPR page](https://www.goatcounter.com/help/gdpr) says it "should *probably* be safe" to use without a consent notice, adds "I am not a lawyer", and talks only about the GDPR.

**What the EU rule covers.** The banner question comes from Article 5(3) of the ePrivacy Directive, not the GDPR. The European Data Protection Board's [Guidelines 2/2023](https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf), adopted on 7 October 2024, read that article broadly. It protects information on the device whether or not it is personal data. When JavaScript builds a tracking request, sending that code is the instruction and collecting what comes back counts as "gaining of access". Even tracking based only on the IP address can fall under it.

So "no cookies" doesn't take a script out of scope. The same guidelines stress that being in scope "does not systematically mean that consent needs to be collected": exemptions are decided case by case, which in practice means by national regulators.

**France's exemption.** The CNIL lets [audience measurement skip consent](https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications) if all of these hold: you tell users and let them object; the purpose is only audience measurement or A/B testing; the data isn't combined with other processing; the tracking covers one publisher, not several sites; the last byte of the IP address is truncated; and trackers last at most 13 months. The CNIL also warns that most large analytics products don't qualify.

**The UK changed in 2026.** Since [5 February 2026](https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2026/02/key-aspects-of-the-data--use-and-access--act-take-effect.html), UK law has had a statistical-purposes exception. The [ICO's guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) sets the conditions: statistics must be the sole purpose, and only to improve the service; you give clear information and a simple, free way to object; any third party acts only as your processor; and the output is aggregate. UK guides that say analytics always needs consent predate this.

So for a small SaaS with EU or UK visitors, cookieless analytics usually moves you from "ask first" to "tell and allow opt-out", provided you meet the conditions. Here is the engineering checklist we work from; it isn't legal advice:

1. Use the tool for counting only. Don't feed its data into ads, a CRM or another site's stats.
2. Say in your privacy policy what you count, with which tool, and where it's hosted. Our [privacy policy generator](/tools/seo/privacy-policy-generator/) gives you a starting draft.
3. Offer a simple opt-out that works without an account.
4. Keep the tool to your own domains; don't share one identifier across unrelated sites.
5. For French visitors, check the CNIL's two technical conditions as well: none of the three tools' pages we read says it truncates the last byte of the IP address before using it, so ask the vendor, or truncate it yourself in a proxy and accept rougher visitor counts.
6. Strip what you don't need before it's sent: query strings, the referring page's full address, form input.

What we strip on our side, for item 6: our sender drops the query string; our proxy forwards only the counting fields, never the Referer header or cookies; and our web server's access log for the stats host removes query strings, Referer and cookies.

## What these tools can't tell you

Cookieless counting gives up some answers, by design.

- **Returning visitors across days.** Plausible can't link Monday's visit to Thursday's, by design. GoatCounter can't either after 8 hours. Umami can within a month, then not.
- **Which campaign worked, if you don't tag links.** Referrers are often missing. Add UTM tags to the links you control, with our [UTM builder](/tools/seo/utm-builder/) or by hand, and each tool will group visits by campaign.
- **Your own visits and bots.** Plausible's self-hosted edition gets only basic bot filtering, while its cloud [excludes about 32K data-center IP ranges](https://plausible.io/self-hosted-web-analytics). We drop our own server's IP and the user agents of Lighthouse, headless Chrome, Playwright and Puppeteer in a small proxy before GoatCounter sees the hit.
- **Who a visitor is.** That's the point. If you need per-user product analytics inside your app, that's a different tool with a different consent basis.

## Which one to pick

- **You want the least to run, or nothing at all:** GoatCounter. Hosted is free for reasonable use; self-hosted, it is one program and one SQLite file, and ours sits at about 33 MB of memory.
- **You want a polished hosted dashboard and will pay:** Plausible Cloud, [from $9 a month](https://plausible.io/#pricing) for 10k pageviews. Self-host it only if you're happy to run ClickHouse with 2 GB of RAM and accept the missing features.
- **You already run Postgres, or want a month-long visitor count:** Umami. The free hosted [Hobby plan](https://umami.is/pricing) covers 100K events a month; self-hosted, it's a Node app on a database you already have.

Whichever you pick, measure the same way for a few months before acting on the numbers, and write the privacy notice the same day you add the script.

## Sources

- GoatCounter, [Sessions](https://www.goatcounter.com/help/sessions), [GDPR consent notices](https://www.goatcounter.com/help/gdpr) and [home page](https://www.goatcounter.com/) (read 14 November 2026)
- Plausible, [Data policy](https://plausible.io/data-policy), [Pricing](https://plausible.io/#pricing), [Subscription plans](https://plausible.io/docs/subscription-plans), [Self-hosted web analytics](https://plausible.io/self-hosted-web-analytics) (read 14 November 2026)
- Plausible, [Community Edition repository](https://github.com/plausible/community-edition), v3.2.1
- Umami, [Pricing](https://umami.is/pricing), [Installation](https://docs.umami.is/docs/install), and the [umami repository](https://github.com/umami-software/umami) (`src/lib/collection-session.ts`, `src/lib/crypto.ts`), v3.5.0
- European Data Protection Board, [Guidelines 2/2023 on the technical scope of Art. 5(3) of the ePrivacy Directive, version 2.0](https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf), adopted 7 October 2024
- CNIL, [Sheet no. 16: Use analytics on your websites and applications](https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications)
- ICO, [What are the exceptions?](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) (guidance on storage and access technologies)
- Clifford Chance, [Key aspects of the Data (Use and Access) Act take effect](https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2026/02/key-aspects-of-the-data--use-and-access--act-take-effect.html), February 2026
- Ours: GoatCounter service status and `ps` on our server, our stats access log from 23 October to 14 November 2026, and script sizes measured with curl and `gzip -9` on 14 November 2026
