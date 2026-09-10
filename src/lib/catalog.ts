/**
 * Packages and paid add-ons — the part of the offer the admin creates itself,
 * as opposed to the fixed rate grid in `prices.ts`.
 *
 * Two different things live here on purpose:
 *
 * - a **package** replaces the fare. "CDG ⇄ Disneyland round trip, up to
 *   4 passengers, €150" is sold as one line and ignores the grid entirely.
 * - an **add-on** is charged on top of whatever the fare turned out to be:
 *   child seat, meet & greet at arrivals, an hour of waiting.
 *
 * Like `prices.ts` this module is client-safe: pure types and pure arithmetic,
 * no database. `src/lib/db.ts` is what reads and writes the rows.
 *
 * ⚠️ Names and descriptions are typed by the admin in a single language, so
 * they are NOT translated the way the rest of the site is. A visitor reading
 * the Japanese pages sees the package names exactly as the admin wrote them.
 */

export type Package = {
  id: number;
  /** Stable identifier sent by the booking form. */
  slug: string;
  /** Admin-entered, shown as-is in every locale. */
  name: string;
  description: string;
  priceCents: number;
  /** Largest group the package covers. */
  maxPax: number;
  /** Whether the night supplement applies on top of the package price. */
  nightSurcharge: boolean;
  active: boolean;
  sortOrder: number;
};

export type Extra = {
  id: number;
  slug: string;
  /** Admin-entered, shown as-is in every locale. */
  label: string;
  priceCents: number;
  /**
   * `1` when the price is charged per unit chosen (2 child seats = 2 × €10),
   * `0` when it is a flat fee whatever the quantity.
   */
  perUnit: boolean;
  /** Highest quantity offered. `1` renders as a checkbox, more as a select. */
  maxQty: number;
  active: boolean;
  sortOrder: number;
};

/** What the customer actually picked, as stored on the booking. */
export type ExtraSelection = {
  slug: string;
  label: string;
  qty: number;
  unitCents: number;
  totalCents: number;
};

export function findPackage(packages: readonly Package[], slug: string | null | undefined) {
  if (!slug) return undefined;
  return packages.find((p) => p.slug === slug);
}

/**
 * Prices a set of `{slug: qty}` choices against the live add-on list.
 *
 * Unknown slugs and inactive add-ons are dropped rather than rejected: an
 * add-on retired between the moment the form was rendered and the moment it
 * was submitted must not fail the whole booking.
 */
export function priceExtras(
  extras: readonly Extra[],
  chosen: Record<string, number> | null | undefined,
): { lines: ExtraSelection[]; totalCents: number } {
  if (!chosen) return { lines: [], totalCents: 0 };

  const lines: ExtraSelection[] = [];

  for (const extra of extras) {
    if (!extra.active) continue;

    const raw = chosen[extra.slug];
    if (!Number.isFinite(raw)) continue;

    const qty = Math.min(Math.max(Math.trunc(raw as number), 0), extra.maxQty);
    if (qty === 0) continue;

    const totalCents = extra.perUnit ? extra.priceCents * qty : extra.priceCents;
    lines.push({
      slug: extra.slug,
      label: extra.label,
      qty,
      unitCents: extra.priceCents,
      totalCents,
    });
  }

  return { lines, totalCents: lines.reduce((sum, line) => sum + line.totalCents, 0) };
}

/** `package name` → `package-name`, so the admin never has to type a slug. */
export function slugify(value: string): string {
  const base = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  // A name written entirely in a non-Latin script would slugify to nothing.
  return base || `item-${Date.now().toString(36)}`;
}

export function euros(cents: number): string {
  return Number.isInteger(cents / 100) ? `${cents / 100} €` : `${(cents / 100).toFixed(2)} €`;
}
