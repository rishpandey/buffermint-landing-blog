#!/bin/bash
# Lighthouse 13.5.0, mobile, default simulated throttling: 7 builds x 3 pages x RUNS runs, round-robin.
# Each build is served by serve.mjs (Brotli, cache headers) on its own port. Output: one JSON line per run.
set -u
B=$(cd "$(dirname "$0")" && pwd); OUT=${OUT:-$HOME/cwv/lighthouse.jsonl}; RUNS=${RUNS:-5}
pids=(); vars=(); port=8201
for d in "$HOME"/cwv/b/b*; do
  n=$(basename "$d"); node "$B/serve.mjs" "$d" $port & pids+=($!); vars+=("$n=$port"); port=$((port+1))
done
trap 'kill "${pids[@]}"' EXIT
sleep 1
CHROME=$HOME/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
LH=/srv/buffermint/content-studio/node_modules/lighthouse/cli/index.js
PAGES="/ /about-us/ /articles/how-to-use-lean-methodology-to-innovate-faster/"
/srv/buffermint/bin/one-chrome fnm exec --using=22 -- node "$B/lh-run.mjs" "$LH" "$CHROME" "$RUNS" "$OUT" "${vars[@]}" -- $PAGES
echo LH-DONE $?
