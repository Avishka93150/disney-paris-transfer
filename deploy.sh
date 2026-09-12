#!/usr/bin/env bash
#
# Disney Paris Transfers — deployment on the Plesk server (disneyparistransfers.com).
#
# FIRST DEPLOYMENT — in Plesk, open Tools & Settings → SSH Terminal (root) and paste:
#
#   curl -fsSL https://raw.githubusercontent.com/Avishka93150/disney-paris-transfer/main/deploy.sh | bash
#
# EVERY UPDATE AFTERWARDS — same terminal, one command:
#
#   bash /var/www/vhosts/disneyparistransfers.com/httpdocs/deploy.sh
#
# What it does, every time it runs:
#   1. uses Plesk's Node.js 22 (or newer);
#   2. fetches the latest code from GitHub into the application folder — the
#      first time it clones it; an older site found there is moved aside and
#      its database and .env are carried over;
#   3. creates .env on the first run (generates SESSION_SECRET, asks for the
#      admin login, points the database outside the code folder);
#   4. installs the dependencies and builds the site;
#   5. configures the Node.js application in Plesk (when run as root) and
#      restarts it, then checks that the site answers.
#
# Settings can be overridden by environment variables: DOMAIN, BRANCH, REPO,
# APP_ROOT, DATA_DIR.
set -euo pipefail

DOMAIN="${DOMAIN:-disneyparistransfers.com}"
REPO="${REPO:-https://github.com/Avishka93150/disney-paris-transfer.git}"
BRANCH="${BRANCH:-main}"
VHOST="${VHOST:-/var/www/vhosts/$DOMAIN}"
APP="${APP_ROOT:-$VHOST/httpdocs}"
DATA_DIR="${DATA_DIR:-$VHOST/data}"
MIN_NODE=22

