import 'server-only';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Admin authentication — a single account, the driver's.
 *
 * Deliberately dependency-free: `scrypt` for the password, an HMAC-signed
 * session cookie. No session store to purge, no auth library to maintain for
 * one single user.
 */

const COOKIE = 'dpt_admin';
const MAX_AGE_SECONDS = 12 * 60 * 60;
const SCRYPT_KEYLEN = 64;

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      'SESSION_SECRET missing or too short (32 characters minimum). See .env.example.',
    );
  }
  return value;
}

/* ── Password ───────────────────────────────────────────────────────────── */

/**
 * Stored format: `scrypt:<hex salt>:<hex hash>`.
 *
 * Separator `:` and not `$`: `.env` files read `$xxx` as a variable and would
 * silently replace the hash with an empty string.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt.toString('hex')}:${derived.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.trim().split(':');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;

  try {
    const expected = Buffer.from(hashHex, 'hex');
    const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/* ── Session ────────────────────────────────────────────────────────────── */

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function serialize(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: email, exp: Date.now() + MAX_AGE_SECONDS * 1000 }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function parse(token: string): { sub: string } | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      sub?: string;
      exp?: number;
    };
    if (!data.sub || !data.exp || data.exp < Date.now()) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}

/** Checks the credentials against the environment variables. */
export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedEmail || !hash) return false;

  // Case-insensitive email comparison, then a constant-time password check.
  const emailOk = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
  const passwordOk = verifyPassword(password, hash);
  return emailOk && passwordOk;
}

export async function createSession(email: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, serialize(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: COOKIE, path: '/admin' });
}

export async function getSession(): Promise<{ sub: string } | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  try {
    return parse(token);
  } catch {
    // SESSION_SECRET missing: simply treat it as no session at all.
    return null;
  }
}

/** Call this at the top of every admin page and every admin action. */
export async function requireAdmin(): Promise<{ sub: string }> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/** The admin is unusable until the account is configured. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && process.env.SESSION_SECRET);
}
