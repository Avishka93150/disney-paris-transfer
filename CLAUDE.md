# CLAUDE.md — Disney Paris Transfers

> **English is the authoritative version of this document.** A French translation is kept
> at `CLAUDE.fr.md` for the client. If you change one, change the other.
>
> The codebase is English throughout — identifiers, comments, admin UI. The public site is
> multilingual with **English as the default locale**.

Private chauffeur (VTC) website for `disneyparistransfers.com`, specialising in transfers
between the Paris airports (CDG, Orly, Beauvais), central Paris and Disneyland Paris.

This repository implements the mockups exported from Claude Design — kept intact in
`project/`, together with the handoff bundle's `README.md` and `chats/`.
**The mockups are the source of truth for anything visual.** Any divergence in colour,
spacing or typography from `project/*.dc.html` is a bug.

---

## Stack

| Layer          | Choice                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Framework      | Astro 7 (server output, Node adapter) — **no React, no client framework**      |
| Templates      | `.astro` components rendered to complete HTML on the server, TypeScript strict |
| Client JS      | A few small vanilla TypeScript scripts in `src/scripts/` (≈ 10 kB in total)    |
| Styling        | Tailwind CSS v4 (CSS-based config, `src/styles/globals.css`)                   |
| Fonts          | Self-hosted `.woff2` in `public/fonts/` — no request to Google Fonts           |
| Database       | SQLite via `better-sqlite3` (file `data/app.db`)                               |
| Email          | Plain SMTP via `nodemailer`                                                    |
| Payment        | Stripe Checkout — **switchable on/off from the admin**                         |
| Admin auth     | HMAC-signed session cookie + `scrypt` password (no external dependency)        |
| Validation     | `zod` on every API input                                                       |

**Why this stack.** Every public URL answers with a finished HTML document: title, meta
description, canonical, `hreflang` for the nine languages, Open Graph, JSON-LD, and the
full content — including the default calculator price and every fare in the rate tables —
with nothing left for a crawler to execute. There is no hydration and no framework
runtime; the only JavaScript is what the calculator, the booking form and the menus need.

Target hosting: a **classic Node server** (OVH, Gandi, a VPS…) running Node.js **22.12 or
newer**, not a serverless platform. SQLite and SMTP both assume a persistent filesystem and
a long-lived process. Deploying to Vercel/Netlify/Cloudflare Pages would silently discard
every booking on each restart.

---

## Design tokens

Taken verbatim from the mockups. **Do not invent new colours.**

| Role                        | Hex       | Tailwind utility            |
| --------------------------- | --------- | --------------------------- |
| Cream background (page)     | `#FBF6ED` | `bg-cream`                  |
| Sand background (sections)  | `#F6E9D8` | `bg-sand`                   |
| Surface / cards             | `#FFFDF9` | `bg-surface`                |
| Border                      | `#EBDFC9` | `border-line`               |
| Terracotta (accent, CTA)    | `#B4552D` | `text-brand` / `bg-brand`   |
| Dark terracotta (hover)     | `#8F3F1E` | `bg-brand-dark`             |
| Deep brown (text, footer)   | `#3A2E24` | `text-ink` / `bg-ink`       |
| Mid brown (body copy)       | `#6B5641` | `text-ink-soft`             |
| Light brown (tertiary text) | `#8F7455` | `text-ink-mute`             |
| Beige text on brown         | `#C9B79E` | `text-cream-soft`           |
| Gold (CTA on brown)         | `#D9A441` | `bg-gold`                   |
| Dark gold (hover)           | `#C4902F` | `bg-gold-dark`              |
| WhatsApp green (light bg)   | `#E8F0DC` | `bg-whatsapp`               |

**Typography** — `Bree Serif` for every heading (`font-display`), `Nunito` 400/600/700/800
for everything else (`font-sans`). Both are self-hosted from `public/fonts/` (Google's own
files under the Open Font License, one `.woff2` per script; Nunito is the variable font, so
one file covers 400–800) and declared with `@font-face` at the top of `globals.css`,
together with metric-matched fallback faces so nothing shifts while they load. Never add a
`<link>` to Google Fonts.

**Shapes** — cards `rounded-[18px]` to `rounded-3xl`, buttons `rounded-full`, form fields
`rounded-[10px]`. Raised cards use `shadow-lifted`
(`0 24px 48px -20px rgb(58 46 36 / 0.35)`).

