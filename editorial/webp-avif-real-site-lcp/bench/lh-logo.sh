#!/bin/bash
# Logo test: original vs resized, five runs each, both Lighthouse modes, one session. Run from the repo root under bin/one-chrome.
B=editorial/webp-avif-real-site-lcp/bench; M=/srv/buffermint/content-studio/node_modules
node $B/make-logo.mjs $M /tmp/lp/v/webp /tmp/lp/v/logo
node $B/serve.mjs /tmp/lp/v/webp 8102 & A=$!; node $B/serve.mjs /tmp/lp/v/logo 8107 & C=$!
trap 'kill $A $C' EXIT; sleep 1
rm -f $B/lighthouse-logo.jsonl $B/lighthouse-devtools-logo.jsonl
R="$M/lighthouse/cli/index.js $HOME/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome 5"
fnm exec --using=22 -- node $B/lh-run.mjs $R $B/lighthouse-logo.jsonl original=8102 resized=8107 -- /
LH_EXTRA=--throttling-method=devtools fnm exec --using=22 -- node $B/lh-run.mjs $R $B/lighthouse-devtools-logo.jsonl original=8102 resized=8107 -- /
