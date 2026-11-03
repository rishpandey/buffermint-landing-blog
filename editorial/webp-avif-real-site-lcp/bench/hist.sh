#!/bin/bash
# build three historical commits outside the repo
set -u
cd /srv/buffermint/buffermint-landing
for pair in before:fd33e24^ webp:fd33e24 vendor:2368247; do
  n=${pair%%:*}; sha=${pair#*:}; d=/tmp/lp/hist/$n; rm -rf $d; mkdir -p $d
  git archive "$sha" | tar -x -C $d
  sm=$(git ls-tree "$sha" brand | awk '{print $3}'); [ -n "$sm" ] && [ "$(git ls-tree "$sha" brand | awk '{print $2}')" = commit ] && git -C brand archive "$sm" | tar -x -C $d/brand
  ( cd $d; ln -s /srv/buffermint/buffermint-landing/vendor vendor; yarn install --frozen-lockfile --silent --ignore-engines 2>&1 | tail -2; npm run prod 2>&1 | tail -2; ./vendor/bin/jigsaw build production 2>&1 | tail -1; ls build_production | wc -l )
done
