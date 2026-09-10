'use client';

import { useActionState, useState } from 'react';
import { addRateAction, saveRatesAction, type ActionState } from '../actions';
import { TIER_LABELS } from '@/lib/prices';

type Row = { pair: string; label: string; prices: string[] };

export function RatesEditor({ rows, zones }: { rows: Row[]; zones: { id: string; label: string }[] }) {
  const [saveState, saveAction, saving] = useActionState<ActionState, FormData>(saveRatesAction, {});
  const [addState, addAction, adding] = useActionState<ActionState, FormData>(addRateAction, {});

  // Controlled inputs: React 19 resets uncontrolled fields after a server
  // action, which would bring the old prices back right after a successful save.
  const [values, setValues] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(rows.map((row) => [row.pair, row.prices])),
  );
  const [newPrices, setNewPrices] = useState<string[]>(() => Array.from({ length: 6 }, () => ''));

  function setCell(pair: string, index: number, value: string) {
    setValues((current) => {
      const next = [...(current[pair] ?? ['', '', '', '', '', ''])];
      next[index] = value;
      return { ...current, [pair]: next };
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <form action={saveAction} className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="m-0 mb-2 font-display text-xl">Rate grid</h2>
        <p className="m-0 mb-5 text-sm leading-[1.6] text-ink-soft">
          One row per connection, six boxes in passenger-tier order:{' '}
          <strong>1–3, 4, 5, 6, 7, 8</strong> passengers. Prices are in whole euros, one-way.
          Round trips are calculated automatically (×2). Clear every box on a row to remove
          the connection — it then becomes “on request”.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-2 pr-3 font-extrabold">Connection</th>
                {TIER_LABELS.map((tier) => (
                  <th key={tier} className="px-1 py-2 text-center font-extrabold">
                    {tier}
                    <span className="block text-[11px] font-bold text-ink-mute">pax</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.pair} className="border-b border-line-strong last:border-0">
                  <td className="py-2 pr-3">
                    <label htmlFor={`price:${row.pair}:0`} className="text-sm font-bold">
                      {row.label}
                    </label>
                    <input type="hidden" name="pair" value={row.pair} />
                  </td>
                  {TIER_LABELS.map((_, index) => (
                    <td key={index} className="px-1 py-1.5">
                      <input
                        id={`price:${row.pair}:${index}`}
                        name={`price:${row.pair}:${index}`}
                        value={values[row.pair]?.[index] ?? row.prices[index] ?? ''}
                        onChange={(event) => setCell(row.pair, index, event.target.value)}
                        inputMode="numeric"
                        className="field px-2 py-2 text-center font-mono text-[15px]"
                        aria-label={`${row.label}, ${TIER_LABELS[index]} passengers`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 cursor-pointer rounded-full border-none bg-brand px-6 py-3 font-sans text-[15px] font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save the grid'}
        </button>

        {saveState.error ? (
          <p role="alert" className="mb-0 mt-4 text-sm font-bold text-brand">
            {saveState.error}
          </p>
        ) : null}
        {saveState.success ? (
          <p role="status" className="mb-0 mt-4 text-sm font-bold text-success-text">
            {saveState.success}
          </p>
        ) : null}
      </form>

      <form action={addAction} className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="m-0 mb-4 font-display text-xl">Add a connection</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            From
            <select name="from" className="field" defaultValue="cdg">
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            To
            <select name="to" className="field" defaultValue="disney">
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mb-2 mt-5 text-[13px] font-bold">Prices (one-way, €)</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {TIER_LABELS.map((tier, index) => (
            <label key={tier} className="field-label text-center text-[12px]">
              {tier}
              <input
                name={`newPrice:${index}`}
                value={newPrices[index] ?? ''}
                onChange={(event) =>
                  setNewPrices((current) => {
                    const next = [...current];
                    next[index] = event.target.value;
                    return next;
                  })
                }
                inputMode="numeric"
                placeholder="0"
                className="field px-2 py-2 text-center font-mono"
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={adding}
          className="mt-5 cursor-pointer rounded-full border border-brand bg-surface px-6 py-3 font-sans text-[15px] font-extrabold text-brand hover:bg-sand disabled:opacity-60"
        >
          {adding ? 'Adding…' : 'Add'}
        </button>

        {addState.error ? (
          <p role="alert" className="mb-0 mt-4 text-sm font-bold text-brand">
            {addState.error}
          </p>
        ) : null}
        {addState.success ? (
          <p role="status" className="mb-0 mt-4 text-sm font-bold text-success-text">
            {addState.success}
          </p>
        ) : null}
      </form>
    </div>
  );
}
