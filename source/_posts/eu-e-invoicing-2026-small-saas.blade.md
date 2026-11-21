---
featured_image: assets/img/uploads/eu-e-invoicing-2026-small-saas-cover-c06a5e-1200.jpeg
featured_thumbnail: assets/img/uploads/eu-e-invoicing-2026-small-saas-cover-c06a5e-600.jpeg
title: "E-invoicing in France and the EU: what a small SaaS must do"
seo_description: "E-invoicing in France started on 1 September 2026. Which EU mandates apply to a small SaaS, from government pages, with a worked Peppol invoice we checked."
keyword: e invoicing france
author: Rishabh Pandey
show_meta: true
section: postContent
published: true
date: 2026-11-21
extends: _layouts.post
---

E-invoicing in France started on 1 September 2026, as planned. Every business established in France and liable to French VAT, including those under the small-business VAT exemption, must now be able to receive structured e-invoices through an approved platform, large and mid-size companies must also send them, and small and micro businesses must send them from 1 September 2027, according to the [French tax administration](https://www.impots.gouv.fr/professionnel/je-decouvre-la-facturation-electronique). Belgium made structured B2B invoices compulsory on 1 January 2026, Poland on 1 February and 1 April 2026, and Germany has required businesses to be able to receive them since 2025.

The part most guides skip: each of these mandates covers businesses established in that country. A SaaS company in the US, the UK or India that bills a French or Belgian customer, with no office there, is not required to send e-invoices in any of the four. If you are established in one of them, you are in scope and the dates below are yours.

We read each government's own pages on 21 November 2026, counted the rules in the current Peppol invoice standard, looked up how many businesses each country has in the public Peppol Directory, and wrote a real e-invoice for a €49 subscription, then checked it rule by rule.

## The mandates as of November 2026

Built from the government pages listed under Sources. "Seller without an establishment" means a company with no office or fixed establishment in that country, even if it has a VAT number there.

| Country | Receive | Send | Format and channel | Seller without an establishment |
|---|---|---|---|---|
| [France](https://www.impots.gouv.fr/professionnel/je-decouvre-la-facturation-electronique) | All businesses from 1 Sep 2026 | Large and mid-size from 1 Sep 2026; small and micro from 1 Sep 2027 | UBL, CII or a mixed PDF-plus-data format, through an approved platform | Out of e-invoicing; a VAT-registered French customer reports the purchase, but you e-report if you charge French VAT yourself |
| [Belgium](https://efactuur.belgium.be/nl/article/voor-wie-wordt-e-facturatie-verplicht) | Since 1 Jan 2026 | Since 1 Jan 2026 | Peppol BIS over the Peppol network | Out of scope, even with a Belgian VAT number |
| [Germany](https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html) | Since 1 Jan 2025 (an email inbox is enough) | Optional until the end of 2026; end of 2027 below €800,000 turnover | EN 16931 formats such as XRechnung or ZUGFeRD 2.0.1+, any channel | Out of scope; you may say so on the invoice |
| [Poland](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/zakres-obowiazkowego-ksef) | Through the national KSeF system since 1 Feb 2026 | Since 1 Feb 2026 above PLN 200 million in sales, 1 Apr 2026 for everyone else; under PLN 10,000 a month exempt until the end of 2026 | KSeF, the government's own system (not Peppol) | Out of scope |
| [EU-wide (ViDA)](https://taxation-customs.ec.europa.eu/taxation/vat/vat-digital-age-vida_en) | From 1 Jul 2030 for cross-border B2B | From 1 Jul 2030 for cross-border B2B | E-invoices with digital reporting to the tax authorities | Not settled on the Commission's page |

Two things in that table catch people out. First, "receive" deadlines apply even to companies that never invoice a business. A French or Belgian SaaS that sells only to consumers still has to receive e-invoices from its own suppliers. Second, being out of scope as a seller doesn't stop a customer asking. In Belgium, a business that registers on Peppol [counts as having agreed](https://efactuur.belgium.be/nl/article/voor-wie-wordt-e-facturatie-verplicht) to receive structured invoices, so an e-invoice is always acceptable there, even when it isn't required.

## E-invoicing in France: receive now, send in 2027

The French reform has three parts, as the [DGFiP describes it](https://www.impots.gouv.fr/professionnel/je-decouvre-la-facturation-electronique):

- **E-invoicing** for sales between businesses established in France and liable to French VAT, including those under the small-business VAT exemption (franchise en base) and micro-entrepreneurs.
- **Transaction e-reporting** for sales to consumers and for transactions with operators established abroad. If you are a foreign SaaS billing a French company that has a French VAT number, your invoice stays outside the e-invoicing system and, under the reverse charge, [the customer reports it](https://www.impots.gouv.fr/internationalenbusiness/e-reporting-requirements-foreign-companies-without-permanent-establishment).
- **Payment e-reporting** for services where VAT is due when payment is received, which covers many service businesses that haven't opted to pay VAT on invoicing.

Invoices travel through a plateforme agréée, a private company the state has approved; the [list is on impots.gouv.fr](https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique). A PDF sent by email is no longer a compliant invoice between two French businesses in scope.

Foreign companies aren't automatically off the hook, though. The DGFiP's [page for companies without a French establishment](https://www.impots.gouv.fr/internationalenbusiness/e-reporting-requirements-foreign-companies-without-permanent-establishment) says they have their own e-reporting duty when they charge French VAT themselves, for example on sales to French consumers under a direct French VAT registration. That starts on 1 September 2027 for SMEs and micro-businesses (fewer than 250 staff), and started in 2026 for larger ones. Consumer sales declared through the EU's One Stop Shop are excluded.

Enforcement is softer than the date. The DGFiP's [start-up guide](https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/guide_pratique_facturation_electronique.pdf) says no penalties will be applied during the start-up phase to companies that are struggling but on a serious path to compliance, and that this is neither a postponement nor a suspension. It also says a real invoice that arrives by email, PDF or paper must not be rejected for that reason alone. The fines themselves are per invoice, under article 1737 of the French tax code.

For a small French SaaS the order is: a receiving platform now (it has been required since September), then sending and e-reporting working before September 2027.

## Belgium, Germany and Poland

**Belgium** went furthest, fastest. Since 1 January 2026, Belgian VAT-registered businesses have had to exchange structured invoices with each other over Peppol, in the Peppol BIS format, and [FPS Finance](https://einvoice.belgium.be/en/article/structured-electronic-invoices-between-companies-are-compulsory-2026) says a PDF by email or through a portal is no longer enough. The [small-business exemption](https://efactuur.belgium.be/nl/article/voor-wie-wordt-e-facturatie-verplicht) (turnover up to €25,000) doesn't take you out of it.

FPS Finance gave a [tolerance period](https://einvoice.belgium.be/en/news/period-tolerance-during-first-three-months-2026) for January to March 2026 and ruled out any general postponement. Fines under the Royal Decree for not having the means to send or receive e-invoices start at €1,500 for a first offense, rising to €3,000 and then €5,000, as [KPMG Belgium summarizes](https://kpmg.com/be/en/insights/my-tax-compass/indirect-tax-insights/belgium-new-royal-decree-on-structured-electronic-invoicing.html).

One detail for foreign sellers: FPS Finance says the non-established company must tell its Belgian customers itself that it has no fixed establishment there, because the customer can't easily tell.

**Germany** is the gentlest. The [Federal Ministry of Finance FAQ](https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html) says any domestic business must have been able to receive e-invoices since 1 January 2025, and that an email inbox is enough. Sending stays optional until the end of 2026, or the [end of 2027](https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html) for issuers with prior-year turnover up to €800,000.

The ministry also says issuing a normal invoice where an e-invoice is required is not an administrative offense under § 26a of the VAT act. The customer can, however, claim an e-invoice under civil law. A foreign business registered for German VAT with no fixed establishment can state that on its invoices to explain why it isn't sending an e-invoice.

**Poland** uses its own government platform, KSeF, not Peppol. According to the [Ministry of Finance](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/zakres-obowiazkowego-ksef), issuing invoices in KSeF became mandatory on 1 February 2026 for businesses whose 2024 sales exceeded PLN 200 million and on 1 April 2026 for everyone else, except those invoicing no more than PLN 10,000 gross a month, who have until the end of 2026. Taxpayers without a seat or fixed establishment in Poland are excluded, and so are invoices to consumers.

## What the Peppol Directory shows

The [Peppol Directory](https://directory.peppol.eu/) is the public list of businesses that can receive invoices over Peppol. We queried its [search API](https://directory.peppol.eu/public/locale-en_US/menuitem-docs-rest-api) on 21 November 2026 for each country:

| Country | Directory entries |
|---|---|
| France | 5,923,824 |
| Belgium | 2,177,076 |
| Netherlands | 121,526 |
| Poland | 21,204 |
| Germany | 18,174 |

These are entries, not companies. In the first 1,000 Belgian results, 599 were listed by enterprise number and 400 by VAT number, with only 650 distinct names, so many firms appear twice.

Even so, the gap follows the rules. Belgium requires Peppol, so its businesses registered by the million; Germany accepts email, so it has 18,174 entries for a much larger economy. Poland's low count makes sense because its mandate runs on KSeF. Nearly all of the French results we sampled (990 of the first 1,000) use a France-specific identifier scheme rather than the company or VAT number.

The practical point for a seller: before you invoice a Belgian business, you can look it up in the directory by its enterprise number. If it's there, you have its e-invoicing address.

## What an e-invoice has to contain

An e-invoice isn't a PDF with more fields. It's a data file, usually XML, that follows the European standard EN 16931. Peppol's version, Peppol BIS Billing 3.0, is maintained by OpenPeppol, and its [rule files](https://github.com/OpenPeppol/peppol-bis-invoice-3) are public. We counted the rules in release 3.0.22 (4 November 2026):

- 979 checks from the European standard, 281 of them fatal. Of the 698 warnings, 676 flag UBL elements an invoice should not include.
- 165 Peppol checks, 139 of them fatal, including country rules for Germany, Denmark, Sweden, Iceland, the Netherlands, Greece, Italy and Norway. None are specific to Belgium or France.

That's 420 fatal checks, but a one-line subscription invoice touches only a few dozen of them, because most VAT cases have their own block of 10 to 14 rules (standard-rated, zero-rated, exempt, reverse charge and so on) and you only meet the block for the case you invoice.

We wrote a minimal e-invoice for a fictional Belgian SaaS billing a Belgian business for one month of a €49 plan (21% VAT, €10.29, total €59.29). Then we wrote a script that re-implements 54 of the fatal rules such an invoice can trip, from the rule texts in those files: the header, both parties, the line and its price, the payment details, the standard-rate VAT rules and every total. It passed all 54. We then removed two things a typical SaaS invoice doesn't have, and 2 rules failed:

| Rule | What it requires | Why a normal SaaS invoice fails it |
|---|---|---|
| PEPPOL-EN16931-R003 | A buyer reference or a purchase order number | Self-serve checkouts don't ask for one |
| PEPPOL-EN16931-R010 | The buyer's electronic address (its Peppol ID) | Billing forms collect an email, not a Peppol ID |

Once you add that address, a third rule watches it: PEPPOL-COMMON-R043 rejects a Belgian enterprise number (scheme 0208) unless it has 10 digits and valid check digits, so a typo fails the whole invoice.

A caveat on method: this was our own reading of a subset of the rules, not the official validator, and it doesn't check the XML schema or code lists. Before you send real invoices, run them through the official rules, or make sure the Peppol provider you send through does.

The useful result is the field list. To send a valid Belgian e-invoice, your billing needs, for each business customer:

1. The customer's legal name and full postal address with country code.
2. Its VAT number and, in Belgium, its enterprise number, the usual Peppol address there (scheme 0208, used by 599 of the first 1,000 Belgian directory entries).
3. A buyer reference or PO number. Let the customer type it at checkout or in billing settings, and fall back to something stable such as your subscription ID.
4. Your own Peppol address, VAT number and bank details.
5. Totals that add up exactly to the cent: several fatal rules check the invoice totals against the lines and the VAT breakdown. Only the VAT per rate gets a margin, of 1 euro, against taxable amount × rate.

You don't have to build the file yourself. Belgian accounting and invoicing software that's connected to Peppol produces it, and [FPS Finance keeps a list](https://einvoice.belgium.be/en/article/structured-electronic-invoices-between-companies-are-compulsory-2026) that includes free and low-cost options. If you do get an XML invoice and want to read it, our [XML formatter](/tools/dev/xml-formatter/) lays it out in your browser.

## If your SaaS is outside the EU

As a seller with no establishment in these countries, you are not obliged to send e-invoices in France, Belgium, Germany or Poland today. France's e-reporting is the one exception to check. What changes for you is mostly on the customer's side:

- Belgian customers may ask for Peppol invoices, since they now receive their domestic invoices that way. Sending one is allowed.
- French business customers with a French VAT number report your invoice through e-reporting, so it doesn't have to be a structured e-invoice. If you charge French VAT yourself outside the One Stop Shop, the e-reporting is yours from September 2027 (see the France section).
- German customers can receive your PDF as before.

Two things to do now. If you invoice Belgian businesses, tell them you have no fixed establishment in Belgium, as FPS Finance asks. And collect VAT numbers and a buyer reference at checkout already, since they're needed whichever way you invoice.

Further out, the EU's [VAT in the Digital Age package](https://taxation-customs.ec.europa.eu/taxation/vat/vat-digital-age-vida_en) was adopted on 11 March 2025. From 1 July 2030 it brings digital reporting requirements, based on e-invoicing, whose main impact the Commission says falls on businesses making cross-border B2B supplies. Since it entered into force on 14 April 2025, member states can also introduce mandatory e-invoicing under the conditions it sets; Poland, by contrast, needed a [Council derogation](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/podstawy-prawne-oraz-kluczowe-terminy) for its mandate. More countries are likely to follow before 2030.

For VAT rates in the meantime, our calculators for [Belgium](/tools/business/vat-calculator-belgium/), [France](/tools/business/vat-calculator-france/) and [Germany](/tools/business/vat-calculator-germany/) do the arithmetic. Our [invoice generator](/tools/everyday/invoice-generator/) makes a PDF invoice, which is fine for consumers and for customers outside these mandates. It isn't an e-invoice for two Belgian or French businesses in scope.

If you also sell to consumers, e-invoicing is the smaller job. VAT registration and who collects the tax matter more, and our breakdown of [merchant of record fees](/articles/merchant-of-record-fees) covers one way to hand that off.

## Checklist for a small SaaS established in the EU

- **France:** a receiving platform chosen (required since 1 Sep 2026); sending and e-reporting live before 1 Sep 2027 if you're a small business.
- **Belgium:** sending and receiving over Peppol since 1 Jan 2026; customers' enterprise numbers stored; buyer reference collected.
- **Germany:** an inbox that can receive e-invoices (since 2025); sending ready for 2027, or 2028 below €800,000 turnover.
- **Poland:** invoices issued in KSeF since April 2026, unless you're under PLN 10,000 a month, which buys you until the end of 2026.
- **Everywhere:** VAT numbers stored per customer; sums that add up to the cent; a note in your billing settings for your customers' PO numbers.

Not legal or tax advice. Which VAT category a cross-border invoice uses depends on your setup, so check that with an adviser.

## Sources

- Direction générale des Finances publiques (France), [Je passe à la facturation électronique](https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique) (updated 1 September 2026), [Je découvre la facturation électronique](https://www.impots.gouv.fr/professionnel/je-decouvre-la-facturation-electronique) (updated 26 May 2026), the [start-up guide for 1 September 2026](https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/guide_pratique_facturation_electronique.pdf) and [E-reporting requirements for foreign companies without a permanent establishment in France](https://www.impots.gouv.fr/internationalenbusiness/e-reporting-requirements-foreign-companies-without-permanent-establishment) (updated 23 June 2026) (read 21 November 2026)
- FPS Finance (Belgium), [Structured electronic invoices between companies are compulsory since 2026](https://einvoice.belgium.be/en/article/structured-electronic-invoices-between-companies-are-compulsory-2026), [Voor wie wordt e-facturatie verplicht?](https://efactuur.belgium.be/nl/article/voor-wie-wordt-e-facturatie-verplicht) and [Period of tolerance during the first three months of 2026](https://einvoice.belgium.be/en/news/period-tolerance-during-first-three-months-2026) (18 December 2025) (read 21 November 2026)
- KPMG Belgium, [New Royal Decree on structured electronic invoicing](https://kpmg.com/be/en/insights/my-tax-compass/indirect-tax-insights/belgium-new-royal-decree-on-structured-electronic-invoicing.html) (read 21 November 2026)
- Bundesministerium der Finanzen (Germany), [Fragen und Antworten zur Einführung der obligatorischen E-Rechnung](https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html) (read 21 November 2026)
- Ministerstwo Finansów (Poland), [Zakres obowiązkowego KSeF](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/zakres-obowiazkowego-ksef) and [Podstawy prawne oraz kluczowe terminy](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/podstawy-prawne-oraz-kluczowe-terminy) (read 21 November 2026)
- European Commission, [VAT in the Digital Age (ViDA)](https://taxation-customs.ec.europa.eu/taxation/vat/vat-digital-age-vida_en) (read 21 November 2026)
- OpenPeppol, [Peppol BIS Billing 3.0 rules, release 3.0.22](https://github.com/OpenPeppol/peppol-bis-invoice-3) (4 November 2026) and the [Peppol Directory](https://directory.peppol.eu/) with its [REST API](https://directory.peppol.eu/public/locale-en_US/menuitem-docs-rest-api) (queried 21 November 2026)
- Ours: the rule count, the example invoice, the check script and the directory counts are kept with this post's research notes
