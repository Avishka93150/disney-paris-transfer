'use client';

import { useActionState, useState } from 'react';
import { addRateAction, saveRatesAction, type ActionState } from '../actions';

type Row = { pair: string; label: string; prices: string };

export function RatesEditor({ rows, zones }: { rows: Row[]; zones: { id: string; label: string }[] }) {
  const [saveState, saveAction, saving] = useActionState<ActionState, FormData>(saveRatesAction, {});
  const [addState, addAction, adding] = useActionState<ActionState, FormData>(addRateAction, {});

  // Controlled inputs: React 19 resets uncontrolled fields after a server
  // action, which would bring the old prices back right after a successful save.
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((row) => [row.pair, row.prices])),
  );

  return (
    <div className="flex flex-col gap-8">
      <form action={saveAction} className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="m-0 mb-2 font-display text-xl">Rate grid</h2>
        <p className="m-0 mb-5 text-sm leading-[1.6] text-ink-soft">
          Six prices per connection, in euros, in passenger-tier order:{' '}
          <strong>1-3, 4, 5, 6, 7, 8</strong>. Round trips are calculated automatically (×2). Clear
          a line to remove the connection from the grid — it then becomes “on request”.
        </p>

        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.pair} className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_2fr]">
              <label htmlFor={`prices:${row.pair}`} className="text-sm font-bold">
                {row.label}
              </label>
              <input
                id={`prices:${row.pair}`}
                name={`prices:${row.pair}`}
                value={values[row.pair] ?? ''}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [row.pair]: event.target.value }))
                }
                inputMode="numeric"
                className="field font-mono"
              />
              <input type="hidden" name="pair" value={row.pair} />
            </div>
          ))}
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

        <div className="grid gap-4 sm:grid-cols-3">
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

          <label className="field-label">
            Prices (6 tiers)
            <input name="prices" placeholder="70 80 85 90 90 105" className="field font-mono" />
          </label>
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
