'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DestinationSelect } from '@/components/DestinationSelect';
import type { Dictionary } from '@/lib/i18n/types';
import {
  MAX_PAX,
  NIGHT_RULE_OFF,
  VEHICLES,
  activeVehicles,
  fittingVehicle,
  isZoneId,
  quote,
  quoteBreakdown,
  type NightRule,
  type TripType,
  type Vehicle,
  type ZoneId,
} from '@/lib/prices';
import { destinationLabel, fill } from '@/lib/i18n';
import { whatsappLink } from '@/lib/site';

/**
 * "Your price, live" — the calculator in the home page hero.
 *
 * The rate grid, the night rule and the fleet all come from the server (the
 * admin can change them). The price shown here is indicative and
 * **recalculated server-side** before anything is stored or charged.
 */
export function PriceCalculator({
  dict,
  rates,
  night = NIGHT_RULE_OFF,
  vehicles = VEHICLES,
  bookingHref,
  initialFrom = 'cdg',
  initialTo = 'disney',
  variant = 'card',
}: {
  dict: Dictionary;
  rates: Record<string, readonly number[]>;
  night?: NightRule;
  vehicles?: readonly Vehicle[];
  bookingHref: string;
  initialFrom?: ZoneId;
  initialTo?: string;
  /** `hero` = slightly transparent, for the photo background on the home page. */
  variant?: 'card' | 'hero';
}) {
  const [from, setFrom] = useState<ZoneId>(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [pax, setPax] = useState(2);
  const [trip, setTrip] = useState<TripType>('ow');
  const [vehicleId, setVehicleId] = useState('saloon');
  const [time, setTime] = useState('');

  const calc = dict.home.calc;
  const fleet = activeVehicles(vehicles);

  // The chosen vehicle switches automatically when it becomes too small.
  const selected = fittingVehicle(pax, vehicleId, vehicles);
  const toIsZone = isZoneId(to);
  const samePlace = toIsZone && from === to;

  const options = useMemo(
    () =>
      fleet.map((vehicle) => {
        const fits = vehicle.maxPax >= pax;
        const price =
          fits && toIsZone
            ? quote({ from, to, pax, vehicleId: vehicle.id, trip, rates, time, night, vehicles })
            : null;
        return {
          id: vehicle.id,
          label: dict.vehicles[vehicle.id].short,
          desc: `${dict.vehicles[vehicle.id].pax} · ${dict.vehicles[vehicle.id].bags}`,
          fits,
          price,
          active: selected?.id === vehicle.id,
        };
      }),
    [from, to, toIsZone, pax, trip, rates, time, night, dict, selected, fleet, vehicles],
  );

  const breakdown =
    selected && toIsZone
      ? quoteBreakdown({ from, to, pax, vehicleId: selected.id, trip, rates, time, night, vehicles })
      : null;

  let summaryLabel: string;
  let priceLabel: string;

  if (samePlace) {
    summaryLabel = calc.samePlace;
    priceLabel = dict.common.quoteOnly;
  } else if (breakdown && selected) {
    summaryLabel = dict.vehicles[selected.id].label + (trip === 'rt' ? calc.roundTripSuffix : '');
    priceLabel = `${breakdown.totalEuros} €`;
  } else {
    summaryLabel = calc.custom;
    priceLabel = dict.common.quoteOnly;
  }

  const waMessage = fill(calc.whatsappMessage, {
    from: destinationLabel(dict, from),
    to: destinationLabel(dict, to),
    pax,
    vehicle: selected ? dict.vehicles[selected.id].label : '',
    trip: trip === 'rt' ? calc.roundTrip : calc.oneWay,
  });

  // Pre-fills the booking form with the current simulation.
  const bookingUrl = `${bookingHref}?from=${from}&to=${encodeURIComponent(to)}&pax=${pax}&trip=${trip}&vehicle=${
    selected?.id ?? ''
  }${time ? `&time=${encodeURIComponent(time)}` : ''}`;

  const selectClass =
    'box-border w-full min-w-0 max-w-full rounded-[10px] border border-line bg-cream p-[11px] font-sans text-sm text-ink';
  const labelClass = 'flex min-w-0 w-full flex-col gap-[5px] text-[13px] font-bold';

  return (
    <div
      className={`flex min-w-0 w-full max-w-full flex-col gap-4 overflow-hidden rounded-3xl border border-line p-5 shadow-lifted sm:p-7 ${
        variant === 'hero'
          ? 'bg-surface/85 backdrop-blur-md'
          : 'bg-surface'
      }`}
    >
      <div className="font-display text-[22px]">{calc.title}</div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <DestinationSelect
          label={calc.fromLabel}
          value={from}
          onChange={(value) => {
            if (isZoneId(value)) setFrom(value);
          }}
          dict={dict}
          selectClassName={selectClass}
        />

        <DestinationSelect
          label={calc.toLabel}
          value={to}
          onChange={setTo}
          dict={dict}
          includeTours
          selectClassName={selectClass}
        />

        <label className={labelClass}>
          {calc.paxLabel}
          <select
            className={selectClass}
            value={pax}
            onChange={(event) => setPax(Number(event.target.value))}
          >
            {Array.from({ length: MAX_PAX }, (_, index) => index + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          {calc.tripLabel}
          <select
            className={selectClass}
            value={trip}
            onChange={(event) => setTrip(event.target.value as TripType)}
          >
            <option value="ow">{calc.oneWay}</option>
            <option value="rt">{calc.roundTrip}</option>
          </select>
        </label>

        {/* Only worth asking for the time when it can change the price. */}
        {night.enabled ? (
          <label className={`${labelClass} sm:col-span-2`}>
            {dict.pricing.timeLabel}
            <input
              type="time"
              className={selectClass}
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </label>
        ) : null}
      </div>

      {fleet.length > 0 ? (
        <div className="flex flex-col gap-[5px]">
          <span className="text-[13px] font-bold">{calc.vehicleLabel}</span>
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={!option.fits}
                aria-pressed={option.active}
                onClick={() => setVehicleId(option.id)}
                className={`min-w-0 rounded-xl border-2 px-3 py-[9px] text-left font-sans ${
                  option.active ? 'border-brand bg-sand' : 'border-line bg-surface'
                } ${option.fits ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'}`}
              >
                <div className="flex min-w-0 items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-[13px] font-extrabold text-ink">{option.label}</span>
                  <span className="shrink-0 text-[13px] font-extrabold text-brand">
                    {!option.fits
                      ? '—'
                      : option.price != null
                        ? `${option.price} €`
                        : dict.common.quoteOnly}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-ink-mute">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        aria-live="polite"
        className="flex min-w-0 items-center justify-between gap-3 rounded-[14px] bg-sand px-4 py-4 sm:px-5"
      >
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-ink-soft">{summaryLabel}</div>
          <div className="font-display text-[30px] text-brand">{priceLabel}</div>
          {breakdown?.night ? (
            <div className="text-[12px] font-bold text-ink-mute">
              {fill(dict.pricing.nightLine, { percent: breakdown.nightPercent })} ·{' '}
              {breakdown.nightEuros} €
            </div>
          ) : null}
        </div>
        <div className="max-w-[150px] text-right text-xs leading-[1.5] text-ink-mute">
          {calc.priceNote}
        </div>
      </div>

      {night.enabled && !breakdown?.night ? (
        <p className="m-0 text-[12px] font-bold text-ink-mute">
          {fill(dict.pricing.nightNote, {
            percent: night.percent,
            start: night.start,
            end: night.end,
          })}
        </p>
      ) : null}

      <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row">
        <Link
          href={bookingUrl}
          className="flex-1 rounded-full bg-brand py-[13px] text-center text-[15px] font-extrabold text-surface no-underline hover:bg-brand-dark"
        >
          {calc.book}
        </Link>
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full border-2 border-brand bg-transparent py-[11px] text-center text-[15px] font-extrabold text-brand no-underline hover:bg-sand"
        >
          {calc.confirmWhatsapp}
        </a>
      </div>
    </div>
  );
}
