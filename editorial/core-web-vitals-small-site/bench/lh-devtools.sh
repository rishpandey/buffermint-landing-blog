#!/bin/bash
# Cross-check in Lighthouse's DevTools throttling mode (throttling applied during the load), 4 builds x 3 pages x 3 runs.
set -u
B=$(cd "$(dirname "$0")" && pwd); OUT=${OUT:-$HOME/cwv/lighthouse-devtools.jsonl}
pids=(); vars=(); port=8301
for n in b0-start b3-vendor b5-no-vue b6-main; do node "$B/serve.mjs" "$HOME/cwv/b/$n" $port & pids+=($!); vars+=("$n=$port"); port=$((port+1)); done
trap 'kill "${pids[@]}"' EXIT
sleep 1
LH_EXTRA="--throttling-method=devtools" /srv/buffermint/bin/one-chrome fnm exec --using=22 -- node "$B/lh-run.mjs" /srv/buffermint/content-studio/node_modules/lighthouse/cli/index.js "$HOME/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome" 3 "$OUT" "${vars[@]}" -- / /about-us/ /articles/how-to-use-lean-methodology-to-innovate-faster/
echo LH-DONE $?
