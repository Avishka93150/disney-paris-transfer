import type { APIRoute } from 'astro';
import { bookingSchema, createBooking } from '@/lib/booking';
import { isLocale } from '@/lib/i18n/config';
import { path } from '@/lib/i18n/routes';
import { sendBookingConfirmation, sendBookingNotification } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import { getSettings, payableCents } from '@/lib/settings';

/**
 * Receives a quote / booking request.
 *
 * Two callers: the booking form's script (JSON in, JSON out) and, without
 * JavaScript, the same form posted as `application/x-www-form-urlencoded` —
 * in that case the answer is a redirect back to the booking page with the
 * reference in the query string.
 */

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...(init.headers ?? {}) },
  });
}

/** A 303 built by hand: `Response.redirect()` has immutable headers, which the middleware cannot add to. */
function seeOther(path: string, request: Request): Response {
  return new Response(null, { status: 303, headers: { Location: new URL(path, request.url).toString() } });
}

/** A classic form post, reshaped into the JSON the schema expects. */
function fromFormData(form: FormData): Record<string, unknown> {
  const text = (key: string) => String(form.get(key) ?? '');
  const extras: Record<string, number> = {};
  for (const [key, value] of form.entries()) {
    if (key.startsWith('extra:')) extras[key.slice('extra:'.length)] = Number(value) || 0;
  }
  return {
    locale: text('locale'),
    from: text('from'),
    to: text('to'),
    trip: text('trip'),
    pax: text('pax'),
    vehicle: text('vehicle'),
    bags: text('bags') || '0',
    childSeats: text('childSeats') || '0',
    date: text('date'),
    time: text('time'),
    flight: text('flight'),
    name: text('name'),
    email: text('email'),
    phone: text('phone'),
    message: text('message'),
    packageSlug: text('package'),
    extras,
    website: text('website'),
  };
}

export const POST: APIRoute = async ({ request }) => {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`booking:${ip}`, 5, 10 * 60 * 1000);
  const isForm = (request.headers.get('content-type') ?? '').includes('form');

  if (!limit.ok) {
    return json({ ok: false, error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  }

  let payload: unknown;
  try {
    payload = isForm ? fromFormData(await request.formData()) : await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: 'validation', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const bookingPage = path(isLocale(parsed.data.locale) ? parsed.data.locale : 'en', 'booking');

  // Honeypot filled in: answer "ok" so the bot learns nothing, but store
  // and send nothing.
  if (parsed.data.website) {
    if (isForm) return seeOther(`${bookingPage}?sent=1`, request);
    return json({ ok: true, reference: null, payment: null });
  }

  const booking = createBooking(parsed.data);

  // Email must never fail the booking: the request is already stored and
  // visible in the admin even if SMTP is down.
  const results = await Promise.allSettled([sendBookingNotification(booking), sendBookingConfirmation(booking)]);
  for (const result of results) {
    if (result.status === 'rejected') console.error('[booking] email delivery failed', result.reason);
  }

  if (isForm) return seeOther(`${bookingPage}?sent=1&ref=${booking.reference}`, request);

  const settings = getSettings();
  const payment =
    settings.stripeEnabled && booking.quoted_price_cents
      ? { enabled: true, amountCents: payableCents(booking.quoted_price_cents, settings), mode: settings.stripeMode }
      : null;

  return json({ ok: true, reference: booking.reference, quotedCents: booking.quoted_price_cents, payment });
};
