import nodemailer, { type Transporter } from 'nodemailer';
import { bookingExtras } from './booking';
import { euros } from './catalog';
import type { BookingRow } from './db';
import { destinationLabel, fill, getDictionary } from './i18n';
import { isLocale } from './i18n/config';
import { en } from './i18n/dictionaries/en';
import type { VehicleId } from './prices';
import { getSmtpConfig } from './settings';
import { site } from './site';

/**
 * Plain SMTP (the host's mailbox: OVH, Gandi, Ionos…).
 *
 * Without a host (admin settings or `SMTP_HOST`), emails are written to the
 * console: the site stays usable in development and requests are still recorded.
 */

let transporter: Transporter | null = null;
let transporterKey: string | null = null;

function adminInbox(): string {
  return getSmtpConfig().mailTo || site.email;
}

function getTransport(): Transporter | null {
  const smtp = getSmtpConfig();
  if (!smtp.host) {
    transporter = null;
    transporterKey = null;
    return null;
  }

  const key = JSON.stringify({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    user: smtp.user,
    pass: smtp.pass,
  });
  if (transporter && transporterKey === key) return transporter;

  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  });
  transporterKey = key;
  return transporter;
}

export async function sendMail(message: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const transport = getTransport();
  const smtp = getSmtpConfig();
  const from = smtp.mailFrom || `${site.name} <${site.email}>`;

  if (!transport) {
    console.info(
      `[mail] SMTP not configured — email not sent.\n  To: ${message.to}\n  Subject: ${message.subject}\n${message.text}`,
    );
    return;
  }

  await transport.sendMail({ from, ...message });
}

/* ── Formatting ──────────────────────────────────────────────────────────── */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function optionLabel(list: string[], index: string | null): string {
  if (index === null) return '—';
  const parsed = Number.parseInt(index, 10);
  return list[parsed] ?? index;
}

/** Summary of a request, in the requested language. */
function describe(booking: BookingRow, localeCode: string) {
  const dict = isLocale(localeCode) ? getDictionary(localeCode) : en;

  // A booking taken before a vehicle id was renamed must still render.
  const vehicleEntry = booking.vehicle ? dict.vehicles[booking.vehicle as VehicleId] : undefined;
  const vehicle =
    booking.vehicle && booking.vehicle !== 'advise'
      ? (vehicleEntry?.label ?? booking.vehicle)
      : dict.booking.vehicleAdvise;

  return {
    dict,
    rows: [
      ...(booking.package_name
        ? ([[dict.pricing.packageLabel, booking.package_name]] as [string, string][])
        : []),
      [dict.booking.fromLabel, destinationLabel(dict, booking.from_zone)],
      [dict.booking.toLabel, destinationLabel(dict, booking.to_zone)],
      [dict.booking.tripLabel, booking.trip === 'rt' ? dict.booking.roundTrip : dict.booking.oneWay],
      [dict.booking.dateLabel, booking.travel_date ?? '—'],
      [dict.booking.timeLabel, booking.travel_time ?? '—'],
      [dict.booking.paxLabel, String(booking.pax)],
      [dict.booking.bagsLabel, optionLabel(dict.booking.bagOptions, booking.bags)],
      [dict.booking.vehicleLabel, vehicle],
      [dict.booking.seatsLabel, optionLabel(dict.booking.seatOptions, booking.child_seats)],
      [dict.booking.flightLabel, booking.flight ?? '—'],
    ] as [string, string][],
  };
}

/**
 * The night supplement and each add-on as their own lines, so the customer can
 * see why the total is what it is rather than only the total.
 */
function priceLines(booking: BookingRow, dict: typeof en): [string, string][] {
  const lines: [string, string][] = [];
  const extras = bookingExtras(booking);

  if (booking.base_price_cents != null && (booking.night_surcharge_cents || extras.length > 0)) {
    lines.push([
      booking.package_name ?? dict.pricing.baseLine,
      euros(booking.base_price_cents),
    ]);
  }

  if (booking.night_surcharge_cents) {
    // The percentage is derived rather than stored: the admin may have changed
    // the rate since, and the email must describe what this customer was
    // actually charged.
    const percent = booking.base_price_cents
      ? Math.round((booking.night_surcharge_cents / booking.base_price_cents) * 100)
      : 0;

    lines.push([
      fill(dict.pricing.nightLine, { percent }),
      `+ ${euros(booking.night_surcharge_cents)}`,
    ]);
  }

  for (const extra of extras) {
    lines.push([
      extra.qty > 1 ? `${extra.label} × ${extra.qty}` : extra.label,
      `+ ${euros(extra.totalCents)}`,
    ]);
  }

  return lines;
}

function table(rows: [string, string][]): string {
  return rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#6B5641;font-size:14px">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:700;font-size:14px">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
}