say()  { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$*"; }
die()  { printf '\n\033[1;31m✖ %s\033[0m\n' "$*" >&2; exit 1; }

IS_ROOT=0
[ "$(id -u)" = 0 ] && IS_ROOT=1

# ── 1. Node.js ───────────────────────────────────────────────────────────────
for version in 26 24 22; do
  if [ -x "/opt/plesk/node/$version/bin/node" ]; then
    export PATH="/opt/plesk/node/$version/bin:$PATH"
    break
  fi
done
command -v node >/dev/null 2>&1 ||
  die "Node.js not found. In Plesk: Tools & Settings → Updates → Add/Remove Components → Web hosting → Node.js 22. Then run this script again."
NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
[ "$NODE_MAJOR" -ge "$MIN_NODE" ] ||
  die "Node $(node -v) is too old: the site needs Node.js 22.12 or newer. Install the Node.js 22 component in Plesk and run this script again."
command -v git >/dev/null 2>&1 || die "git is not installed on this server (install the Git extension in Plesk, or 'apt/dnf install git')."
say "Node $(node -v), npm $(npm -v)"

# ── 2. Code ──────────────────────────────────────────────────────────────────
if [ "$IS_ROOT" = 1 ]; then
  git config --global --add safe.directory "$APP" >/dev/null 2>&1 || true
fi

CARRY_ENV=""
if [ -d "$APP/.git" ]; then
  say "Updating $APP from GitHub ($BRANCH)"
  git -C "$APP" fetch -q origin "$BRANCH"
  git -C "$APP" reset -q --hard "origin/$BRANCH"
else
  if [ -d "$APP" ] && [ -n "$(ls -A "$APP" 2>/dev/null)" ]; then
    BACKUP="$VHOST/httpdocs.before-$(date +%Y%m%d-%H%M%S)"
    say "Moving the current content of $APP to $BACKUP"
    mv "$APP" "$BACKUP"
    # An earlier version of this site: keep its bookings and its settings.
    if [ -f "$BACKUP/data/app.db" ] && [ ! -f "$DATA_DIR/app.db" ]; then
      mkdir -p "$DATA_DIR"
      cp "$BACKUP/data/app.db"* "$DATA_DIR/"
      warn "Bookings database carried over to $DATA_DIR/app.db"
    fi
    if [ -f "$BACKUP/.env" ]; then
      CARRY_ENV="$BACKUP/.env"
      warn "Existing .env carried over"
    fi
  fi
  say "Cloning $REPO ($BRANCH) into $APP"
  git clone -q --branch "$BRANCH" "$REPO" "$APP"
  [ -n "$CARRY_ENV" ] && cp "$CARRY_ENV" "$APP/.env"
fi
cd "$APP"
say "Code at $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

# ── 3. .env ──────────────────────────────────────────────────────────────────
# set_env KEY VALUE — replaces the KEY= line in .env, or appends it.
set_env() {
  local key="$1" value="$2"
  if grep -q "^$key=" .env; then
    sed -i "s|^$key=.*|$key=$value|" .env
  else
    printf '%s=%s\n' "$key" "$value" >> .env
  fi
}
# env_is_empty KEY — true when the key is missing or has no value.
env_is_empty() { ! grep -q "^$1=." .env; }

GENERATED_PASSWORD=""
if [ ! -f .env ]; then
  say "Creating .env"
  cp .env.example .env
  set_env APP_URL "https://$DOMAIN"
  set_env SESSION_SECRET "$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
  set_env DATABASE_PATH "$DATA_DIR/app.db"

  ADMIN_EMAIL="contact@$DOMAIN"
  ADMIN_PASSWORD=""
  # Ask on the terminal when there is one (also when the script arrives through
  # `curl | bash`, where stdin is the script itself); otherwise generate.
  if { exec 3<>/dev/tty; } 2>/dev/null; then
    printf '\nBack-office login (https://%s/admin)\n' "$DOMAIN" >&3
    printf '  Admin email [%s]: ' "$ADMIN_EMAIL" >&3
    read -r answer <&3 || true
    [ -n "${answer:-}" ] && ADMIN_EMAIL="$answer"
    printf '  Admin password (10+ characters, leave empty to generate one): ' >&3
    read -r -s ADMIN_PASSWORD <&3 || true
    printf '\n' >&3
    exec 3>&-
  fi
  if [ "${#ADMIN_PASSWORD}" -lt 10 ]; then
    [ -n "$ADMIN_PASSWORD" ] && warn "Password shorter than 10 characters — generating one instead."
    ADMIN_PASSWORD="$(node -e 'console.log(require("crypto").randomBytes(9).toString("base64url"))')"
    GENERATED_PASSWORD="$ADMIN_PASSWORD"
  fi
  set_env ADMIN_EMAIL "$ADMIN_EMAIL"
  set_env ADMIN_PASSWORD_HASH "$(node scripts/hash-password.mjs "$ADMIN_PASSWORD" | sed -n 's/^ADMIN_PASSWORD_HASH=//p')"
  set_env MAIL_TO "$ADMIN_EMAIL"
  chmod 600 .env
else
  env_is_empty APP_URL && set_env APP_URL "https://$DOMAIN"
  env_is_empty DATABASE_PATH && set_env DATABASE_PATH "$DATA_DIR/app.db"
  env_is_empty SESSION_SECRET && set_env SESSION_SECRET "$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
fi
mkdir -p "$DATA_DIR"

# ── 4. Install and build ────────────────────────────────────────────────────
say "Installing dependencies (npm ci)"
npm ci --no-audit --no-fund --loglevel=error
say "Building the site (npm run build)"
npm run build --silent

# ── 5. Plesk configuration, ownership, restart ──────────────────────────────
REL_APP="${APP#"$VHOST"/}"           # e.g. httpdocs
PLESK_OK=0
if [ "$IS_ROOT" = 1 ] && command -v plesk >/dev/null 2>&1; then
  say "Configuring the Node.js application in Plesk"
  PLESK_OK=1
  plesk_try() {
    if ! "$@" >/dev/null 2>&1; then
      PLESK_OK=0
      warn "Could not run: $* (set it in the panel, see below)"
    fi
  }
  plesk_try plesk ext nodejs --enable -domain "$DOMAIN"
  plesk_try plesk ext nodejs --set-version -domain "$DOMAIN" -version "$NODE_MAJOR"
  plesk_try plesk ext nodejs --set-app-root -domain "$DOMAIN" -app-root "/$REL_APP"
  plesk_try plesk ext nodejs --set-startup-file -domain "$DOMAIN" -startup-file server.mjs
  plesk_try plesk ext nodejs --set-mode -domain "$DOMAIN" -mode production
  plesk_try plesk bin site --update "$DOMAIN" -www-root "$REL_APP/dist/client"
fi

if [ "$IS_ROOT" = 1 ]; then
  OWNER="$(stat -c %U "$VHOST")"
  GROUP="psacln"
  getent group "$GROUP" >/dev/null 2>&1 || GROUP="$(stat -c %G "$VHOST")"
  chown -R "$OWNER:$GROUP" "$APP" "$DATA_DIR"
fi

say "Restarting the application"
mkdir -p tmp
touch tmp/restart.txt
if [ "$IS_ROOT" = 1 ] && command -v plesk >/dev/null 2>&1; then
  plesk ext nodejs --restart -domain "$DOMAIN" >/dev/null 2>&1 || true
fi

# ── 6. Report ────────────────────────────────────────────────────────────────
sleep 3
STATUS="$(curl -sk -o /dev/null -w '%{http_code}' --max-time 15 "https://$DOMAIN/en" 2>/dev/null || true)"
STATUS="${STATUS:-000}"

printf '\n\033[1;32m✔ Deployed %s (%s) to %s\033[0m\n' "$(git rev-parse --short HEAD)" "$BRANCH" "$APP"
if [ "$STATUS" = 200 ]; then
  echo "  https://$DOMAIN/en answers 200 — the site is live."
else
  echo "  https://$DOMAIN/en answered $STATUS — check the Node.js settings below, then Restart App in Plesk."
fi

if [ "$PLESK_OK" != 1 ]; then
  cat <<EOF

Node.js settings to check in Plesk (Websites & Domains → $DOMAIN → Node.js):
  Node.js version            $NODE_MAJOR
  Application mode           production
  Application root           /$REL_APP
  Document root              /$REL_APP/dist/client
  Application startup file   server.mjs
Then click "Enable Node.js" (first time) or "Restart App".
EOF
fi

if [ -n "$GENERATED_PASSWORD" ]; then
  cat <<EOF

Back office: https://$DOMAIN/admin
  Email:     $(sed -n 's/^ADMIN_EMAIL=//p' .env)
  Password:  $GENERATED_PASSWORD
Write it down now — it is not stored anywhere else. You can change it in Admin → Settings.
EOF
fi

cat <<EOF

Settings live in $APP/.env (mailbox, Stripe, phone number) and in Admin → Settings.
Bookings database: $(sed -n 's/^DATABASE_PATH=//p' .env) — back it up regularly.
Next update: bash $APP/deploy.sh
EOF
