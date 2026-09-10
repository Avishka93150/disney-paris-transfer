'use client';

import { useActionState, useState } from 'react';
import { changePasswordAction, type ActionState } from '../actions';

const MIN_PASSWORD_LENGTH = 10;

export function PasswordForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <form action={action} className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
      <div>
        <h2 className="m-0 mb-1 font-display text-xl">Admin password</h2>
        <p className="m-0 text-sm leading-[1.6] text-ink-soft">
          Sign-in stays <strong>{email || 'the ADMIN_EMAIL in .env'}</strong>. A password saved
          here overrides <code>ADMIN_PASSWORD_HASH</code> without editing the server files.
        </p>
      </div>

      <label className="field-label">
        Current password
        <input
          type="password"
          name="currentPassword"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          autoComplete="current-password"
          required
          className="field"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          New password
          <input
            type="password"
            name="newPassword"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
            className="field"
          />
        </label>

        <label className="field-label">
          Confirm new password
          <input
            type="password"
            name="confirmPassword"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
            className="field"
          />
        </label>
      </div>

      <p className="m-0 text-[13px] font-bold text-ink-mute">
        At least {MIN_PASSWORD_LENGTH} characters.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-fit cursor-pointer rounded-full border-none bg-brand px-6 py-3 font-sans text-[15px] font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Change password'}
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
