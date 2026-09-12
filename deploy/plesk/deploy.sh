#!/usr/bin/env bash
# Plesk deployment hook. Runs after Plesk pulls the `deploy` branch — as the
# "Additional deployment actions" of the Git repository — or by hand over SSH:
#
#   bash /var/www/vhosts/disneyparistransfers.com/httpdocs/deploy.sh
#
# 1. puts Plesk's Node.js 22 (or newer) first on the PATH;
# 2. installs the production dependencies listed in package-lock.json;
# 3. asks Passenger to restart the application (tmp/restart.txt) — the same
#    thing as the "Restart App" button in the domain's Node.js screen.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

for version in 24 22; do
  if [ -x "/opt/plesk/node/$version/bin/node" ]; then
    export PATH="/opt/plesk/node/$version/bin:$PATH"
    break
  fi
done

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install the 'Node.js 22' component in Plesk (Tools & Settings → Updates),"
  echo "or click 'NPM install' then 'Restart App' in the domain's Node.js screen instead."
  exit 1
fi

echo "Using Node $(node -v) ($(command -v node))"
npm ci --omit=dev --no-audit --no-fund

mkdir -p tmp
touch tmp/restart.txt
echo "Deployed build $(cat BUILD 2>/dev/null || echo '?') — application restarted."
