/**
 * Disney Paris Transfers rate grid — ported from `project/prices.js`.
 *
 * This file holds DATA only (ids, numbers) plus the pure functions that turn
 * that data into a price. Every visible label lives in the i18n dictionaries,
 * so the grid stays single-sourced whatever the language.
 *
 * It is imported by client components, so it must never reach for the
 * database or for `server-only` modules. The live grid, the night rule and the
 * packages are read on the server and passed in as arguments.
 *
 * ⚠️ Non-CDG prices were estimated during the design phase and must be
 * validated by the client before going live.
 */

export const ZONE_IDS = [
  'cdg',
  'orly',
  'beauvais',
  'disney',
  'paris',
  'versailles',
  'ladefense',
  'valeurope',
] as const;

export type ZoneId = (typeof ZONE_IDS)[number];

/** How a place is grouped in the booking calculator and the prices page. */
export const DESTINATION_KINDS = ['airport', 'city', 'castle', 'tours'] as const;

export type DestinationKind = (typeof DESTINATION_KINDS)[number];

export const ZONE_KIND: Record<ZoneId, Exclude<DestinationKind, 'tours'>> = {
  cdg: 'airport',
  orly: 'airport',
  beauvais: 'airport',
  paris: 'city',
  ladefense: 'city',
  valeurope: 'city',
  disney: 'castle',
  versailles: 'castle',
};

export const ZONE_KIND_ORDER: Exclude<DestinationKind, 'tours'>[] = ['airport', 'city', 'castle'];

export function isZoneId(value: string): value is ZoneId {
  return (ZONE_IDS as readonly string[]).includes(value);
}

export function zonesOfKind(kind: Exclude<DestinationKind, 'tours'>): ZoneId[] {
  return ZONE_IDS.filter((id) => ZONE_KIND[id] === kind);
}

export const VEHICLE_IDS = ['saloon', 'suv', 'van', 'premium'] as const;

export type VehicleId = (typeof VEHICLE_IDS)[number];

export type Vehicle = {
  id: VehicleId;
  /** Maximum number of passengers. */
  maxPax: number;
  /** Suitcases carried in the boot. */
  bags: number;
  /** Multiplier applied to the connection's base price. */
  mult: number;
  /** When false, the vehicle is hidden from the public site. */
  active: boolean;
};

/** Admin-editable slice of a vehicle; capacity and bags stay compiled in. */
export type VehicleOverride = { active?: boolean; mult?: number };

export const VEHICLES: readonly Vehicle[] = [
  { id: 'saloon', maxPax: 4, bags: 3, mult: 1, active: true },
  { id: 'suv', maxPax: 4, bags: 4, mult: 1.1, active: true },
  { id: 'van', maxPax: 8, bags: 8, mult: 1, active: true },
  { id: 'premium', maxPax: 3, bags: 3, mult: 1.5, active: true },
];

export function mergeVehicles(
  overrides?: Partial<Record<VehicleId, VehicleOverride>> | null,
): Vehicle[] {
  return VEHICLES.map((vehicle) => {
    const patch = overrides?.[vehicle.id];
    const mult = patch?.mult;
    const validMult = typeof mult === 'number' && Number.isFinite(mult) && mult >= 0.5 && mult <= 5;
    return {
      ...vehicle,
      active: patch?.active ?? vehicle.active,
      mult: validMult ? Math.round(mult * 100) / 100 : vehicle.mult,
    };
  });
}

export function getVehicle(id: string, fleet: readonly Vehicle[] = VEHICLES): Vehicle | undefined {
  return fleet.find((vehicle) => vehicle.id === id);
}

export function activeVehicles(fleet: readonly Vehicle[] = VEHICLES): Vehicle[] {
  return fleet.filter((vehicle) => vehicle.active);
}

/** Passenger tiers matching the 6 columns of `RATES`. */
export const TIER_LABELS = ['1 – 3', '4', '5', '6', '7', '8'] as const;

