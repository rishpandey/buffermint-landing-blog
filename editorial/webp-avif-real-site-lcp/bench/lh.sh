#!/bin/bash
set -u
L=/srv/buffermint/buffermint-landing; B=$L/editorial/webp-avif-real-site-lcp/bench
cd $L; pids=()
for x in jpeg:8101 webp:8102 avif:8103; do node $B/serve.mjs /tmp/lp/v/${x%%:*} ${x##*:} & pids+=($!); done
for x in before:8104 webp:8105 vendor:8106; do node $B/serve.mjs /tmp/lp/hist/${x%%:*}/build_production ${x##*:} & pids+=($!); done
trap 'kill "${pids[@]}"' EXIT
sleep 1
CHROME=$HOME/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
LH=/srv/buffermint/content-studio/node_modules/lighthouse/cli/index.js
POSTPATH=/articles/how-to-achieve-a-product-market-fit-with-your-product/
export PATH_NODE=1
/srv/buffermint/bin/one-chrome fnm exec --using=22 -- sh -c "node -v; node $B/lh-run.mjs $LH $CHROME 1 /tmp/lp/sanity.jsonl webp=8102 -- $POSTPATH && [ -s /tmp/lp/sanity.jsonl ] && node $B/lh-run.mjs $LH $CHROME 5 /tmp/lp/lh.jsonl jpeg=8101 webp=8102 avif=8103 h-before=8104 h-webp=8105 h-vendor=8106 -- / $POSTPATH"
echo LH-DONE $?
