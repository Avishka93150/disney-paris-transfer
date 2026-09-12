import { fill } from './i18n/fill';
import type { Dictionary } from './i18n/types';
import {
  activeVehicles,
  fittingVehicle,
  isTourId,
  isZoneId,
  parseTourDest,
  quote,
  quoteBreakdown,
  type NightRule,
  type TripType,
  type Vehicle,
} from './prices';

/**
 * "Your price, live" — the view-model behind the calculator on the home page
 * and the route pages.
 *
 * Pure and client-safe: the Astro component calls `computeCalculator()` to
 * render the initial state into the HTML (so the default price is visible to
 * search engines and to visitors without JavaScript), and the browser script
 * calls the very same function on every change. One implementation, two
 * callers — the two can never disagree.
 *
 * Only the strings the widget needs travel to the browser, never a whole
 * dictionary.
 */

export type CalcLabels = {
  zones: Record<string, string>;
  tours: Record<string, string>;
  vehicles: Record<string, { label: string; short: string; pax: string; bags: string }>;
  calc: Dictionary['home']['calc'];
  timeLabel: string;
  vehicleLabel: string;
  quoteOnly: string;
  nightLine: string;
  nightNote: string;
};

export type CalcConfig = {
  rates: Record<string, readonly number[]>;
  night: NightRule;
  vehicles: readonly Vehicle[];
  bookingHref: string;
  whatsappHref: string;
  labels: CalcLabels;
};

export type CalcState = {
  from: string;
  to: string;
  pax: number;
  trip: TripType;
  vehicleId: string;
  time: string;
};

export type CalcOption = {
  id: string;
  label: string;
  desc: string;
  fits: boolean;
  /** Price label: `"80 €"`, the "on request" wording, or `—` when too small. */
  priceLabel: string;
  active: boolean;
};

export type CalcView = {
  options: CalcOption[];
  summaryLabel: string;
  priceLabel: string;
  /** "+20 % night rate · 16 €" — `null` when the surcharge does not apply. */
  nightLine: string | null;
  showNightNote: boolean;
  bookingUrl: string;
  whatsappUrl: string;
};

/** Zone name, or the tour name when the id is a `tour:…` destination. */
export function calcLabelFor(labels: CalcLabels, id: string): string {
  if (isZoneId(id)) return labels.zones[id] ?? id;
  const tour = parseTourDest(id) ?? (isTourId(id) ? id : null);
  if (tour) return labels.tours[tour] ?? id;
  return id;
}

export function labelsFromDictionary(dict: Dictionary): CalcLabels {
  return {
    zones: dict.zones,
    tours: Object.fromEntries(Object.entries(dict.tours).map(([id, tour]) => [id, tour.name])),
    vehicles: dict.vehicles,
    calc: dict.home.calc,
    timeLabel: dict.pricing.timeLabel,
    vehicleLabel: dict.home.calc.vehicleLabel,
    quoteOnly: dict.common.quoteOnly,
    nightLine: dict.pricing.nightLine,
    nightNote: dict.pricing.nightNote,
  };
}

export function computeCalculator(state: CalcState, cfg: CalcConfig): CalcView {
  const { labels, rates, night, vehicles } = cfg;
  const { from, to, pax, trip, time } = state;
  const calc = labels.calc;

  const fleet = activeVehicles(vehicles);
  // The chosen vehicle switches automatically when it becomes too small.
  const selected = fittingVehicle(pax, state.vehicleId, vehicles);
  const toIsZone = isZoneId(to);
  const samePlace = toIsZone && from === to;

  const options: CalcOption[] = fleet.map((vehicle) => {
    const fits = vehicle.maxPax >= pax;
    const price =
      fits && toIsZone
        ? quote({ from, to, pax, vehicleId: vehicle.id, trip, rates, time, night, vehicles })
        : null;
    const names = labels.vehicles[vehicle.id];
    return {
      id: vehicle.id,
      label: names?.short ?? vehicle.id,
      desc: `${names?.pax ?? ''} · ${names?.bags ?? ''}`,
      fits,
      priceLabel: !fits ? '—' : price != null ? `${price} €` : labels.quoteOnly,
      active: selected?.id === vehicle.id,
    };
  });

  const breakdown =
    selected && toIsZone
      ? quoteBreakdown({ from, to, pax, vehicleId: selected.id, trip, rates, time, night, vehicles })
      : null;

  let summaryLabel: string;
  let priceLabel: string;

  if (samePlace) {
    summaryLabel = calc.samePlace;
    priceLabel = labels.quoteOnly;
  } else if (breakdown && selected) {
    summaryLabel =
      (labels.vehicles[selected.id]?.label ?? selected.id) + (trip === 'rt' ? calc.roundTripSuffix : '');
    priceLabel = `${breakdown.totalEuros} €`;
  } else {
    summaryLabel = calc.custom;
    priceLabel = labels.quoteOnly;
  }

  const waMessage = fill(calc.whatsappMessage, {
    from: calcLabelFor(labels, from),
    to: calcLabelFor(labels, to),
    pax,
    vehicle: selected ? (labels.vehicles[selected.id]?.label ?? selected.id) : '',
    trip: trip === 'rt' ? calc.roundTrip : calc.oneWay,
  });

  // Pre-fills the booking form with the current simulation.
  const bookingUrl = `${cfg.bookingHref}?from=${from}&to=${encodeURIComponent(to)}&pax=${pax}&trip=${trip}&vehicle=${
    selected?.id ?? ''
  }${time ? `&time=${encodeURIComponent(time)}` : ''}`;

  return {
    options,
    summaryLabel,
    priceLabel,
    nightLine: breakdown?.night
      ? `${fill(labels.nightLine, { percent: breakdown.nightPercent })} · ${breakdown.nightEuros} €`
      : null,
    showNightNote: night.enabled && !breakdown?.night,
    bookingUrl,
    whatsappUrl: `${cfg.whatsappHref}?text=${encodeURIComponent(waMessage)}`,
  };
}