export const MAX_PAX = 8;

/** One-way price in €, per passenger tier `[1-3, 4, 5, 6, 7, 8]`. */
export const RATES: Record<string, readonly number[]> = {
  'cdg-disney': [70, 80, 85, 90, 90, 105],
  'cdg-valeurope': [70, 80, 85, 90, 90, 105],
  'cdg-paris': [80, 90, 95, 100, 110, 125],
  'cdg-orly': [100, 100, 110, 115, 120, 140],
  'cdg-beauvais': [150, 150, 155, 155, 160, 175],
  'cdg-ladefense': [100, 100, 110, 120, 130, 145],
  'cdg-versailles': [130, 130, 135, 135, 140, 155],
  'orly-disney': [80, 90, 95, 100, 100, 115],
  'orly-paris': [70, 80, 85, 90, 100, 115],
  'orly-beauvais': [160, 160, 165, 165, 170, 185],
  'orly-versailles': [110, 110, 115, 115, 120, 135],
  'orly-ladefense': [90, 90, 100, 110, 120, 135],
  'orly-valeurope': [80, 90, 95, 100, 100, 115],
  'beauvais-disney': [160, 170, 175, 180, 180, 195],
  'beauvais-paris': [150, 160, 165, 170, 175, 190],
  'paris-disney': [70, 80, 85, 90, 90, 105],
  'paris-versailles': [90, 90, 95, 95, 100, 115],
  'paris-valeurope': [70, 80, 85, 90, 90, 105],
  'disney-versailles': [130, 130, 135, 135, 140, 155],
  'disney-valeurope': [40, 45, 50, 55, 55, 65],
};

/** The grid is symmetric: CDG→Disney and Disney→CDG cost the same. */
export function findRate(
  from: string,
  to: string,
  rates: Record<string, readonly number[]> = RATES,
): readonly number[] | null {
  if (from === to) return null;
  return rates[`${from}-${to}`] ?? rates[`${to}-${from}`] ?? null;
}

export function tierIndex(pax: number): number {
  return pax <= 3 ? 0 : Math.min(pax, MAX_PAX) - 3;
}

export type TripType = 'ow' | 'rt';

/* ── Night surcharge ─────────────────────────────────────────────────────── */

/**
 * Percentage supplement applied to pickups inside a time window, both set by
 * the admin. The window is allowed to wrap past midnight — that is in fact the
 * normal case (21:00 → 06:00).
 */
export type NightRule = {
  enabled: boolean;
  /** Extra percentage on top of the base fare, e.g. `20` for +20 %. */
  percent: number;
  /** Window opening time, `HH:MM`. */
  start: string;
  /** Window closing time, `HH:MM`, exclusive. */
  end: string;
};

export const NIGHT_RULE_OFF: NightRule = {
  enabled: false,
  percent: 0,
  start: '21:00',
  end: '06:00',
};

