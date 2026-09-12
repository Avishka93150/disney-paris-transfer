/**
 * In-process cache of rendered public pages.
 *
 * Every public page is server-rendered HTML that depends on nothing but the
 * URL — no cookie, no visitor data — so the first render of `/en/prices` can
 * be served to every following visitor straight from memory, exactly as fast
 * as a static file, until either:
 *
 *   - the admin saves something that changes what pages show (rates,
 *     vehicles, packages, add-ons, night rule) and calls `invalidatePages()`;
 *   - the entry is older than `TTL_MS` — the safety net for an invalidation
 *     that was missed.
 *
 * This replaces the "static page + revalidatePath" behaviour of the previous
 * implementation. It lives in the process, like the rate limiter: a restart
 * simply starts with an empty cache. Behind several Node processes, each keeps
 * its own copy — which is still correct, only slightly less warm.
 */

export const TTL_MS = 60 * 60 * 1000;

type Entry = { body: string; headers: [string, string][]; status: number; storedAt: number };

const pages = new Map<string, Entry>();

/** Bumped on every invalidation, so a stale entry can never be served. */
let generation = 0;
const entryGeneration = new Map<string, number>();

export function getCachedPage(key: string): Entry | null {
  const entry = pages.get(key);
  if (!entry) return null;

  if (entryGeneration.get(key) !== generation || Date.now() - entry.storedAt > TTL_MS) {
    pages.delete(key);
    entryGeneration.delete(key);
    return null;
  }
  return entry;
}

export function setCachedPage(key: string, entry: Omit<Entry, 'storedAt'>): void {
  // Bound the memory: 9 locales × ~35 pages is well under this, anything more
  // is a crawler probing random URLs, and those are 404s we do not keep.
  if (pages.size > 2000) {
    pages.clear();
    entryGeneration.clear();
  }
  pages.set(key, { ...entry, storedAt: Date.now() });
  entryGeneration.set(key, generation);
}

/** Call after any admin write that changes what a public page displays. */
export function invalidatePages(): void {
  generation += 1;
  pages.clear();
  entryGeneration.clear();
}
