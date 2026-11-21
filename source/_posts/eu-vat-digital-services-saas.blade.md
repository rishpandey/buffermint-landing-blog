---
featured_image: assets/img/uploads/eu-vat-digital-services-saas-cover-066f97-1200.jpeg
featured_thumbnail: assets/img/uploads/eu-vat-digital-services-saas-cover-066f97-600.jpeg
title: "EU VAT on digital services: OSS, €10,000 and the MoR math"
seo_description: "Who owes EU VAT on digital services from the first sale, who the €10,000 threshold is for, and what OSS or a merchant of record costs a small SaaS."
keyword: eu vat digital services
author: Rishabh Pandey
show_meta: true
section: postContent
published: true
date: 2026-11-23
extends: _layouts.post
---

EU VAT on digital services starts earlier than most founders expect. If your SaaS is based outside the EU and you sell a subscription to a person in Germany, you owe German VAT on that first sale. There is no threshold for you. The €10,000 threshold that most guides lead with is only for sellers established in a single EU country ([Irish Revenue](https://www.revenue.ie/en/vat/vat-on-services/electronic-services/vat-and-electronically-supplied-services/index.aspx)). If your customers are businesses with an EU VAT number, it flips: the customer accounts for the VAT under the reverse charge, and you file nothing in the EU.

That much is in the official guidance. What we couldn't find anywhere was the arithmetic a founder needs to choose between doing it yourself and paying a merchant of record. So we worked through two examples for the same founder, priced each way from the providers' own fee pages, and measured something the guides leave out: how often the EU's own VAT number checker is down.

Everything below is as of November 2026, and none of it is tax advice for your situation.

## Who owes EU VAT on digital services, in one table

Electronically supplied services, which is what EU VAT law calls software delivered over the internet, are taxed where the customer is. For a consumer, that means the consumer's country and its rate. For a business, the business accounts for it ([Your Europe](https://europa.eu/youreurope/business/taxation/vat/cross-border-vat/index_en.htm); [Irish Revenue](https://www.revenue.ie/en/vat/foreign-suppliers-doing-business-in-ireland/non-established-traders-supplying-goods.aspx)).

| You are | Selling to EU consumers | Selling to EU businesses with a VAT number |
|---|---|---|
| Outside the EU | Charge the customer's country's VAT from the first sale. Register in each country, or once under the non-Union OSS | No VAT on your invoice; the customer self-accounts (reverse charge). No EU registration for this |
| In one EU country, under €10,000 of cross-border consumer sales a year | You may charge your home country's VAT | Reverse charge for customers in other EU countries |
| In one EU country, over €10,000 | Customer's country's VAT, through the Union OSS or local registrations | Reverse charge for customers in other EU countries |

*From [Irish Revenue](https://www.revenue.ie/en/vat/vat-on-services/electronic-services/vat-and-electronically-supplied-services/index.aspx), [Your Europe](https://europa.eu/youreurope/business/taxation/vat/cross-border-vat/index_en.htm) and [Stripe's EU tax docs](https://docs.stripe.com/tax/supported-countries/european-union), read in November 2026.*

## The €10,000 threshold is not for non-EU sellers

[Irish Revenue's guidance](https://www.revenue.ie/en/vat/vat-on-services/electronic-services/vat-and-electronically-supplied-services/index.aspx) sets out the conditions: the supplier is established in only one member state, and its cross-border sales of these services plus distance sales of goods to consumers in other member states stay at or under €10,000 in the current and the previous calendar year. It then says plainly that the threshold does not apply to a supplier not established in the EU ([Irish Revenue](https://www.revenue.ie/en/vat/vat-on-services/electronic-services/vat-and-electronically-supplied-services/index.aspx)). Stripe's documentation agrees: its "small seller option" is only for businesses based in the EU, and a business outside the EU "might need to register to collect VAT from your first sale" ([Stripe docs](https://docs.stripe.com/tax/supported-countries/european-union)).

So a founder in the US, the UK or India selling to EU consumers has two choices: register in every country where a customer lives, or register once under the non-Union One Stop Shop (OSS).

## Example A: a non-EU founder with 100 EU consumers

Take a solo founder outside the EU with 100 consumer subscribers in the EU, each paying $29 a month plus VAT. We assumed the customers are spread across countries in proportion to population, using [Eurostat](https://ec.europa.eu/eurostat/databrowser/view/tps00001/default/table)'s figures for 1 January 2026, and applied each country's standard rate from the [Your Europe rate table](https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm). Your own mix will differ, but the steps don't.

**Registration.** The non-Union scheme is for "any taxable person, not established in the EU, who supplies services to non-taxable persons", and you pick the member state you register in ([OSS portal](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/register-oss_en)). You don't need a tax representative for it ([Stripe docs](https://docs.stripe.com/tax/supported-countries/european-union)). One registration covers all 27 countries.

**The money.** Net sales are $34,800 a year. At a population-weighted average standard rate of 21.27%, you collect and pass on about $7,400 of VAT a year, roughly $1,850 per quarter. The return is made out in euro, converted at the European Central Bank rate on the last day of the quarter ([OSS portal](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/declare-and-pay-oss_en)). If you charge VAT on top of your price it isn't your cost, but it passes through your account and your cash planning.

**The filings.** Four returns a year, each due by the end of the month after the quarter: 30 April, 31 July, 31 October and 31 January. A deadline on a weekend doesn't move, and you can't file before the quarter ends. A quarter with no EU sales still needs a nil return. Payment is due with the return. Late returns get a reminder on day 10, after which each customer's country applies its own penalties, and three reminders in a row left unresolved can get you excluded from the scheme ([OSS portal](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/declare-and-pay-oss_en)).

**The evidence.** For every sale you need to show where the customer lives. The rule is two items of evidence that don't contradict each other, such as the billing address and the customer's bank details or IP address. Sellers established in the EU with under €100,000 of these cross-border sales may rely on one item from a third party, such as the payment provider, but a non-EU seller doesn't get that relief ([Implementing Regulation 2017/2459](https://eur-lex.europa.eu/eli/reg_impl/2017/2459/oj/eng), Art. 24b). Stripe Tax calculates from a single address but stores all the location evidence it saw on the customer record ([Stripe docs](https://docs.stripe.com/tax/supported-countries/european-union)), so check that both items are actually being captured at checkout.

**The records.** Ten years from the end of the year of each sale, even after you leave the scheme, including the country, date, type of supply, VAT and the location evidence. Any customer's country can ask for them, and not producing them within a month of a reminder counts as persistent non-compliance ([OSS portal](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/record-keeping-and-audits-oss_en)).

Count it up: one registration, four returns a year (nil ones included), two pieces of evidence per customer, ten years of records. Each step is simple; the cost is that it comes due every quarter whether or not you're busy. It adds a second registration if you also sell to UK consumers: HMRC requires a business established outside the UK to register for UK VAT on any taxable supplies "regardless of their value and including supplies of digital services" ([HMRC VAT Notice 700/1](https://www.gov.uk/government/publications/vat-notice-7001-should-i-be-registered-for-vat/vat-notice-7001-should-i-be-registered-for-vat)).

## Example B: the same founder with 100 EU businesses

Now make all 100 customers businesses with valid EU VAT numbers. For services to a business, the place of supply is generally where the customer is established, and the customer self-accounts for the VAT under the reverse charge ([Irish Revenue](https://www.revenue.ie/en/vat/foreign-suppliers-doing-business-in-ireland/non-established-traders-supplying-goods.aspx); [Your Europe](https://europa.eu/youreurope/business/taxation/vat/cross-border-vat/index_en.htm)). You charge no EU VAT, need no EU registration for these sales, and file no EU returns. Your invoice states that the reverse charge applies instead of showing a tax amount ([Stripe docs](https://docs.stripe.com/tax/supported-countries/european-union)).

What you do need is a valid VAT number for each customer: without one, Stripe processes the sale as a sale to a consumer. Stripe also notes that a domestic tax ID that isn't an EU VAT number doesn't trigger the reverse charge, and that some countries add conditions it doesn't model ([Stripe docs](https://docs.stripe.com/tax/supported-countries/european-union)).

The free way to check a number is the Commission's VIES service, which has a public REST API. We tested it on 21 November 2026 with a published Irish VAT number: three calls returned the company's name and address in 0.47 to 0.51 seconds each.

We also polled its status endpoint every five minutes from 08:11 UTC. **At the first check, VIES reported Belgium and Finland as "Unavailable"**: a VAT number from either country couldn't be checked at that moment. VIES is a search engine, not a database: each lookup goes to the issuing country's own VAT database, and the Commission says the system is sometimes unavailable while national databases are backed up ([Your Europe](https://europa.eu/youreurope/business/taxation/vat/check-vat-number-vies/index_en.htm)). An unavailable country is not the same as an invalid number.

The practical lesson: don't make checkout fail when VIES can't answer. Accept the number, mark it unverified, check it again later, and only then decide whether to apply the reverse charge on the next invoice.

Count it up: zero EU registrations, zero EU returns, one VAT number check per customer (repeated when it fails), and invoice wording. A mixed customer base puts you back in Example A for the consumers.

## VAT-inclusive pricing: the 27-rate spread

You can show a price and add VAT at checkout, or show one all-in euro price. With the all-in price, the VAT comes out of your revenue, and the rate varies more than people expect. Standard rates run from 17% in Luxembourg to 27% in Hungary ([Your Europe](https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm)).

| Country | Standard rate | You keep from €29 VAT-inclusive | Customer pays if VAT is added to €29 |
|---|---|---|---|
| Luxembourg | 17% | €24.79 | €33.93 |
| Germany | 19% | €24.37 | €34.51 |
| France | 20% | €24.17 | €34.80 |
| Hungary | 27% | €22.83 | €36.83 |

That's €1.95 a month per customer between the lowest and highest rate, about 8% of what you keep. For planning, the simple average of the 27 standard rates is 21.91%, and weighted by population it's 21.27%. Check the rates again before you set prices: they change, and the rates above are the ones the Commission's portal showed in November 2026. Our [VAT calculator](/tools/business/vat-calculator/) does the add-or-remove arithmetic for any rate, and there are versions for [Germany](/tools/business/vat-calculator-germany/), [France](/tools/business/vat-calculator-france/) and other countries.

## Doing it yourself vs a merchant of record

A merchant of record (MoR) is the legal seller to your customer. Paddle, for example, says it acts as the seller, is registered in over 100 jurisdictions and remits the tax; a business buyer with a valid VAT ID pays no VAT to Paddle, and your sale to Paddle is itself a B2B transaction ([Paddle help](https://www.paddle.com/help/sell/tax/how-paddle-handles-vat-on-your-behalf)). In our [merchant of record fee comparison](/articles/merchant-of-record-fees/) we read six providers' pricing pages in October 2026. Here is what those price lists imply for these two examples, for a card issued outside the US, which is what an EU customer usually has:

| Per sale, card issued outside the US | $9 | $29 | $99 |
|---|---|---|---|
| Paddle (5% + 50¢) | $0.95 | $1.95 | $5.45 |
| Stripe + Billing + Tax Basic (you file) | $0.80 | $1.92 | $5.84 |
| MoR premium | +15¢ | +3¢ | −39¢ |
| Stripe + Billing, no Stripe Tax (B2B only) | $0.76 | $1.78 | $5.35 |
| MoR premium for a B2B-only seller | +19¢ | +17¢ | +10¢ |

*Stripe at 2.9% + 30¢, +1.5% for international cards, +0.7% Billing and +0.5% Tax Basic, from our October 2026 reading of [Stripe's US pricing](https://stripe.com/us/pricing); fees taken on the pre-tax price for comparison. Tax Basic is charged only on transactions where you're registered ([Stripe Tax pricing](https://stripe.com/tax/pricing)).*

For **Example A**, 1,200 sales a year at $29, the MoR costs about **$31 a year** more than Stripe with Tax Basic, and at $99 it's cheaper. For that, the MoR does the registration, the four returns, the evidence and the ten years of records. If you want Stripe to file for you, its Tax Complete plan files non-Union OSS returns directly ([Stripe Tax pricing](https://stripe.com/tax/pricing)), but at the $90 a month we read in October that's $1,080 a year, and the entry tier Stripe showed us in November includes 200 transactions a month and four filings a year.

For **Example B**, there's nothing to file in the EU, so the MoR saves you little work and costs about $205 a year more at $29. Collecting VAT numbers and printing reverse-charge wording on invoices is a one-time setup in your billing system.

Other merchants of record are cheaper or dearer than Paddle; the [full comparison](/articles/merchant-of-record-fees/) has the numbers. The pattern holds: once you add the international-card surcharge that EU buyers trigger, plus Billing and Tax Basic, the headline gap between [Paddle's 5% + 50¢](https://www.paddle.com/pricing) and [Stripe's 2.9% + 30¢](https://stripe.com/us/pricing) mostly disappears for consumer sales.

## What changes next

The EU's VAT in the Digital Age package, adopted on 11 March 2025, extends the OSS schemes and introduces a mandatory reverse charge for non-identified suppliers from 1 July 2028 ([European Commission](https://taxation-customs.ec.europa.eu/taxation/vat/vat-digital-age-vida_en)). The Commission describes these as letting more businesses that sell to consumers in other EU countries meet their VAT obligations through one portal. Separately, if you sell to EU businesses, the national e-invoicing mandates are the bigger near-term change; we covered them in our post on [e-invoicing in France and the EU](/articles/eu-e-invoicing-2026-small-saas/).

## A checklist

1. **List your customers by type.** Consumers in the EU put you in Example A from the first sale; businesses with VAT numbers put you in Example B.
2. **If you sell to consumers and are outside the EU,** choose: non-Union OSS registration in one member state, or a merchant of record. At $29 and up on EU cards, the price gap is small.
3. **Capture two pieces of location evidence** per consumer, such as billing address and bank or IP country, and keep them for ten years.
4. **Put the four OSS deadlines in your calendar,** and file nil returns for empty quarters.
5. **For business customers,** collect the VAT number at checkout, check it with VIES, and don't block checkout when VIES is down.
6. **Decide whether prices include VAT.** If they do, plan on 21–22% and know the 17–27% range.
7. **If you also sell to UK consumers,** register with HMRC: there's no threshold for sellers established outside the UK.

## Sources

- European Commission, OSS portal: [Register](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/register-oss_en), [Declare and pay](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/declare-and-pay-oss_en) and [Record keeping and audits](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/record-keeping-and-audits-oss_en) (read 21 November 2026).
- Your Europe (European Commission): [Cross-border VAT](https://europa.eu/youreurope/business/taxation/vat/cross-border-vat/index_en.htm) and [VAT rules and rates](https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm) (last checked by the Commission 13 July 2026; read 21 November 2026).
- European Commission: [VAT in the Digital Age](https://taxation-customs.ec.europa.eu/taxation/vat/vat-digital-age-vida_en) (read 21 November 2026).
- [Commission Implementing Regulation (EU) 2017/2459](https://eur-lex.europa.eu/eli/reg_impl/2017/2459/oj/eng), new Article 24b of Regulation 282/2011 (EUR-Lex; we read the text through a mirror because EUR-Lex refused our fetcher).
- Irish Revenue: [VAT and electronically supplied services](https://www.revenue.ie/en/vat/vat-on-services/electronic-services/vat-and-electronically-supplied-services/index.aspx) (published 6 July 2026) and [Non-established traders doing business in Ireland](https://www.revenue.ie/en/vat/foreign-suppliers-doing-business-in-ireland/non-established-traders-supplying-goods.aspx) (published 10 December 2025).
- HMRC: [VAT Notice 700/1](https://www.gov.uk/government/publications/vat-notice-7001-should-i-be-registered-for-vat/vat-notice-7001-should-i-be-registered-for-vat) (updated 5 August 2026).
- Stripe: [Tax in the European Union](https://docs.stripe.com/tax/supported-countries/european-union) and [Stripe Tax pricing](https://stripe.com/tax/pricing) (read 21 November 2026); [US pricing](https://stripe.com/us/pricing) (read October 2026).
- Paddle: [How Paddle handles VAT on your behalf](https://www.paddle.com/help/sell/tax/how-paddle-handles-vat-on-your-behalf) (read 21 November 2026); [Pricing](https://www.paddle.com/pricing) (read October 2026).
- Eurostat: [Population on 1 January](https://ec.europa.eu/eurostat/databrowser/view/tps00001/default/table), 2026 figures (fetched 21 November 2026).
- European Commission: [VIES](https://ec.europa.eu/taxation_customs/vies/) VAT number check and its REST API status endpoint (queried 21 November 2026); Your Europe, [Check a VAT number (VIES)](https://europa.eu/youreurope/business/taxation/vat/check-vat-number-vies/index_en.htm) (last checked 18 June 2026).
- Our calculations: VAT per country weighted by population, the €29 VAT-inclusive table, and the per-sale fee comparison from the October 2026 price lists.