function wrap(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#FBF6ED;font-family:Helvetica,Arial,sans-serif;color:#3A2E24">
    <div style="max-width:600px;margin:0 auto;padding:24px">
      <div style="font-size:20px;font-weight:800;margin-bottom:16px">Disney Paris <span style="color:#B4552D">Transfers</span></div>
      <div style="background:#FFFDF9;border:1px solid #EBDFC9;border-radius:16px;padding:24px">
        <h1 style="margin:0 0 16px;font-size:19px">${escapeHtml(title)}</h1>
        ${body}
      </div>
      <p style="color:#8F7455;font-size:12px;margin-top:16px">${escapeHtml(site.domain)} · ${escapeHtml(site.phoneDisplay)}</p>
    </div>
  </body></html>`;
}

function price(cents: number | null): string {
  return cents == null ? '—' : `${Math.round(cents / 100)} €`;
}

/* ── Emails ──────────────────────────────────────────────────────────────── */

/** Notification to the driver — always in English, whatever the customer read. */
export async function sendBookingNotification(booking: BookingRow): Promise<void> {
  const { rows } = describe(booking, 'en');
  const to = adminInbox();

  const details: [string, string][] = [
    ...rows,
    ...priceLines(booking, en),
    ['Calculated price', price(booking.quoted_price_cents)],
    ['Name', booking.customer_name],
    ['Email', booking.customer_email],
    ['Phone', booking.customer_phone],
    ['Language', booking.locale.toUpperCase()],
  ];

  const text = [
    `New request ${booking.reference}`,
    ...details.map(([label, value]) => `${label}: ${value}`),
    booking.message ? `\nMessage:\n${booking.message}` : '',
  ].join('\n');

  await sendMail({
    to,
    replyTo: booking.customer_email,
    subject: `New request ${booking.reference} — ${booking.customer_name}`,
    text,
    html: wrap(
      `New request ${booking.reference}`,
      `<table style="border-collapse:collapse;width:100%">${table(details)}</table>
       ${
         booking.message
           ? `<div style="margin-top:16px;padding:14px;background:#F6E9D8;border-radius:10px;font-size:14px;line-height:1.6">${escapeHtml(booking.message).replace(/\n/g, '<br>')}</div>`
           : ''
       }
       <p style="margin-top:20px;font-size:13px;color:#6B5641">Reply directly to this email to reach the customer.</p>`,
    ),
  });
}

/** Acknowledgement to the customer, in their own language. */
export async function sendBookingConfirmation(booking: BookingRow): Promise<void> {
  const { dict, rows } = describe(booking, booking.locale);

  const summary: [string, string][] = [
    ...rows,
    ...priceLines(booking, dict),
    [dict.booking.estimateLabel, price(booking.quoted_price_cents)],
  ];

  const text = [
    `${dict.booking.success} — ${booking.reference}`,
    dict.booking.successLead,
    '',
    ...summary.map(([label, value]) => `${label}: ${value}`),
    '',
    dict.booking.note,
    `${site.phoneDisplay} · ${site.whatsappHref}`,
  ].join('\n');

  await sendMail({
    to: booking.customer_email,
    subject: `${dict.booking.success} ${booking.reference} — ${site.name}`,
    text,
    html: wrap(
      `${dict.booking.success} ${booking.reference}`,
      `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#6B5641">${escapeHtml(dict.booking.successLead)}</p>
       <table style="border-collapse:collapse;width:100%">${table(summary)}</table>
       <p style="margin:20px 0 0;font-size:13px;color:#8F7455">${escapeHtml(dict.booking.note)}</p>
       <p style="margin:12px 0 0;font-size:14px"><a href="${site.whatsappHref}" style="color:#B4552D">WhatsApp</a> · <a href="${site.phoneHref}" style="color:#B4552D">${escapeHtml(site.phoneDisplay)}</a></p>`,
    ),
  });
}

/** Payment confirmation, in the customer's language. */
export async function sendPaymentReceipt(booking: BookingRow, amountCents: number): Promise<void> {
  const dict = isLocale(booking.locale) ? getDictionary(booking.locale) : en;

  const text = `${dict.booking.paySuccess}\n${booking.reference} — ${price(amountCents)}`;

  await sendMail({
    to: booking.customer_email,
    subject: `${dict.booking.paySuccess} — ${booking.reference}`,
    text,
    html: wrap(
      dict.booking.paySuccess,
      `<p style="margin:0;font-size:15px;line-height:1.6;color:#6B5641">${escapeHtml(booking.reference)} — <strong>${price(amountCents)}</strong></p>`,
    ),
  });

  await sendMail({
    to: adminInbox(),
    subject: `Payment received ${booking.reference} — ${price(amountCents)}`,
    text: `Payment received for ${booking.reference}: ${price(amountCents)} (${booking.customer_name}).`,
    html: wrap(
      `Payment received ${booking.reference}`,
      `<p style="margin:0;font-size:15px">${escapeHtml(booking.customer_name)} — <strong>${price(amountCents)}</strong></p>`,
    ),
  });
}
