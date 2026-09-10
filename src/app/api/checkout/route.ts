import { NextResponse } from 'next/server';
import { getBookingByReference, markPayment } from '@/lib/booking';
import { destinationLabel, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { path } from '@/lib/i18n/routes';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import { getSettings, payableCents } from '@/lib/settings';
import { absoluteUrl } from '@/lib/site';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

/**
 * Opens a Stripe Checkout session for an existing request.
 *
 * The amount comes **exclusively** from `quoted_price_cents` in the database,
 * computed server-side: the browser only ever sends the reference.
 */
export async function POST(request: Request) {
  const limit = rateLimit(`checkout:${clientIp(request.headers)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const settings = getSettings();
  if (!settings.stripeEnabled) {
    return NextResponse.json({ ok: false, error: 'stripe_disabled' }, { status: 403 });
  }

  const client = stripe();
  if (!client) {
    return NextResponse.json({ ok: false, error: 'stripe_unconfigured' }, { status: 503 });
  }

  let body: { reference?: unknown };
  try {
    body = (await request.json()) as { reference?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const reference = typeof body.reference === 'string' ? body.reference : '';
  const booking = reference ? getBookingByReference(reference) : undefined;

  if (!booking) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  if (booking.payment_status === 'paid') {
    return NextResponse.json({ ok: false, error: 'already_paid' }, { status: 409 });
  }
  if (!booking.quoted_price_cents) {
    return NextResponse.json({ ok: false, error: 'no_price' }, { status: 409 });
  }

  const locale = isLocale(booking.locale) ? booking.locale : 'en';
  const dict = getDictionary(locale);
  const amount = payableCents(booking.quoted_price_cents, settings);

  // A package was sold under its own name; anything else is a route.
  const label =
    booking.package_name ??
    `${destinationLabel(dict, booking.from_zone)} → ${destinationLabel(dict, booking.to_zone)}`;
  const bookingUrl = absoluteUrl(path(locale, 'booking'));

  const session = await client.checkout.sessions.create({
    mode: 'payment',
    customer_email: booking.customer_email,
    client_reference_id: booking.reference,
    metadata: { reference: booking.reference, bookingId: String(booking.id) },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: amount,
          product_data: {
            name: `${label} — ${booking.reference}`,
            description:
              settings.stripeMode === 'deposit'
                ? `${dict.booking.payTitle} (${settings.depositPercent} %)`
                : dict.booking.payTitle,
          },
        },
      },
    ],
    success_url: `${bookingUrl}?paid=1&ref=${booking.reference}`,
    cancel_url: `${bookingUrl}?cancelled=1&ref=${booking.reference}`,
  });

  markPayment(booking.id, { paymentStatus: 'pending', stripeSessionId: session.id });

  return NextResponse.json({ ok: true, url: session.url });
}