/** `HH:MM` → minutes since midnight, or `null` when the string is unusable. */
export function parseClock(value: string | null | undefined): number | null {
  if (!value) return null;

  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

/**
 * Is this pickup time inside the night window?
 *
 * A window whose end is at or before its start wraps past midnight, so
 * 21:00 → 06:00 covers the evening AND the early morning. A window with equal
 * bounds would otherwise mean "never", which is never what an admin intends;
 * `start === end` is treated as the wrapping case and so covers the full day.
 */
export function isNightTime(time: string | null | undefined, rule: NightRule): boolean {
  if (!rule.enabled || rule.percent <= 0) return false;

  const minutes = parseClock(time);
  const start = parseClock(rule.start);
  const end = parseClock(rule.end);
  if (minutes == null || start == null || end == null) return false;

  // Straight window: 12:00 → 14:00.
  if (start < end) return minutes >= start && minutes < end;

  // Wrapping window: 21:00 → 06:00.
  return minutes >= start || minutes < end;
}

/* ── Quoting ─────────────────────────────────────────────────────────────── */

export type QuoteInput = {
  from: string;
  to: string;
  pax: number;
  vehicleId: string;
  trip: TripType;
  rates?: Record<string, readonly number[]>;
  /** Pickup time `HH:MM`; without it the night surcharge cannot apply. */
  time?: string | null;
  night?: NightRule;
  /** Live fleet from the admin; defaults to the compiled vehicles. */
  vehicles?: readonly Vehicle[];
};

/** A priced trip, broken down so the surcharge can be shown on its own line. */
export type QuoteBreakdown = {
  /** Fare before the night surcharge, trip multiplier already applied. */
  baseEuros: number;
  /** The night supplement in euros — `0` when the rule does not apply. */
  nightEuros: number;
  totalEuros: number;
  /** Whether the pickup falls inside the night window. */
  night: boolean;
  /** The percentage that was applied, for the "+20 %" label. */
  nightPercent: number;
};

/**
 * Full price for a request. Returns `null` when the connection is missing from
 * the grid or the vehicle is too small: the site then says "on request, reply
 * within 2 h" and never invents a price.
 *
 * The night supplement is applied per leg, before the round-trip doubling, so
 * a round trip booked at 23:00 carries the surcharge on both legs. The form
 * only collects one pickup time, so the outbound time decides for both — worth
 * knowing when quoting a night pickup with a daytime return.
 */
export function quoteBreakdown(input: QuoteInput): QuoteBreakdown | null {
  const vehicle = getVehicle(input.vehicleId, input.vehicles);
  if (!vehicle || !vehicle.active || vehicle.maxPax < input.pax) return null;

  const rate = findRate(input.from, input.to, input.rates ?? RATES);
  if (!rate) return null;

  const base = rate[tierIndex(input.pax)];
  if (base == null) return null;

  const legs = input.trip === 'rt' ? 2 : 1;
  const rule = input.night ?? NIGHT_RULE_OFF;
  const night = isNightTime(input.time, rule);

  const leg = Math.round(base * vehicle.mult);
  const legWithNight = night ? Math.round(leg * (1 + rule.percent / 100)) : leg;

  return {
    baseEuros: leg * legs,
    nightEuros: (legWithNight - leg) * legs,
    totalEuros: legWithNight * legs,
    night,
    nightPercent: night ? rule.percent : 0,
  };
}

/** Total only — the common case for cards, tables and SEO snippets. */
export function quote(input: QuoteInput): number | null {
  return quoteBreakdown(input)?.totalEuros ?? null;
}

/**
 * Applies the night rule to any fixed amount, e.g. a package price.
 *
 * Unit-agnostic on purpose: pass euros and you get euros back, pass cents and
 * the rounding simply happens at the cent — which is what package prices want,
 * since they are stored in cents.
 */
export function applyNight(
  amount: number,
  time: string | null | undefined,
  rule: NightRule,
): { total: number; surcharge: number; night: boolean } {
  if (!isNightTime(time, rule)) {
    return { total: amount, surcharge: 0, night: false };
  }

  const total = Math.round(amount * (1 + rule.percent / 100));
  return { total, surcharge: total - amount, night: true };
}

/** First vehicle able to seat the group, when the current pick no longer fits. */
export function fittingVehicle(
  pax: number,
  preferred?: string,
  fleet: readonly Vehicle[] = VEHICLES,
): Vehicle | undefined {
  const available = activeVehicles(fleet);
  const chosen = preferred ? available.find((vehicle) => vehicle.id === preferred) : undefined;
  if (chosen && chosen.maxPax >= pax) return chosen;
  return available.find((vehicle) => vehicle.maxPax >= pax);
}

/**
 * Groups consecutive tiers that share a price, for the rate tables:
 * `[70,80,85,90,90,105]` → 1–3 / 4 / 5 / 6–7 / 8.
 */
export function collapseTiers(
  rate: readonly number[],
): { tier: string; ow: number; rt: number; pax: number }[] {
  const rows: { tier: string; ow: number; rt: number; pax: number }[] = [];
  let start = 0;

  for (let i = 1; i <= rate.length; i++) {
    if (i === rate.length || rate[i] !== rate[start]) {
      const price = rate[start];
      if (price == null) break;

      const first = start === 0 ? 1 : start + 3;
      const last = i === 1 ? 3 : i + 2;
      const tier = first === last ? String(first) : `${first} – ${last}`;

      rows.push({ tier, ow: price, rt: price * 2, pax: last });
      start = i;
    }
  }

  return rows;
}

/** Excursions and hourly hire — always on request (reply within 2 h). */
export const TOUR_IDS = [
  'parisCityTour',
  'versailles',
  'montSaintMichel',
  'normandie',
  'loire',
  'fontainebleau',
  'giverny',
  'parcAsterix',
  'valleeVillage',
] as const;

export type TourId = (typeof TOUR_IDS)[number];

/**
 * Prefix used when a tour is stored as a destination (`to_zone`).
 * Tour ids can collide with zone ids (`versailles`), so they never share
 * the same string.
 */
export const TOUR_DEST_PREFIX = 'tour:' as const;

export type TourDest = `${typeof TOUR_DEST_PREFIX}${TourId}`;

/** A drop-off: a priced zone, or a tour (always on request). */
export type ArrivalId = ZoneId | TourDest;

export function isTourId(value: string): value is TourId {
  return (TOUR_IDS as readonly string[]).includes(value);
}

export function tourDestValue(id: TourId): TourDest {
  return `${TOUR_DEST_PREFIX}${id}`;
}

export function parseTourDest(value: string): TourId | null {
  if (!value.startsWith(TOUR_DEST_PREFIX)) return null;
  const id = value.slice(TOUR_DEST_PREFIX.length);
  return isTourId(id) ? id : null;
}

export function isArrivalId(value: string): value is ArrivalId {
  return isZoneId(value) || parseTourDest(value) != null;
}

export function destinationKindOf(value: string): DestinationKind {
  if (isZoneId(value)) return ZONE_KIND[value];
  return 'tours';
}

/** Dedicated route pages (SEO). One page = one highlighted connection. */
export type RoutePage = {
  slug: string;
  from: ZoneId;
  to: ZoneId;
  durationMin: number;
  distanceKm: number;
  /** Promoted on the home page. */
  featured: boolean;
};

export const ROUTE_PAGES: readonly RoutePage[] = [
  { slug: 'cdg-disneyland', from: 'cdg', to: 'disney', durationMin: 45, distanceKm: 60, featured: true },
  { slug: 'orly-disneyland', from: 'orly', to: 'disney', durationMin: 50, distanceKm: 50, featured: true },
  { slug: 'beauvais-disneyland', from: 'beauvais', to: 'disney', durationMin: 90, distanceKm: 120, featured: true },
  { slug: 'paris-disneyland', from: 'paris', to: 'disney', durationMin: 45, distanceKm: 45, featured: true },
  { slug: 'cdg-paris', from: 'cdg', to: 'paris', durationMin: 40, distanceKm: 35, featured: true },
  { slug: 'orly-paris', from: 'orly', to: 'paris', durationMin: 35, distanceKm: 25, featured: false },
  { slug: 'paris-beauvais', from: 'paris', to: 'beauvais', durationMin: 75, distanceKm: 85, featured: false },
  { slug: 'paris-versailles', from: 'paris', to: 'versailles', durationMin: 40, distanceKm: 25, featured: false },
];

export function findRoutePage(slug: string): RoutePage | undefined {
  return ROUTE_PAGES.find((r) => r.slug === slug);
}

/** Entry price for a connection ("from €X"), used on cards and in SEO copy. */
export function startingPrice(
  from: string,
  to: string,
  rates: Record<string, readonly number[]> = RATES,
): number | null {
  const rate = findRate(from, to, rates);
  if (!rate || rate.length === 0) return null;
  return Math.min(...rate);
}
