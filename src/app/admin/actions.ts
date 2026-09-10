'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { updateBooking } from '@/lib/booking';
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
import { checkCredentials, createSession, destroySession, hashPassword, MIN_PASSWORD_LENGTH, requireAdmin } from '@/lib/auth';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import {
  MAX_NIGHT_PERCENT,
  saveVehicleFleet,
  setSetting,
  setSettings,
  stripeSecretKey,
  updateSettings,
} from '@/lib/settings';
import { VEHICLE_IDS, parseClock, type VehicleId } from '@/lib/prices';

export type ActionState = { error?: string; success?: string };

/** Invalidates the public pages that display prices. */
function revalidatePublicPages() {
  revalidatePath('/', 'layout');
}

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

/* ── Session ─────────────────────────────────────────────────────────────── */

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const ip = clientIp(await headers());
  const limit = rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    return { error: 'Too many attempts. Try again in a few minutes.' };
  }

  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!checkCredentials(email, password)) {
    return { error: 'Incorrect credentials.' };
  }

  await createSession(email);
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}

/* ── Bookings ────────────────────────────────────────────────────────────── */

export async function updateBookingAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return { error: 'Booking not found.' };

  const status = String(formData.get('status') ?? '');
  const allowed = ['new', 'quoted', 'confirmed', 'cancelled'];
  if (!allowed.includes(status)) return { error: 'Invalid status.' };

  const rawPrice = String(formData.get('price') ?? '').trim();
  let quotedPriceCents: number | null | undefined;

  if (rawPrice === '') {
    quotedPriceCents = null;
  } else {
    const cents = parseEuros(rawPrice);
    if (cents == null) return { error: 'Invalid price.' };
    quotedPriceCents = cents;
  }

  updateBooking(id, {
    status,
    adminNotes: String(formData.get('notes') ?? ''),
    quotedPriceCents,
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/bookings/${id}`);
  return { success: 'Booking updated.' };
}

/* ── Rate grid ───────────────────────────────────────────────────────────── */

export async function saveRatesAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const pairs = formData.getAll('pair').map(String);
  const errors: string[] = [];

  for (const pair of pairs) {
    const cells = Array.from({ length: 6 }, (_, index) =>
      String(formData.get(`price:${pair}:${index}`) ?? '').trim(),
    );

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

  if (errors.length > 0) {
    return {
      error: `Six whole prices expected (tiers 1-3, 4, 5, 6, 7, 8) — not saved for: ${errors.join(', ')}.`,
    };
  }

  revalidatePath('/admin/rates');
  revalidatePublicPages();
  return { success: 'Rate grid saved.' };
}

export async function addRateAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const from = String(formData.get('from') ?? '');
  const to = String(formData.get('to') ?? '');
  if (!from || !to || from === to) return { error: 'Pick two different places.' };

  const cells = Array.from({ length: 6 }, (_, index) =>
    String(formData.get(`newPrice:${index}`) ?? '').trim(),
  );
  const values = cells.map((cell) => Number.parseInt(cell, 10));

  if (values.length !== 6 || values.some((value) => !Number.isFinite(value) || value < 0)) {
    return { error: 'Six whole prices expected (tiers 1-3, 4, 5, 6, 7, 8).' };
  }

  setRate(`${from}-${to}`, values);
  revalidatePath('/admin/rates');
  revalidatePublicPages();
  return { success: 'Connection added.' };
}

export async function saveVehiclesAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const fleet: { id: VehicleId; active: boolean; mult: number }[] = [];

  for (const id of VEHICLE_IDS) {
    const raw = String(formData.get(`vehicleMult:${id}`) ?? '').trim().replace(',', '.');
    const mult = Number.parseFloat(raw);
    if (!Number.isFinite(mult) || mult < 0.5 || mult > 5) {
      return { error: `The ${id} price factor must be between 0.50 and 5.00.` };
    }
    fleet.push({
      id,
      active: formData.get(`vehicleActive:${id}`) === 'on',
      mult: Math.round(mult * 100) / 100,
    });
  }

  if (!fleet.some((vehicle) => vehicle.active)) {
    return { error: 'Leave at least one vehicle offered.' };
  }

  saveVehicleFleet(fleet);
  revalidatePath('/admin/rates');
  revalidatePublicPages();
  return { success: 'Vehicles saved.' };
}

/* ── Packages ────────────────────────────────────────────────────────────── */

export async function savePackageAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const name = String(formData.get('name') ?? '').trim();
  if (name.length < 2) return { error: 'Give the package a name.' };

  const priceCents = parseEuros(String(formData.get('price') ?? ''));
  if (priceCents == null) return { error: 'Invalid package price.' };

  const input = {
    name: name.slice(0, 120),
    description: String(formData.get('description') ?? '').trim().slice(0, 400),
    priceCents,
    maxPax: parseCount(String(formData.get('maxPax') ?? ''), 1, 8, 8),
    nightSurcharge: formData.get('nightSurcharge') === 'on',
    active: formData.get('active') === 'on',
    sortOrder: parseCount(String(formData.get('sortOrder') ?? ''), 0, 999, 0),
  };

  const rawId = String(formData.get('id') ?? '');
  if (rawId) {
    const id = Number(rawId);
    if (!Number.isInteger(id)) return { error: 'Package not found.' };
    updatePackage(id, input);
  } else {
    createPackage(input);
  }

  revalidatePath('/admin/packages');
  revalidatePublicPages();
  return { success: rawId ? 'Package updated.' : 'Package created.' };
}

export async function deletePackageAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return { error: 'Package not found.' };

  deletePackage(id);
  revalidatePath('/admin/packages');
  revalidatePublicPages();
  return { success: 'Package deleted.' };
}

/* ── Paid add-ons ────────────────────────────────────────────────────────── */

export async function saveExtraAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const label = String(formData.get('label') ?? '').trim();
  if (label.length < 2) return { error: 'Give the add-on a name.' };

  const priceCents = parseEuros(String(formData.get('price') ?? ''));
  if (priceCents == null) return { error: 'Invalid add-on price.' };

  const input = {
    label: label.slice(0, 120),
    priceCents,
    perUnit: formData.get('perUnit') === 'on',
    maxQty: parseCount(String(formData.get('maxQty') ?? ''), 1, 20, 1),
    active: formData.get('active') === 'on',
    sortOrder: parseCount(String(formData.get('sortOrder') ?? ''), 0, 999, 0),
  };

  const rawId = String(formData.get('id') ?? '');
  if (rawId) {
    const id = Number(rawId);
    if (!Number.isInteger(id)) return { error: 'Add-on not found.' };
    updateExtra(id, input);
  } else {
    createExtra(input);
  }

  revalidatePath('/admin/packages');
  revalidatePublicPages();
  return { success: rawId ? 'Add-on updated.' : 'Add-on created.' };
}

export async function deleteExtraAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return { error: 'Add-on not found.' };

  deleteExtra(id);
  revalidatePath('/admin/packages');
  revalidatePublicPages();
  return { success: 'Add-on deleted.' };
}

/* ── Settings ────────────────────────────────────────────────────────────── */

export async function saveSettingsAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const mode = String(formData.get('stripeMode') ?? 'full');
  const percent = Number.parseInt(String(formData.get('depositPercent') ?? '30'), 10);

  if (mode === 'deposit' && (!Number.isFinite(percent) || percent < 5 || percent > 100)) {
    return { error: 'The deposit must be between 5 % and 100 %.' };
  }

  const nightEnabled = formData.get('nightSurchargeEnabled') === 'on';
  const nightPercent = Number.parseInt(String(formData.get('nightSurchargePercent') ?? ''), 10);
  const nightStart = String(formData.get('nightStart') ?? '');
  const nightEnd = String(formData.get('nightEnd') ?? '');

  if (nightEnabled) {
    if (!Number.isFinite(nightPercent) || nightPercent < 1 || nightPercent > MAX_NIGHT_PERCENT) {
      return { error: `The night supplement must be between 1 % and ${MAX_NIGHT_PERCENT} %.` };
    }
    if (parseClock(nightStart) == null || parseClock(nightEnd) == null) {
      return { error: 'Night hours must be valid times, e.g. 21:00 and 06:00.' };
    }
    if (nightStart === nightEnd) {
      return { error: 'Night hours cannot start and end at the same time.' };
    }
  }

  const stripeKey = String(formData.get('stripeSecretKey') ?? '').trim();
  const webhookKey = String(formData.get('stripeWebhookSecret') ?? '').trim();

  if (stripeKey) {
    if (!/^sk_(test|live)_/.test(stripeKey) && !stripeKey.startsWith('rk_')) {
      return { error: 'The Stripe secret key should start with sk_test_, sk_live_ or rk_.' };
    }
    setSetting('stripeSecretKey', stripeKey);
  }
  if (webhookKey) {
    if (!webhookKey.startsWith('whsec_')) {
      return { error: 'The Stripe webhook secret should start with whsec_.' };
    }
    setSetting('stripeWebhookSecret', webhookKey);
  }

  const wantsStripe = formData.get('stripeEnabled') === 'on';
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

  revalidatePath('/admin/settings');
  revalidatePublicPages();
  return { success: 'Settings saved.' };
}

export async function saveSmtpAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const host = String(formData.get('smtpHost') ?? '').trim();
  const portRaw = Number.parseInt(String(formData.get('smtpPort') ?? '465'), 10);
  const user = String(formData.get('smtpUser') ?? '').trim();
  const pass = String(formData.get('smtpPass') ?? '');
  const mailFrom = String(formData.get('mailFrom') ?? '').trim();
  const mailTo = String(formData.get('mailTo') ?? '').trim();

  if (host && (!Number.isFinite(portRaw) || portRaw < 1 || portRaw > 65535)) {
    return { error: 'SMTP port must be between 1 and 65535.' };
  }

  const entries: Record<string, string> = {
    smtpHost: host,
    smtpPort: Number.isFinite(portRaw) ? String(portRaw) : '465',
    smtpSecure: formData.get('smtpSecure') === 'on' ? '1' : '0',
    smtpUser: user,
    mailFrom,
    mailTo,
  };
  if (pass.trim()) entries.smtpPass = pass;

  setSettings(entries);
  revalidatePath('/admin/settings');
  return { success: 'Mail settings saved. They apply to the next email, without a restart.' };
}

export async function changePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const current = String(formData.get('currentPassword') ?? '');
  const next = String(formData.get('newPassword') ?? '');
  const confirm = String(formData.get('confirmPassword') ?? '');
  const email = process.env.ADMIN_EMAIL ?? '';

  if (!checkCredentials(email, current)) {
    return { error: 'Current password is incorrect.' };
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (next !== confirm) {
    return { error: 'The new password and its confirmation do not match.' };
  }
  if (next === current) {
    return { error: 'Pick a password different from the current one.' };
  }

  setSetting('adminPasswordHash', hashPassword(next));
  revalidatePath('/admin/settings');
  return { success: 'Password changed. Use it the next time you sign in.' };
}
