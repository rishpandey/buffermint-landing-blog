#!/bin/bash
# Runs under bin/heavy. Rebuild history with real vendor copies, build current, make AVIFs, variants, Lighthouse.
set -u
L=/srv/buffermint/buffermint-landing; B=$L/editorial/webp-avif-real-site-lcp/bench
for n in before webp vendor; do
  d=/tmp/lp/hist/$n; rm -f $d/vendor; rm -rf $d/vendor $d/build_production
  cp -r $L/vendor $d/vendor
  ( cd $d; ./vendor/bin/jigsaw build production 2>&1 | tail -1; echo "$n pages: $(find build_production -name '*.html' | wc -l)" )
done
cd $L && npm run prod 2>&1 | tail -1; ./vendor/bin/jigsaw build production 2>&1 | tail -1
rm -rf /tmp/lp/cur; cp -r build_production /tmp/lp/cur
mkdir -p /tmp/lp/avif
node $B/encode-avif.mjs /srv/buffermint/content-studio/node_modules /tmp/lp/avif 50
python3 -I $B/make-variants.py /tmp/lp/cur /tmp/lp/v /tmp/lp/avif
pids=()
for x in jpeg:8101 webp:8102 avif:8103; do node $B/serve.mjs /tmp/lp/v/${x%%:*} ${x##*:} & pids+=($!); done
for x in before:8104 webp:8105 vendor:8106; do node $B/serve.mjs /tmp/lp/hist/${x%%:*}/build_production ${x##*:} & pids+=($!); done
sleep 1
CHROME=$HOME/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
LH=/srv/buffermint/content-studio/node_modules/lighthouse/cli/index.js
POSTPATH=/articles/how-to-achieve-a-product-market-fit-with-your-product/
/srv/buffermint/bin/one-chrome node $B/lh-run.mjs $LH $CHROME 5 /tmp/lp/lh.jsonl jpeg=8101 webp=8102 avif=8103 h-before=8104 h-webp=8105 h-vendor=8106 -- / $POSTPATH
kill "${pids[@]}"
echo BENCH-DONE
