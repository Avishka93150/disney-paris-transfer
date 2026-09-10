import { NextResponse } from 'next/server';
import { bookingSchema, createBooking } from '@/lib/booking';
import { sendBookingConfirmation, sendBookingNotification } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import { getSettings, payableCents } from '@/lib/settings';

export const runtime = 'nodejs';

/** Receives a quote / booking request. */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`booking:${ip}`, 5, 10 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Honeypot filled in: answer "ok" so the bot learns nothing, but store
  // and send nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, reference: null, payment: null });
  }

  const booking = createBooking(parsed.data);

  // Email must never fail the booking: the request is already stored and
  // visible in the admin even if SMTP is down.
  await Promise.allSettled([sendBookingNotification(booking), sendBookingConfirmation(booking)]).then(
    (results) => {
      for (const result of results) {
        if (result.status === 'rejected') console.error('[booking] email delivery failed', result.reason);
      }
    },
  );

  const settings = getSettings();
  const payment =
    settings.stripeEnabled && booking.quoted_price_cents
      ? {
          enabled: true,
          amountCents: payableCents(booking.quoted_price_cents, settings),
          mode: settings.stripeMode,
        }
      : null;

  return NextResponse.json({
    ok: true,
    reference: booking.reference,
    quotedCents: booking.quoted_price_cents,
    payment,
  });
}
