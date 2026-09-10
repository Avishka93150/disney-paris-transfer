-- ============================================================================
--  Disney Paris Transfers — database schema
--  SQLite 3 · UTF-8
-- ============================================================================
--
--  WHAT THIS FILE IS FOR
--
--  The application creates and upgrades this database on its own at first
--  start: normally you have NOTHING to run here.
--
--  This file is provided so you can:
--    · understand how the data is structured;
--    · restore an empty database after an incident;
--    · export to another engine (MySQL, PostgreSQL) if the site outgrows this;
--    · browse the database with an external tool (DB Browser for SQLite…).
--
--  Running it against an existing database is safe: every statement is written
--  so that it overwrites nothing (IF NOT EXISTS / INSERT OR IGNORE).
--
--  MANUAL USE
--    sqlite3 data/app.db < delivery/schema.sql
--
--  AMOUNTS
--    Every amount is stored in euro CENTS (whole numbers), to avoid the
--    rounding errors of decimal numbers. 7000 = €70.00.
--    The one exception is the `rates` grid, which is in whole euros.
-- ============================================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
--  1. bookings — quote requests and bookings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Reference given to the customer: DPT-4F2K9A (readable over the phone).
  reference          TEXT    NOT NULL UNIQUE,

  created_at         TEXT    NOT NULL,          -- ISO 8601 UTC
  updated_at         TEXT    NOT NULL,          -- ISO 8601 UTC

  -- Visitor's language: en | fr | es | it | ru | zh | ja
  -- Used to reply in their own language.
  locale             TEXT    NOT NULL,

  -- new | quoted | confirmed | cancelled   (editable in the admin)
  status             TEXT    NOT NULL DEFAULT 'new',

  -- Zone ids: cdg | orly | beauvais | disney | paris
  --           versailles | ladefense | valeurope
  from_zone          TEXT    NOT NULL,
  to_zone            TEXT    NOT NULL,

  -- ow = one way, rt = round trip
  trip               TEXT    NOT NULL DEFAULT 'ow',

  travel_date        TEXT,                      -- YYYY-MM-DD
  -- HH:MM. This is what decides whether the night supplement applies.
  travel_time        TEXT,

  pax                INTEGER NOT NULL,          -- 1 to 8

  -- Index of the option chosen in the dropdown (0 to 3):
  -- 0 = "0–2", 1 = "3–4", 2 = "5–6", 3 = "7 or more"
  bags               TEXT,

  -- saloon | suv | van | premium | advise ("advise me")
  vehicle            TEXT,

  -- Index of the option chosen (0 to 4):
  -- 0 = none, 1 = baby seat, 2 = child seat, 3 = booster, 4 = several
  child_seats        TEXT,

  flight             TEXT,                      -- e.g. "AF 1234"

  customer_name      TEXT    NOT NULL,
  customer_email     TEXT    NOT NULL,
  customer_phone     TEXT    NOT NULL,
  message            TEXT,

  -- Final price computed by the SERVER: fare (or package)
  --   + night supplement + paid add-ons.
  -- NULL = outside the rate grid, to be quoted by hand.
  quoted_price_cents INTEGER,

  -- unpaid | pending | paid | refunded
  payment_status     TEXT    NOT NULL DEFAULT 'unpaid',
  paid_amount_cents  INTEGER,
  stripe_session_id  TEXT,

  admin_notes        TEXT,                      -- internal notes, never shown

  -- ── Price breakdown, frozen at booking time ──────────────────────────────
  -- The name is copied, not referenced: renaming a package later must not
  -- rewrite what an existing customer was quoted.
  package_slug          TEXT,
  package_name          TEXT,

  -- JSON array of the add-ons chosen, with their label and unit price as they
  -- stood on the day:
  --   [{"slug":"child-seat","label":"Child seat","qty":2,
  --     "unitCents":1200,"totalCents":2400}]
  extras_json           TEXT,

  -- The three parts that add up to quoted_price_cents.
  base_price_cents      INTEGER,   -- fare or package, before the supplement
  night_surcharge_cents INTEGER,   -- 0 when the pickup is outside night hours
  extras_price_cents    INTEGER    -- add-ons are never night-surcharged
);

CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status  ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings (stripe_session_id);

-- ----------------------------------------------------------------------------
--  2. settings — everything editable from the admin
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

--  stripeEnabled          '0' | '1'          online-payment switch
--  stripeMode             'full' | 'deposit'
--  depositPercent         '5' to '100'       percentage in deposit mode
--
--  nightSurchargeEnabled  '0' | '1'          night supplement switch
--  nightSurchargePercent  '1' to '200'       e.g. '20' for +20 %
--  nightStart             'HH:MM'            when night hours begin
--  nightEnd               'HH:MM'            when they end (exclusive)
--
--  stripeSecretKey        sk_live_… / sk_test_…   (overrides STRIPE_SECRET_KEY)
--  stripeWebhookSecret    whsec_…                 (overrides STRIPE_WEBHOOK_SECRET)
--  smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass
--  mailFrom, mailTo
--  adminPasswordHash      scrypt:salt:hash        (overrides ADMIN_PASSWORD_HASH)
--  vehicles               JSON { saloon: { active, mult }, … }
--
--  Secrets saved from Admin → Settings override the matching .env values.
--  The admin forms never display them again, only a last-four-characters hint.
--
--  A window whose end is at or before its start runs through midnight, which
--  is the normal case: 21:00 → 06:00 covers the evening AND the early morning.
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('stripeEnabled',         '0'),
  ('stripeMode',            'full'),
  ('depositPercent',        '30'),
  ('nightSurchargeEnabled', '0'),
  ('nightSurchargePercent', '20'),
  ('nightStart',            '21:00'),
  ('nightEnd',              '06:00');

-- ----------------------------------------------------------------------------
--  3. rates — the rate grid
-- ----------------------------------------------------------------------------
--  `pair`   : the two zones separated by a hyphen. The grid is SYMMETRIC,
--             'cdg-disney' also serves Disney → CDG. One row is enough.
--  `prices` : JSON array of 6 prices in WHOLE EUROS, for the passenger tiers
--             [1-3, 4, 5, 6, 7, 8]. A round trip costs double.
--
--  Final price = tier price × vehicle multiplier, then the night supplement if
--  the pickup time falls inside night hours:
--    saloon ×1 (4 pax max) · SUV ×1.1 (4 pax) · van ×1 (8 pax)
--    premium ×1.5 (3 pax)
--
--  A connection missing from this table is treated as "on request, reply
--  within 2 h" — the site never invents a price.
--
--  ⚠️  Connections DEPARTING FROM CDG use fares observed on the market.
--      The OTHERS were ESTIMATED on the same model and must be validated
--      before going live (editable in the admin, "Rates" page).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rates (
  pair   TEXT PRIMARY KEY,
  prices TEXT NOT NULL
);

