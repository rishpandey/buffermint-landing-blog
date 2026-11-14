#!/usr/bin/env bash
# Build the landing site + blog and publish it to https://buffermint.com/ on Cloudflare Pages
# (../buffermint-pages/publish.sh, which adds the /tools/ build from the buffermint-tools repo).
# A copy also goes to the VPS (buffermint-vps) as a fallback and as the source publish.sh reads.
# Needs PHP 8.2 to 8.5 (Jigsaw 1.3), Composer, Node 20+ (see .nvmrc) and Yarn 1.
set -euo pipefail
cd "$(dirname "$0")"
# Mac emergency path logs in as agent (never root) and runs the same root-owned wrappers with sudo
HOST=${DEPLOY_HOST:-agent@buffermint-vps}
STAGE=/srv/buffermint/.mac-stage
# On buffermint-vps itself (the bm-publish wrapper exists) everything is local: no ssh, root-owned wrappers instead of root
[ -x /usr/local/sbin/bm-publish ] && ON_VPS=1 || ON_VPS=
[ -n "$ON_VPS" ] || [ "${ALLOW_MAC_DEPLOY:-}" = 1 ] || { echo "Deploys run on buffermint-vps since 2026-10-23: ssh buffermint-agent, then cd /srv/buffermint/buffermint-landing. (ALLOW_MAC_DEPLOY=1 overrides, for emergencies only.)"; exit 1; }
DIR=/var/www/buffermint-landing
# Only merged, pushed main ships (fix 11, audit L5): a lane may have its branch checked out in this folder. On main at
# origin/main after a fetch, or detached at a commit already in origin/main (bin/landing-autopublish's worktree: it waits
# for a check slot, so main may move on meanwhile). No override (ALLOW_DIRTY below covers uncommitted files only).
release_guard() {
  local b h o lim=()
  b=$(git symbolic-ref --quiet --short HEAD 2>/dev/null) || b=
  [ -z "$b" ] || [ "$b" = main ] || { echo "on branch $b, not main (a lane may be working here)"; return 1; }
  command -v timeout >/dev/null && lim=(timeout 60)   # macOS has no timeout(1)
  # into a fixed ref, not FETCH_HEAD, which another fetch in this folder could rewrite meanwhile
  GIT_TERMINAL_PROMPT=0 ${lim[@]+"${lim[@]}"} git fetch --quiet origin +refs/heads/main:refs/remotes/origin/main 2>/dev/null || { echo "couldn't fetch origin main"; return 1; }
  h=$(git rev-parse --verify -q HEAD) && o=$(git rev-parse --verify -q refs/remotes/origin/main) || { echo "couldn't read HEAD or origin/main"; return 1; }
  [ "$h" = "$o" ] && return 0
  [ -z "$b" ] && git merge-base --is-ancestor "$h" "$o" && return 0
  echo "HEAD ${h:0:10} isn't origin/main ${o:0:10} (unpushed, behind or another commit)"; return 1
}
why=$(release_guard) || { echo "Not deploying: $why. Deploy only merged main: merge and push, then run it from a clean main checkout (git pull --ff-only if it's behind)."; exit 1; }
# deploy only committed work (ALLOW_DIRTY=1 to override, e.g. while testing)
if [ -z "${ALLOW_DIRTY:-}" ] && [ -n "$(git status --porcelain --ignore-submodules=none -- . ':(exclude).claude')" ]; then
  echo "Uncommitted changes: commit them first (or ALLOW_DIRTY=1 ./deploy.sh)."; exit 1
fi
# publish.sh refuses a buffermint-pages checkout that isn't a clean main at origin/main: ask it now, before the build and
# the copy to /var/www, so a pages lane can't stop this deploy halfway
# (an older publish.sh would ignore CHECK_ONLY and publish, so it must know it first)
grep -q 'CHECK_ONLY' ../buffermint-pages/publish.sh || { echo "Not deploying: ../buffermint-pages/publish.sh is older than this deploy.sh (no CHECK_ONLY): pull it first."; exit 1; }
CHECK_ONLY=1 ../buffermint-pages/publish.sh || { echo "Not deploying: ../buffermint-pages isn't ready to publish (above)."; exit 1; }
# build against the brand commit HEAD records, also when ALLOW_DIRTY=1 lets a moved or staged pointer through (BM-383)
git submodule update --init brand
BRAND_WANT=$(git rev-parse HEAD:brand)
if [ "$(git -C brand rev-parse HEAD)" != "$BRAND_WANT" ]; then
  echo "brand submodule is not at the commit HEAD records: checking out $BRAND_WANT"
  git -C brand checkout -q --detach "$BRAND_WANT"
fi
[ "$(git -C brand rev-parse HEAD)" = "$BRAND_WANT" ] || { echo "brand submodule is still not at $BRAND_WANT: stopping."; exit 1; }
# every deploy, so a lockfile change pulled into an existing checkout is installed (no-ops when nothing changed)
composer install --no-dev --no-interaction -q
yarn install --frozen-lockfile --silent
yarn run prod >/dev/null
# Jigsaw 1.3 prints PHP 8.4+ deprecations: hide only those, keep real errors and warnings visible
php -d error_reporting='E_ALL & ~E_DEPRECATED' vendor/bin/jigsaw build production | tail -1
# SEO gate (shared with the tools site): titles, descriptions, canonicals, OG, JSON-LD, links, sitemap
node brand/scripts/seo-check.mjs --dir build_production --site https://buffermint.com --skip /tools/,/stats/
if [ -n "$ON_VPS" ]; then
  # bm-www copies into the root-owned web root (no links); before the owner installs it, the old agent copy
  if [ -x /usr/local/sbin/bm-www ]; then sudo -n /usr/local/sbin/bm-www landing "$PWD/build_production"
  else rsync -a --delete build_production/ "$DIR/" && chmod -R u=rwX,go=rX "$DIR"; fi
else
ssh "$HOST" "mkdir -p $STAGE/landing"
rsync -az --delete build_production/ "$HOST:$STAGE/landing/"
ssh "$HOST" "sudo -n /usr/local/sbin/bm-www landing $STAGE/landing"
fi
echo "Uploaded to $([ -n "$ON_VPS" ] && echo "$DIR" || echo "$HOST:$DIR") (fallback copy; also the source publish.sh reads when the tools deploy)"
# buffermint.com is served by Cloudflare Pages: publish this build together with the live /tools/ build
LANDING="$PWD/build_production" ../buffermint-pages/publish.sh
# tell IndexNow search engines (Bing, Yandex, …) which pages changed; never fails the deploy
node brand/scripts/indexnow.mjs --dir build_production --site https://buffermint.com || true
