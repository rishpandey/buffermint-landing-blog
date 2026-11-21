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
    out, n = re.subn(pattern, "", xml, count=1)
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


if __name__ == "__main__":
    unittest.main()
