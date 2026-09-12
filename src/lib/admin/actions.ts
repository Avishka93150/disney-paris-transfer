import { updateBooking } from '@/lib/booking';
import { invalidatePages } from '@/lib/cache';
import {
  createExtra,
  createPackage,
  deleteExtra,
  deletePackage,
  deleteRate,
  setRate,
  updateExtra,
  updatePackage,
} from '@/lib/db';
import { checkCredentials, hashPassword, MIN_PASSWORD_LENGTH } from '@/lib/auth';
import { VEHICLE_IDS, parseClock, type VehicleId } from '@/lib/prices';
import {
  MAX_NIGHT_PERCENT,
  saveVehicleFleet,
  setSetting,
  setSettings,
  stripeSecretKey,
  updateSettings,
} from '@/lib/settings';

/**
 * The back office's write operations. Each takes the posted form and answers
 * with a message; the admin pages call them from their frontmatter when the
 * request is a POST. Every one that changes what a public page displays
 * empties the page cache, so the change is live on the next request.
 *
 * The caller has already checked the session.
 */

export type ActionState = { error?: string; success?: string };

/** Euros typed by a human ("150", "150,50", " 150.5 ") to cents. */
function parseEuros(raw: string): number | null {
  const value = Number.parseFloat(raw.trim().replace(',', '.'));
  if (!Number.isFinite(value) || value < 0 || value > 100000) return null;
  return Math.round(value * 100);
}