**Content width** — `max-w-[1200px] mx-auto px-6`, sections at `py-[72px]` (`py-14` on
mobile). The mockups were drawn at 1280 px only; the responsive behaviour (3-column grids
collapsing to 1 column below `md`, the header's burger menu below 1100 px) is **added** by
this implementation — the prototypes did not cover it.

---

## Repository layout

```
project/                       Exported DC mockups (visual reference, not compiled)
chats/  README.md              Claude Design handoff bundle (what the client actually asked for)
delivery/                      Client-facing docs: install guides (VPS, Plesk; EN + FR), schema.sql
deploy/plesk/                  deploy.sh shipped on the `deploy` branch (Plesk deployment action)
.github/workflows/             deploy-branch.yml: builds main → publishes the `deploy` branch
Dockerfile                     For container hosts (persistent volume on /app/data)
server.mjs                     Production entry: loads .env, starts dist/server/entry.mjs
astro.config.mjs               Astro: server output, Node adapter, Tailwind plugin
src/
  pages/
    [locale]/index.astro       Home page
    [locale]/[...segments].astro   Every other public page — see "Routing" below
    404.astro  sitemap.xml.ts  robots.txt.ts
    api/booking.ts             Quote/booking submission (JSON, or a classic form post)
    api/checkout.ts            Creates a Stripe Checkout session
    api/webhooks/stripe.ts     Payment confirmation (the authority on "paid")
    admin/                     Protected back office (English only, not translated)
      login.astro  logout.ts  index.astro  bookings/[id].astro
      rates.astro  packages.astro  settings.astro
  layouts/
    PublicLayout.astro         <head> with all SEO tags, skip link, cookie notice
    AdminLayout.astro          Back-office shell
  components/
    pages/                     One server component per public page
    PriceCalculator.astro  BookingForm.astro  PricesTables.astro  DestinationSelect.astro
    SiteHeader.astro  SiteFooter.astro  CookieBanner.astro  HeroSlideshow.astro
    Button.astro  PageHero.astro  DarkCta.astro  PhotoPlaceholder.astro  …
    admin/Feedback.astro
  scripts/                     Browser scripts (vanilla TS, one per widget):
    site.ts                    menus, language picker, cookie notice, hero slideshow
    calculator.ts  booking-form.ts  destination-select.ts  prices-tables.ts  admin.ts
  lib/
    prices.ts                  Rate grid, vehicles, routes, night rule — pure data + maths
    catalog.ts                 Packages and add-ons — pure types + pure arithmetic
    calculator.ts              View-model of the calculator (shared server + browser)
    estimate.ts                Booking estimate mirroring serverQuote() (shared)
    i18n/                      Locale config, translated URL segments, 9 dictionaries
    admin/actions.ts           The back office's write operations
    admin/page.ts              POST → redirect / feedback helper for the admin pages
    cache.ts                   In-process cache of rendered public pages
    db.ts  booking.ts  mail.ts  auth.ts  settings.ts  stripe.ts  seo.ts  site.ts
  middleware.ts                Locale redirect, page cache, security headers
  styles/globals.css           Tailwind theme (design tokens) + @font-face rules
public/fonts/                  Bree Serif + Nunito (variable) .woff2, one per script
public/transfers/              Route photos
data/app.db                    SQLite database (git-ignored, created on first run)
```

---

## Routing

There are only **two** public page files. `src/pages/[locale]/index.astro` renders the home
page; everything else goes through `src/pages/[locale]/[...segments].astro`, which maps the
URL segment back to a page key using the `SEGMENTS` table.

This indirection exists because the URL segments are translated per locale, which no folder
structure can express: `/fr/tarifs`, `/en/prices` and `/es/precios` are the same page.

When adding a page:

1. add its key to `PAGE_KEYS` and its 9 segments to `SEGMENTS` (`src/lib/i18n/routes.ts`);
2. add its copy to the `Dictionary` type, then to all 9 dictionaries;
3. create the server component under `src/components/pages/`;
4. wire it into `[...segments].astro`. The sitemap picks it up from `PAGE_KEYS`.

Any locale/segment combination that does not exist returns 404 — deliberately, so Google
never sees two URLs for the same content. `src/pages/404.astro` is what Astro renders for
every 404.

---

## Rendering, caching and SEO

- Every page is rendered **on the server, on request**, as complete HTML (`output:
  'server'`). There is no client-side routing: each link is a normal navigation.
- Public pages are then kept in an **in-process cache** (`src/lib/cache.ts`), keyed on the
  path, so they answer from memory like static files. Every admin write that changes what a
  page shows (rates, vehicles, packages, add-ons, night rule) calls `invalidatePages()`;
  a one-hour expiry is the safety net. Pages with a query string are never cached — the
  booking page reads `?from=…` to pre-fill itself and `?paid=1` on return from Stripe.
  `X-Cache: HIT` / `MISS` on the response tells you which case you are looking at.
- `PublicLayout.astro` emits, for every public page: `<title>`, `description`, `canonical`,
  `hreflang` × 9 + `x-default`, Open Graph, Twitter card, `robots`. Pages add JSON-LD:
  `LocalBusiness` + `WebSite` (home), `Service` + `FAQPage` + `BreadcrumbList` (route
  pages), `FAQPage` (FAQ), `BreadcrumbList` (lists).
- `/sitemap.xml` lists the 270 URLs (30 pages × 9 languages) with `xhtml:link` alternates;
  `/robots.txt` excludes `/admin` and `/api`.
- The calculator's default price and **every fare of every departure** on the prices page
  are in the HTML. The filter pills and the calculator only show/hide and update what is
  already there.

---

## i18n — 9 locales

`en` (default) · `fr` · `es` · `it` · `de` · `pt` · `ru` · `zh` · `ja`

- Every public URL is locale-prefixed. `middleware.ts` redirects `/prices` to `/en/prices`
  based on a cookie, then `Accept-Language`, then English.
- **Page segments are translated** (`SEGMENTS`, the single source of truth). This is what
  earns local search ranking.
- **Route slugs are not** (`cdg-disneyland`, `orly-disneyland`…). They are proper nouns, and
  keeping them stable means one key per priced connection instead of nine.
- Dictionaries are TypeScript objects typed against the `Dictionary` interface: adding a key
  breaks the build in the other eight languages until it is translated. That is intentional.
- **Packages and add-ons are the one exception.** Their names and descriptions are typed by
  the admin at runtime and shown verbatim in all nine languages — a string that does not
  exist at build time cannot be translated. `dict.pricing.*` translates the wording *around*
  them (headings, "Up to {pax} passengers", the night-rate note).
- `hreflang` + `x-default` are generated for every page by `pageMetadata()` (`src/lib/seo.ts`).
- Legal pages (terms, privacy, cookies) have translated URLs in all nine languages.
- Browser scripts never import a dictionary: the strings a widget needs are serialised into
  a `<script type="application/json">` next to it (see `labelsFromDictionary()` in
  `src/lib/calculator.ts`).
- ⚠️ The non-French translations were written by an assistant and **have not been reviewed by
  a native speaker**. Get DE / PT / RU / 中文 / 日本語 checked before launch — including the
  `pricing` block added for packages, add-ons and the night supplement.

---

## Rate grid

Single source of truth: `src/lib/prices.ts` (ported from `project/prices.js`).

- 20 connections, one-way price in €, per passenger tier `[1-3, 4, 5, 6, 7, 8]`.
- The grid is **symmetric**: `cdg-disney` also serves Disney → CDG.
- Round trip = ×2.
- Vehicles: saloon (×1, 4 pax), SUV (×1.1, 4 pax), van (×1, 8 pax),
  premium Mercedes (×1.5, 3 pax). The admin can hide a vehicle and change its
  multiplier on `/admin/rates` (stored in `settings.vehicles`).
- A connection missing from the grid means "on request, reply within 2 h" — the site never
  invents a price.
- The admin edits prices in the database as **six separate boxes per row**; `prices.ts` only
  seeds the defaults on first boot (`seedRates()` in `src/lib/db.ts`). Read the live grid
  with `getRates()`, never `RATES` directly, outside of that seed.
- Read the live fleet with `getVehicleFleet()`, never `VEHICLES` directly, outside of that
  seed / the client-safe fallback.

**Non-CDG prices were estimated during the design phase and must be validated by the client.**

Money is stored in **cents** (`quoted_price_cents`, `paid_amount_cents`) to avoid float
rounding; the grid itself is in whole euros.

---

## What a price is made of

Three layers, all admin-controlled, composed in this order:

```
  base        the rate grid x vehicle multiplier x trip   (or a package's flat price)
+ night       base x nightSurchargePercent, if the pickup time is inside night hours
+ extras      the paid add-ons chosen, never night-surcharged
= quoted_price_cents
```

- **Packages** (`packages` table) replace the fare entirely: a package booking ignores the
  grid, the vehicle multiplier and the round-trip doubling. Per-package `night_surcharge`
  decides whether the supplement applies on top.
- **The night rule** is one global window plus one percentage (`settings`). A window whose
  end is at or before its start wraps past midnight — 21:00 -> 06:00 is the normal case, and
  `isNightTime()` handles it. `end` is exclusive: a 22:00–05:30 window surcharges 05:29 and
  not 05:30. With no pickup time supplied, the supplement never applies.
- **Add-ons** (`extras` table) are flat or per-unit, capped by `max_qty`, and always charged
  at face value.

`quoteBreakdown()` / `applyNight()` in `prices.ts` and `priceExtras()` in `catalog.ts` are
pure and client-safe; `serverQuote()` in `booking.ts` is what actually decides the price.
**`computeEstimate()` in `src/lib/estimate.ts` mirrors `serverQuote()` deliberately** — it
renders the estimate on the booking page on the server *and* re-renders it in the browser —
so the visitor sees the same figure the server will store. If you change one, change the
other, or the estimate and the confirmation email will disagree.

A booking freezes its own breakdown (`base_price_cents`, `night_surcharge_cents`,
`extras_price_cents`, `package_name`, `extras_json`). Editing a package or an add-on later
must never rewrite what an existing customer was quoted — that is why the label and unit
price are copied onto the booking rather than referenced.

---

## Environment variables

See `.env.example`. No secret is ever committed.

```
APP_URL=https://disneyparistransfers.com
SESSION_SECRET=            # 32+ random characters, required
ADMIN_EMAIL=               # admin login
ADMIN_PASSWORD_HASH=       # from `npm run admin:hash -- 'password'`
SMTP_HOST= SMTP_PORT= SMTP_USER= SMTP_PASS= SMTP_SECURE=
MAIL_FROM="Disney Paris Transfers <contact@disneyparistransfers.com>"
MAIL_TO=                   # where quote requests are delivered
STRIPE_SECRET_KEY=         # optional — also pasteable from Admin → Settings
STRIPE_WEBHOOK_SECRET=
SITE_PHONE=+33781662122    # (the old NEXT_PUBLIC_* names still work as a fallback)
SITE_PHONE_DISPLAY="07 81 66 21 22"
SITE_WHATSAPP=33781662122
SITE_EMAIL=contact@disneyparistransfers.com
PORT=3000  HOST=0.0.0.0    # optional
```

Every variable is read from `process.env` **at request time**: nothing is baked into the
build, so changing the phone number means editing `.env` and restarting, not rebuilding.
`server.mjs` loads `.env` itself in production (no dotenv dependency, no `$` expansion);
`astro.config.mjs` does the same for `npm run dev` and `npm run build`.

Stripe keys, SMTP and the admin password can also be saved from **Admin → Settings**.
Values in the database override `.env` without a restart. The forms never show the full
secret again — only a `••••abcd` hint. `SESSION_SECRET` and `ADMIN_EMAIL` stay in `.env`.

With no SMTP host (neither admin nor `SMTP_HOST`), mail falls back to console logging: the
site stays usable in development and bookings are still persisted.

⚠️ `ADMIN_PASSWORD_HASH` uses `:` as its separator (`scrypt:salt:hash`), **not** `$`.
Dotenv-style loaders expand `$name` as a variable and would silently truncate the hash.

---

## Deployment

Three supported routes, all documented for the client under `delivery/`:

- **VPS** (`INSTALLATION-GUIDE.md`): `npm ci && npm run build`, then `npm start` under pm2
  behind nginx.
- **Plesk** (`DEPLOY-PLESK.md`) — the client's server: the site is **never built on the
  server**. `npm run deploy` (`scripts/deploy.mjs`) checks, builds, assembles the
  ready-to-run tree in `out/` (`scripts/assemble-deploy.mjs`: `dist/`, `server.mjs`,
  `package*.json`, `scripts/`, `deploy/plesk/deploy.sh`, `BUILD`) and delivers it either
  straight to the server over SSH (`DEPLOY_SSH`, tar over ssh + `deploy.sh`) or by
  force-pushing the `deploy` branch and pinging `PLESK_WEBHOOK_URL`.
  `.github/workflows/deploy-branch.yml` does the same assemble + push on every merge to
  `main`, with the same `assemble-deploy.mjs`. Plesk's Git tool pulls that branch into
  `httpdocs` (automatically through a GitHub webhook, or on click) and runs `deploy.sh` as
  its deployment action: it puts `/opt/plesk/node/22/bin` on the PATH, runs
  `npm ci --omit=dev` and touches `tmp/restart.txt` for Passenger. The domain's Node.js
  screen points *Application root* at `httpdocs`, *Document root* at `httpdocs/dist/client`
  (static files served by the web server) and the startup file at `server.mjs`; Passenger
  ignores the port `server.mjs` listens on. Set `DATABASE_PATH` outside `httpdocs` so a
  redeploy can never touch the bookings.
- **Container hosts** (Render, Railway, Coolify…): the `Dockerfile` at the root; mount a
  persistent volume on `/app/data`.

Whichever route: Node **22.12+**, one process, and the `.env` variables from
`.env.example` (or the panel's environment variables — `server.mjs` only fills in what is
not already set).

---

## Commands

```bash
npm run dev          # development server (http://localhost:3000)
npm run build        # production build → dist/
npm start            # production server (node server.mjs, reads .env, port 3000)
npm run check        # astro check — TypeScript on .astro and .ts files
npm run lint         # ESLint
npm run deploy       # check + build + deliver to the Plesk server (see Deployment)
npm run admin:hash   # generate an ADMIN_PASSWORD_HASH
```

---

## Conventions

- **HTML first.** A page must be complete and correct before any script runs: the
  calculator shows the default price, the prices page shows every table, the booking form
  posts as a classic form. Browser scripts only *enhance* — they never render content that
  is not already in the HTML.
- **One script per widget**, in `src/scripts/`, imported from the component with a
  `<script>` tag. Astro bundles and de-duplicates them. A script starts with
  `document.querySelectorAll('[data-…]')` and tolerates its markup being absent, since one
  bundle serves several pages.
- **Shared maths, one implementation.** Anything computed both on the server and in the
  browser lives in a pure module (`calculator.ts`, `estimate.ts`) that both import. Those
  modules never touch `process.env` or the database.
- Prices shown to the visitor are **always recalculated server-side** before anything is
  persisted or charged. Never trust an amount sent by the browser.
- **Admin forms are plain HTML forms** posted to the page itself. A successful save answers
  with a redirect (`?saved=…`) so a refresh never re-submits; an error re-renders the page
  with the typed values and the message next to the form (`src/lib/admin/page.ts`).
- Every visible string goes through the dictionary — no hard-coded copy in a component. Two
  exceptions: the admin (English only), and package / add-on names, which the admin types.
- Phone number, WhatsApp and email come from env vars, never hard-coded.
- Keep the disclaimer carried over from the design, in all languages: *"Independent service,
  not affiliated with The Walt Disney Company."*
- Tailwind's important modifier is the v4 **suffix** form (`px-7!`), used only to tune a
  `Button` on a given page.

---

## Things worth knowing before you change something

- **`data/` is the whole business.** One SQLite file holds every booking. Any deployment
  change that does not preserve it loses customer data.
- **The Stripe webhook is the authority on payment**, not the browser redirect. A customer
  who closes the tab after paying must still end up marked as paid.
- **The honeypot answers `200`.** `website` is accepted by the schema and silently discarded
  in the route, so a bot learns nothing from the response.
- **Astro checks the `Origin` header on form posts** (built-in CSRF protection): a
  `application/x-www-form-urlencoded` POST without a matching `Origin` gets a 403. Browsers
  always send it; `curl` does not — add `-H 'Origin: …'` when testing the admin or the
  no-JavaScript booking form by hand. JSON posts (the booking script, the Stripe webhook)
  are not subject to it.
- **Rate limiting is in-process** (`src/lib/ratelimit.ts`). It resets on restart, which is
  fine for spam control but is not a security boundary. Behind several Node processes, move
  it to the database or a shared store. It is keyed on `x-forwarded-for`, so `/api/booking`
  accepts 5 requests per IP per 10 minutes — worth knowing when testing by hand.
- **The page cache is in-process too.** Behind several Node processes each keeps its own
  copy; an admin write invalidates only the process that handled it, the others expire
  within the hour. Run one process (pm2 `fork` mode), or drop the cache, if that matters.
- **New columns need a guarded `ALTER TABLE`.** SQLite has no `ADD COLUMN IF NOT EXISTS`, so
  `addColumns()` in `db.ts` checks `table_info` first. An existing `data/app.db` in
  production has to survive every upgrade.
- **`berline` was renamed `saloon`** when the codebase moved to English. `addColumns()`
  migrates old rows, and the admin and email templates both fall back to the raw id rather
  than crashing on a vehicle they do not recognise.
- **`Response.redirect()` has immutable headers.** The middleware copies such a response
  before adding the security headers; prefer `new Response(null, { status: 303, headers })`
  or `Astro.redirect()` anyway.
