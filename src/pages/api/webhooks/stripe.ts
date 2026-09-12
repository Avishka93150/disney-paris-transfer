import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { getBookingByReference, markPayment, updateBooking } from '@/lib/booking';
import { sendPaymentReceipt } from '@/lib/mail';
import { stripeWebhookSecret } from '@/lib/settings';
import { stripe } from '@/lib/stripe';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * Payment confirmation from Stripe.
 *
 * This route — not the return page — is the authority: a customer who closes
 * their browser after paying must still end up marked as paid.
 */
export const POST: APIRoute = async ({ request }) => {
  const client = stripe();
  const secret = stripeWebhookSecret();

  if (!client || !secret) return json({ ok: false, error: 'stripe_unconfigured' }, 503);

  const signature = request.headers.get('stripe-signature');
  if (!signature) return json({ ok: false, error: 'missing_signature' }, 400);

  // The signature is verified against the raw body: do not parse JSON first.
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(raw, signature, secret);
  } catch (error) {
    console.error('[stripe] invalid signature', error);
    return json({ ok: false, error: 'invalid_signature' }, 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const reference = session.metadata?.reference ?? session.client_reference_id ?? '';
    const booking = reference ? getBookingByReference(reference) : undefined;

    if (booking && booking.payment_status !== 'paid') {
      const amount = session.amount_total ?? 0;
      markPayment(booking.id, { paymentStatus: 'paid', paidAmountCents: amount });
      updateBooking(booking.id, { status: 'confirmed' });

      try {
        await sendPaymentReceipt({ ...booking, paid_amount_cents: amount }, amount);
      } catch (error) {
        // The payment is collected: a failed email must not make Stripe
        // replay the event.
        console.error('[stripe] receipt delivery failed', error);
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object;
    const reference = session.metadata?.reference ?? session.client_reference_id ?? '';
    const booking = reference ? getBookingByReference(reference) : undefined;
    if (booking && booking.payment_status === 'pending') {
      markPayment(booking.id, { paymentStatus: 'unpaid' });
    }
  }

  return json({ received: true });
};
