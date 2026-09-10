import { BookingForm } from '@/components/BookingForm';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Container, PageHero } from '@/components/ui';
import { getRates, listActiveExtras, listActivePackages } from '@/lib/db';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import {
  VEHICLE_IDS,
  activeVehicles,
  fittingVehicle,
  isArrivalId,
  isZoneId,
  parseClock,
  type TripType,
  type ZoneId,
} from '@/lib/prices';
import { getVehicleFleet, nightRule } from '@/lib/settings';
import { site } from '@/lib/site';

type SearchParams = Record<string, string | string[] | undefined>;

function one(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function asZone(value: string | undefined, fallback: ZoneId): ZoneId {
  return value && isZoneId(value) ? value : fallback;
}

function asArrival(value: string | undefined, fallback: string): string {
  return value && isArrivalId(value) ? value : fallback;
}

/** Booking page — carried over from `project/Reservation.dc.html`. */
export function BookingPage({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: SearchParams;
}) {
  const dict = getDictionary(locale);
  const rates = getRates();
  const packages = listActivePackages();
  const extras = listActiveExtras();
  const night = nightRule();
  const vehicles = getVehicleFleet();
  const offered = activeVehicles(vehicles);

  // Pre-filled from the home page calculator or the prices page.
  const paxParam = Number.parseInt(one(searchParams, 'pax') ?? '', 10);
  const vehicleParam = one(searchParams, 'vehicle');
  const timeParam = one(searchParams, 'time');
  const pax = Number.isFinite(paxParam) && paxParam >= 1 && paxParam <= 8 ? paxParam : 2;
  const preferred =
    vehicleParam && (VEHICLE_IDS as readonly string[]).includes(vehicleParam)
      ? vehicleParam
      : offered[0]?.id;
  const fitted = fittingVehicle(pax, preferred, vehicles);

  const defaults = {
    from: asZone(one(searchParams, 'from'), 'cdg'),
    to: asArrival(one(searchParams, 'to'), 'disney'),
    pax,
    trip: (one(searchParams, 'trip') === 'rt' ? 'rt' : 'ow') as TripType,
    vehicle: fitted?.id ?? 'advise',
    time: parseClock(timeParam) == null ? '' : (timeParam as string),
  };

  // Coming back from Stripe.
  const paid = one(searchParams, 'paid') === '1';
  const cancelled = one(searchParams, 'cancelled') === '1';

  return (
    <>
      <SiteHeader locale={locale} />

      <main id="contenu">
        <PageHero title={dict.booking.h1} lead={dict.booking.lead} />

        <Container className="grid items-start gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-4">
            {paid ? (
              <p
                role="status"
                className="m-0 rounded-xl border border-success-border bg-whatsapp px-[18px] py-3.5 text-[15px] font-bold text-success-text"
              >
                ✓ {dict.booking.paySuccess}
              </p>
            ) : null}
            {cancelled ? (
              <p
                role="status"
                className="m-0 rounded-xl border border-line bg-sand px-[18px] py-3.5 text-[15px] font-bold text-ink-soft"
              >
                {dict.booking.payCancelled}
              </p>
            ) : null}

            <BookingForm
              locale={locale}
              dict={dict}
              rates={rates}
              packages={packages}
              extras={extras}
              night={night}
              vehicles={vehicles}
              defaults={defaults}
            />
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1.5 rounded-[18px] bg-ink p-6 text-surface no-underline hover:bg-ink-light"
            >
              <span className="text-lg font-extrabold">💬 {dict.booking.sidebarWhatsapp}</span>
              <span className="text-sm text-cream-soft">{dict.booking.sidebarWhatsappNote}</span>
            </a>

            <a
              href={site.phoneHref}
              className="flex flex-col gap-1.5 rounded-[18px] border border-line bg-surface p-6 text-ink no-underline hover:border-brand"
            >
              <span className="text-lg font-extrabold">📞 {site.phoneDisplay}</span>
              <span className="text-sm text-ink-soft">{dict.booking.sidebarPhoneNote}</span>
            </a>

            <div className="rounded-[18px] bg-sand p-6">
              <div className="mb-2.5 text-[15px] font-extrabold">{dict.booking.includedTitle}</div>
              <div className="flex flex-col gap-[7px] text-sm text-ink-soft">
                {dict.booking.included.map((item) => (
                  <span key={item}>✓ {item}</span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
