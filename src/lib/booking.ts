import 'server-only';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import {
  db,
  getPackageBySlug,
  getRates,
  listActiveExtras,
  type BookingRow,
} from './db';
import { priceExtras, type ExtraSelection } from './catalog';
import { LOCALES } from './i18n/config';
import { VEHICLE_IDS, ZONE_IDS, applyNight, isArrivalId, quoteBreakdown } from './prices';
import { getSettings, getVehicleFleet, nightRule } from './settings';

/** Number of options in the dropdowns, so received indexes can be validated. */
const BAG_OPTIONS = 4;
const SEAT_OPTIONS = 5;

export const bookingSchema = z.object({
  locale: z.enum(LOCALES),
  from: z.enum(ZONE_IDS),
  to: z.string().refine(isArrivalId, { message: 'invalid_destination' }),
  trip: z.enum(['ow', 'rt']),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal('')),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional()
    .or(z.literal('')),
  pax: z.coerce.number().int().min(1).max(8),
  bags: z.coerce.number().int().min(0).max(BAG_OPTIONS - 1),
  vehicle: z.enum([...VEHICLE_IDS, 'advise']),
  childSeats: z.coerce.number().int().min(0).max(SEAT_OPTIONS - 1),
  flight: z.string().max(20).optional().or(z.literal('')),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(6).max(40),
  message: z.string().max(2000).optional().or(z.literal('')),
  /** Slug of a package chosen instead of the rate grid. */
  packageSlug: z.string().max(80).optional().or(z.literal('')),
  /** `{ 'child-seat': 2 }`. Unknown slugs are dropped when pricing. */
  extras: z.record(z.string().max(80), z.coerce.number().int().min(0).max(20)).optional(),
  /**
   * Honeypot: only bots fill it. Deliberately accepted by the schema — the
   * route answers "ok" without recording anything, rather than telling the bot
   * which field gave it away.
   */
  website: z.string().max(200).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/** Short reference, readable over the phone: DPT-4F2K9A. */
export function newReference(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, O, 0, 1
  const bytes = randomBytes(6);
  let code = '';
  for (const byte of bytes) code += alphabet[byte % alphabet.length];
  return `DPT-${code}`;
}

/** Every component of the price, so the admin can see how a total was reached. */
export type ServerQuote = {
  /** Fare or package price, before night supplement and add-ons. */
  baseCents: number;
  nightCents: number;
  extrasCents: number;
  totalCents: number;
  night: boolean;
  nightPercent: number;
  extraLines: ExtraSelection[];
  packageSlug: string | null;
  packageName: string | null;
};

/**
 * Reference price, recomputed server-side from the database. The amount the
 * browser sends is never used.
 *
 * Returns `null` for the base fare when the connection is off-grid or the
 * customer asked for advice on the vehicle: the request then goes out "on
 * request". Add-ons alone never make a price — without a fare to attach them
 * to, the whole quote stays manual.
 */
export function serverQuote(input: BookingInput): ServerQuote | null {
  const settings = getSettings();
  const rule = nightRule(settings);
  const time = input.time || null;

  const chosenPackage = input.packageSlug ? getPackageBySlug(input.packageSlug) : undefined;

  let baseCents: number;
  let nightCents: number;
  let night: boolean;

  if (chosenPackage) {
    // An inactive or too-small package is treated as no package at all: the
    // customer still gets a reply, priced by hand.
    if (!chosenPackage.active || chosenPackage.maxPax < input.pax) return null;

    const applied = chosenPackage.nightSurcharge
      ? applyNight(chosenPackage.priceCents, time, rule)
      : { total: chosenPackage.priceCents, surcharge: 0, night: false };

    baseCents = chosenPackage.priceCents;
    nightCents = applied.surcharge;
    night = applied.night;
  } else {
    if (input.vehicle === 'advise') return null;

    const breakdown = quoteBreakdown({
      from: input.from,
      to: input.to,
      pax: input.pax,
      vehicleId: input.vehicle,
      trip: input.trip,
      rates: getRates(),
      time,
      night: rule,
      vehicles: getVehicleFleet(),
    });
    if (!breakdown) return null;

    baseCents = breakdown.baseEuros * 100;
    nightCents = breakdown.nightEuros * 100;
    night = breakdown.night;
  }

  const { lines, totalCents: extrasCents } = priceExtras(listActiveExtras(), input.extras);

  return {
    baseCents,
    nightCents,
    extrasCents,
    totalCents: baseCents + nightCents + extrasCents,
    night,
    nightPercent: night ? rule.percent : 0,
    extraLines: lines,
    packageSlug: chosenPackage?.slug ?? null,
    packageName: chosenPackage?.name ?? null,
  };
}

/** Kept for the callers that only need the number. */
export function serverQuoteCents(input: BookingInput): number | null {
  return serverQuote(input)?.totalCents ?? null;
}

export function createBooking(input: BookingInput): BookingRow {
  const now = new Date().toISOString();
  const reference = newReference();
  const priced = serverQuote(input);

  const result = db()
    .prepare(
      `INSERT INTO bookings (
        reference, created_at, updated_at, locale, status,
        from_zone, to_zone, trip, travel_date, travel_time,
        pax, bags, vehicle, child_seats, flight,
        customer_name, customer_email, customer_phone, message, quoted_price_cents,
        package_slug, package_name, extras_json,
        base_price_cents, night_surcharge_cents, extras_price_cents
      ) VALUES (
        @reference, @now, @now, @locale, 'new',
        @from, @to, @trip, @date, @time,
        @pax, @bags, @vehicle, @childSeats, @flight,
        @name, @email, @phone, @message, @quoted,
        @packageSlug, @packageName, @extrasJson,
        @baseCents, @nightCents, @extrasCents
      )`,
    )
    .run({
      reference,
      now,
      locale: input.locale,
      from: input.from,
      to: input.to,
      trip: input.trip,
      date: input.date || null,
      time: input.time || null,
      pax: input.pax,
      bags: String(input.bags),
      vehicle: input.vehicle,
      childSeats: String(input.childSeats),
      flight: input.flight || null,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message || null,
      quoted: priced?.totalCents ?? null,
      packageSlug: priced?.packageSlug ?? null,
      packageName: priced?.packageName ?? null,
      // Labels and unit prices are frozen here: editing an add-on later must
      // not silently rewrite what an existing customer was quoted.
      extrasJson: priced && priced.extraLines.length > 0 ? JSON.stringify(priced.extraLines) : null,
      baseCents: priced?.baseCents ?? null,
      nightCents: priced?.nightCents ?? null,
      extrasCents: priced?.extrasCents ?? null,
    });

  return getBookingById(Number(result.lastInsertRowid))!;
}

/** The add-ons stored on a booking, tolerant of a corrupt or absent column. */
export function bookingExtras(booking: BookingRow): ExtraSelection[] {
  if (!booking.extras_json) return [];

  try {
    const parsed: unknown = JSON.parse(booking.extras_json);
    return Array.isArray(parsed) ? (parsed as ExtraSelection[]) : [];
  } catch {
    return [];
  }
}

export function getBookingById(id: number): BookingRow | undefined {
  return db().prepare('SELECT * FROM bookings WHERE id = ?').get(id) as BookingRow | undefined;
}

export function getBookingByReference(reference: string): BookingRow | undefined {
  return db().prepare('SELECT * FROM bookings WHERE reference = ?').get(reference) as
    | BookingRow
    | undefined;
}

export function listBookings(options: { status?: string; limit?: number } = {}): BookingRow[] {
  const limit = options.limit ?? 200;

  if (options.status && options.status !== 'all') {
    return db()
      .prepare('SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC LIMIT ?')
      .all(options.status, limit) as BookingRow[];
  }

  return db()
    .prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT ?')
    .all(limit) as BookingRow[];
}

export function countByStatus(): Record<string, number> {
  const rows = db()
    .prepare('SELECT status, COUNT(*) AS n FROM bookings GROUP BY status')
    .all() as { status: string; n: number }[];
  return Object.fromEntries(rows.map((row) => [row.status, row.n]));
}

export function updateBooking(
  id: number,
  patch: { status?: string; adminNotes?: string; quotedPriceCents?: number | null },
): void {
  const fields: string[] = ['updated_at = @now'];
  const values: Record<string, unknown> = { id, now: new Date().toISOString() };

  if (patch.status !== undefined) {
    fields.push('status = @status');
    values.status = patch.status;
  }
  if (patch.adminNotes !== undefined) {
    fields.push('admin_notes = @notes');
    values.notes = patch.adminNotes;
  }
  if (patch.quotedPriceCents !== undefined) {
    fields.push('quoted_price_cents = @quoted');
    values.quoted = patch.quotedPriceCents;
  }

  db()
    .prepare(`UPDATE bookings SET ${fields.join(', ')} WHERE id = @id`)
    .run(values);
}

export function markPayment(
  id: number,
  patch: { paymentStatus: string; paidAmountCents?: number; stripeSessionId?: string },
): void {
  db()
    .prepare(
      `UPDATE bookings SET
         payment_status = @status,
         paid_amount_cents = COALESCE(@paid, paid_amount_cents),
         stripe_session_id = COALESCE(@session, stripe_session_id),
         updated_at = @now
       WHERE id = @id`,
    )
    .run({
      id,
      status: patch.paymentStatus,
      paid: patch.paidAmountCents ?? null,
      session: patch.stripeSessionId ?? null,
      now: new Date().toISOString(),
    });
}
