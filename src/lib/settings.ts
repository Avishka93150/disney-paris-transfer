import 'server-only';
import { db } from './db';
import {
  NIGHT_RULE_OFF,
  VEHICLE_IDS,
  mergeVehicles,
  parseClock,
  type NightRule,
  type Vehicle,
  type VehicleId,
  type VehicleOverride,
} from './prices';

/**
 * Settings the admin can change from the back office, with no redeploy.
 *
 * `stripeEnabled` is the switch the client asked for: while it is `false`, no
 * payment journey is offered anywhere on the site.
 *
 * Secrets (Stripe keys, SMTP password, admin hash) live in the same table but
 * are never returned by `getSettings()` — they go through the dedicated
 * getters below, and the admin forms only ever see a "saved" hint.
 */
export type Settings = {
  stripeEnabled: boolean;
  /** `full` = pay the whole fare, `deposit` = a percentage up front. */
  stripeMode: 'full' | 'deposit';
  depositPercent: number;
  /** Percentage supplement on pickups inside the night window. */
  nightSurchargeEnabled: boolean;
  nightSurchargePercent: number;
  /** `HH:MM`. A window whose end is before its start wraps past midnight. */
  nightStart: string;
  nightEnd: string;
};

const DEFAULTS: Settings = {
  stripeEnabled: false,
  stripeMode: 'full',
  depositPercent: 30,
  nightSurchargeEnabled: false,
  nightSurchargePercent: 20,
  nightStart: '21:00',
  nightEnd: '06:00',
};

/** Highest supplement the admin form accepts, as a sanity bound. */
export const MAX_NIGHT_PERCENT = 200;

function loadStore(): Map<string, string> {
  const rows = db().prepare('SELECT key, value FROM settings').all() as {
    key: string;
    value: string;
  }[];
  return new Map(rows.map((row) => [row.key, row.value]));
}

function pick(stored: Map<string, string>, key: string, fallback: string): string {
  if (stored.has(key)) return stored.get(key) ?? '';
  return fallback;
}

export function setSetting(key: string, value: string): void {
  db()
    .prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    )
    .run(key, value);
}

export function setSettings(entries: Record<string, string>): void {
  const upsert = db().prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  );
  const write = db().transaction(() => {
    for (const [key, value] of Object.entries(entries)) {
      upsert.run(key, value);
    }
  });
  write();
}

/** Last four characters of a secret, for the admin "saved" hint. Never the full value. */
export function secretHint(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length <= 4) return '••••';
  return `••••${trimmed.slice(-4)}`;
}

/* ── Stripe keys (admin or .env) ─────────────────────────────────────────── */

export function stripeSecretKey(): string {
  return pick(loadStore(), 'stripeSecretKey', process.env.STRIPE_SECRET_KEY ?? '').trim();
}

export function stripeWebhookSecret(): string {
  return pick(loadStore(), 'stripeWebhookSecret', process.env.STRIPE_WEBHOOK_SECRET ?? '').trim();
}

/** Stripe can only be switched on once a secret key is present (admin or .env). */
export function stripeConfigured(): boolean {
  return Boolean(stripeSecretKey());
}

/* ── SMTP (admin or .env) ────────────────────────────────────────────────── */

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  mailFrom: string;
  mailTo: string;
};

export function getSmtpConfig(): SmtpConfig {
  const stored = loadStore();
  const port = Number.parseInt(pick(stored, 'smtpPort', process.env.SMTP_PORT ?? '465'), 10);
  const secureRaw = pick(stored, 'smtpSecure', process.env.SMTP_SECURE ?? 'true');

  return {
    host: pick(stored, 'smtpHost', process.env.SMTP_HOST ?? '').trim(),
    port: Number.isFinite(port) && port >= 1 && port <= 65535 ? port : 465,
    secure: secureRaw !== '0' && secureRaw !== 'false',
    user: pick(stored, 'smtpUser', process.env.SMTP_USER ?? ''),
    pass: pick(stored, 'smtpPass', process.env.SMTP_PASS ?? ''),
    mailFrom: pick(stored, 'mailFrom', process.env.MAIL_FROM ?? ''),
    mailTo: pick(stored, 'mailTo', process.env.MAIL_TO ?? ''),
  };
}

export type SmtpFormValues = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  passSet: boolean;
  mailFrom: string;
  mailTo: string;
};

export function smtpFormValues(): SmtpFormValues {
  const smtp = getSmtpConfig();
  return {
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    user: smtp.user,
    passSet: Boolean(smtp.pass),
    mailFrom: smtp.mailFrom,
    mailTo: smtp.mailTo,
  };
}

