'use client';

import { useActionState, useState } from 'react';
import { updateBookingAction, type ActionState } from '../../actions';

export function BookingEditor({
  id,
  status,
  priceEuros,
  notes,
}: {
  id: number;
  status: string;
  priceEuros: string;
  notes: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateBookingAction, {});

  // Controlled inputs: React 19 resets uncontrolled fields after a server
  // action, which would show the old values after a save.
  const [form, setForm] = useState({ status, price: priceEuros, notes });
  const update = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }));

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
      <input type="hidden" name="id" value={id} />

      <label className="field-label">
        Status
        <select
          name="status"
          value={form.status}
          onChange={(event) => update({ status: event.target.value })}
          className="field"
        >
          <option value="new">New</option>
          <option value="quoted">Quoted</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>

      <label className="field-label">
        Confirmed price (€)
        <input
          type="text"
          inputMode="decimal"
          name="price"
          value={form.price}
          onChange={(event) => update({ price: event.target.value })}
          placeholder="leave empty for “on request”"
          className="field"
        />
      </label>

      <label className="field-label">
        Internal notes
        <textarea
          name="notes"
          rows={4}
          value={form.notes}
          onChange={(event) => update({ notes: event.target.value })}
          className="field resize-y"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-full border-none bg-brand px-6 py-3 font-sans text-[15px] font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save'}
      </button>

      {state.error ? (
        <p role="alert" className="m-0 text-sm font-bold text-brand">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="m-0 text-sm font-bold text-success-text">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
