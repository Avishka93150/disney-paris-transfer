'use client';

import { useActionState, useState } from 'react';
import { saveSmtpAction, type ActionState } from '../actions';

type SmtpFormValues = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  passSet: boolean;
  mailFrom: string;
  mailTo: string;
};

export function SmtpForm(values: SmtpFormValues) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSmtpAction, {});
  const [host, setHost] = useState(values.host);
  const [port, setPort] = useState(String(values.port));
  const [secure, setSecure] = useState(values.secure);
  const [user, setUser] = useState(values.user);
  const [pass, setPass] = useState('');
  const [mailFrom, setMailFrom] = useState(values.mailFrom);
  const [mailTo, setMailTo] = useState(values.mailTo);

  return (
    <form action={action} className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
      <div>
        <h2 className="m-0 mb-1 font-display text-xl">Email (SMTP)</h2>
        <p className="m-0 text-sm leading-[1.6] text-ink-soft">
          Booking notifications go through this mailbox. Leave the host empty to keep logging
          emails to the server console. A blank password field keeps the current secret.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label sm:col-span-2">
          SMTP host
          <input
            name="smtpHost"
            value={host}
            onChange={(event) => setHost(event.target.value)}
            placeholder="ssl0.ovh.net"
            className="field font-mono"
          />
        </label>

        <label className="field-label">
          Port
          <input
            name="smtpPort"
            value={port}
            onChange={(event) => setPort(event.target.value)}
            inputMode="numeric"
            className="field font-mono"
          />
        </label>

        <label className="flex cursor-pointer items-center gap-3 pt-6 text-[15px] font-bold">
          <input
            type="checkbox"
            name="smtpSecure"
            checked={secure}
            onChange={(event) => setSecure(event.target.checked)}
            className="h-5 w-5 accent-[#B4552D]"
          />
          TLS / SSL (usually on for port 465)
        </label>

        <label className="field-label">
          Username
          <input
            name="smtpUser"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            autoComplete="off"
            className="field"
          />
        </label>

        <label className="field-label">
          Password
          <input
            type="password"
            name="smtpPass"
            value={pass}
            onChange={(event) => setPass(event.target.value)}
            autoComplete="new-password"
            placeholder={values.passSet ? '•••••••• (saved)' : ''}
            className="field"
          />
        </label>

        <label className="field-label sm:col-span-2">
          From
          <input
            name="mailFrom"
            value={mailFrom}
            onChange={(event) => setMailFrom(event.target.value)}
            placeholder='Disney Paris Transfers <contact@example.com>'
            className="field"
          />
        </label>

        <label className="field-label sm:col-span-2">
          Booking emails delivered to
          <input
            name="mailTo"
            value={mailTo}
            onChange={(event) => setMailTo(event.target.value)}
            placeholder="contact@example.com"
            className="field"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-fit cursor-pointer rounded-full border-none bg-brand px-6 py-3 font-sans text-[15px] font-extrabold text-surface hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save mail settings'}
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
