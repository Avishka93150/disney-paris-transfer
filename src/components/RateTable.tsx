import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n/types';

export type RateRow = { tier: string; ow: number; rt: number; pax: number };

/**
 * Fare table where the whole row is a booking link (passengers + one-way),
 * and the return price books the same route as a round trip.
 */
export function RateTable({
  dict,
  rows,
  hrefFor,
  caption,
}: {
  dict: Dictionary;
  rows: RateRow[];
  hrefFor: (row: RateRow, trip: 'ow' | 'rt') => string;
  caption?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full border-collapse text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="bg-sand text-left">
            <th className="px-3.5 py-[9px] font-extrabold">{dict.prices.colPax}</th>
            <th className="px-3.5 py-[9px] font-extrabold">{dict.prices.colOneWay}</th>
            <th className="px-3.5 py-[9px] font-extrabold">{dict.prices.colRoundTrip}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const oneWay = hrefFor(row, 'ow');
            const roundTrip = hrefFor(row, 'rt');
            const oneWayLabel = `${dict.prices.bookThis}: ${caption ? `${caption}, ` : ''}${row.tier}, ${dict.prices.colOneWay} ${row.ow} €`;
            const roundTripLabel = `${dict.prices.bookThis}: ${caption ? `${caption}, ` : ''}${row.tier}, ${dict.prices.colRoundTrip} ${row.rt} €`;

            return (
              <tr key={row.tier} className="border-t border-line-strong hover:bg-sand">
                <td className="p-0">
                  <Link
                    href={oneWay}
                    aria-label={oneWayLabel}
                    className="block cursor-pointer px-3.5 py-2.5 font-bold text-ink no-underline"
                  >
                    {row.tier}
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={oneWay}
                    aria-label={oneWayLabel}
                    className="block cursor-pointer px-3.5 py-2.5 font-extrabold text-brand no-underline hover:underline"
                  >
                    {row.ow} €
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={roundTrip}
                    aria-label={roundTripLabel}
                    className="block cursor-pointer px-3.5 py-2.5 font-bold text-ink-soft no-underline hover:text-brand hover:underline"
                  >
                    {row.rt} €
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
