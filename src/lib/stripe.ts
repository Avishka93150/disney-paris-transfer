import 'server-only';
import Stripe from 'stripe';
import { stripeSecretKey } from './settings';

let client: Stripe | null = null;
let clientKey: string | null = null;

/**
 * Stripe client, created on demand. Returns `null` when no key is configured —
 * the site must stay perfectly usable without Stripe.
 *
 * Recreated when the admin pastes a new key: a cached client would keep
 * charging the old account.
 */
export function stripe(): Stripe | null {
  const key = stripeSecretKey();
  if (!key) {
    client = null;
    clientKey = null;
    return null;
  }
  if (client && clientKey === key) return client;

  client = new Stripe(key);
  clientKey = key;
  return client;
}
