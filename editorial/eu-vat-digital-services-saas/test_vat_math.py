"""The numbers the eu-vat-digital-services-saas post cites still come out of vat-math.py.
Run: python3 -I -B test_vat_math.py (tests/editorial-scripts.test.mjs runs it in the check)."""
import contextlib, importlib.util, io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("vat_math", os.path.join(HERE, "vat-math.py"))
vm = importlib.util.module_from_spec(spec); spec.loader.exec_module(vm)
POST = open(os.path.join(HERE, "..", "..", "source", "_posts", "eu-vat-digital-services-saas.blade.md"), encoding="utf8").read()

def run():
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        vm.main()
    return buf.getvalue()

def test_rates_table():
    assert len(vm.RATES) == 27
    assert min(vm.RATES, key=vm.RATES.get) == "LU" and max(vm.RATES, key=vm.RATES.get) == "HU"

def test_population_covers_every_country():
    pop = vm.population()
    assert all(v for v in pop.values()), pop
    assert sum(pop.values()) == 451_990_314

def test_script_output_matches_the_post():
    out = run()
    # (script output, how the post writes it)
    for script, post in [
        ("simple mean standard rate: 21.91%", "21.91%"),
        ("population-weighted standard rate: 21.27%", "21.27%"),
        ("keeps 24.79", "24.79"),
        ("keeps 22.83", "22.83"),
        ("(inclusive pricing): 1.95", "1.95"),
        ("net sales EUR 34,800/yr", "34,800"),
        ("OSS EUR 7,400/yr", "7,400"),
        ("per quarterly return EUR 1,850", "1,850"),
        ("premium vs Tax Basic $31/yr", "$31"),
        ("vs no Stripe Tax $205/yr", "$205"),
    ]:
        assert script in out, f"vat-math.py no longer prints {script!r}:\n{out}"
        assert post in POST, f"the post no longer cites {post!r}"

if __name__ == "__main__":
    failed = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            try:
                fn(); print("ok", name)
            except AssertionError as e:
                failed += 1; print("FAIL", name, e)
    sys.exit(1 if failed else 0)
