import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingEditor } from './BookingEditor';
import { requireAdmin } from '@/lib/auth';
import { bookingExtras, getBookingById } from '@/lib/booking';
import { euros } from '@/lib/catalog';
import { destinationLabel } from '@/lib/i18n';
import { en } from '@/lib/i18n/dictionaries/en';
import type { VehicleId } from '@/lib/prices';
import { whatsappLink } from '@/lib/site';

export const dynamic = 'force-dynamic';

function option(list: string[], index: string | null): string {
  if (index === null) return '—';
  return list[Number.parseInt(index, 10)] ?? index;
}

export default async function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await params;
  const booking = getBookingById(Number(id));
  if (!booking) notFound();

  const zone = (value: string) => destinationLabel(en, value);

  // Old bookings can carry a vehicle id that no longer exists in the app.
  const vehicleEntry = booking.vehicle ? en.vehicles[booking.vehicle as VehicleId] : undefined;
  const vehicle =
    booking.vehicle && booking.vehicle !== 'advise'
      ? (vehicleEntry?.label ?? booking.vehicle)
      : 'To be advised';

  const extras = bookingExtras(booking);

  const details: [string, string][] = [
    ...(booking.package_name ? ([['Package', booking.package_name]] as [string, string][]) : []),
    ['From', zone(booking.from_zone)],
    ['To', zone(booking.to_zone)],
    ['Trip', booking.trip === 'rt' ? 'Round trip' : 'One way'],
    ['Date', booking.travel_date ?? '—'],
    ['Time', booking.travel_time ?? '—'],
    ['Passengers', String(booking.pax)],
    ['Luggage', option(en.booking.bagOptions, booking.bags)],
    ['Vehicle', vehicle],
    ['Child seats', option(en.booking.seatOptions, booking.child_seats)],
    ['Flight no.', booking.flight ?? '—'],
    ['Customer language', booking.locale.toUpperCase()],
    [
      'Payment',
      booking.payment_status === 'paid'
        ? `Paid — ${Math.round((booking.paid_amount_cents ?? 0) / 100)} €`
        : booking.payment_status,
    ],
  ];

  // Only worth showing once there is something to break down.
  const showBreakdown =
    booking.base_price_cents != null &&
    (booking.night_surcharge_cents || booking.extras_price_cents || extras.length > 0);

  const waMessage = `Hello ${booking.customer_name}, about your request ${booking.reference} (${zone(booking.from_zone)} → ${zone(booking.to_zone)}):`;

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-10">
      <Link href="/admin" className="text-sm font-bold text-brand no-underline">
        ← All bookings
      </Link>

      <h1 className="mb-1 mt-4 font-display text-[28px]">
        <span className="font-mono">{booking.reference}</span> — {booking.customer_name}
      </h1>
      <p className="m-0 mb-8 text-sm text-ink-mute">
        Received {new Date(booking.created_at).toLocaleString('en-GB')}
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="m-0 mb-4 font-display text-xl">Trip details</h2>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {details.map(([label, value]) => (
                  <tr key={label} className="border-b border-line-strong last:border-0">
                    <td className="py-2 pr-4 text-ink-soft">{label}</td>
                    <td className="py-2 font-bold">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {booking.message ? (
              <div className="mt-4 whitespace-pre-wrap rounded-xl bg-sand p-4 text-sm leading-[1.6]">
                {booking.message}
              </div>
            ) : null}
          </div>

          {showBreakdown ? (
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="m-0 mb-4 font-display text-xl">How this price was calculated</h2>
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-b border-line-strong">
                    <td className="py-2 pr-4 text-ink-soft">
                      {booking.package_name ? 'Package' : 'Fare'}
                    </td>
                    <td className="py-2 text-right font-bold">
                      {euros(booking.base_price_cents ?? 0)}
                    </td>
                  </tr>

                  {booking.night_surcharge_cents ? (
                    <tr className="border-b border-line-strong">
                      <td className="py-2 pr-4 text-ink-soft">Night supplement</td>
                      <td className="py-2 text-right font-bold">
                        + {euros(booking.night_surcharge_cents)}
                      </td>
                    </tr>
                  ) : null}

                  {extras.map((extra) => (
                    <tr key={extra.slug} className="border-b border-line-strong">
                      <td className="py-2 pr-4 text-ink-soft">
                        {extra.label}
                        {extra.qty > 1 ? ` × ${extra.qty}` : ''}
                      </td>
                      <td className="py-2 text-right font-bold">+ {euros(extra.totalCents)}</td>
                    </tr>
                  ))}

                  <tr>
                    <td className="py-2 pr-4 font-extrabold">Total quoted</td>
                    <td className="py-2 text-right font-extrabold text-brand">
                      {euros(booking.quoted_price_cents ?? 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="m-0 mb-4 font-display text-xl">Contact</h2>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`mailto:${booking.customer_email}`} className="font-bold text-brand">
                {booking.customer_email}
              </a>
              <a href={`tel:${booking.customer_phone}`} className="font-bold text-brand">
                {booking.customer_phone}
              </a>
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block w-fit rounded-full bg-whatsapp px-4 py-2 font-extrabold text-ink no-underline hover:bg-whatsapp-dark"
              >
                💬 Reply on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <BookingEditor
          id={booking.id}
          status={booking.status}
          priceEuros={
            booking.quoted_price_cents == null ? '' : String(Math.round(booking.quoted_price_cents / 100))
          }
          notes={booking.admin_notes ?? ''}
        />
      </div>
    </main>
  );
}
