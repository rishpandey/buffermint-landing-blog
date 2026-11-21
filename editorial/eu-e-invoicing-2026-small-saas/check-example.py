"""Check example-invoice.xml against the Peppol BIS 3.0.22 fatal rules a one-line,
single-rate (category S) invoice can trip. Each check names the rule it re-implements;
the rule texts come from CEN-EN16931-UBL.sch and PEPPOL-EN16931-UBL.sch in
https://github.com/OpenPeppol/peppol-bis-invoice-3 (tag 3.0.22, 4 Nov 2026).
This is our own reading of those rules, not the official validator.
Run: python3 -I check-example.py example-invoice.xml
"""
import sys
from decimal import Decimal, ROUND_HALF_UP
import xml.etree.ElementTree as ET

NS = {
    "i": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
    "cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
    "cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
}
SPEC = "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0"


def main(path):
    root = ET.parse(path).getroot()
    t = lambda xp: (root.findtext(xp, namespaces=NS) or "").strip()
    has = lambda xp: root.find(xp, NS) is not None
    d = lambda xp: Decimal(t(xp) or "0")
    sup = "cac:AccountingSupplierParty/cac:Party/"
    cus = "cac:AccountingCustomerParty/cac:Party/"
    lines = root.findall("cac:InvoiceLine", NS)
    subs = root.findall("cac:TaxTotal/cac:TaxSubtotal", NS)
    line_sum = sum(Decimal(l.findtext("cbc:LineExtensionAmount", namespaces=NS)) for l in lines)

    def mod97(v):
        return len(v) == 10 and v.isdigit() and int(v[8:]) == 97 - int(v[:8]) % 97

    def r2(x):
        return x.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    checks = [
        ("BR-01", t("cbc:CustomizationID") != ""),
        ("PEPPOL-EN16931-R004", t("cbc:CustomizationID").startswith(SPEC)),
        ("PEPPOL-EN16931-R001", t("cbc:ProfileID") != ""),
        ("BR-02", t("cbc:ID") != ""),
        ("BR-03", t("cbc:IssueDate") != ""),
        ("BR-04", t("cbc:InvoiceTypeCode") != ""),
        ("BR-05", t("cbc:DocumentCurrencyCode") != ""),
        ("PEPPOL-EN16931-R003", has("cbc:BuyerReference") or has("cac:OrderReference/cbc:ID")),
        ("BR-06", t(sup + "cac:PartyLegalEntity/cbc:RegistrationName") != ""),
        ("BR-07", t(cus + "cac:PartyLegalEntity/cbc:RegistrationName") != ""),
        ("BR-08", has(sup + "cac:PostalAddress")),
        ("BR-09", t(sup + "cac:PostalAddress/cac:Country/cbc:IdentificationCode") != ""),
        ("BR-10", has(cus + "cac:PostalAddress")),
        ("BR-11", t(cus + "cac:PostalAddress/cac:Country/cbc:IdentificationCode") != ""),
        ("PEPPOL-EN16931-R020", t(sup + "cbc:EndpointID") != ""),
        ("PEPPOL-EN16931-R010", t(cus + "cbc:EndpointID") != ""),
        ("PEPPOL-COMMON-R043 (seller)", mod97(t(sup + "cbc:EndpointID"))),
        ("PEPPOL-COMMON-R043 (buyer)", mod97(t(cus + "cbc:EndpointID"))),
        ("BR-CO-26", t(sup + "cac:PartyTaxScheme/cbc:CompanyID") != ""),
        ("BR-CO-09", t(sup + "cac:PartyTaxScheme/cbc:CompanyID")[:2] == "BE"
                     and t(cus + "cac:PartyTaxScheme/cbc:CompanyID")[:2] == "BE"),
        ("BR-S-02 (seller VAT id with an S line)", t(sup + "cac:PartyTaxScheme/cbc:CompanyID") != ""),
        ("BR-12", has("cac:LegalMonetaryTotal/cbc:LineExtensionAmount")),
        ("BR-13", has("cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount")),
        ("BR-14", has("cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount")),
        ("BR-15", has("cac:LegalMonetaryTotal/cbc:PayableAmount")),
        ("BR-16", len(lines) >= 1),
        ("BR-CO-18", len(subs) >= 1),
        ("BR-CO-10", d("cac:LegalMonetaryTotal/cbc:LineExtensionAmount") == line_sum),
        ("BR-CO-13", d("cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount") == line_sum),
        ("BR-CO-14", d("cac:TaxTotal/cbc:TaxAmount")
                     == sum(Decimal(s.findtext("cbc:TaxAmount", namespaces=NS)) for s in subs)),
        ("BR-CO-15", d("cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount")
                     == d("cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount") + d("cac:TaxTotal/cbc:TaxAmount")),
        ("BR-CO-16", d("cac:LegalMonetaryTotal/cbc:PayableAmount")
                     == d("cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount")),
        ("BR-CO-17", all(
            Decimal(s.findtext("cbc:TaxAmount", namespaces=NS))
            == r2(Decimal(s.findtext("cbc:TaxableAmount", namespaces=NS))
                  * Decimal(s.findtext("cac:TaxCategory/cbc:Percent", namespaces=NS)) / 100)
            for s in subs)),
        ("BR-CO-19", (not has("cac:InvoicePeriod"))
                     or has("cac:InvoicePeriod/cbc:StartDate") or has("cac:InvoicePeriod/cbc:EndDate")),
        ("PEPPOL-EN16931-R051", all(
            e.get("currencyID") == t("cbc:DocumentCurrencyCode")
            for e in root.iter() if e.get("currencyID") is not None)),
        ("PEPPOL-EN16931-R008", all((e.text or "").strip() or len(e) for e in root.iter())),
    ]
    failed = [rule for rule, ok in checks if not ok]
    for rule, ok in checks:
        print(("ok  " if ok else "FAIL"), rule)
    print(f"{len(checks) - len(failed)}/{len(checks)} checks pass")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "example-invoice.xml"))
