'use client';

import { useActionState, useState } from 'react';
import {
  deleteExtraAction,
  deletePackageAction,
  saveExtraAction,
  savePackageAction,
  type ActionState,
} from '../actions';
import type { Extra, Package } from '@/lib/catalog';

/**
 * Packages and add-ons share one screen because the admin thinks of them
 * together ("what can I sell on top of a transfer?"), but they are two
 * independent lists with their own actions.
 *
 * Every row is its own `<form>`: HTML forbids nesting, and a delete button
 * needs a form of its own next to the save form.
 */

function Feedback({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p role="alert" className="m-0 text-sm font-bold text-brand">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p role="status" className="m-0 text-sm font-bold text-success-text">
        {state.success}
      </p>
    );
  }
  return null;
}

function DeleteForm({
  id,
  what,
  action,
}: {
  id: number;
  what: string;
  action: typeof deletePackageAction;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!confirm(`Delete “${what}”? This cannot be undone.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-full border border-line bg-cream px-4 py-2 font-sans text-[13px] font-bold text-ink-soft hover:border-brand hover:text-brand disabled:opacity-60"
      >
        {pending ? 'Deleting…' : 'Delete'}
      </button>
      <Feedback state={state} />
    </form>
  );
}

/* ── Packages ────────────────────────────────────────────────────────────── */

const BLANK_PACKAGE = {
  name: '',
  description: '',
  price: '',
  maxPax: '8',
  nightSurcharge: true,
  active: true,
  sortOrder: '0',
};

function PackageForm({ item }: { item?: Package }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(savePackageAction, {});

  // Controlled inputs: React 19 resets uncontrolled fields after a server
  // action, which would blank the row the admin just saved.
  const [form, setForm] = useState(
    item
      ? {
          name: item.name,
          description: item.description,
          price: String(item.priceCents / 100),
          maxPax: String(item.maxPax),
          nightSurcharge: item.nightSurcharge,
          active: item.active,
          sortOrder: String(item.sortOrder),
        }
      : BLANK_PACKAGE,
  );
  const set = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }));

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <form action={formAction} className="flex flex-col gap-4">
        {item ? <input type="hidden" name="id" value={item.id} /> : null}

        <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
          <label className="field-label">
            Package name
            <input
              name="name"
              required
              minLength={2}
              placeholder="CDG ⇄ Disneyland round trip"
              value={form.name}
              onChange={(event) => set({ name: event.target.value })}
              className="field"
            />
          </label>

          <label className="field-label">
            Price (€)
            <input
              name="price"
              required
              inputMode="decimal"
              placeholder="150"
              value={form.price}
              onChange={(event) => set({ price: event.target.value })}
              className="field"
            />
          </label>

          <label className="field-label">
            Up to … passengers
            <input
              type="number"
              name="maxPax"
              min={1}
              max={8}
              value={form.maxPax}
              onChange={(event) => set({ maxPax: event.target.value })}
              className="field"
            />
          </label>
        </div>

        <label className="field-label">
          Description shown to the customer
          <textarea
            name="description"
            rows={2}
            placeholder="Return transfer, 60 min free waiting on arrival, child seats included."
            value={form.description}
            onChange={(event) => set({ description: event.target.value })}
            className="field resize-y"
          />
        </label>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={(event) => set({ active: event.target.checked })}
              className="h-4 w-4 accent-[#B4552D]"
            />
            Visible on the site
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              name="nightSurcharge"
              checked={form.nightSurcharge}
              onChange={(event) => set({ nightSurcharge: event.target.checked })}
              className="h-4 w-4 accent-[#B4552D]"
            />
            Night supplement applies
          </label>

          <label className="flex items-center gap-2 text-sm font-bold">
            Order
            <input
              type="number"
              name="sortOrder"
              min={0}
              max={999}
              value={form.sortOrder}
              onChange={(event) => set({ sortOrder: event.target.value })}
              className="field w-[80px]"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className={`cursor-pointer rounded-full px-6 py-3 font-sans text-[15px] font-extrabold disabled:opacity-60 ${
              item
                ? 'border border-brand bg-surface text-brand hover:bg-sand'
                : 'border-none bg-brand text-surface hover:bg-brand-dark'
            }`}
          >
            {pending ? 'Saving…' : item ? 'Save' : 'Create the package'}
          </button>
          <Feedback state={state} />
        </div>
      </form>

      {item ? (
        <div className="mt-4 border-t border-line-strong pt-4">
          <DeleteForm id={item.id} what={item.name} action={deletePackageAction} />
        </div>
      ) : null}
    </div>
  );
}

/* ── Add-ons ─────────────────────────────────────────────────────────────── */

const BLANK_EXTRA = {
  label: '',
  price: '',
  perUnit: false,
  maxQty: '1',
  active: true,
  sortOrder: '0',
};

function ExtraForm({ item }: { item?: Extra }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveExtraAction, {});

  const [form, setForm] = useState(
    item
      ? {
          label: item.label,
          price: String(item.priceCents / 100),
          perUnit: item.perUnit,
          maxQty: String(item.maxQty),
          active: item.active,
          sortOrder: String(item.sortOrder),
        }
      : BLANK_EXTRA,
  );
  const set = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }));

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <form action={formAction} className="flex flex-col gap-4">
        {item ? <input type="hidden" name="id" value={item.id} /> : null}

        <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
          <label className="field-label">
            Add-on name
            <input
              name="label"
              required
              minLength={2}
              placeholder="Child seat"
              value={form.label}
              onChange={(event) => set({ label: event.target.value })}
              className="field"
            />
          </label>

          <label className="field-label">
            Price (€)
            <input
              name="price"
              required
              inputMode="decimal"
              placeholder="10"
              value={form.price}
              onChange={(event) => set({ price: event.target.value })}
              className="field"
            />
          </label>

          <label className="field-label">
            Max quantity
            <input
              type="number"
              name="maxQty"
              min={1}
              max={20}
              value={form.maxQty}
              onChange={(event) => set({ maxQty: event.target.value })}
              className="field"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={(event) => set({ active: event.target.checked })}
              className="h-4 w-4 accent-[#B4552D]"
            />
            Offered at booking
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              name="perUnit"
              checked={form.perUnit}
              onChange={(event) => set({ perUnit: event.target.checked })}
              className="h-4 w-4 accent-[#B4552D]"
            />
            Charge per unit
          </label>

          <label className="flex items-center gap-2 text-sm font-bold">
            Order
            <input
              type="number"
              name="sortOrder"
              min={0}
              max={999}
              value={form.sortOrder}
              onChange={(event) => set({ sortOrder: event.target.value })}
              className="field w-[80px]"
            />
          </label>
        </div>

        <p className="m-0 text-[13px] leading-[1.6] text-ink-mute">
          {form.perUnit
            ? `Charged for each unit chosen — ${form.maxQty} × ${form.price || '0'} € at most.`
            : 'Charged once, whatever quantity the customer picks.'}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className={`cursor-pointer rounded-full px-6 py-3 font-sans text-[15px] font-extrabold disabled:opacity-60 ${
              item
                ? 'border border-brand bg-surface text-brand hover:bg-sand'
                : 'border-none bg-brand text-surface hover:bg-brand-dark'
            }`}
          >
            {pending ? 'Saving…' : item ? 'Save' : 'Create the add-on'}
          </button>
          <Feedback state={state} />
        </div>
      </form>

      {item ? (
        <div className="mt-4 border-t border-line-strong pt-4">
          <DeleteForm id={item.id} what={item.label} action={deleteExtraAction} />
        </div>
      ) : null}
    </div>
  );
}

export function CatalogEditor({
  packages,
  extras,
}: {
  packages: Package[];
  extras: Extra[];
}) {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="m-0 mb-2 font-display text-xl">Packages</h2>
          <p className="m-0 max-w-[720px] text-sm leading-[1.6] text-ink-soft">
            A package is sold at its own fixed price and ignores the rate grid entirely. Customers
            pick one at the top of the booking form instead of a route.
          </p>
        </div>

        {packages.map((item) => (
          <PackageForm key={item.id} item={item} />
        ))}

        <div>
          <h3 className="m-0 mb-3 font-display text-lg text-ink-soft">New package</h3>
          <PackageForm />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="m-0 mb-2 font-display text-xl">Paid add-ons</h2>
          <p className="m-0 max-w-[720px] text-sm leading-[1.6] text-ink-soft">
            Add-ons are charged on top of the fare or the package. They are never night-surcharged —
            a child seat costs the same at 3 am as at 3 pm.
          </p>
        </div>

        {extras.map((item) => (
          <ExtraForm key={item.id} item={item} />
        ))}

        <div>
          <h3 className="m-0 mb-3 font-display text-lg text-ink-soft">New add-on</h3>
          <ExtraForm />
        </div>
      </section>
    </div>
  );
}
