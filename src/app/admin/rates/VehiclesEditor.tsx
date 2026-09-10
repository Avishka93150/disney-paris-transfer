'use client';

import { useActionState, useMemo, useState } from 'react';
import { saveVehiclesAction, type ActionState } from '../actions';
import type { VehicleId } from '@/lib/prices';

type FleetRow = {
  id: VehicleId;
  label: string;
  pax: string;
  bags: string;
  active: boolean;
  mult: string;
};

export function VehiclesEditor({ vehicles }: { vehicles: FleetRow[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveVehiclesAction, {});
  const [rows, setRows] = useState(vehicles);

  const exampleBase = 80;

  const preview = useMemo(
    () =>
      rows.map((row) => {
        const mult = Number.parseFloat(row.mult.replace(',', '.'));
        const price = Number.isFinite(mult) ? Math.round(exampleBase * mult) : null;
        return { id: row.id, price };
      }),
    [rows],
  );

  function patch(id: VehicleId, update: Partial<Pick<FleetRow, 'active' | 'mult'>>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...update } : row)));
  }

  return (
    <form action={action} className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="m-0 mb-2 font-display text-xl">Vehicles</h2>
      <p className="m-0 mb-5 text-sm leading-[1.6] text-ink-soft">
        Untick a vehicle to hide it from the calculator, the booking form and the fleet
        section. The price factor multiplies the grid: <strong>1.00</strong> is the listed
        fare, <strong>1.10</strong> is +10&nbsp;%, <strong>1.50</strong> is +50&nbsp;%.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-2 pr-3 font-extrabold">Vehicle</th>
              <th className="px-2 py-2 text-center font-extrabold">Offered</th>
              <th className="px-2 py-2 font-extrabold">Price factor</th>
              <th className="px-2 py-2 text-right font-extrabold">€{exampleBase} becomes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const example = preview.find((item) => item.id === row.id)?.price;
              return (
                <tr key={row.id} className="border-b border-line-strong last:border-0">
                  <td className="py-3 pr-3">
                    <div className="font-bold">{row.label}</div>
                    <div className="text-[12px] font-bold text-ink-mute">
                      {row.pax} · {row.bags}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      name={`vehicleActive:${row.id}`}
                      checked={row.active}
                      onChange={(event) => patch(row.id, { active: event.target.checked })}
                      className="h-5 w-5 accent-[#B4552D]"
                      aria-label={`Offer ${row.label}`}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <input
                      name={`vehicleMult:${row.id}`}
                      value={row.mult}
                      onChange={(event) => patch(row.id, { mult: event.target.value })}
                      inputMode="decimal"
                      className="field max-w-[120px] px-3 py-2 font-mono"
                      aria-label={`${row.label} price factor`}
                    />
                  </td>
                  <td className="px-2 py-3 text-right font-extrabold text-brand">
                    {example != null ? `${example} €` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 cursor-pointer rounded-full border-none bg-brand px-6 py-3 font-sans text-[15px] font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save vehicles'}
      </button>

      {state.error ? (
        <p role="alert" className="mb-0 mt-4 text-sm font-bold text-brand">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="mb-0 mt-4 text-sm font-bold text-success-text">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
