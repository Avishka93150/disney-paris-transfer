'use client';

import { useActionState, useState } from 'react';
import { saveSettingsAction, type ActionState } from '../actions';

export function SettingsForm({
  stripeEnabled,
  stripeMode,
  depositPercent,
  stripeConfigured,
  stripeSecretHint,
  stripeWebhookSet,
  nightSurchargeEnabled,
  nightSurchargePercent,
  nightStart,
  nightEnd,
}: {
  stripeEnabled: boolean;
  stripeMode: 'full' | 'deposit';
  depositPercent: number;
  stripeConfigured: boolean;
  stripeSecretHint: string | null;
  stripeWebhookSet: boolean;
  nightSurchargeEnabled: boolean;
  nightSurchargePercent: number;
  nightStart: string;
  nightEnd: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveSettingsAction, {});
  const [enabled, setEnabled] = useState(stripeEnabled);
  const [mode, setMode] = useState(stripeMode);
  const [percent, setPercent] = useState(String(depositPercent));
  const [secretDraft, setSecretDraft] = useState('');

  const [night, setNight] = useState(nightSurchargeEnabled);
  const [nightPercent, setNightPercent] = useState(String(nightSurchargePercent));
  const [start, setStart] = useState(nightStart);
  const [end, setEnd] = useState(nightEnd);

  // A window that ends at or before it starts runs through midnight. Saying so
  // out loud saves the admin wondering whether 21:00 → 06:00 was understood.
  const wraps = end <= start;
  const example = Math.round(80 * (1 + (Number(nightPercent) || 0) / 100));

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="nightSurchargeEnabled"
              checked={night}
              onChange={(event) => setNight(event.target.checked)}
              className="mt-1 h-5 w-5 accent-[#B4552D]"
            />
            <span>
              <span className="block text-base font-extrabold">Night supplement</span>
              <span className="block text-sm leading-[1.6] text-ink-soft">
                Adds a percentage to every fare, package and route whose pickup time falls inside
                the night hours below. Add-ons are never surcharged.
              </span>
            </span>
          </label>
        </div>

        <fieldset disabled={!night} className="m-0 flex flex-col gap-4 border-0 p-0 disabled:opacity-50">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="field-label">
              Night starts at
              <input
                type="time"
                name="nightStart"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className="field"
              />
            </label>

            <label className="field-label">
              Night ends at
              <input
                type="time"
                name="nightEnd"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className="field"
              />
            </label>

            <label className="field-label">
              Supplement (%)
              <input
                type="number"
                name="nightSurchargePercent"
                min={1}
                max={200}
                step={1}
                value={nightPercent}
                onChange={(event) => setNightPercent(event.target.value)}
                className="field"
              />
            </label>
          </div>

          <p className="m-0 rounded-[10px] bg-sand p-3 text-[13px] leading-[1.6] text-ink-soft">
            {wraps ? (
              <>
                Pickups from <strong>{start || '—'}</strong> in the evening through to{' '}
                <strong>{end || '—'}</strong> the next morning are charged{' '}
                <strong>+{Number(nightPercent) || 0} %</strong>.
              </>
            ) : (
              <>
                Pickups between <strong>{start || '—'}</strong> and <strong>{end || '—'}</strong> on
                the same day are charged <strong>+{Number(nightPercent) || 0} %</strong>.
              </>
            )}{' '}
            An €80 transfer becomes <strong>{example} €</strong>. On a round trip the supplement
            applies to both legs, based on the outbound pickup time.
          </p>
        </fieldset>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
        <div>
          <h2 className="m-0 mb-1 font-display text-xl">Stripe</h2>
          <p className="m-0 mb-4 text-sm leading-[1.6] text-ink-soft">
            Keys can be pasted here or left in the <code>.env</code> file. Values saved in
            admin override the environment. Leave a field blank to keep the current secret.
          </p>

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <label className="field-label">
              Secret key
              <input
                type="password"
                name="stripeSecretKey"
                autoComplete="off"
                value={secretDraft}
                onChange={(event) => setSecretDraft(event.target.value)}
                placeholder={stripeSecretHint ?? 'sk_live_…'}
                className="field font-mono"
              />
              {stripeSecretHint ? (
                <span className="text-[12px] font-bold text-ink-mute">Saved {stripeSecretHint}</span>
              ) : (
                <span className="text-[12px] font-bold text-ink-mute">Not set yet</span>
              )}
            </label>

            <label className="field-label">
              Webhook secret
              <input
                type="password"
                name="stripeWebhookSecret"
                autoComplete="off"
                placeholder={stripeWebhookSet ? 'whsec_… (saved)' : 'whsec_…'}
                className="field font-mono"
              />
              <span className="text-[12px] font-bold text-ink-mute">
                {stripeWebhookSet ? 'Saved — leave blank to keep it' : 'Needed to mark bookings as paid'}
              </span>
            </label>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="stripeEnabled"
              checked={enabled}
              disabled={!stripeConfigured && secretDraft.length === 0}
              onChange={(event) => setEnabled(event.target.checked)}
              className="mt-1 h-5 w-5 accent-[#B4552D]"
            />
            <span>
              <span className="block text-base font-extrabold">Enable online payment</span>
              <span className="block text-sm leading-[1.6] text-ink-soft">
                While this box is unticked, no payment button appears anywhere on the site:
                customers pay on board, as they do today. You can tick it in the same save as
                a newly pasted key.
              </span>
            </span>
          </label>

          {!stripeConfigured ? (
            <p className="mb-0 mt-3 rounded-[10px] bg-sand p-3 text-[13px] leading-[1.6] text-ink-soft">
              Paste a secret key above (or set <code>STRIPE_SECRET_KEY</code> in{' '}
              <code>.env</code>) before the payment button can be switched on.
            </p>
          ) : null}
        </div>

        <fieldset
          disabled={!enabled}
          className="m-0 flex flex-col gap-4 border-0 p-0 disabled:opacity-50"
        >
          <legend className="mb-2 text-base font-extrabold">Amount collected</legend>

          <label className="flex cursor-pointer items-center gap-3 text-[15px]">
            <input
              type="radio"
              name="stripeMode"
              value="full"
              checked={mode === 'full'}
              onChange={() => setMode('full')}
              className="h-4 w-4 accent-[#B4552D]"
            />
            Full payment for the transfer
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-[15px]">
            <input
              type="radio"
              name="stripeMode"
              value="deposit"
              checked={mode === 'deposit'}
              onChange={() => setMode('deposit')}
              className="h-4 w-4 accent-[#B4552D]"
            />
            Deposit, balance paid on board
          </label>

          <label className="field-label max-w-[220px]">
            Deposit percentage
            <input
              type="number"
              name="depositPercent"
              min={5}
              max={100}
              step={1}
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
              disabled={mode !== 'deposit'}
              className="field"
            />
          </label>
        </fieldset>
      </section>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-fit cursor-pointer rounded-full border-none bg-brand px-6 py-3 font-sans text-[15px] font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save settings'}
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
      </div>
    </form>
  );
}