INSERT OR IGNORE INTO rates (pair, prices) VALUES ('beauvais-disney',   '[160,170,175,180,180,195]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('beauvais-paris',    '[150,160,165,170,175,190]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('cdg-beauvais',      '[150,150,155,155,160,175]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('cdg-disney',        '[70,80,85,90,90,105]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('cdg-ladefense',     '[100,100,110,120,130,145]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('cdg-orly',          '[100,100,110,115,120,140]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('cdg-paris',         '[80,90,95,100,110,125]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('cdg-valeurope',     '[70,80,85,90,90,105]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('cdg-versailles',    '[130,130,135,135,140,155]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('disney-valeurope',  '[40,45,50,55,55,65]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('disney-versailles', '[130,130,135,135,140,155]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('orly-beauvais',     '[160,160,165,165,170,185]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('orly-disney',       '[80,90,95,100,100,115]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('orly-ladefense',    '[90,90,100,110,120,135]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('orly-paris',        '[70,80,85,90,100,115]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('orly-valeurope',    '[80,90,95,100,100,115]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('orly-versailles',   '[110,110,115,115,120,135]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('paris-disney',      '[70,80,85,90,90,105]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('paris-valeurope',   '[70,80,85,90,90,105]');
INSERT OR IGNORE INTO rates (pair, prices) VALUES ('paris-versailles',  '[90,90,95,95,100,115]');

-- ----------------------------------------------------------------------------
--  4. packages — your own fixed-price offers
-- ----------------------------------------------------------------------------
--  A package is sold at its own price and IGNORES the rate grid entirely.
--  The customer picks one at the top of the booking form instead of a route.
--
--  `name` and `description` are shown to visitors exactly as typed, in all
--  9 languages — they do not go through the site's translations.
--
--  `night_surcharge` : 1 = the night supplement applies on top of this package,
--                      0 = the price is the price, whatever the hour.
--  `active`          : 0 hides it from the site without deleting it.
--  `sort_order`      : lowest first; ties are broken by name.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS packages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT    NOT NULL UNIQUE,   -- derived from the name
  name            TEXT    NOT NULL,
  description     TEXT    NOT NULL DEFAULT '',
  price_cents     INTEGER NOT NULL,
  max_pax         INTEGER NOT NULL DEFAULT 8,
  night_surcharge INTEGER NOT NULL DEFAULT 1,
  active          INTEGER NOT NULL DEFAULT 1,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------------------------------------------------------
--  5. extras — paid add-ons
-- ----------------------------------------------------------------------------
--  Charged ON TOP of the fare or the package. Add-ons are never
--  night-surcharged: a child seat costs the same at 3 am as at 3 pm.
--
--  `per_unit` : 1 = price × quantity chosen (2 child seats = 2 × €12),
--               0 = a flat fee whatever the quantity.
--  `max_qty`  : 1 renders as a tick box on the form, more as a 0…n dropdown.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS extras (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,       -- derived from the label
  label       TEXT    NOT NULL,
  price_cents INTEGER NOT NULL,
  per_unit    INTEGER NOT NULL DEFAULT 0,
  max_qty     INTEGER NOT NULL DEFAULT 1,
  active      INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
--  USEFUL QUERIES
-- ============================================================================
--
--  Today's requests:
--    SELECT reference, customer_name, from_zone, to_zone, pax,
--           quoted_price_cents / 100.0 AS price_eur, status
--    FROM bookings
--    WHERE created_at >= date('now')
--    ORDER BY created_at DESC;
--
--  Revenue collected online this month:
--    SELECT SUM(paid_amount_cents) / 100.0 AS total_eur
--    FROM bookings
--    WHERE payment_status = 'paid'
--      AND created_at >= date('now', 'start of month');
--
--  Most requested routes:
--    SELECT from_zone, to_zone, COUNT(*) AS n
--    FROM bookings GROUP BY from_zone, to_zone ORDER BY n DESC;
--
--  How much the night supplement earned:
--    SELECT COUNT(*) AS night_jobs,
--           SUM(night_surcharge_cents) / 100.0 AS supplement_eur
--    FROM bookings WHERE night_surcharge_cents > 0;
--
--  Which packages actually sell:
--    SELECT package_name, COUNT(*) AS n
--    FROM bookings WHERE package_name IS NOT NULL
--    GROUP BY package_name ORDER BY n DESC;
--
--  Change a fare by hand (same as the admin's "Rates" page):
--    UPDATE rates SET prices = '[75,85,90,95,95,110]' WHERE pair = 'cdg-disney';
--
--  Set night hours by hand (same as the admin's "Settings" page):
--    UPDATE settings SET value = '1'     WHERE key = 'nightSurchargeEnabled';
--    UPDATE settings SET value = '25'    WHERE key = 'nightSurchargePercent';
--    UPDATE settings SET value = '22:00' WHERE key = 'nightStart';
--    UPDATE settings SET value = '06:00' WHERE key = 'nightEnd';
--
--  Turn online payment on by hand:
--    UPDATE settings SET value = '1' WHERE key = 'stripeEnabled';
-- ============================================================================
