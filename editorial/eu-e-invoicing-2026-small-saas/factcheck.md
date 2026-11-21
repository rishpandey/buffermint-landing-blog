# Fact-check: eu-e-invoicing-2026-small-saas

By t-20261116-blog-post-review on 2026-11-21. Every row of claims.md checked: each source fetched on 2026-11-21 (curl, HTML to text, searched for the quoted wording; the DGFiP guide through pdftotext); every `ours:` row rerun: the five Peppol Directory counts and both 1,000-result samples queried again, both 3.0.22 `.sch` files downloaded from GitHub and recounted with ElementTree, `check-example.py` run on the example and on a copy without the buyer reference and buyer endpoint, `test_check_example.py` run (14 tests OK). content-factcheck.json read first: its 8 blockers are our own numbers (rows 12, 16, 38–40, 46), all verified below; its 4 warnings are local number formats ("25.000 euro", "800.000 Euro", "200 mln zł", "EUR 1.500"), found on the linked pages. Copying: 7-word overlaps between the post and the English sources are only page titles in Sources and one attributed phrase (row 19).

| # | Verdict | Evidence |
|---|---|---|
| 1 | verified | je-passe page (modifié le 01/09/2026): "effective depuis le 1 er septembre 2026"; guide: "Le premier est le maintien du calendrier légal" |
| 2 | verified | je-découvre (modifié le 26/05/2026): "Toutes les entreprises, quelle que soit leur taille, sont concernées … dès le 1er septembre 2026"; "plateforme agréée"; scope "entreprises établies en France et assujetties à la TVA française" |
| 3 | verified | je-découvre: "les grandes entreprises et les entreprises de taille intermédiaire devront émettre"; small and micro "auront jusqu'au 1er septembre 2027 pour émettre" |
| 4 | verified | einvoice.belgium.be: "Since 1 January 2026, all Belgian enterprises liable to VAT will have to use structured electronic invoices" |
| 5 | verified | KSeF page: "1 lutego 2026 r." (2024 sales over 200 mln zł) and "1 kwietnia 2026 r. dla pozostałych podatników" |
| 6 | verified | BMF FAQ Q12: "Seit dem 1. Januar 2025 besteht für inländische Unternehmen … die Notwendigkeit, eine E-Rechnung e[mpfangen zu können]" |
| 7 | verified | FR foreign page: "e-invoicing … does not apply to foreign companies that do not have a permanent establishment in France"; BE: "Niet in België gevestigde btw-plichtigen zonder vaste inrichting, zelfs als ze in België voor de btw zijn geïdentificeerd, vallen niet onder de verplichting"; DE Q12 limits to "inländische Unternehmen" (Q3); PL excludes "podatników, którzy nie posiadają siedziby … ani stałego miejsca" |
| 8 | verified | je-découvre: "(UBL, CII ou tout format mixte composé d'un fichier de données structurées et d'un fichier image)" |
| 9 | verified | FR foreign page: not liable "if its customer is … registered for VAT in France. In that case, it is the buyer … that is subject to e-reporting"; when the buyer has no French VAT number "the seller/service provider is subject to e-reporting requirements" |
| 10 | verified | efactuur.belgium.be table: "Via Peppol netwerk, in Peppol bis-formaat (tenzij onderling akkoord en respecteren EN16931)" |
| 11 | verified | BMF Q8: "seit dem 1. Januar 2025 den Empfang einer E-Rechnung sicherstellen. Dazu reicht bereits ein E-Mail-Postfach aus" |
| 12 | verified | BMF Q11: "vom 1. Januar 2025 bis zum 31. Dezember 2026 können sich alle Rechnungsaussteller dafür entscheiden"; "bis 800.000 Euro verlängert sich diese Frist noch bis zum Ablauf des Jahres 2027" |
| 13 | verified | BMF: "XRechnung und ZUGFeRD ab Version 2.0.1 (mit Ausnahme der Profile MINIMUM und BASIC-WL)"; "sieht das Gesetz keinen bestimmten Weg vor" |
| 14 | verified | BMF: "in Deutschland umsatzsteuerlich registriert sind, hier aber keine feste Niederlassung haben, können auf diesen Umstand in ihrer Rechnung hinweisen" |
| 15 | verified | KSeF page: "Otrzymywanie faktur przy użyciu KSeF będzie obowiązkowe już od 1 lutego 2026 r." |
| 16 | verified | KSeF page: "nie przekracza kwoty 10 000 zł (brutto), wówczas podatnicy tacy do końca 2026 r. nie mają obowiązku" |
| 17 | verified | KSeF page: "Krajowy System e-Faktur", with a separate "KSeF a PEF" section (PEF is the Peppol-based public procurement channel) |
| 18 | verified | KSeF page exclusions: no seat/fixed establishment; invoices "na rzecz osoby fizycznej nieprowadzącej działalności gospodarczej" |
| 19 | verified | ViDA page: "Digital Reporting Requirements will affect cross-border B2B transactions from 1 July 2030"; "real-time digital reporting for cross-border trade, based on e-invoicing"; "main impact on businesses making cross border B2B supplies" |
| 20 | verified | ViDA page: "adopted on 11 March 2025"; "Upon entry into force (14 April 2025), Member States are able to introduce mandatory e-invoicing under specific conditions" |
| 21 | verified | podstawy-prawne page: "decyzja wykonawcza Rady (UE) 2022/1003 z dnia 17 czerwca 2022 r. upoważniająca Rzeczpospolitą Polską" |
| 22 | verified | BE: "Do you only work for private clients? … But be careful: you [need to be able to receive]"; FR: "Même une entreprise qui n'émet pas de facture est concernée … elle devra être en capacité de recevoir" |
| 23 | verified | efactuur.belgium.be: "Registratie op het Peppol-netwerk geldt als akkoord." |
| 24 | verified | je-découvre: "y compris les entreprises bénéficiant du régime de la franchise en base"; "Les micro-entrepreneurs (ou auto-entrepreneurs) sont donc concernés" |
| 25 | verified | je-découvre: "avec des personnes non assujetties par exemple des particuliers, ou des transactions avec des opérateurs établis à l'étranger" |
| 26 | verified | je-découvre: "les opérations dont la TVA est exigible à l'encaissement" (prestations de services, no option "sur les débits") |
| 27 | verified | je-découvre: "C'est une entreprise privée immatriculée par l'État"; je-passe: "Je consulte la liste des plateformes agréées" |
| 28 | verified | je-découvre: "de PDF ordinaire, de document envoyé par mail, ne sera plus conforme à la réglementation" |
| 29 | verified | guide p.2: "engagées dans une trajectoire sérieuse de mise en conformité"; "ne constitue ni un report ni une suspension de l'obligation" |
| 30 | verified | guide: "par mail, PDF ou papier, ne doit donc pas être écartée pour cette seule raison lorsqu'elle correspond à une opération réelle" |
| 31 | verified | guide: "une amende par facture, dans les limites prévues par l'article 1737 du CGI" |
| 32 | verified | einvoice.belgium.be: "Sending a PDF invoice by e-mail or via a platform will no longer be enough." |
| 33 | verified | efactuur.belgium.be: obligation applies under the small-business exemption ("niet meer dan 25.000 euro bedraagt") |
| 34 | verified | tolerance page (18/12/2025): "will show tolerance during the first three months of 2026"; "Under no circumstances will we grant a general postponement" |
| 35 | fixed | KPMG: "penalties for non-compliance (not having the technical means) to issue or receive e-invoices, starting at EUR 1.500 for the first offence, EUR 3.000 for the second, and EUR 5.000". The post now says the fines are for not having the means to send or receive e-invoices, instead of implying any non-compliant invoice |
| 36 | verified | efactuur.belgium.be: "moet de niet in België gevestigde onderneming zonder vaste inrichting zelf zijn medecontractanten hiervan op de hoogte brengen" |
| 37 | verified | BMF Q12c: "nach dem aktuellen Wortlaut des § 26a UStG nicht um eine Ordnungswidrigkeit"; "einen zivilrechtlichen Anspruch auf Erhalt einer E-Rechnung" |
| 38 | verified | tsv (02:58 UTC) matches the post; requeried 2026-11-21 ~06:45 UTC: BE 2,177,068, FR 5,927,663, DE 18,175, PL 21,204, NL 121,517 (live counts drift by a few; the post dates its figures) |
| 39 | verified | requeried `country=BE&rpc=1000`: schemes 0208 599, 9925 400, 0130 1; 650 distinct first names (lower-cased) |
| 40 | verified | requeried `country=FR&rpc=1000`: 0225 990, 0009 4, 9957 3, 0002 2, 0208 1 |
| 41 | verified | directory.peppol.eu: search by identifier, name, country; entries list the document types received |
| 42 | verified | GitHub API release 3.0.22: "published_at": "2026-11-04T15:36:05Z", repo OpenPeppol/peppol-bis-invoice-3 |
| 43 | fixed | CEN-EN16931-UBL.sch (3.0.22): 979 asserts, 281 fatal, 698 warning; 678 UBL-CR asserts but 2 of them (CR-666, CR-673) are fatal, so 676 warnings, and 3 read "shall not include". Post changed from 678 with the quoted "should not include" to "676 flag UBL elements an invoice should not include" (no quote marks) |
| 44 | verified | PEPPOL-EN16931-UBL.sch: 165 asserts (139 fatal, 26 warning); country prefixes DE-R 31, GR-R 17 + GR-S 2, DK-R 14, SE-R 13, IS-R 10, NL-R 9, IT-R 4, NO-R 2; no BE or FR rule IDs |
| 45 | verified | 281 + 139 = 420; VAT blocks BR-S/Z/E/AE/G/AF/AG 10 each, BR-IC 12, BR-O 14, BR-B 2 (hence "most") |
| 46 | fixed | the code review found the script stricter than the rules on VAT (it matched to the cent; BR-S-09 and BR-CO-17 allow a margin of 1, and BR-CO-17 covers every category) and missing fatal rules a one-line invoice can trip (R053, R120, R121, R130, BR-49, BR-61). Fixed in check-example.py with tests; now "54/54 rules pass", and the post says 54. 49 × 0.21 = 10.29, 49 + 10.29 = 59.29; both 0208 numbers pass mod 97 |
| 47 | verified | copy without `cbc:BuyerReference` and the buyer `cbc:EndpointID`: "FAIL PEPPOL-EN16931-R003, FAIL PEPPOL-EN16931-R010" (46/48 before the fix; 52/54 after, still exactly these 2); .sch R043 test `matches(normalize-space(), '^[0-9]{10}$') and u:mod97-0208(...)` |
| 48 | verified | .sch: R003 test `cbc:BuyerReference or cac:OrderReference/cbc:ID`, "A buyer reference or purchase order reference MUST be provided"; R010 and R043 texts as quoted in claims.md |
| 49 | fixed | CEN .sch: BR-CO-10, -13, -14, -15, -16 are exact to the cent, but BR-S-09 and BR-CO-17 allow a margin of 1. The post said line, VAT and total amounts must add up exactly to the cent; it now says the totals must, and the VAT per rate has a margin of 1 euro |
| 50 | verified | einvoice.belgium.be: "This list also includes solutions that can be used (partially) free of charge or at a limited cost." |
| 51 | verified | buffermint-tools src/everyday/invoice-generator.html: "Download PDF", no UBL/XML export |
| 52 | verified | FR foreign page: "1 September 2026 for large enterprises and intermediate-sized enterprises"; "1 September 2027 for micro-enterprises, very small enterprises (VSEs) and small- and medium-sized enterprises"; "SMEs employ fewer than 250 people"; excluded when "registered with an EU VAT One Stop Shop" |
| 53 | verified | FR foreign page: "it is the buyer … that is subject to e-reporting requirements (VAT reverse charge transactions)" |
| 54 | verified | added by the review (the 21% rate was not in claims.md): Your Europe VAT rates table "BE Belgium 21 6 / 12" |
| 55 | fixed | added by the review: the opening said "every VAT-registered business"; je-découvre includes the franchise en base ("y compris les entreprises bénéficiant du régime de la franchise en base"), so it now says businesses liable to French VAT, including those under the small-business exemption |

