# Installation guide — Disney Paris Transfers

> 🇫🇷 Version française : [`GUIDE-INSTALLATION.md`](./GUIDE-INSTALLATION.md)
>
> **On a server managed with Plesk?** Use [`DEPLOY-PLESK.md`](./DEPLOY-PLESK.md) instead of
> section 4 below.

Private chauffeur website in 9 languages, with a live price calculator, a quote form, a
back office and optional online payment.

This guide assumes you are not a developer. Every command can be copied as-is. Allow about
**30 minutes** for a full deployment.

---

## Contents

1. [What you received](#1-what-you-received)
2. [What you need](#2-what-you-need)
3. [Try it on your own computer (10 min)](#3-try-it-on-your-own-computer-10-min)
4. [Deploy to a server (30 min)](#4-deploy-to-a-server-30-min)
5. [Connect your email](#5-connect-your-email)
6. [Enable online payment (optional)](#6-enable-online-payment-optional)
7. [Using the back office](#7-using-the-back-office)
8. [Backups](#8-backups)
9. [Changing things later](#9-changing-things-later)
10. [Troubleshooting](#10-troubleshooting)
11. [Before you go live](#11-before-you-go-live)

---

## 1. What you received

```
disney-paris-transfers/
├── .env                          ← YOUR SETTINGS AND SECRETS (already filled in)
├── CREDENTIALS.txt               ← your back-office password — delete after first login
├── delivery/
│   ├── INSTALLATION-GUIDE.md     ← this document
│   ├── GUIDE-INSTALLATION.md     ← French version
│   └── schema.sql                ← database structure (documentation)
├── CLAUDE.md   CLAUDE.fr.md      ← technical documentation (for a developer)
├── src/                          ← the website code
│   ├── pages/                    ← the pages, the back office and the API
│   ├── components/  layouts/     ← reusable visual pieces
│   ├── scripts/                  ← the few browser scripts (calculator, form, menus)
│   └── lib/                      ← prices, translations, database, email, payment
├── public/                       ← photos and fonts
├── server.mjs                    ← what `npm start` runs
├── project/                      ← the original mockups (visual reference)
├── package.json                  ← list of components to install
└── scripts/hash-password.mjs     ← password-changing tool
```

Two files need your attention straight away:

| File               | Why                                                                  |
| ------------------ | -------------------------------------------------------------------- |
| `.env`             | All your settings. **Only the email section is left to fill in.**     |
| `CREDENTIALS.txt`  | Your back-office password. **Delete it after your first login.**      |

> ⚠️ `.env` holds secret keys. Never publish it online and never send it over unencrypted
> email.

---

## 2. What you need

| Item                 | Detail                                                                      |
| -------------------- | --------------------------------------------------------------------------- |
| **Node.js 22.12 or newer** | Free — <https://nodejs.org> (choose the "LTS" version)                 |
| **Hosting**          | A server that runs Node.js **continuously**: OVH, Hetzner, Scaleway VPS…    |
| **Your domain name** | `disneyparistransfers.com`, which you already own                           |
| **A mailbox**        | `contact@disneyparistransfers.com` at your host                              |
| **Stripe**           | Only if you want to take payment online — optional                          |

### ⚠️ One important point about hosting

This website **stores your bookings in a file on disk**. It therefore needs a normal server
whose disk keeps its contents.

- ✅ **Works**: a VPS (OVH, Hetzner, Scaleway, DigitalOcean…), a dedicated server, or shared
  hosting with Node.js support (o2switch, PlanetHoster…).
- ❌ **Does not work**: Vercel, Netlify, Cloudflare Pages. These platforms wipe the disk on
  every restart — **you would lose every booking.**
- ❌ **Does not work**: PHP-only shared hosting (the "WordPress" kind). This site is not PHP.

An entry-level VPS (around €5/month) is plenty.

---

## 3. Try it on your own computer (10 min)

Before deploying, run the site locally to get familiar with it.

**1.** Install Node.js from <https://nodejs.org> (LTS version).

**2.** Open a terminal (Windows: *PowerShell*; Mac: *Terminal*) and go to the site folder:

```bash
cd path/to/disney-paris-transfers
```

**3.** Check Node is installed — this must print `v22…` or higher:

```bash
node -v
```

**4.** Install the site's components (a few minutes, once only):

```bash
npm install
```

**5.** For local testing, open `.env` in a text editor and temporarily change the first
setting to:

```
APP_URL=http://localhost:3000
```

**6.** Start the site:

```bash
npm run dev
```

**7.** Open <http://localhost:3000> in your browser.

The site is there, in English (your browser's language decides). Try:

- the **price calculator** at the top of the home page (change the passenger count: vehicles
  that are too small grey themselves out);
- the **language selector** in the top right — all 9 languages are written;
- the **booking form**: send yourself a test request;
- the **back office** at <http://localhost:3000/admin>, using the credentials in
  `CREDENTIALS.txt`. Your test request should be listed there.

To stop the site: `Ctrl + C` in the terminal.

> 💡 Until email is configured (step 5) nothing is sent — but **requests are still saved**
> and visible in the back office. You will see their contents printed in the terminal.

---

## 4. Deploy to a server (30 min)

Example on an Ubuntu VPS. Adjust the paths if your host differs.

### 4.1 Prepare the server

Connect over SSH, then:

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build tools (for the database) and web server
sudo apt-get install -y build-essential nginx

# Process manager that keeps the site up and restarts it after a reboot
sudo npm install -g pm2
```

### 4.2 Upload the site

From **your own computer**, send the folder (without the generated files):

```bash
rsync -av --exclude node_modules --exclude dist --exclude .git \
  ./disney-paris-transfers/ root@YOUR-IP:/var/www/disneyparistransfers/
```

*(No `rsync`? A plain FTP/SFTP upload of the folder works too — just leave out
`node_modules` and `dist` if they exist.)*

### 4.3 Install and build

On the server:

```bash
cd /var/www/disneyparistransfers

# .env holds your secrets: make it readable by you alone
chmod 600 .env

npm ci            # install the components
npm run build     # build the site (1–2 minutes)
```

The build must end with `[build] Complete!` and create a `dist/` folder.

### 4.4 Start it, and keep it running

```bash
pm2 start npm --name disneyparistransfers -- start
pm2 save
pm2 startup       # run the line this command prints back to you
```

The site now runs on port 3000 and restarts by itself after a power cut.

Handy commands:

```bash
pm2 status                        # is the site running?
pm2 logs disneyparistransfers     # see what is happening (Ctrl+C to exit)
pm2 restart disneyparistransfers  # restart
```

### 4.5 Point your domain at it

At your registrar, point `disneyparistransfers.com` and `www.disneyparistransfers.com` at
your server's IP address (`A` records).

Then create `/etc/nginx/sites-available/disneyparistransfers`:

```nginx
server {
    listen 80;
    server_name disneyparistransfers.com www.disneyparistransfers.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Stripe payment notifications must arrive untouched
    location /api/webhooks/stripe {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_request_buffering off;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/disneyparistransfers /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4.6 Turn on HTTPS (the padlock)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d disneyparistransfers.com -d www.disneyparistransfers.com
```

The certificate renews itself from then on.

Open <https://disneyparistransfers.com> — you are live. 🎉

> ℹ️ The database creates itself on the first page load, at `data/app.db`, pre-filled with
> the starting rate grid. There is no SQL file to run. `delivery/schema.sql` is provided as
> documentation, and to rebuild an empty database should you ever need to.

---

## 5. Connect your email

Without this step **the site works and records everything**, but you get no email alert and
the customer gets no acknowledgement.

Open `.env` and fill in section 4 with your mailbox settings:

```
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@disneyparistransfers.com
SMTP_PASS=your-mailbox-password
```

You can also paste these later from **Admin → Settings → Email (SMTP)**. Values saved there
override `.env` without a restart.

Settings by host:

| Host      | `SMTP_HOST`             | Port |
| --------- | ----------------------- | ---- |
| OVH       | `ssl0.ovh.net`          | 465  |
| Gandi     | `mail.gandi.net`        | 465  |
| Ionos     | `smtp.ionos.fr`         | 465  |
| o2switch  | `mail.yourdomain.com`   | 465  |
| Gmail     | `smtp.gmail.com`        | 465  |

*(Gmail requires an "app password", not your usual Gmail password.)*

Then restart:

```bash
pm2 restart disneyparistransfers
```

Send a test request from the site. You should receive:

- **you**: an email titled "Nouvelle demande DPT-XXXXXX", in French, with the full trip
  details. Replying to it writes straight to the customer;
- **the customer**: an acknowledgement **in their own language**, with their reference.

> 💡 If your emails land in spam, add an **SPF** record to your domain (your email host will
> give you the exact line to copy).

---

## 6. Enable online payment (optional)

Online payment is **off by default**: your customers pay on board, as the mockups intended.
No payment button appears anywhere.

To enable it:

**1.** Create an account at <https://dashboard.stripe.com>.

**2.** *Developers → API keys*: copy the **secret key** (`sk_live_…`) into `.env`:

```
STRIPE_SECRET_KEY=sk_live_...
```

You can paste this key (and the webhook secret) from **Admin → Settings** instead of `.env`.

**3.** *Developers → Webhooks → Add endpoint*:

- URL: `https://disneyparistransfers.com/api/webhooks/stripe`
- Events: `checkout.session.completed` and `checkout.session.expired`

Copy the **signing secret** (`whsec_…`) into `.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

**4.** Restart (`pm2 restart disneyparistransfers`), then go to **Admin → Settings**: the
"Enable online payment" checkbox is now clickable. There you choose between:

- **full payment** for the transfer, or
- a **deposit** (30% by default, adjustable), the balance being paid on board.

You can untick it at any time: online payment disappears from the site immediately, with
nothing else affected.

> 🔒 The amount charged is **always recalculated by the server** from your rate grid. A
> customer tampering with the page in their browser cannot change what they pay.

---

## 7. Using the back office

Address: **`https://disneyparistransfers.com/admin`**

The back office is in English.

### First login

Sign in with the credentials from `CREDENTIALS.txt`, then **change the password right away**
from **Admin → Settings** (current password + new password). That writes the new hash to the
database and does not require a restart.

Alternatively, from the server:

```bash
cd /var/www/disneyparistransfers
npm run admin:hash -- 'your-new-password'
```

Copy the printed `ADMIN_PASSWORD_HASH=…` line into your `.env` (replacing the old one),
restart, then **delete `CREDENTIALS.txt`**.

> ⚠️ Paste the line **exactly as printed**, with no quotes around it.

### The four screens

**Bookings** — every request received, newest first. Filter by status, click a reference to
open it. On a request you can:

- change the status: *New → Quoted → Confirmed* (or *Cancelled*);
- correct the price (leave empty for "on request");
- write internal notes, never visible to the customer;
- reply in one click via **WhatsApp**, phone or email.

Each request also shows **how its price was calculated** — fare or package, night
supplement, each add-on — so you can see at a glance why a customer was quoted what they
were.

**Rates** — your grid, editable without touching any code. Each line holds six prices,
separated by spaces, for the passenger tiers **1-3, 4, 5, 6, 7, 8**. For example:

```
CDG Airport ↔ Disneyland Paris      70 80 85 90 90 105
```

Round trips are doubled automatically, and per-vehicle prices are derived too (SUV +10%,
Premium +50%). Clearing a line removes that connection from the grid: it becomes "on
request". You can also add a new connection at the bottom of the page.

**Enter daytime prices here.** If you use the night supplement (see *Settings*), it is added
on top of these figures — do not build it into the grid yourself.

**Packages & add-ons** — the part of the offer you create yourself.

A **package** is sold at its own fixed price and ignores the rate grid entirely: *"CDG ⇄
Disneyland round trip, up to 6 passengers, €150"*. Give it a name, a price, a description
and the largest group it covers. Customers pick one at the top of the booking form instead
of choosing a route. Tick *Night supplement applies* if the package should be surcharged
at night, untick it if the price is the price whatever the hour.

An **add-on** is charged on top of whatever the fare turned out to be: a child seat, an hour
of waiting, meet and greet at arrivals. Set a price, and:

- *Charge per unit* — €12 each, so two child seats cost €24. Leave it unticked for a flat
  fee whatever the quantity.
- *Max quantity* — 1 shows the add-on as a tick box on the form, more shows a dropdown.

Add-ons are **never night-surcharged**: a child seat costs the same at 3 am as at 3 pm.

> ⚠️ Package and add-on names are shown to visitors **exactly as you type them**, in all
> 9 languages — they do not go through the site's translations. Write them in the language
> most of your customers read.

Untick *Visible on the site* / *Offered at booking* to retire a package or an add-on without
deleting it. Deleting one does **not** change any booking already taken: the name and price
are frozen onto the booking at the moment the customer sends it.

**Settings** — night hours, the online-payment switch, and a reminder of your public contact
details (those are edited in `.env`).

To set up the **night supplement**:

1. tick *Night supplement*;
2. set *Night starts at* and *Night ends at* — e.g. `22:00` and `06:00`. An end time earlier
   than the start simply means the window runs through midnight, which is the normal case;
3. set the percentage — e.g. `20` for +20 %.

The panel underneath shows, in plain words, what you have just set up and what an €80
transfer would become. The supplement then applies to every fare, route and eligible package
whose **pickup time** falls inside the window. On a round trip it applies to both legs, based
on the outbound pickup time.

A booking with no pickup time is never surcharged — there is nothing to judge it by. That is
deliberate: quote those by hand.

Every change on all four screens is **live immediately**, in all 9 languages.

---

## 8. Backups

All your bookings live in **a single file**: `data/app.db`. Back it up regularly.

Manual backup:

```bash
cp /var/www/disneyparistransfers/data/app.db ~/backup-$(date +%F).db
```

Automatic nightly backup at 3 a.m. — run `crontab -e` and add:

```
0 3 * * * cp /var/www/disneyparistransfers/data/app.db /root/backups/app-$(date +\%F).db
```

*(Create the folder first: `mkdir -p /root/backups`.)*

Keep a copy of your `.env` somewhere safe as well: without it, your settings and your
back-office access are gone.

---

## 9. Changing things later

| What you want to change                | Where                                       | Restart needed? |
| -------------------------------------- | ------------------------------------------- | --------------- |
| Prices                                 | Back office → **Rates**                     | no              |
| Night hours and night supplement       | Back office → **Settings**                  | no              |
| Packages and paid add-ons              | Back office → **Packages & add-ons**        | no              |
| Turn online payment on/off             | Back office → **Settings**                  | no              |
| Phone number, WhatsApp, email          | `.env`, section 6                           | **yes**         |
| Copy, photos, new pages                | files under `src/` — developer work         | **yes** + rebuild |

After editing `.env`:

```bash
pm2 restart disneyparistransfers
```

After editing the code (`src/`) or the photos and fonts (`public/`):

```bash
npm run build && pm2 restart disneyparistransfers
```

The expected **photos** (vehicle, airport meet and greet, driver portrait) currently show as
hatched rectangles carrying their description. Likewise the three **customer reviews** on the
home page are reserved placeholders. Replacing them is a short job for a developer —
`CLAUDE.md` tells them exactly where.

---

## 10. Troubleshooting

**The site will not start / `pm2 status` shows `errored`**

```bash
pm2 logs disneyparistransfers --lines 50
```

The usual causes:

| Message                                      | Cause and fix                                                        |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `SESSION_SECRET manquant ou trop court`      | `.env` is not at the project root, or that line was deleted.          |
| `EADDRINUSE ... 3000`                        | Another program holds the port. Set `PORT=3001` in `.env`.            |
| `Cannot find module`                         | `npm ci` was never run, or it failed. Run it again.                   |
| `npm ci` fails on `better-sqlite3`           | Missing build tools: `sudo apt-get install -y build-essential python3`. |

**I cannot log into the back office**

Check that the `ADMIN_PASSWORD_HASH` line in your `.env`:

- starts with `scrypt:`;
- is on **one single line**, with no quotes and no spaces;
- was copied in full (it is long).

The attempt counter locks after 8 failures: wait 15 minutes. As a last resort, generate a
new password with `npm run admin:hash`.

**I am not receiving the emails**

1. `pm2 logs disneyparistransfers` — if you see `[mail] SMTP non configuré`, then
   `SMTP_HOST` is still empty in `.env`.
2. Double-check the mailbox password, and that port 465 is not blocked.
3. Look in your spam folder, and add an SPF record to your domain.

**Are requests lost if email fails?**
No. Saving to the database happens **before** sending: everything stays visible under
Admin → Bookings.

**A page shows "404"**
Check the address: each page exists under its translated form. `/en/prices` and
`/es/precios` work, `/fr/prices` does not — that is deliberate, so Google never sees several
addresses for the same content.

---

## 11. Before you go live

In order of importance:

1. **Check the prices.** Only the connections departing from **CDG** use rates observed on
   the market. Every other one (Orly, Beauvais, Paris, Versailles…) was **estimated** and
   needs confirming. → Back office → Rates.

2. **Have the translations proofread.** All 9 languages are fully written, but the
   **German, Portuguese, Russian, Chinese and Japanese** versions have not been reviewed by a native speaker. Get
   them checked before you advertise in those markets.

3. **Supply your photos**: vehicle interior with child seats, airport meet and greet, driver
   portrait, saloon, van, Mercedes.

4. **Paste your Google / TripAdvisor reviews** over the three placeholders on the home page.

5. **Personalise the "About" page**: the copy contains a highlighted note inviting you to
   introduce yourself (first name, years of experience, languages spoken).

6. **Legal notice and terms.** A French VTC business must display its legal information
   (SIREN number, VTC register entry, insurance, consumer mediator). That page does not exist
   yet: have it added before you start trading.

7. **Register the site** with Google Search Console and submit the sitemap:
   `https://disneyparistransfers.com/sitemap.xml` (270 addresses across 9 languages).

---

## Command summary

```bash
npm install       # install the components (once)
npm run dev       # run locally for testing
npm run build     # build for production
npm start         # start the production server
npm run admin:hash -- 'password'   # change the back-office password

pm2 status                        # is the site running?
pm2 logs disneyparistransfers     # read the logs
pm2 restart disneyparistransfers  # restart after editing .env
```

---

*Technical documentation for a developer: see `CLAUDE.md` at the project root.*
