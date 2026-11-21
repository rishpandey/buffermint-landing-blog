"""Tests for check-example.py. Run: python3 -I test_check_example.py (from this folder)."""
import importlib.util
import os
import re
import unittest
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("check_example", os.path.join(HERE, "check-example.py"))
ce = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ce)
XML = open(os.path.join(HERE, "example-invoice.xml"), encoding="utf-8").read()


def failed(xml):
    return [rule for rule, ok in ce.checks_for(ET.fromstring(xml.encode())) if not ok]


def drop(xml, pattern):
    out, n = re.subn(pattern, "", xml, count=1, flags=re.S)
    assert n == 1, pattern
    return out


class CheckExample(unittest.TestCase):
    def test_example_passes_every_rule(self):
        self.assertEqual(failed(XML), [])

    def test_rule_ids_are_distinct(self):
        rules = [r for r, _ in ce.checks_for(ET.fromstring(XML.encode()))]
        self.assertEqual(len(rules), len(set(rules)))

    def test_missing_buyer_reference_and_endpoint_fails_exactly_two(self):
        xml = drop(XML, r"<cbc:BuyerReference>[^<]*</cbc:BuyerReference>")
        xml = drop(xml, r'<cbc:EndpointID schemeID="0208">0506070873</cbc:EndpointID>')
        self.assertEqual(sorted(failed(xml)), ["PEPPOL-EN16931-R003", "PEPPOL-EN16931-R010"])

    def test_r043_only_for_scheme_0208(self):
        xml = XML.replace('<cbc:EndpointID schemeID="0208">1020304002</cbc:EndpointID>',
                          '<cbc:EndpointID schemeID="9925">BE1020304002</cbc:EndpointID>')
        self.assertEqual(failed(xml), [])
        bad = XML.replace(">0506070873</cbc:EndpointID>", ">0506070874</cbc:EndpointID>")
        self.assertEqual(failed(bad), ["PEPPOL-COMMON-R043"])

    def test_cross_border_vat_ids_pass_br_co_09(self):
        xml = XML.replace("<cbc:CompanyID>BE0506070873</cbc:CompanyID>", "<cbc:CompanyID>NL123456789B01</cbc:CompanyID>")
        self.assertNotIn("BR-CO-09", failed(xml))
        no_buyer_vat = drop(XML, r"(?s)<cac:PartyTaxScheme>\s*<cbc:CompanyID>BE0506070873</cbc:CompanyID>.*?</cac:PartyTaxScheme>")
        self.assertNotIn("BR-CO-09", failed(no_buyer_vat))
        self.assertIn("BR-CO-09", failed(XML.replace("BE0506070873", "0506070873")))

    def test_missing_amounts_fail_instead_of_crashing(self):
        head, line = XML.split("<cac:InvoiceLine>")
        xml = head + "<cac:InvoiceLine>" + drop(line, r'<cbc:LineExtensionAmount currencyID="EUR">49.00</cbc:LineExtensionAmount>')
        self.assertIn("BR-24", failed(xml))
        xml = XML.replace('<cbc:TaxableAmount currencyID="EUR">49.00</cbc:TaxableAmount>', "")
        self.assertIn("BR-S-08", failed(xml))

    def test_line_level_rules(self):
        self.assertIn("BR-25", failed(drop(XML, r"<cbc:Name>Pro plan, monthly</cbc:Name>")))
        self.assertIn("BR-S-08", failed(XML.replace('<cbc:TaxableAmount currencyID="EUR">49.00', '<cbc:TaxableAmount currencyID="EUR">48.00')))
        self.assertIn("BR-27", failed(XML.replace('<cbc:PriceAmount currencyID="EUR">49.00', '<cbc:PriceAmount currencyID="EUR">-49.00')))

    def test_non_finite_amounts_fail_instead_of_crashing(self):
        self.assertIn("BR-27", failed(XML.replace('<cbc:PriceAmount currencyID="EUR">49.00', '<cbc:PriceAmount currencyID="EUR">NaN')))
        self.assertIn("BR-S-09", failed(XML.replace('<cbc:TaxableAmount currencyID="EUR">49.00', '<cbc:TaxableAmount currencyID="EUR">Infinity')))

    def test_zero_price_is_allowed(self):
        self.assertNotIn("BR-27", failed(XML.replace('<cbc:PriceAmount currencyID="EUR">49.00', '<cbc:PriceAmount currencyID="EUR">0')))

    def test_same_rate_written_two_ways(self):
        xml = XML.replace("<cbc:Percent>21</cbc:Percent>", "<cbc:Percent>21.00</cbc:Percent>", 1)
        self.assertEqual(failed(xml), [])

    def test_non_vat_tax_registration_is_not_a_vat_id(self):
        loc = ("<cac:PartyTaxScheme><cbc:CompanyID>12345</cbc:CompanyID>"
               "<cac:TaxScheme><cbc:ID>LOC</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>")
        xml = XML.replace("<cac:PartyLegalEntity>\n        <cbc:RegistrationName>Example SaaS BV", loc + "<cac:PartyLegalEntity>\n        <cbc:RegistrationName>Example SaaS BV", 1)
        self.assertIn(loc, xml)
        self.assertEqual(failed(xml), [])

    def test_prepaid_invoice_balances(self):
        xml = XML.replace('<cbc:PayableAmount currencyID="EUR">59.29</cbc:PayableAmount>',
                          '<cbc:PrepaidAmount currencyID="EUR">59.29</cbc:PrepaidAmount><cbc:PayableAmount currencyID="EUR">0.00</cbc:PayableAmount>')
        self.assertEqual(failed(xml), [])

    def test_vat_in_accounting_currency_is_exempt_from_r051(self):
        xml = XML.replace("<cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>",
                          "<cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode><cbc:TaxCurrencyCode>PLN</cbc:TaxCurrencyCode>")
        xml = xml.replace("<cac:TaxTotal>", '<cac:TaxTotal><cbc:TaxAmount currencyID="PLN">43.60</cbc:TaxAmount></cac:TaxTotal><cac:TaxTotal>', 1)
        self.assertEqual(failed(xml), [])

    def test_r043_ignores_other_ids_with_scheme_0208(self):
        xml = XML.replace("<cbc:Name>Pro plan, monthly</cbc:Name>",
                          '<cbc:Name>Pro plan, monthly</cbc:Name><cac:StandardItemIdentification><cbc:ID schemeID="0208">123</cbc:ID></cac:StandardItemIdentification>')
        self.assertNotIn("PEPPOL-COMMON-R043", failed(xml))

    def test_vat_has_a_margin_of_one_not_the_cent(self):
        # BR-S-09 / BR-CO-17 accept a subtotal VAT within 1 of taxable x rate; the totals rules still need exact sums.
        sub = XML.replace('<cbc:TaxAmount currencyID="EUR">10.29</cbc:TaxAmount>\n      <cac:TaxCategory>',
                          '<cbc:TaxAmount currencyID="EUR">10.30</cbc:TaxAmount>\n      <cac:TaxCategory>')
        self.assertNotEqual(sub, XML)
        f = failed(sub)
        self.assertNotIn("BR-S-09", f)
        self.assertNotIn("BR-CO-17", f)
        self.assertIn("BR-CO-14", f)  # the subtotal no longer adds up to the VAT total
        off = sub.replace(">10.30<", ">11.29<")
        self.assertIn("BR-S-09", failed(off))
        self.assertIn("BR-CO-17", failed(off))

    def test_br_co_17_covers_zero_rated_subtotals(self):
        zero = ('<cac:TaxSubtotal><cbc:TaxableAmount currencyID="EUR">0.00</cbc:TaxableAmount>'
                '<cbc:TaxAmount currencyID="EUR">{}</cbc:TaxAmount><cac:TaxCategory><cbc:ID>Z</cbc:ID>'
                '<cbc:Percent>0</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal>')
        ok = XML.replace("</cac:TaxSubtotal>", "</cac:TaxSubtotal>" + zero.format("0.00"), 1)
        self.assertNotIn("BR-CO-17", failed(ok))
        bad = XML.replace("</cac:TaxSubtotal>", "</cac:TaxSubtotal>" + zero.format("1.00"), 1)
        self.assertIn("BR-CO-17", failed(bad))
        self.assertNotIn("BR-S-09", failed(bad))  # BR-S-09 is for category S only

    def test_r120_line_net_matches_quantity_times_price(self):
        two = XML.replace('<cbc:InvoicedQuantity unitCode="MON">1</cbc:InvoicedQuantity>',
                          '<cbc:InvoicedQuantity unitCode="MON">2</cbc:InvoicedQuantity>')
        self.assertEqual(failed(two), ["PEPPOL-EN16931-R120"])
        base = XML.replace('<cbc:PriceAmount currencyID="EUR">49.00</cbc:PriceAmount>',
                           '<cbc:PriceAmount currencyID="EUR">98.00</cbc:PriceAmount><cbc:BaseQuantity unitCode="MON">2</cbc:BaseQuantity>')
        self.assertEqual(failed(base), [])
        self.assertEqual(failed(base.replace('<cbc:BaseQuantity unitCode="MON">2', '<cbc:BaseQuantity unitCode="DAY">2')),
                         ["PEPPOL-EN16931-R130"])
        self.assertIn("PEPPOL-EN16931-R121", failed(base.replace('unitCode="MON">2</cbc:BaseQuantity>', 'unitCode="MON">-2</cbc:BaseQuantity>')))
        slack = XML.replace('<cbc:PriceAmount currencyID="EUR">49.00', '<cbc:PriceAmount currencyID="EUR">49.02')
        self.assertNotIn("PEPPOL-EN16931-R120", failed(slack))
        self.assertIn("PEPPOL-EN16931-R120", failed(slack.replace(">49.02<", ">49.03<")))

    def test_payment_means_rules(self):
        self.assertEqual(failed(drop(XML, r"<cac:PayeeFinancialAccount>.*?</cac:PayeeFinancialAccount>")), ["BR-61"])
        card = drop(XML.replace("<cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>", "<cbc:PaymentMeansCode>48</cbc:PaymentMeansCode>"),
                    r"<cac:PayeeFinancialAccount>.*?</cac:PayeeFinancialAccount>")
        self.assertEqual(failed(card), [])
        self.assertIn("BR-49", failed(drop(XML, r"<cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>")))

    def test_r053_one_tax_total_with_subtotals(self):
        start, end = XML.index("<cac:TaxTotal>"), XML.index("</cac:TaxTotal>") + len("</cac:TaxTotal>")
        twice = XML[:end] + XML[start:end] + XML[end:]
        self.assertIn("PEPPOL-EN16931-R053", failed(twice))

    def test_br_co_09_uses_the_rule_prefix_list(self):
        self.assertIn("BR-CO-09", failed(XML.replace("BE0506070873", "ZZ0506070873")))
        self.assertNotIn("BR-CO-09", failed(XML.replace("BE0506070873", "XI0506070873")))

    def test_br_co_16_fails_a_present_but_broken_prepaid_amount(self):
        xml = XML.replace('<cbc:PayableAmount currencyID="EUR">59.29</cbc:PayableAmount>',
                          '<cbc:PrepaidAmount currencyID="EUR">abc</cbc:PrepaidAmount><cbc:PayableAmount currencyID="EUR">59.29</cbc:PayableAmount>')
        self.assertIn("BR-CO-16", failed(xml))

    def test_xpath_round_halves_up(self):
        from decimal import Decimal as D
        self.assertEqual([ce.xround(D(x)) for x in ("2.5", "-2.5", "0.49", "-0.51")], [3, -2, 0, -1])


if __name__ == "__main__":
    unittest.main()
