'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DestinationIcon } from '@/components/DestinationIcon';
import { RateTable } from '@/components/RateTable';
import type { Dictionary } from '@/lib/i18n/types';
import {
  TOUR_IDS,
  ZONE_IDS,
  ZONE_KIND_ORDER,
  collapseTiers,
  tourDestValue,
  zonesOfKind,
  type ZoneId,
} from '@/lib/prices';

type Filter = ZoneId | 'tours';

/** Rate tables filtered by departure point — from `project/Tarifs.dc.html`. */
export function PricesTables({
  dict,
  rates,
  bookingHref,
}: {
  dict: Dictionary;
  rates: Record<string, readonly number[]>;
  bookingHref: string;
}) {
  const [filter, setFilter] = useState<Filter>('cdg');

  const tables = useMemo(() => {
    if (filter === 'tours') return [];

    const zone = filter;
    const result: {
      key: string;
      title: string;
      min: number;
      other: string;
      rows: ReturnType<typeof collapseTiers>;
    }[] = [];

    for (const [pair, rate] of Object.entries(rates)) {
      const [a, b] = pair.split('-');
      const other = a === zone ? b : b === zone ? a : null;
      if (!other || !(ZONE_IDS as readonly string[]).includes(other)) continue;

      const otherName = dict.zones[other as ZoneId];
      result.push({
        key: pair,
        title: `${dict.zones[zone]} ↔ ${otherName}`,
        min: Math.min(...rate),
        other,
        rows: collapseTiers(rate),
      });
    }

    return result.sort((x, y) => x.min - y.min);
  }, [filter, rates, dict]);

  function bookUrl(to: string, extra: Record<string, string | number> = {}) {
    const params = new URLSearchParams({ from: filter === 'tours' ? 'paris' : filter, to });
    for (const [key, value] of Object.entries(extra)) params.set(key, String(value));
    return `${bookingHref}?${params.toString()}`;
  }

  return (
    <>
      <div className="mb-7 flex flex-col gap-5">
        <span className="text-[15px] font-extrabold">{dict.prices.departLabel}</span>
        {ZONE_KIND_ORDER.map((kind) => (
          <div key={kind} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[13px] font-extrabold text-ink-soft">
              <span className="text-brand">
                <DestinationIcon kind={kind} />
              </span>
              {dict.destinationKinds[kind]}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {zonesOfKind(kind).map((id) => {
                const active = filter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(id)}
                    className={`cursor-pointer rounded-full border px-[18px] py-[9px] font-sans text-sm font-extrabold hover:border-brand ${
                      active ? 'border-brand bg-brand text-surface' : 'border-line bg-surface text-ink'
                    }`}
                  >
                    {dict.zones[id]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[13px] font-extrabold text-ink-soft">
            <span className="text-brand">
              <DestinationIcon kind="tours" />
            </span>
            {dict.destinationKinds.tours}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-pressed={filter === 'tours'}
              onClick={() => setFilter('tours')}
              className={`cursor-pointer rounded-full border px-[18px] py-[9px] font-sans text-sm font-extrabold hover:border-brand ${
                filter === 'tours'
                  ? 'border-brand bg-brand text-surface'
                  : 'border-line bg-surface text-ink'
              }`}
            >
              {dict.destinationKinds.tours}
            </button>
          </div>
        </div>
      </div>

      {filter === 'tours' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOUR_IDS.map((id) => {
            const tour = dict.tours[id];
            return (
              <Link
                key={id}
                href={bookUrl(tourDestValue(id))}
                className="flex flex-col gap-2 rounded-2xl border border-line bg-cream p-5 text-ink no-underline hover:border-brand hover:shadow-card"
              >
                <div className="flex items-baseline justify-between gap-2.5">
                  <div className="text-base font-extrabold">{tour.name}</div>
                  <div className="whitespace-nowrap rounded-full bg-sand px-2.5 py-[3px] text-xs font-extrabold text-brand">
                    {tour.dur}
                  </div>
                </div>
                <p className="m-0 text-sm leading-[1.6] text-ink-soft">{tour.desc}</p>
                <span className="mt-auto text-[13px] font-extrabold text-brand">
                  {dict.prices.tourCta}
                </span>
              </Link>
            );
          })}
        </div>
      ) : tables.length === 0 ? (
        <p className="rounded-[18px] border border-line bg-surface p-6 text-[15px] text-ink-soft">
          {dict.prices.noRoute}
        </p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {tables.map((table) => (
            <div
              key={table.key}
              className="flex flex-col gap-3.5 rounded-[18px] border border-line bg-surface p-6"
            >
              <Link
                href={bookUrl(table.other)}
                className="flex flex-wrap items-baseline justify-between gap-2.5 text-ink no-underline hover:text-brand"
              >
                <div className="font-display text-[19px]">{table.title}</div>
                <div className="text-[13px] font-bold text-ink-mute">
                  {dict.common.from} <span className="text-base text-brand">{table.min} €</span>
                </div>
              </Link>

              <RateTable
                dict={dict}
                rows={table.rows}
                caption={table.title}
                hrefFor={(row, trip) => bookUrl(table.other, { pax: row.pax, trip })}
              />

              <Link
                href={bookUrl(table.other)}
                className="rounded-full bg-brand py-[11px] text-center text-sm font-extrabold text-surface no-underline hover:bg-brand-dark"
              >
                {dict.prices.bookThis}
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
