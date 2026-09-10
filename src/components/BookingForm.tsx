'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { DestinationSelect } from '@/components/DestinationSelect';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import {
  MAX_PAX,
  NIGHT_RULE_OFF,
  VEHICLES,
  activeVehicles,
  applyNight,
  isZoneId,
  quoteBreakdown,
  type NightRule,
  type TripType,
  type Vehicle,
  type ZoneId,
} from '@/lib/prices';
import { euros, findPackage, priceExtras, type Extra, type Package } from '@/lib/catalog';
import { fill } from '@/lib/i18n';

type Defaults = {
  from: ZoneId;
  to: string;
  pax: number;
  trip: TripType;
  vehicle: string;
  time: string;
  packageSlug?: string;
};

type PaymentOffer = { enabled: boolean; amountCents: number; mode: 'full' | 'deposit' };

type Result = { reference: string | null; quotedCents: number | null; payment: PaymentOffer | null };

/**
 * Quote form — carried over from `project/Reservation.dc.html` and wired to the
 * API. The estimate shown is indicative: the server recomputes the price from
 * its own grid, packages and add-ons before storing anything.
 */
export function BookingForm({
  locale,
  dict,
  rates,
  packages,
  extras,
  night = NIGHT_RULE_OFF,
  vehicles = VEHICLES,
  defaults,
}: {
  locale: Locale;
  dict: Dictionary;
  rates: Record<string, readonly number[]>;
  packages: Package[];
  extras: Extra[];
  night?: NightRule;
  vehicles?: readonly Vehicle[];
  defaults: Defaults;
}) {
  const b = dict.booking;

  const [from, setFrom] = useState<ZoneId>(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [pax, setPax] = useState(defaults.pax);
  const [trip, setTrip] = useState<TripType>(defaults.trip);
  const [vehicle, setVehicle] = useState(defaults.vehicle);
  const [time, setTime] = useState(defaults.time);
  const [packageSlug, setPackageSlug] = useState(defaults.packageSlug ?? '');
  const [chosenExtras, setChosenExtras] = useState<Record<string, number>>({});

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [payPending, setPayPending] = useState(false);
  const [step, setStep] = useState(defaults.packageSlug ? 1 : 0);

  // A package that no longer covers the group falls away rather than quoting a
  // price the driver cannot honour.
  const selectedPackage = useMemo(() => {
    const found = findPackage(packages, packageSlug);
    return found && found.maxPax >= pax ? found : undefined;
  }, [packages, packageSlug, pax]);

  /**
   * Mirrors `serverQuote()` in `src/lib/booking.ts`. Kept in cents so the two
   * agree to the cent — the customer must not see 149 € here and 150 € in the
   * confirmation email.
   */
  const estimate = useMemo(() => {
    const extrasPriced = priceExtras(extras, chosenExtras);

    let baseCents: number | null = null;
    let nightCents = 0;
    let nightPercent = 0;

    if (selectedPackage) {
      const applied = selectedPackage.nightSurcharge
        ? applyNight(selectedPackage.priceCents, time, night)
        : { total: selectedPackage.priceCents, surcharge: 0, night: false };

      baseCents = selectedPackage.priceCents;
      nightCents = applied.surcharge;
      nightPercent = applied.night ? night.percent : 0;
    } else if (vehicle !== 'advise' && isZoneId(to)) {
      const breakdown = quoteBreakdown({
        from,
        to,
        pax,
        vehicleId: vehicle,
        trip,
        rates,
        time,
        night,
        vehicles,
      });
      if (breakdown) {
        baseCents = breakdown.baseEuros * 100;
        nightCents = breakdown.nightEuros * 100;
        nightPercent = breakdown.nightPercent;
      }
    }

    if (baseCents == null) return null;

    return {
      baseCents,
      nightCents,
      nightPercent,
      extraLines: extrasPriced.lines,
      totalCents: baseCents + nightCents + extrasPriced.totalCents,
    };
  }, [selectedPackage, vehicle, from, to, pax, trip, rates, time, night, extras, chosenExtras, vehicles]);

  function setExtraQty(slug: string, qty: number) {
    setChosenExtras((current) => ({ ...current, [slug]: qty }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 2) {
      if (!(isZoneId(to) && from === to)) setStep((current) => Math.min(2, current + 1));
      return;
    }
    setStatus('sending');

    const form = new FormData(event.currentTarget);
    const payload = {
      locale,
      from,
      to,
      trip,
      pax,
      vehicle,
      bags: Number(form.get('bags') ?? 0),
      childSeats: Number(form.get('childSeats') ?? 0),
      date: String(form.get('date') ?? ''),
      time,
      flight: String(form.get('flight') ?? ''),
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      message: String(form.get('message') ?? ''),
      packageSlug: selectedPackage?.slug ?? '',
      extras: chosenExtras,
      website: String(form.get('website') ?? ''),
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean } & Partial<Result>;

      if (!response.ok || !data.ok) {
        setStatus('error');
        return;
      }

      setResult({
        reference: data.reference ?? null,
        quotedCents: data.quotedCents ?? null,
        payment: data.payment ?? null,
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  async function startPayment() {
    if (!result?.reference) return;
    setPayPending(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: result.reference }),
      });
      const data = (await response.json()) as { ok: boolean; url?: string };

      if (data.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setPayPending(false);
    } catch {
      setPayPending(false);
    }
  }

  if (status === 'sent' && result) {
    return (
      <div className="flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-8">
        <div className="rounded-xl border border-success-border bg-whatsapp px-[18px] py-3.5 text-[15px] font-bold text-success-text">
          ✓ {b.success} {result.reference ? <span className="font-mono">{result.reference}</span> : null}
        </div>
        <p className="m-0 text-[15px] leading-[1.7] text-ink-soft">{b.successLead}</p>

        {result.payment?.enabled ? (
          <div className="rounded-2xl bg-sand p-6">
            <div className="mb-2 text-base font-extrabold">{b.payTitle}</div>
            <p className="m-0 mb-4 text-sm leading-[1.6] text-ink-soft">{b.payLead}</p>
            <button
              type="button"
              onClick={startPayment}
              disabled={payPending}
              className="cursor-pointer rounded-full border-none bg-brand px-7 py-3.5 font-sans text-base font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
            >
              {payPending
                ? b.submitting
                : fill(b.payCta, { price: Math.round(result.payment.amountCents / 100) })}
            </button>
            <p className="mb-0 mt-3 text-[13px] text-ink-mute">{b.paySkip}</p>
          </div>
        ) : null}

        <p className="m-0 text-[13px] text-ink-faint">{b.note}</p>
      </div>
    );
  }

  const activePackages = packages.filter((item) => item.active);
  const activeExtras = extras.filter((item) => item.active);
  const steps = [b.stepJourney, b.stepParty, b.stepContact];
  const trust = [
    { icon: '👶', text: b.trustSeats },
    { icon: '💶', text: b.trustFixed },
    { icon: '🕑', text: b.trustHours },
    { icon: '✓', text: b.noCard },
  ];
  const samePlace = isZoneId(to) && from === to;

  const estimateBox = (
    <div aria-live="polite" className="rounded-[14px] bg-sand px-5 py-4">
      <div className="mb-2 text-[13px] font-extrabold uppercase tracking-[0.8px] text-ink-mute">
        {b.liveTitle}
      </div>
      {estimate ? (
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-ink-soft">
              {selectedPackage ? selectedPackage.name : dict.pricing.baseLine}
            </span>
            <span className="font-bold">{euros(estimate.baseCents)}</span>
          </div>
          {estimate.nightCents > 0 ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-ink-soft">
                {fill(dict.pricing.nightLine, { percent: estimate.nightPercent })}
              </span>
              <span className="font-bold">+ {euros(estimate.nightCents)}</span>
            </div>
          ) : null}
          {estimate.extraLines.map((line) => (
            <div key={line.slug} className="flex items-center justify-between gap-4">
              <span className="text-ink-soft">
                {line.label}
                {line.qty > 1 ? ` × ${line.qty}` : ''}
              </span>
              <span className="font-bold">+ {euros(line.totalCents)}</span>
            </div>
          ))}
          <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line-strong pt-2">
            <span className="text-[13px] font-bold text-ink-soft">{b.estimateLabel}</span>
            <span className="font-display text-[26px] text-brand">{euros(estimate.totalCents)}</span>
          </div>
        </div>
      ) : (
        <span className="text-[13px] font-bold text-ink-soft">{b.estimateCustom}</span>
      )}
      {night.enabled && (!estimate || estimate.nightCents === 0) ? (
        <p className="mb-0 mt-3 text-[12px] font-bold text-ink-mute">
          {fill(dict.pricing.nightNote, {
            percent: night.percent,
            start: night.start,
            end: night.end,
          })}
        </p>
      ) : null}
    </div>
  );

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-6 shadow-lifted sm:p-8"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {trust.map((item) => (
          <div
            key={item.text}
            className="rounded-[14px] bg-sand px-3 py-2.5 text-center text-[12px] font-extrabold leading-snug text-ink"
          >
            <span className="mb-1 block text-base">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      <ol className="m-0 flex list-none gap-2 p-0">
        {steps.map((label, index) => (
          <li key={label} className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className={`h-1.5 rounded-full ${index <= step ? 'bg-brand' : 'bg-line'}`} aria-hidden />
            <span className={`text-[12px] font-extrabold ${index === step ? 'text-brand' : 'text-ink-mute'}`}>
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      <div className={step === 0 ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}>
        <DestinationSelect
          label={b.fromLabel}
          name="from"
          value={from}
          onChange={(value) => {
            if (isZoneId(value)) setFrom(value);
          }}
          dict={dict}
        />
        <DestinationSelect
          label={b.toLabel}
          name="to"
          value={to}
          onChange={setTo}
          dict={dict}
          includeTours
        />
        <label className="field-label">
          {b.tripLabel}
          <select
            name="trip"
            className="field"
            value={trip}
            onChange={(event) => setTrip(event.target.value as TripType)}
          >
            <option value="ow">{b.oneWay}</option>
            <option value="rt">{b.roundTrip}</option>
          </select>
        </label>
        <label className="field-label">
          {b.dateLabel}
          <input type="date" name="date" className="field" />
        </label>
        <label className="field-label">
          {b.timeLabel}
          <input
            type="time"
            name="time"
            className="field"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </label>
        <label className="field-label">
          {b.flightLabel}
          <input type="text" name="flight" placeholder={b.flightPlaceholder} className="field" />
        </label>
      </div>

      <div className={step === 1 ? 'flex flex-col gap-5' : 'hidden'}>
        {activePackages.length > 0 ? (
          <div className="rounded-[14px] bg-sand p-5">
            <label className="field-label">
              {dict.pricing.packageLabel}
              <select
                className="field"
                value={packageSlug}
                onChange={(event) => setPackageSlug(event.target.value)}
              >
                <option value="">{dict.pricing.packageNone}</option>
                {activePackages.map((item) => (
                  <option key={item.slug} value={item.slug} disabled={item.maxPax < pax}>
                    {item.name} — {euros(item.priceCents)}
                  </option>
                ))}
              </select>
            </label>
            {selectedPackage ? (
              <p className="mb-0 mt-3 text-[13px] leading-[1.6] text-ink-soft">
                {selectedPackage.description}{' '}
                <span className="font-bold">
                  {fill(dict.pricing.packageUpTo, { pax: selectedPackage.maxPax })}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            {b.paxLabel}
            <select
              name="pax"
              className="field"
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
          <label className="field-label">
            {b.bagsLabel}
            <select name="bags" className="field" defaultValue="0">
              {b.bagOptions.map((option, index) => (
                <option key={option} value={index}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            {b.vehicleLabel}
            <select
              name="vehicle"
              className="field"
              value={vehicle}
              onChange={(event) => setVehicle(event.target.value)}
            >
              {activeVehicles(vehicles).map((item) => (
                <option key={item.id} value={item.id}>
                  {dict.vehicles[item.id].label}
                </option>
              ))}
              <option value="advise">{b.vehicleAdvise}</option>
            </select>
          </label>
          <label className="field-label">
            {b.seatsLabel}
            <select name="childSeats" className="field" defaultValue="0">
              {b.seatOptions.map((option, index) => (
                <option key={option} value={index}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {activeExtras.length > 0 ? (
          <fieldset className="m-0 rounded-[14px] border border-line p-5">
            <legend className="px-2 text-[15px] font-extrabold">{dict.pricing.extrasTitle}</legend>
            <p className="m-0 mb-4 text-[13px] text-ink-soft">{dict.pricing.extrasLead}</p>
            <div className="flex flex-col gap-3">
              {activeExtras.map((extra) => {
                const qty = chosenExtras[extra.slug] ?? 0;
                const price = `${euros(extra.priceCents)}${
                  extra.perUnit ? ` ${dict.pricing.extrasEach}` : ''
                }`;
                return (
                  <div key={extra.slug} className="flex flex-wrap items-center gap-3 text-sm">
                    {extra.maxQty === 1 ? (
                      <label className="flex cursor-pointer items-center gap-2 font-bold">
                        <input
                          type="checkbox"
                          checked={qty > 0}
                          onChange={(event) => setExtraQty(extra.slug, event.target.checked ? 1 : 0)}
                          className="h-4 w-4 accent-[#B4552D]"
                        />
                        {extra.label}
                      </label>
                    ) : (
                      <label className="flex items-center gap-2 font-bold">
                        <select
                          value={qty}
                          onChange={(event) => setExtraQty(extra.slug, Number(event.target.value))}
                          className="field w-[70px] py-1"
                        >
                          {Array.from({ length: extra.maxQty + 1 }, (_, index) => index).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                        {extra.label}
                      </label>
                    )}
                    <span className="ml-auto font-extrabold text-brand">{price}</span>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ) : null}
      </div>

      <div className={step === 2 ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}>
        <label className="field-label">
          {b.nameLabel}
          <input
            type="text"
            name="name"
            required={step === 2}
            minLength={2}
            placeholder={b.namePlaceholder}
            className="field"
          />
        </label>
        <label className="field-label">
          {b.emailLabel}
          <input
            type="email"
            name="email"
            required={step === 2}
            placeholder={b.emailPlaceholder}
            className="field"
          />
        </label>
        <label className="field-label sm:col-span-2">
          {b.phoneLabel}
          <input
            type="tel"
            name="phone"
            required={step === 2}
            minLength={6}
            placeholder={b.phonePlaceholder}
            className="field"
          />
        </label>
        <label className="field-label sm:col-span-2">
          {b.messageLabel}
          <textarea name="message" rows={3} className="field resize-y" />
        </label>
      </div>

      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {samePlace && step === 0 ? (
        <p role="alert" className="m-0 text-[14px] font-bold text-brand">
          {dict.home.calc.samePlace}
        </p>
      ) : null}

      {estimateBox}

      <div className="flex flex-col gap-2.5 sm:flex-row">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            className="cursor-pointer rounded-full border-2 border-brand bg-surface px-6 py-[13px] font-sans text-[16px] font-extrabold text-brand hover:bg-sand"
          >
            {b.back}
          </button>
        ) : null}
        {step < 2 ? (
          <button
            type="button"
            disabled={samePlace}
            onClick={() => setStep((current) => current + 1)}
            className="flex-1 cursor-pointer rounded-full border-none bg-brand px-6 py-[15px] font-sans text-[17px] font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
          >
            {b.next}
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex-1 cursor-pointer rounded-full border-none bg-brand px-6 py-[15px] font-sans text-[17px] font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
          >
            {status === 'sending' ? b.submitting : b.submit}
          </button>
        )}
      </div>

      {status === 'error' ? (
        <p role="alert" className="m-0 text-[15px] font-bold text-brand">
          {b.error}
        </p>
      ) : null}

      <p className="m-0 text-[13px] text-ink-faint">{b.note}</p>
    </form>
  );
}
