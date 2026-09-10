import 'server-only';
import { db } from './db';
import { NIGHT_RULE_OFF, parseClock, type NightRule } from './prices';

/**
 * Settings the admin can change from the back office, with no redeploy.
 *
 * `stripeEnabled` is the switch the client asked for: while it is `false`, no
 * payment journey is offered anywhere on the site.
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

/** Stripe can only be switched on once the server keys are present. */
export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getSettings(): Settings {
  const rows = db().prepare('SELECT key, value FROM settings').all() as {
    key: string;
    value: string;
  }[];
  const stored = new Map(rows.map((row) => [row.key, row.value]));

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
  const upsert = db().prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  );

  const write = db().transaction(() => {
    if (patch.stripeEnabled !== undefined) upsert.run('stripeEnabled', patch.stripeEnabled ? '1' : '0');
    if (patch.stripeMode !== undefined) upsert.run('stripeMode', patch.stripeMode);
    if (patch.depositPercent !== undefined) upsert.run('depositPercent', String(patch.depositPercent));
    if (patch.nightSurchargeEnabled !== undefined) {
      upsert.run('nightSurchargeEnabled', patch.nightSurchargeEnabled ? '1' : '0');
    }
    if (patch.nightSurchargePercent !== undefined) {
      upsert.run('nightSurchargePercent', String(patch.nightSurchargePercent));
    }
    if (patch.nightStart !== undefined) upsert.run('nightStart', patch.nightStart);
    if (patch.nightEnd !== undefined) upsert.run('nightEnd', patch.nightEnd);
  });

  write();
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
