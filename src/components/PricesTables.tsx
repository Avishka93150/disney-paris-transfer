'use client';

import { useMemo, useState } from 'react';
import { fill } from '@/lib/i18n';
import type { Dictionary } from '@/lib/i18n/types';
import { ZONE_IDS, collapseTiers, type ZoneId } from '@/lib/prices';
import { whatsappLink } from '@/lib/site';

/** Rate tables filtered by departure point — from `project/Tarifs.dc.html`. */
export function PricesTables({
  dict,
  rates,
}: {
  dict: Dictionary;
  rates: Record<string, readonly number[]>;
}) {
  const [zone, setZone] = useState<ZoneId>('cdg');

  const tables = useMemo(() => {
    const result: { key: string; title: string; min: number; rows: ReturnType<typeof collapseTiers>; wa: string }[] =
      [];

    for (const [pair, rate] of Object.entries(rates)) {
      const [a, b] = pair.split('-');
      const other = a === zone ? b : b === zone ? a : null;
      if (!other || !(ZONE_IDS as readonly string[]).includes(other)) continue;

      const otherName = dict.zones[other as ZoneId];
      result.push({
        key: pair,
        title: `${dict.zones[zone]} ↔ ${otherName}`,
        min: Math.min(...rate),
        rows: collapseTiers(rate),
        wa: whatsappLink(fill(dict.prices.whatsappRoute, { from: dict.zones[zone], to: otherName })),
      });
    }

    return result.sort((x, y) => x.min - y.min);
  }, [zone, rates, dict]);

  return (
    <>
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <span className="text-[15px] font-extrabold">{dict.prices.departLabel}</span>
        {ZONE_IDS.map((id) => {
          const active = id === zone;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setZone(id)}
              className={`cursor-pointer rounded-full border px-[18px] py-[9px] font-sans text-sm font-extrabold hover:border-brand ${
                active ? 'border-brand bg-brand text-surface' : 'border-line bg-surface text-ink'
              }`}
            >
              {dict.zones[id]}
            </button>
          );
        })}
      </div>

      {tables.length === 0 ? (
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
              <div className="flex flex-wrap items-baseline justify-between gap-2.5">
                <div className="font-display text-[19px]">{table.title}</div>
                <div className="text-[13px] font-bold text-ink-mute">
                  {dict.common.from} <span className="text-base text-brand">{table.min} €</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-line">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-sand text-left">
                      <th className="px-3.5 py-[9px] font-extrabold">{dict.prices.colPax}</th>
                      <th className="px-3.5 py-[9px] font-extrabold">{dict.prices.colOneWay}</th>
                      <th className="px-3.5 py-[9px] font-extrabold">{dict.prices.colRoundTrip}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row) => (
                      <tr key={row.tier} className="border-t border-line-strong">
                        <td className="px-3.5 py-2 font-bold">{row.tier}</td>
                        <td className="px-3.5 py-2 font-extrabold text-brand">{row.ow} €</td>
                        <td className="px-3.5 py-2 font-bold text-ink-soft">{row.rt} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <a
                href={table.wa}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand py-[11px] text-center text-sm font-extrabold text-surface no-underline hover:bg-brand-dark"
              >
                {dict.prices.bookThis}
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
