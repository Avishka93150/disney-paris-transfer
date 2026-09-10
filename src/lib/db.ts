import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { RATES } from './prices';
import { slugify, type Extra, type Package } from './catalog';

/**
 * One SQLite file, created on first access. Plenty for an independent
 * chauffeur's volume, and no external service to administer.
 *
 * Assumes classic Node hosting with a persistent disk (OVH, a VPS…) — not a
 * serverless platform.
 */

const DB_PATH = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'app.db');

let instance: Database.Database | null = null;

export function db(): Database.Database {
  if (instance) return instance;

  mkdirSync(dirname(DB_PATH), { recursive: true });
  const database = new Database(DB_PATH);
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');

  migrate(database);
  instance = database;
  return database;
}

function migrate(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      reference          TEXT    NOT NULL UNIQUE,
      created_at         TEXT    NOT NULL,
      updated_at         TEXT    NOT NULL,
      locale             TEXT    NOT NULL,
      status             TEXT    NOT NULL DEFAULT 'new',
      from_zone          TEXT    NOT NULL,
      to_zone            TEXT    NOT NULL,
      trip               TEXT    NOT NULL DEFAULT 'ow',
      travel_date        TEXT,
      travel_time        TEXT,
      pax                INTEGER NOT NULL,
      bags               TEXT,
      vehicle            TEXT,
      child_seats        TEXT,
      flight             TEXT,
      customer_name      TEXT    NOT NULL,
      customer_email     TEXT    NOT NULL,
      customer_phone     TEXT    NOT NULL,
      message            TEXT,
      quoted_price_cents INTEGER,
      payment_status     TEXT    NOT NULL DEFAULT 'unpaid',
      paid_amount_cents  INTEGER,
      stripe_session_id  TEXT,
      admin_notes        TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_bookings_status  ON bookings (status);
    CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings (stripe_session_id);

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rates (
      pair   TEXT PRIMARY KEY,
      prices TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS packages (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      slug            TEXT    NOT NULL UNIQUE,
      name            TEXT    NOT NULL,
      description     TEXT    NOT NULL DEFAULT '',
      price_cents     INTEGER NOT NULL,
      max_pax         INTEGER NOT NULL DEFAULT 8,
      night_surcharge INTEGER NOT NULL DEFAULT 1,
      active          INTEGER NOT NULL DEFAULT 1,
      sort_order      INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS extras (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT    NOT NULL UNIQUE,
      label       TEXT    NOT NULL,
      price_cents INTEGER NOT NULL,
      per_unit    INTEGER NOT NULL DEFAULT 0,
      max_qty     INTEGER NOT NULL DEFAULT 1,
      active      INTEGER NOT NULL DEFAULT 1,
      sort_order  INTEGER NOT NULL DEFAULT 0
    );
  `);

  addColumns(database);
  seedRates(database);
}

/**
 * Columns added after the first release. `ALTER TABLE ADD COLUMN` has no
 * `IF NOT EXISTS` in SQLite, so each one is checked against `table_info`
 * first — an existing `data/app.db` in production must survive an upgrade.
 */
function addColumns(database: Database.Database) {
  const existing = new Set(
    (database.pragma('table_info(bookings)') as { name: string }[]).map((column) => column.name),
  );

  const columns: [string, string][] = [
    ['package_slug', 'TEXT'],
    ['package_name', 'TEXT'],
    ['extras_json', 'TEXT'],
    ['base_price_cents', 'INTEGER'],
    ['night_surcharge_cents', 'INTEGER'],
    ['extras_price_cents', 'INTEGER'],
  ];

  for (const [name, type] of columns) {
    if (!existing.has(name)) {
      database.exec(`ALTER TABLE bookings ADD COLUMN ${name} ${type}`);
    }
  }

  // `berline` was renamed `saloon` when the codebase moved to English. Old
  // bookings keep pointing at a vehicle id that no longer exists otherwise.
  database.prepare("UPDATE bookings SET vehicle = 'saloon' WHERE vehicle = 'berline'").run();
}

/** The grid in `prices.ts` seeds the defaults on first boot only. */
function seedRates(database: Database.Database) {
  const row = database.prepare('SELECT COUNT(*) AS n FROM rates').get() as { n: number };
  if (row.n > 0) return;

  const insert = database.prepare('INSERT INTO rates (pair, prices) VALUES (?, ?)');
  const seed = database.transaction(() => {
    for (const [pair, prices] of Object.entries(RATES)) {
      insert.run(pair, JSON.stringify(prices));
    }
  });
  seed();
}

export type BookingStatus = 'new' | 'quoted' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'refunded';

export type BookingRow = {
  id: number;
  reference: string;
  created_at: string;
  updated_at: string;
  locale: string;
  status: BookingStatus;
  from_zone: string;
  to_zone: string;
  trip: 'ow' | 'rt';
  travel_date: string | null;
  travel_time: string | null;
  pax: number;
  bags: string | null;
  vehicle: string | null;
  child_seats: string | null;
  flight: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message: string | null;
  quoted_price_cents: number | null;
  payment_status: PaymentStatus;
  paid_amount_cents: number | null;
  stripe_session_id: string | null;
  admin_notes: string | null;
  package_slug: string | null;
  /** Copied at booking time so a renamed package does not rewrite history. */
  package_name: string | null;
  /** JSON `ExtraSelection[]`, likewise frozen at booking time. */
  extras_json: string | null;
  base_price_cents: number | null;
  night_surcharge_cents: number | null;
  extras_price_cents: number | null;
};

/* ── Rate grid ───────────────────────────────────────────────────────────── */

/** The live grid: the database wins over the defaults compiled into the app. */
export function getRates(): Record<string, readonly number[]> {
  const rows = db().prepare('SELECT pair, prices FROM rates').all() as {
    pair: string;
    prices: string;
  }[];

  if (rows.length === 0) return RATES;

  const result: Record<string, readonly number[]> = {};
  for (const row of rows) {
    try {
      const parsed: unknown = JSON.parse(row.prices);
      if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number')) {
        result[row.pair] = parsed as number[];
      }
    } catch {
      // Corrupt row: skip it rather than bring the site down.
    }
  }
  return result;
}

export function setRate(pair: string, prices: number[]): void {
  db()
    .prepare(
      'INSERT INTO rates (pair, prices) VALUES (?, ?) ON CONFLICT(pair) DO UPDATE SET prices = excluded.prices',
    )
    .run(pair, JSON.stringify(prices));
}

export function deleteRate(pair: string): void {
  db().prepare('DELETE FROM rates WHERE pair = ?').run(pair);
}

/* ── Packages ────────────────────────────────────────────────────────────── */

type PackageRow = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  max_pax: number;
  night_surcharge: number;
  active: number;
  sort_order: number;
};

function toPackage(row: PackageRow): Package {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceCents: row.price_cents,
    maxPax: row.max_pax,
    nightSurcharge: row.night_surcharge === 1,
    active: row.active === 1,
    sortOrder: row.sort_order,
  };
}

/** Every package, active or not — the admin list. */
export function listPackages(): Package[] {
  const rows = db()
    .prepare('SELECT * FROM packages ORDER BY sort_order, name')
    .all() as PackageRow[];
  return rows.map(toPackage);
}

/** Only what a visitor may see and book. */
export function listActivePackages(): Package[] {
  return listPackages().filter((item) => item.active);
}

export function getPackageBySlug(slug: string): Package | undefined {
  const row = db().prepare('SELECT * FROM packages WHERE slug = ?').get(slug) as
    | PackageRow
    | undefined;
  return row ? toPackage(row) : undefined;
}

export type PackageInput = {
  name: string;
  description: string;
  priceCents: number;
  maxPax: number;
  nightSurcharge: boolean;
  active: boolean;
  sortOrder: number;
};

export function createPackage(input: PackageInput): void {
  db()
    .prepare(
      `INSERT INTO packages (slug, name, description, price_cents, max_pax, night_surcharge, active, sort_order)
       VALUES (@slug, @name, @description, @priceCents, @maxPax, @nightSurcharge, @active, @sortOrder)`,
    )
    .run({
      ...input,
      slug: uniqueSlug('packages', slugify(input.name)),
      nightSurcharge: input.nightSurcharge ? 1 : 0,
      active: input.active ? 1 : 0,
    });
}

export function updatePackage(id: number, input: PackageInput): void {
  db()
    .prepare(
      `UPDATE packages SET
         name = @name, description = @description, price_cents = @priceCents,
         max_pax = @maxPax, night_surcharge = @nightSurcharge,
         active = @active, sort_order = @sortOrder
       WHERE id = @id`,
    )
    .run({
      ...input,
      id,
      nightSurcharge: input.nightSurcharge ? 1 : 0,
      active: input.active ? 1 : 0,
    });
}

export function deletePackage(id: number): void {
  db().prepare('DELETE FROM packages WHERE id = ?').run(id);
}

/* ── Add-ons ─────────────────────────────────────────────────────────────── */

type ExtraRow = {
  id: number;
  slug: string;
  label: string;
  price_cents: number;
  per_unit: number;
  max_qty: number;
  active: number;
  sort_order: number;
};

function toExtra(row: ExtraRow): Extra {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    priceCents: row.price_cents,
    perUnit: row.per_unit === 1,
    maxQty: row.max_qty,
    active: row.active === 1,
    sortOrder: row.sort_order,
  };
}

export function listExtras(): Extra[] {
  const rows = db().prepare('SELECT * FROM extras ORDER BY sort_order, label').all() as ExtraRow[];
  return rows.map(toExtra);
}

export function listActiveExtras(): Extra[] {
  return listExtras().filter((item) => item.active);
}

export type ExtraInput = {
  label: string;
  priceCents: number;
  perUnit: boolean;
  maxQty: number;
  active: boolean;
  sortOrder: number;
};

export function createExtra(input: ExtraInput): void {
  db()
    .prepare(
      `INSERT INTO extras (slug, label, price_cents, per_unit, max_qty, active, sort_order)
       VALUES (@slug, @label, @priceCents, @perUnit, @maxQty, @active, @sortOrder)`,
    )
    .run({
      ...input,
      slug: uniqueSlug('extras', slugify(input.label)),
      perUnit: input.perUnit ? 1 : 0,
      active: input.active ? 1 : 0,
    });
}

export function updateExtra(id: number, input: ExtraInput): void {
  db()
    .prepare(
      `UPDATE extras SET
         label = @label, price_cents = @priceCents, per_unit = @perUnit,
         max_qty = @maxQty, active = @active, sort_order = @sortOrder
       WHERE id = @id`,
    )
    .run({ ...input, id, perUnit: input.perUnit ? 1 : 0, active: input.active ? 1 : 0 });
}

export function deleteExtra(id: number): void {
  db().prepare('DELETE FROM extras WHERE id = ?').run(id);
}

/**
 * Slugs are unique per table, but two packages may legitimately share a name
 * ("Airport transfer" priced for 4 and for 8). Suffix rather than reject.
 */
function uniqueSlug(table: 'packages' | 'extras', base: string): string {
  const statement = db().prepare(`SELECT 1 FROM ${table} WHERE slug = ?`);

  let candidate = base;
  let suffix = 2;
  while (statement.get(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}
