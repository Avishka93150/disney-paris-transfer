import { euros, findPackage, priceExtras, type Extra, type ExtraSelection, type Package } from './catalog';
import { fill } from './i18n/fill';
import {
  applyNight,
  isZoneId,
  quoteBreakdown,
  type NightRule,
  type TripType,
  type Vehicle,
} from './prices';

/**
 * The live estimate on the booking form.
 *
 * **Mirrors `serverQuote()` in `src/lib/booking.ts` deliberately**, in cents,
 * so the visitor sees the same figure the server will store — the customer
 * must not see 149 € here and 150 € in the confirmation email. If you change
 * one, change the other.
 *
 * Pure and client-safe, like `calculator.ts`: the Astro component renders the
 * initial estimate into the HTML, the browser script re-renders it on every
 * change through the same `renderEstimateBox()`.
 */

export type EstimateInput = {
  packages: readonly Package[];
  packageSlug: string;
  vehicle: string;
  from: string;
  to: string;
  pax: number;
  trip: TripType;
  rates: Record<string, readonly number[]>;
  time: string;
  night: NightRule;
  vehicles: readonly Vehicle[];
  extras: readonly Extra[];
  chosenExtras: Record<string, number>;
};

export type Estimate = {
  packageName: string | null;
  baseCents: number;
  nightCents: number;
  nightPercent: number;
  extraLines: ExtraSelection[];
  totalCents: number;
};

export type EstimateLabels = {
  liveTitle: string;
  baseLine: string;
  nightLine: string;
  nightNote: string;
  estimateLabel: string;
  estimateCustom: string;
};

/**
 * A package that no longer covers the group falls away rather than quoting a
 * price the driver cannot honour.
 */
export function selectedPackage(
  packages: readonly Package[],
  slug: string,
  pax: number,
): Package | undefined {
  const found = findPackage(packages, slug);
  return found && found.active && found.maxPax >= pax ? found : undefined;
}

export function computeEstimate(input: EstimateInput): Estimate | null {
  const pack = selectedPackage(input.packages, input.packageSlug, input.pax);
  const extrasPriced = priceExtras(input.extras, input.chosenExtras);

  let baseCents: number | null = null;
  let nightCents = 0;
  let nightPercent = 0;

  if (pack) {
    const applied = pack.nightSurcharge
      ? applyNight(pack.priceCents, input.time, input.night)
      : { total: pack.priceCents, surcharge: 0, night: false };

    baseCents = pack.priceCents;
    nightCents = applied.surcharge;
    nightPercent = applied.night ? input.night.percent : 0;
  } else if (input.vehicle !== 'advise' && isZoneId(input.to)) {
    const breakdown = quoteBreakdown({
      from: input.from,
      to: input.to,
      pax: input.pax,
      vehicleId: input.vehicle,
      trip: input.trip,
      rates: input.rates,
      time: input.time,
      night: input.night,
      vehicles: input.vehicles,
    });
    if (breakdown) {
      baseCents = breakdown.baseEuros * 100;
      nightCents = breakdown.nightEuros * 100;
      nightPercent = breakdown.nightPercent;
    }
  }

  if (baseCents == null) return null;

  return {
    packageName: pack?.name ?? null,
    baseCents,
    nightCents,
    nightPercent,
    extraLines: extrasPriced.lines,
    totalCents: baseCents + nightCents + extrasPriced.totalCents,
  };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function line(label: string, value: string): string {
  return `<div class="flex items-center justify-between gap-4"><span class="text-ink-soft">${escapeHtml(label)}</span><span class="font-bold">${escapeHtml(value)}</span></div>`;
}

/** Inner HTML of the estimate box — used verbatim by the server and the browser. */
export function renderEstimateBox(
  estimate: Estimate | null,
  labels: EstimateLabels,
  night: NightRule,
): string {
  let html = `<div class="mb-2 text-[13px] font-extrabold uppercase tracking-[0.8px] text-ink-mute">${escapeHtml(labels.liveTitle)}</div>`;

  if (estimate) {
    const rows: string[] = [line(estimate.packageName ?? labels.baseLine, euros(estimate.baseCents))];
    if (estimate.nightCents > 0) {
      rows.push(line(fill(labels.nightLine, { percent: estimate.nightPercent }), `+ ${euros(estimate.nightCents)}`));
    }
    for (const extra of estimate.extraLines) {
      rows.push(line(extra.qty > 1 ? `${extra.label} × ${extra.qty}` : extra.label, `+ ${euros(extra.totalCents)}`));
    }
    rows.push(
      `<div class="mt-1 flex items-baseline justify-between gap-4 border-t border-line-strong pt-2"><span class="text-[13px] font-bold text-ink-soft">${escapeHtml(labels.estimateLabel)}</span><span class="font-display text-[26px] text-brand">${escapeHtml(euros(estimate.totalCents))}</span></div>`,
    );
    html += `<div class="flex flex-col gap-1.5 text-sm">${rows.join('')}</div>`;
  } else {
    html += `<span class="text-[13px] font-bold text-ink-soft">${escapeHtml(labels.estimateCustom)}</span>`;
  }

  if (night.enabled && (!estimate || estimate.nightCents === 0)) {
    html += `<p class="mb-0 mt-3 text-[12px] font-bold text-ink-mute">${escapeHtml(
      fill(labels.nightNote, { percent: night.percent, start: night.start, end: night.end }),
    )}</p>`;
  }

  return html;
}
