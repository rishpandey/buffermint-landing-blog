#!/bin/bash
# Build buffermint.com at seven commits outside the repo, same tooling for each.
# Work tree in ~/cwv/w/<name> (deleted after), output kept in ~/cwv/b/<name> (build_production only).
set -u -o pipefail
cd /srv/buffermint/buffermint-landing
for pair in b0-start:5a0b2e3^ b1-cap1600:5a0b2e3 b2-webp:fd33e24 b3-vendor:2368247 b4-covers-webp:c2a29e1 b5-no-vue:d1da61d b6-main:${MAIN:-06f8a4e}; do
  n=${pair%%:*}; sha=${pair#*:}; w=$HOME/cwv/w/$n; d=$HOME/cwv/b/$n
  rm -rf "$w" "$d"; mkdir -p "$w" "$(dirname "$d")"
  git archive "$sha" | tar -x -C "$w" || { echo "ARCHIVE FAILED $n"; exit 1; }
  if [ "$(git ls-tree "$sha" brand | awk '{print $2}')" = commit ]; then
    sm=$(git ls-tree "$sha" brand | awk '{print $3}'); git -C brand archive "$sm" | tar -x -C "$w/brand" || { echo "BRAND ARCHIVE FAILED $n"; exit 1; }
  fi
  ( cd "$w"; cp -a /srv/buffermint/buffermint-landing/vendor vendor  # a copy, not a link: Jigsaw resolves paths from vendor/, so a link builds from the live checkout
    yarn install --frozen-lockfile --silent --ignore-engines >/dev/null 2>&1 || { echo "YARN FAILED $n"; exit 1; }
    npm run prod >/dev/null 2>&1 && [ -s source/assets/build/js/main.js ] || { echo "ASSETS FAILED $n"; exit 1; }
    ./vendor/bin/jigsaw build production > build.log 2>&1; tail -1 build.log; test -d build_production/brand || { echo "BUILD FAILED $n"; tail -20 build.log; exit 1; } ) || exit 1
  mv "$w/build_production" "$d"; rm -rf "$w"
  echo "$n $(git rev-parse --short "$sha") pages=$(find "$d" -name index.html | wc -l)"
done
