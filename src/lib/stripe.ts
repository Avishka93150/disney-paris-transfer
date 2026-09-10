import 'server-only';
import Stripe from 'stripe';

let client: Stripe | null = null;

/**
 * Stripe client, created on demand. Returns `null` when no key is configured —
 * the site must stay perfectly usable without Stripe.
 */
export function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (client) return client;

  client = new Stripe(key);
  return client;
}
