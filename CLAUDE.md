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

| Layer          | Choice                                                                        |
| -------------- | ----------------------------------------------------------------------------- |
| Framework      | Next.js 15 (App Router, React 19, TypeScript strict)                          |
| Styling        | Tailwind CSS v4 (CSS-based config, `src/app/globals.css`)                     |
| Database       | SQLite via `better-sqlite3` (file `data/app.db`)                              |
| Email          | Plain SMTP via `nodemailer`                                                   |
| Payment        | Stripe Checkout — **switchable on/off from the admin**                        |
| Admin auth     | HMAC-signed session cookie + `scrypt` password (no external dependency)       |
| Validation     | `zod` on every API input                                                      |

Target hosting: a **classic Node server** (OVH, Gandi, a VPS…), not a serverless platform.
SQLite and SMTP both assume a persistent filesystem and a long-lived process. Deploying to
Vercel/Netlify/Cloudflare Pages would silently discard every booking on each restart.

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
for everything else (`font-sans`). Loaded through `next/font/google`; never add a `<link>`
to Google Fonts.

**Shapes** — cards `rounded-[18px]` to `rounded-3xl`, buttons `rounded-full`, form fields
`rounded-[10px]`. Raised cards use `shadow-lifted`
(`0 24px 48px -20px rgb(58 46 36 / 0.35)`).

**Content width** — `max-w-[1200px] mx-auto px-6`, sections at `py-[72px]` (`py-14` on
mobile). The mockups were drawn at 1280 px only; the responsive behaviour (3-column grids
collapsing to 1 column below `md`, the header's burger menu below `lg`) is **added** by this
implementation — the prototypes did not cover it.

---

## Repository layout

```
project/                       Exported DC mockups (visual reference, not compiled)
chats/  README.md              Claude Design handoff bundle (what the client actually asked for)
delivery/                      Client-facing docs: install guide (EN + FR), schema.sql,
                               and DEVELOPER-HANDOFF.pdf (+ its .html source)
src/
  app/
    [locale]/
      page.tsx                 Home page (+ live price calculator)
      [...segments]/page.tsx   Every other public page — see "Routing" below
    admin/                     Protected back office (English only, not translated)
      actions.ts               Server actions: login, bookings, rates, packages, settings
      bookings/[id]/           Booking detail + how the price was calculated
      rates/                   Rate grid editor
      packages/                Packages and paid add-ons (CRUD)
      settings/                Night hours + supplement, Stripe switch
    api/
      booking/                 Quote/booking submission
      checkout/                Creates a Stripe Checkout session
      webhooks/stripe/         Payment confirmation (the authority on "paid")
    sitemap.ts  robots.ts
  components/
    pages/                     One server component per public page
    PriceCalculator.tsx  BookingForm.tsx  PricesTables.tsx   ("use client")
    SiteHeader.tsx  SiteFooter.tsx  ui.tsx
  lib/
    prices.ts                  Rate grid, vehicles, routes, night rule — pure data + maths
    catalog.ts                 Packages and add-ons — pure types + pure arithmetic
    i18n/                      Locale config, translated URL segments, 7 dictionaries
    db.ts  booking.ts  mail.ts  auth.ts  settings.ts  stripe.ts  seo.ts  site.ts
  middleware.ts                Redirects un-prefixed URLs to the best locale
data/app.db                    SQLite database (git-ignored, created on first run)
```

---

## Routing

There are only **two** public page files. `src/app/[locale]/page.tsx` renders the home page;
everything else goes through `src/app/[locale]/[...segments]/page.tsx`, which maps the URL
segment back to a page key using the `SEGMENTS` table.

This indirection exists because the URL segments are translated per locale, which no folder
structure can express: `/fr/tarifs`, `/en/prices` and `/es/precios` are the same page.

When adding a page:

1. add its key to `PAGE_KEYS` and its 7 segments to `SEGMENTS` (`src/lib/i18n/routes.ts`);
2. add its copy to the `Dictionary` type, then to all 7 dictionaries;
3. create the server component under `src/components/pages/`;
4. wire it into the `switch` in `[...segments]/page.tsx` and into `generateStaticParams`.

Any locale/segment combination that does not exist returns 404 — deliberately, so Google
never sees two URLs for the same content.

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
**`BookingForm` mirrors `serverQuote()` deliberately** so the visitor sees the same figure
the server will store — if you change one, change the other, or the estimate and the
confirmation email will disagree.

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
NEXT_PUBLIC_PHONE=+33781662122
NEXT_PUBLIC_WHATSAPP=33781662122
```

Stripe keys, SMTP and the admin password can also be saved from **Admin → Settings**.
Values in the database override `.env` without a restart. The forms never show the full
secret again — only a `••••abcd` hint. `SESSION_SECRET` and `ADMIN_EMAIL` stay in `.env`.

With no SMTP host (neither admin nor `SMTP_HOST`), mail falls back to console logging: the
site stays usable in development and bookings are still persisted.

⚠️ `ADMIN_PASSWORD_HASH` uses `:` as its separator (`scrypt:salt:hash`), **not** `$`.
Dotenv expands `$name` as a variable and would silently truncate the hash.

---

## Commands

```bash
npm run dev          # development server (http://localhost:3000)
npm run build        # production build
npm start            # production server
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run admin:hash   # generate an ADMIN_PASSWORD_HASH
```

---

## Conventions

- **Server Components by default.** `"use client"` only where interaction demands it: price
  calculator, language selector, phone popover, booking form, admin screens.
- Prices shown to the visitor are **always recalculated server-side** before anything is
  persisted or charged. Never trust an amount sent by the browser.
- Admin forms use **controlled inputs**. React 19 resets uncontrolled fields after a server
  action, which would show stale values right after a successful save.
- Every visible string goes through the dictionary — no hard-coded copy in a component. Two
  exceptions: the admin (English only), and package / add-on names, which the admin types.
- Phone number, WhatsApp and email come from env vars, never hard-coded.
- Keep the disclaimer carried over from the design, in all languages: *"Independent service,
  not affiliated with The Walt Disney Company."*
- SEO: every public page sets `title`, `description`, `canonical` and `alternates`. The home
  page and route pages also emit JSON-LD (`LocalBusiness`, `Service`, `FAQPage`).
- Public pages are statically rendered with `revalidate = 3600`; admin writes call
  `revalidatePath('/', 'layout')` so a price change appears immediately.

---

## Things worth knowing before you change something

- **`data/` is the whole business.** One SQLite file holds every booking. Any deployment
  change that does not preserve it loses customer data.
- **The Stripe webhook is the authority on payment**, not the browser redirect. A customer
  who closes the tab after paying must still end up marked as paid.
- **The honeypot answers `200`.** `website` is accepted by the schema and silently discarded
  in the route, so a bot learns nothing from the response.
- **Rate limiting is in-process** (`src/lib/ratelimit.ts`). It resets on restart, which is
  fine for spam control but is not a security boundary. Behind several Node processes, move
  it to the database or a shared store. It is keyed on `x-forwarded-for`, so `/api/booking`
  accepts 5 requests per IP per 10 minutes — worth knowing when testing by hand.
- **New columns need a guarded `ALTER TABLE`.** SQLite has no `ADD COLUMN IF NOT EXISTS`, so
  `addColumns()` in `db.ts` checks `table_info` first. An existing `data/app.db` in
  production has to survive every upgrade.
- **`berline` was renamed `saloon`** when the codebase moved to English. `addColumns()`
  migrates old rows, and the admin and email templates both fall back to the raw id rather
  than crashing on a vehicle they do not recognise.
