'use client';

import { useActionState, useState } from 'react';
import { loginAction, type ActionState } from '../actions';

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, {});
  // Controlled input: React 19 resets uncontrolled fields after a server
  // action, forcing the email to be retyped after every failed attempt.
  const [email, setEmail] = useState('');

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6"
    >
      <label className="field-label">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field"
        />
      </label>

      <label className="field-label">
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="field"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-full border-none bg-brand px-6 py-3 font-sans text-base font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      {state.error ? (
        <p role="alert" className="m-0 text-sm font-bold text-brand">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