/* ── Admin password hash (admin or .env) ─────────────────────────────────── */

export function getAdminPasswordHash(): string {
  return pick(loadStore(), 'adminPasswordHash', process.env.ADMIN_PASSWORD_HASH ?? '').trim();
}

/* ── Vehicle fleet ───────────────────────────────────────────────────────── */

export function getVehicleFleet(): Vehicle[] {
  const raw = loadStore().get('vehicles');
  if (!raw) return mergeVehicles();

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return mergeVehicles();

    const overrides: Partial<Record<VehicleId, VehicleOverride>> = {};
    for (const id of VEHICLE_IDS) {
      const entry = (parsed as Record<string, unknown>)[id];
      if (!entry || typeof entry !== 'object') continue;
      const row = entry as { active?: unknown; mult?: unknown };
      overrides[id] = {
        ...(typeof row.active === 'boolean' ? { active: row.active } : {}),
        ...(typeof row.mult === 'number' ? { mult: row.mult } : {}),
      };
    }
    return mergeVehicles(overrides);
  } catch {
    return mergeVehicles();
  }
}

export function saveVehicleFleet(fleet: Pick<Vehicle, 'id' | 'active' | 'mult'>[]): void {
  const overrides: Record<string, VehicleOverride> = {};
  for (const vehicle of fleet) {
    overrides[vehicle.id] = { active: vehicle.active, mult: vehicle.mult };
  }
  setSetting('vehicles', JSON.stringify(overrides));
}

export function getSettings(): Settings {
  const stored = loadStore();

  const depositPercent = Number.parseInt(stored.get('depositPercent') ?? '', 10);
  const mode = stored.get('stripeMode');
  const nightPercent = Number.parseInt(stored.get('nightSurchargePercent') ?? '', 10);
  const nightStart = stored.get('nightStart');
  const nightEnd = stored.get('nightEnd');

  return {
    // Even if the database says "on", a missing key disables payment: better
    // to hide the button than to hand the customer an error.
    stripeEnabled: stored.get('stripeEnabled') === '1' && stripeConfigured(),
    stripeMode: mode === 'deposit' ? 'deposit' : DEFAULTS.stripeMode,
    depositPercent:
      Number.isFinite(depositPercent) && depositPercent >= 5 && depositPercent <= 100
        ? depositPercent
        : DEFAULTS.depositPercent,
    nightSurchargeEnabled: stored.get('nightSurchargeEnabled') === '1',
    nightSurchargePercent:
      Number.isFinite(nightPercent) && nightPercent >= 0 && nightPercent <= MAX_NIGHT_PERCENT
        ? nightPercent
        : DEFAULTS.nightSurchargePercent,
    nightStart: parseClock(nightStart) == null ? DEFAULTS.nightStart : (nightStart as string),
    nightEnd: parseClock(nightEnd) == null ? DEFAULTS.nightEnd : (nightEnd as string),
  };
}

export function updateSettings(patch: Partial<Settings>): void {
  const entries: Record<string, string> = {};
  if (patch.stripeEnabled !== undefined) entries.stripeEnabled = patch.stripeEnabled ? '1' : '0';
  if (patch.stripeMode !== undefined) entries.stripeMode = patch.stripeMode;
  if (patch.depositPercent !== undefined) entries.depositPercent = String(patch.depositPercent);
  if (patch.nightSurchargeEnabled !== undefined) {
    entries.nightSurchargeEnabled = patch.nightSurchargeEnabled ? '1' : '0';
  }
  if (patch.nightSurchargePercent !== undefined) {
    entries.nightSurchargePercent = String(patch.nightSurchargePercent);
  }
  if (patch.nightStart !== undefined) entries.nightStart = patch.nightStart;
  if (patch.nightEnd !== undefined) entries.nightEnd = patch.nightEnd;
  setSettings(entries);
}

/**
 * The night rule in the shape the pure pricing functions expect. Public pages
 * and the booking form both receive this object, never the whole settings.
 */
export function nightRule(settings: Settings = getSettings()): NightRule {
  if (!settings.nightSurchargeEnabled) return NIGHT_RULE_OFF;

  return {
    enabled: true,
    percent: settings.nightSurchargePercent,
    start: settings.nightStart,
    end: settings.nightEnd,
  };
}

/** Amount to collect online, in cents, according to the chosen mode. */
export function payableCents(totalCents: number, settings: Settings): number {
  if (settings.stripeMode === 'full') return totalCents;
  return Math.round((totalCents * settings.depositPercent) / 100);
}