## Editor

Read as a small SaaS founder (EU-established, or outside the EU billing EU businesses). The opening answers the question in two paragraphs (France's dates, then the established/non-established split that decides whether any of it applies), and the rest earns its place.
- **New angle is real:** the "seller without an establishment" column, built from four governments' own pages, is not in any single source; the Peppol Directory counts and the rule count are our own reproducible data; the worked €49 invoice and the field list are something a reader can act on. Not generic: it could not have been written without the research.
- **Sources:** 6 publishers (DGFiP, FPS Finance, BMF, Polish MF, European Commission, OpenPeppol) plus KPMG, all primary except KPMG for the fine scale.
- **Changes:** the warning count (row 43); the Belgian fines now say what they punish (row 35); the 21% rate added to claims.md (row 54); after the code review, the worked example (54 rules, VAT margin of 1, rows 46, 47, 49) and the opening's French scope (row 55). Nothing else needed: the tone is plain, no hype or filler, and the method caveat (our own subset of rules, not the official validator) is stated where the result is.
- **Public copy:** neutral; links only to live /tools pages (XML formatter, three VAT calculators, invoice generator, with the honest caveat that its PDF isn't an e-invoice in scope) and a live post. No unreleased products, no funnel, no competitor names.
- **Dates:** "as of November 2026" on the mandates; directory counts dated 21 November 2026; release date for 3.0.22; past events in the past tense (France 1 Sep 2026, Belgium tolerance Jan–Mar 2026). Dated 2026-11-21, four days after the last post.
