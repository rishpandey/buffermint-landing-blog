"""EU VAT worked examples for the post. Run: python3 -I vat-math.py
Rates: Your Europe "VAT rules and rates" table (last checked 13/07/2026, read 2026-11-21).
Population: Eurostat tps00001, 1 January 2026 (fetched 2026-11-21, saved next to this file).
"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
RATES = {"AT":20,"BE":21,"BG":20,"CY":19,"CZ":21,"DE":19,"DK":25,"EE":24,"EL":24,"ES":21,
         "FI":25.5,"FR":20,"HR":25,"HU":27,"IE":23,"IT":22,"LT":21,"LU":17,"LV":21,"MT":18,
         "NL":21,"PL":23,"PT":23,"RO":21,"SE":25,"SI":22,"SK":23}

def population(year="2026"):
    d = json.load(open(os.path.join(HERE, "eurostat-tps00001-2026-11-21.json")))
    geo = d["dimension"]["geo"]["category"]["index"]; time = d["dimension"]["time"]["category"]["index"]
    nt = len(time); out = {}
    for c in RATES:
        g = geo.get(c)
        v = d["value"].get(str(g * nt + time[year])) if g is not None else None
        out[c] = v
    return out

def main():
    pop = population()
    missing = [c for c, v in pop.items() if v is None]
    assert not missing, missing
    total = sum(pop.values())
    w = sum(RATES[c] * pop[c] for c in RATES) / total
    print(f"EU27 population 1 Jan 2026: {total:,}")
    print(f"simple mean standard rate: {sum(RATES.values())/27:.2f}%")
    print(f"population-weighted standard rate: {w:.2f}%")
    price = 29.0
    lo, hi = min(RATES, key=RATES.get), max(RATES, key=RATES.get)
    for c in (lo, "DE", "FR", hi):
        r = RATES[c] / 100
        print(f"{c} {RATES[c]}%: VAT-inclusive EUR 29 keeps {price/(1+r):.2f}; VAT on top charges {price*(1+r):.2f}")
    print(f"gap in net per customer per month (inclusive pricing): {price/(1+RATES[lo]/100)-price/(1+RATES[hi]/100):.2f}")
    # Example A: 100 consumers spread like the population, EUR 29/month, VAT on top
    year_sales = 100 * price * 12
    vat = sum(year_sales * pop[c] / total * RATES[c] / 100 for c in RATES)
    print(f"Example A: net sales EUR {year_sales:,.0f}/yr, VAT collected and paid through OSS EUR {vat:,.0f}/yr, "
          f"per quarterly return EUR {vat/4:,.0f}")
    # Fee comparison per sale, USD, card issued outside the US (topic 5 price lists, read Oct 2026)
    for p in (9, 29, 99):
        paddle = 0.05 * p + 0.50
        stripe_basic = (0.029 + 0.015 + 0.007 + 0.005) * p + 0.30  # processing + intl card + Billing + Tax Basic
        stripe_notax = (0.029 + 0.015 + 0.007) * p + 0.30          # no Stripe Tax: not registered (B2B only)
        print(f"${p}: Paddle {paddle:.3f}, Stripe+Billing+Tax Basic {stripe_basic:.3f} (MoR premium {paddle-stripe_basic:+.3f}), "
              f"Stripe+Billing no Tax {stripe_notax:.3f} (premium {paddle-stripe_notax:+.3f})")
    n = 1200
    print(f"1,200 sales at $29: premium vs Tax Basic ${n*((0.05*29+0.5)-(0.056*29+0.3)):.0f}/yr, "
          f"vs no Stripe Tax ${n*((0.05*29+0.5)-(0.051*29+0.3)):.0f}/yr, Tax Complete adds $1,080/yr at $90/month")

if __name__ == "__main__":
    main()
