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
import { checkCredentials, createSession, destroySession, requireAdmin } from '@/lib/auth';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import { MAX_NIGHT_PERCENT, updateSettings } from '@/lib/settings';
import { parseClock } from '@/lib/prices';

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
    const raw = String(formData.get(`prices:${pair}`) ?? '').trim();

    if (raw === '') {
      deleteRate(pair);
      continue;
    }

    const values = raw
      .split(/[,;\s]+/)
      .filter(Boolean)
      .map((value) => Number.parseInt(value, 10));

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

  const raw = String(formData.get('prices') ?? '').trim();
  const values = raw
    .split(/[,;\s]+/)
    .filter(Boolean)
    .map((value) => Number.parseInt(value, 10));

  if (values.length !== 6 || values.some((value) => !Number.isFinite(value) || value < 0)) {
    return { error: 'Six whole prices expected (tiers 1-3, 4, 5, 6, 7, 8).' };
  }

  setRate(`${from}-${to}`, values);
  revalidatePath('/admin/rates');
  revalidatePublicPages();
  return { success: 'Connection added.' };
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

  updateSettings({
    stripeEnabled: formData.get('stripeEnabled') === 'on',
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