function parseCount(raw: string, min: number, max: number, fallback: number): number {
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

const text = (form: FormData, key: string) => String(form.get(key) ?? '');

/* ── Bookings ────────────────────────────────────────────────────────────── */

export function updateBookingAction(form: FormData): ActionState {
  const id = Number(form.get('id'));
  if (!Number.isInteger(id)) return { error: 'Booking not found.' };

  const status = text(form, 'status');
  const allowed = ['new', 'quoted', 'confirmed', 'cancelled'];
  if (!allowed.includes(status)) return { error: 'Invalid status.' };

  const rawPrice = text(form, 'price').trim();
  let quotedPriceCents: number | null;

  if (rawPrice === '') {
    quotedPriceCents = null;
  } else {
    const cents = parseEuros(rawPrice);
    if (cents == null) return { error: 'Invalid price.' };
    quotedPriceCents = cents;
  }

  updateBooking(id, { status, adminNotes: text(form, 'notes'), quotedPriceCents });
  return { success: 'Booking updated.' };
}

/* ── Rate grid ───────────────────────────────────────────────────────────── */

export function saveRatesAction(form: FormData): ActionState {
  const pairs = form.getAll('pair').map(String);
  const errors: string[] = [];

  for (const pair of pairs) {
    const cells = Array.from({ length: 6 }, (_, index) => text(form, `price:${pair}:${index}`).trim());

    if (cells.every((cell) => cell === '')) {
      deleteRate(pair);
      continue;
    }

    const values = cells.map((cell) => Number.parseInt(cell, 10));
    if (values.length !== 6 || values.some((value) => !Number.isFinite(value) || value < 0)) {
      errors.push(pair);
      continue;
    }

    setRate(pair, values);
  }

  invalidatePages();

  if (errors.length > 0) {
    return { error: `Six whole prices expected (tiers 1-3, 4, 5, 6, 7, 8) — not saved for: ${errors.join(', ')}.` };
  }
  return { success: 'Rate grid saved.' };
}

export function addRateAction(form: FormData): ActionState {
  const from = text(form, 'from');
  const to = text(form, 'to');
  if (!from || !to || from === to) return { error: 'Pick two different places.' };

  const cells = Array.from({ length: 6 }, (_, index) => text(form, `newPrice:${index}`).trim());
  const values = cells.map((cell) => Number.parseInt(cell, 10));

  if (values.length !== 6 || values.some((value) => !Number.isFinite(value) || value < 0)) {
    return { error: 'Six whole prices expected (tiers 1-3, 4, 5, 6, 7, 8).' };
  }

  setRate(`${from}-${to}`, values);
  invalidatePages();
  return { success: 'Connection added.' };
}

export function saveVehiclesAction(form: FormData): ActionState {
  const fleet: { id: VehicleId; active: boolean; mult: number }[] = [];

  for (const id of VEHICLE_IDS) {
    const raw = text(form, `vehicleMult:${id}`).trim().replace(',', '.');
    const mult = Number.parseFloat(raw);
    if (!Number.isFinite(mult) || mult < 0.5 || mult > 5) {
      return { error: `The ${id} price factor must be between 0.50 and 5.00.` };
    }
    fleet.push({ id, active: form.get(`vehicleActive:${id}`) === 'on', mult: Math.round(mult * 100) / 100 });
  }

  if (!fleet.some((vehicle) => vehicle.active)) return { error: 'Leave at least one vehicle offered.' };

  saveVehicleFleet(fleet);
  invalidatePages();
  return { success: 'Vehicles saved.' };
}

/* ── Packages ────────────────────────────────────────────────────────────── */

export function savePackageAction(form: FormData): ActionState {
  const name = text(form, 'name').trim();
  if (name.length < 2) return { error: 'Give the package a name.' };

  const priceCents = parseEuros(text(form, 'price'));
  if (priceCents == null) return { error: 'Invalid package price.' };

  const input = {
    name: name.slice(0, 120),
    description: text(form, 'description').trim().slice(0, 400),
    priceCents,
    maxPax: parseCount(text(form, 'maxPax'), 1, 8, 8),
    nightSurcharge: form.get('nightSurcharge') === 'on',
    active: form.get('active') === 'on',
    sortOrder: parseCount(text(form, 'sortOrder'), 0, 999, 0),
  };

  const rawId = text(form, 'id');
  if (rawId) {
    const id = Number(rawId);
    if (!Number.isInteger(id)) return { error: 'Package not found.' };
    updatePackage(id, input);
  } else {
    createPackage(input);
  }

  invalidatePages();
  return { success: rawId ? 'Package updated.' : 'Package created.' };
}

export function deletePackageAction(form: FormData): ActionState {
  const id = Number(form.get('id'));
  if (!Number.isInteger(id)) return { error: 'Package not found.' };

  deletePackage(id);
  invalidatePages();
  return { success: 'Package deleted.' };
}

/* ── Paid add-ons ────────────────────────────────────────────────────────── */

export function saveExtraAction(form: FormData): ActionState {
  const label = text(form, 'label').trim();
  if (label.length < 2) return { error: 'Give the add-on a name.' };

  const priceCents = parseEuros(text(form, 'price'));
  if (priceCents == null) return { error: 'Invalid add-on price.' };

  const input = {
    label: label.slice(0, 120),
    priceCents,
    perUnit: form.get('perUnit') === 'on',
    maxQty: parseCount(text(form, 'maxQty'), 1, 20, 1),
    active: form.get('active') === 'on',
    sortOrder: parseCount(text(form, 'sortOrder'), 0, 999, 0),
  };

  const rawId = text(form, 'id');
  if (rawId) {
    const id = Number(rawId);
    if (!Number.isInteger(id)) return { error: 'Add-on not found.' };
    updateExtra(id, input);
  } else {
    createExtra(input);
  }

  invalidatePages();
  return { success: rawId ? 'Add-on updated.' : 'Add-on created.' };
}

export function deleteExtraAction(form: FormData): ActionState {
  const id = Number(form.get('id'));
  if (!Number.isInteger(id)) return { error: 'Add-on not found.' };

  deleteExtra(id);
  invalidatePages();
  return { success: 'Add-on deleted.' };
}

/* ── Settings ────────────────────────────────────────────────────────────── */

export function saveSettingsAction(form: FormData): ActionState {
  const mode = text(form, 'stripeMode') || 'full';
  const percent = Number.parseInt(text(form, 'depositPercent') || '30', 10);

  if (mode === 'deposit' && (!Number.isFinite(percent) || percent < 5 || percent > 100)) {
    return { error: 'The deposit must be between 5 % and 100 %.' };
  }

  const nightEnabled = form.get('nightSurchargeEnabled') === 'on';
  const nightPercent = Number.parseInt(text(form, 'nightSurchargePercent'), 10);
  const nightStart = text(form, 'nightStart');
  const nightEnd = text(form, 'nightEnd');

  if (nightEnabled) {
    if (!Number.isFinite(nightPercent) || nightPercent < 1 || nightPercent > MAX_NIGHT_PERCENT) {
      return { error: `The night supplement must be between 1 % and ${MAX_NIGHT_PERCENT} %.` };
    }
    if (parseClock(nightStart) == null || parseClock(nightEnd) == null) {
      return { error: 'Night hours must be valid times, e.g. 21:00 and 06:00.' };
    }
    if (nightStart === nightEnd) return { error: 'Night hours cannot start and end at the same time.' };
  }

  const stripeKey = text(form, 'stripeSecretKey').trim();
  const webhookKey = text(form, 'stripeWebhookSecret').trim();

  if (stripeKey) {
    if (!/^sk_(test|live)_/.test(stripeKey) && !stripeKey.startsWith('rk_')) {
      return { error: 'The Stripe secret key should start with sk_test_, sk_live_ or rk_.' };
    }
    setSetting('stripeSecretKey', stripeKey);
  }
  if (webhookKey) {
    if (!webhookKey.startsWith('whsec_')) return { error: 'The Stripe webhook secret should start with whsec_.' };
    setSetting('stripeWebhookSecret', webhookKey);
  }

  const wantsStripe = form.get('stripeEnabled') === 'on';
  if (wantsStripe && !stripeKey && !stripeSecretKey()) {
    return { error: 'Paste a Stripe secret key before switching online payment on.' };
  }

  updateSettings({
    stripeEnabled: wantsStripe,
    stripeMode: mode === 'deposit' ? 'deposit' : 'full',
    depositPercent: Number.isFinite(percent) ? percent : 30,
    nightSurchargeEnabled: nightEnabled,
    ...(Number.isFinite(nightPercent) ? { nightSurchargePercent: nightPercent } : {}),
    ...(parseClock(nightStart) != null ? { nightStart } : {}),
    ...(parseClock(nightEnd) != null ? { nightEnd } : {}),
  });

  invalidatePages();
  return { success: 'Settings saved.' };
}

export function saveSmtpAction(form: FormData): ActionState {
  const host = text(form, 'smtpHost').trim();
  const portRaw = Number.parseInt(text(form, 'smtpPort') || '465', 10);
  const user = text(form, 'smtpUser').trim();
  const pass = text(form, 'smtpPass');
  const mailFrom = text(form, 'mailFrom').trim();
  const mailTo = text(form, 'mailTo').trim();

  if (host && (!Number.isFinite(portRaw) || portRaw < 1 || portRaw > 65535)) {
    return { error: 'SMTP port must be between 1 and 65535.' };
  }

  const entries: Record<string, string> = {
    smtpHost: host,
    smtpPort: Number.isFinite(portRaw) ? String(portRaw) : '465',
    smtpSecure: form.get('smtpSecure') === 'on' ? '1' : '0',
    smtpUser: user,
    mailFrom,
    mailTo,
  };
  if (pass.trim()) entries.smtpPass = pass;

  setSettings(entries);
  return { success: 'Mail settings saved. They apply to the next email, without a restart.' };
}

export function changePasswordAction(form: FormData): ActionState {
  const current = text(form, 'currentPassword');
  const next = text(form, 'newPassword');
  const confirm = text(form, 'confirmPassword');
  const email = process.env.ADMIN_EMAIL ?? '';

  if (!checkCredentials(email, current)) return { error: 'Current password is incorrect.' };
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (next !== confirm) return { error: 'The new password and its confirmation do not match.' };
  if (next === current) return { error: 'Pick a password different from the current one.' };

  setSetting('adminPasswordHash', hashPassword(next));
  return { success: 'Password changed. Use it the next time you sign in.' };
}
