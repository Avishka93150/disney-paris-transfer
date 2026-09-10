import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { countByStatus, listBookings } from '@/lib/booking';
import { destinationLabel } from '@/lib/i18n';
import { en } from '@/lib/i18n/dictionaries/en';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  quoted: 'Quoted',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-sand text-brand',
  quoted: 'bg-cream text-ink-soft',
  confirmed: 'bg-whatsapp text-success-text',
  cancelled: 'bg-line text-ink-mute',
};

const PAYMENT_LABELS: Record<string, string> = {
  unpaid: 'Unpaid',
  pending: 'Pending',
  paid: 'Paid',
  refunded: 'Refunded',
};

function zone(id: string): string {
  return destinationLabel(en, id);
}

function euros(cents: number | null): string {
  return cents == null ? '—' : `${Math.round(cents / 100)} €`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();

  const { status = 'all' } = await searchParams;
  const bookings = listBookings({ status });
  const counts = countByStatus();
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  const filters = [
    { key: 'all', label: 'All', count: total },
    ...Object.keys(STATUS_LABELS).map((key) => ({
      key,
      label: STATUS_LABELS[key] ?? key,
      count: counts[key] ?? 0,
    })),
  ];

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-10">
      <h1 className="m-0 mb-6 font-display text-[28px]">Booking requests</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = filter.key === status;
          return (
            <Link
              key={filter.key}
              href={filter.key === 'all' ? '/admin' : `/admin?status=${filter.key}`}
              className={`rounded-full border px-4 py-2 text-[13px] font-bold no-underline ${
                active ? 'border-brand bg-brand text-surface' : 'border-line bg-surface text-ink'
              }`}
            >
              {filter.label} ({filter.count})
            </Link>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-[15px] text-ink-soft">
          No booking matches this filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-cream text-left">
                <th className="px-4 py-3 font-extrabold">Received</th>
                <th className="px-4 py-3 font-extrabold">Reference</th>
                <th className="px-4 py-3 font-extrabold">Customer</th>
                <th className="px-4 py-3 font-extrabold">Trip</th>
                <th className="px-4 py-3 font-extrabold">Pax</th>
                <th className="px-4 py-3 font-extrabold">Price</th>
                <th className="px-4 py-3 font-extrabold">Payment</th>
                <th className="px-4 py-3 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-line-strong last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                    {formatDate(booking.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="font-mono font-bold text-brand no-underline"
                    >
                      {booking.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold">{booking.customer_name}</div>
                    <div className="text-[13px] text-ink-mute">{booking.customer_phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    {booking.package_name ? (
                      <span className="font-bold">{booking.package_name}</span>
                    ) : (
                      <>
                        {zone(booking.from_zone)} → {zone(booking.to_zone)}
                      </>
                    )}
                    <div className="text-[13px] text-ink-mute">
                      {booking.trip === 'rt' ? 'Round trip' : 'One way'}
                      {booking.travel_date ? ` · ${booking.travel_date}` : ''}
                      {booking.night_surcharge_cents ? ' · night' : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3">{booking.pax}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-bold">
                    {euros(booking.quoted_price_cents)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px]">
                    {PAYMENT_LABELS[booking.payment_status] ?? booking.payment_status}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-extrabold ${
                        STATUS_STYLES[booking.status] ?? 'bg-cream text-ink'
                      }`}
                    >
                      {STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
