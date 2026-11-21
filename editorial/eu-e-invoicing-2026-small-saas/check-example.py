"""Check example-invoice.xml against a subset of the Peppol BIS 3.0.22 fatal rules that a
one-line, single-rate (category S) invoice with no allowances or charges can trip.
Each check names the rule it re-implements; the rule texts come from CEN-EN16931-UBL.sch and
PEPPOL-EN16931-UBL.sch in https://github.com/OpenPeppol/peppol-bis-invoice-3 (tag 3.0.22,
4 Nov 2026). This is our own reading of those rules, not the official validator: it doesn't
check the UBL schema, code lists, or the rules for other VAT categories, allowances and charges.
Run: python3 -I check-example.py example-invoice.xml
"""
import re
import sys
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import xml.etree.ElementTree as ET

NS = {
    "i": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
    "cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
    "cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
}
SPEC = "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0"


def num(text):
    """A decimal, or None when the amount is missing or not a number (the rule then fails)."""
    try:
        return Decimal((text or "").strip())
    except InvalidOperation:
        return None


def mod97_0208(v):
    return bool(re.fullmatch(r"[0-9]{10}", v)) and int(v[8:]) == 97 - int(v[:8]) % 97


def r2(x):
    return x.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def checks_for(root):
    t = lambda xp, el=root: (el.findtext(xp, namespaces=NS) or "").strip()
    has = lambda xp, el=root: el.find(xp, NS) is not None
    sup = "cac:AccountingSupplierParty/cac:Party/"
    cus = "cac:AccountingCustomerParty/cac:Party/"
    lines = root.findall("cac:InvoiceLine", NS)
    subs = root.findall("cac:TaxTotal/cac:TaxSubtotal", NS)
    line_amounts = [num(l.findtext("cbc:LineExtensionAmount", namespaces=NS)) for l in lines]
    line_sum = sum(a for a in line_amounts if a is not None) if None not in line_amounts else None
    total = lambda name: num(t(f"cac:LegalMonetaryTotal/cbc:{name}"))
    tax_total = num(t("cac:TaxTotal/cbc:TaxAmount"))
    sub_tax = [num(s.findtext("cbc:TaxAmount", namespaces=NS)) for s in subs]
    s_lines = [l for l in lines if t("cac:Item/cac:ClassifiedTaxCategory/cbc:ID", l) == "S"]
    s_subs = [s for s in subs if t("cac:TaxCategory/cbc:ID", s) == "S"]
    seller_vat_ok = t(sup + "cac:PartyTaxScheme/cbc:CompanyID") != ""

    def eq(a, b):
        return a is not None and b is not None and a == b

    def vat_prefixes_ok():
        # BR-CO-09: every VAT identifier that is present starts with a 2-letter country prefix (or EL).
        ids = [e.text or "" for e in root.findall(sup + "cac:PartyTaxScheme/cbc:CompanyID", NS)]
        ids += [e.text or "" for e in root.findall(cus + "cac:PartyTaxScheme/cbc:CompanyID", NS)]
        ids += [e.text or "" for e in root.findall("cac:TaxRepresentativeParty/cac:PartyTaxScheme/cbc:CompanyID", NS)]
        return all(re.match(r"[A-Z]{2}", i.strip()) for i in ids)

    def r043_ok():
        # PEPPOL-COMMON-R043 applies only to identifiers that exist with schemeID 0208.
        els = [e for e in root.iter() if e.get("schemeID") == "0208"
               and e.tag.split("}")[-1] in ("EndpointID", "ID", "CompanyID")]
        return all(mod97_0208((e.text or "").strip()) for e in els)

    def s_breakdown_ok():
        # BR-S-08: per S rate, taxable amount = sum of S line net amounts (no allowances/charges here).
        for s in s_subs:
            rate = t("cac:TaxCategory/cbc:Percent", s)
            net = [num(l.findtext("cbc:LineExtensionAmount", namespaces=NS)) for l in s_lines
                   if t("cac:Item/cac:ClassifiedTaxCategory/cbc:Percent", l) == rate]
            if None in net or not eq(num(s.findtext("cbc:TaxableAmount", namespaces=NS)), sum(net)):
                return False
        return True

    def s_tax_ok():
        # BR-S-09 / BR-CO-17: tax amount = taxable amount x rate, to the cent.
        for s in s_subs:
            base = num(s.findtext("cbc:TaxableAmount", namespaces=NS))
            rate = num(s.findtext("cac:TaxCategory/cbc:Percent", namespaces=NS))
            if base is None or rate is None or not eq(num(s.findtext("cbc:TaxAmount", namespaces=NS)), r2(base * rate / 100)):
                return False
        return True

    return [
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
        ("PEPPOL-COMMON-R043", r043_ok()),
        ("BR-CO-26", seller_vat_ok or t(sup + "cac:PartyIdentification/cbc:ID") != ""
                     or t(sup + "cac:PartyLegalEntity/cbc:CompanyID") != ""),
        ("BR-CO-09", vat_prefixes_ok()),
        ("BR-12", has("cac:LegalMonetaryTotal/cbc:LineExtensionAmount")),
        ("BR-13", has("cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount")),
        ("BR-14", has("cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount")),
        ("BR-15", has("cac:LegalMonetaryTotal/cbc:PayableAmount")),
        ("BR-16", len(lines) >= 1),
        ("BR-21", all(t("cbc:ID", l) for l in lines)),
        ("BR-22", all(has("cbc:InvoicedQuantity", l) for l in lines)),
        ("BR-23", all(l.find("cbc:InvoicedQuantity", NS) is not None
                      and l.find("cbc:InvoicedQuantity", NS).get("unitCode") for l in lines)),
        ("BR-24", None not in line_amounts),
        ("BR-25", all(t("cac:Item/cbc:Name", l) for l in lines)),
        ("BR-26", all(num(t("cac:Price/cbc:PriceAmount", l)) is not None for l in lines)),
        ("BR-27", all((num(t("cac:Price/cbc:PriceAmount", l)) or Decimal(-1)) >= 0 for l in lines)),
        ("BR-CO-04", all(t("cac:Item/cac:ClassifiedTaxCategory/cbc:ID", l) for l in lines)),
        ("BR-CO-18", len(subs) >= 1),
        ("BR-CO-10", eq(total("LineExtensionAmount"), line_sum)),
        ("BR-CO-13", eq(total("TaxExclusiveAmount"), line_sum)),
        ("BR-CO-14", None not in sub_tax and eq(tax_total, sum(sub_tax))),
        ("BR-CO-15", total("TaxExclusiveAmount") is not None and tax_total is not None
                     and eq(total("TaxInclusiveAmount"), total("TaxExclusiveAmount") + tax_total)),
        ("BR-CO-16", eq(total("PayableAmount"), total("TaxInclusiveAmount"))),
        ("BR-CO-17", s_tax_ok()),
        ("BR-CO-19", (not has("cac:InvoicePeriod"))
                     or has("cac:InvoicePeriod/cbc:StartDate") or has("cac:InvoicePeriod/cbc:EndDate")),
        ("BR-S-01", not s_lines or bool(s_subs)),
        ("BR-S-02", not s_lines or seller_vat_ok),
        ("BR-S-05", all((num(t("cac:Item/cac:ClassifiedTaxCategory/cbc:Percent", l)) or 0) > 0 for l in s_lines)),
        ("BR-S-08", s_breakdown_ok()),
        ("BR-S-09", s_tax_ok()),
        ("BR-S-10", all(not has("cac:TaxCategory/cbc:TaxExemptionReason", s)
                        and not has("cac:TaxCategory/cbc:TaxExemptionReasonCode", s) for s in s_subs)),
        ("PEPPOL-EN16931-R051", all(
            e.get("currencyID") == t("cbc:DocumentCurrencyCode")
            for e in root.iter() if e.get("currencyID") is not None)),
        ("PEPPOL-EN16931-R008", all((e.text or "").strip() or len(e) for e in root.iter())),
    ]


def main(path):
    checks = checks_for(ET.parse(path).getroot())
    failed = [rule for rule, ok in checks if not ok]
    for rule, ok in checks:
        print(("ok  " if ok else "FAIL"), rule)
    print(f"{len(checks) - len(failed)}/{len(checks)} rules pass")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "example-invoice.xml"))
