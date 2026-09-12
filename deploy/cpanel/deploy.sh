#!/usr/bin/env bash
# Runs after cPanel pulls the `deploy` branch (see .cpanel.yml), or by hand
# from the cPanel Terminal:  bash ~/disneyparistransfers/deploy.sh
#
# 1. activates the Node.js application's own Node (the "nodevenv" that the
#    Node.js Selector creates for this folder), so the right npm is used;
# 2. installs the production dependencies listed in package-lock.json;
# 3. asks Passenger to restart the application (tmp/restart.txt).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# ~/nodevenv/<application root, relative to home>/<node version>/bin/activate
REL="${ROOT#"$HOME"/}"
ACTIVATE=""
for version in 24 22; do
  if [ -f "$HOME/nodevenv/$REL/$version/bin/activate" ]; then
    ACTIVATE="$HOME/nodevenv/$REL/$version/bin/activate"
    break
  fi
done

if [ -n "$ACTIVATE" ]; then
  # shellcheck disable=SC1090
  . "$ACTIVATE"
  echo "Using $(node -v) from $ACTIVATE"
else
  echo "No Node.js application found for $ROOT in the Node.js Selector (looked for ~/nodevenv/$REL/22)."
  echo "Create it first (Setup Node.js App → Application root: $REL, version 22), then run this script again."
  exit 1
fi

npm ci --omit=dev --no-audit --no-fund

mkdir -p tmp
touch tmp/restart.txt
echo "Deployed build $(cat BUILD 2>/dev/null || echo '?') — application restarted."
