import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PriceCalculator } from '@/components/PriceCalculator';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import {
  Container,
  DarkCta,
  ExternalButton,
  JsonLd,
  PhotoPlaceholder,
  PrimaryLink,
} from '@/components/ui';
import { getRates } from '@/lib/db';
import { fill, formatDistance, formatDuration, getDictionary } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { path, routePath } from '@/lib/i18n/routes';
import { ROUTE_PAGES } from '@/lib/prices';
import { nightRule } from '@/lib/settings';
import { localBusinessJsonLd, pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

/** Service icons — decorative, so they stay out of the dictionary. */
const SERVICE_ICONS = ['✈️', '🪧', '👶', '💳', '🗓️', '💧'];

/**
 * Statically rendered, but the rate grid and the night rule are editable from
 * the admin: saving either calls `revalidatePath`, and this hourly expiry is
 * the safety net for an invalidation that was missed.
 */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, page: 'home' });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const rates = getRates();
  const night = nightRule();
  const home = dict.home;

  const featured = ROUTE_PAGES.filter((route) => route.featured);
  const fleet = (['saloon', 'van', 'premium'] as const).map((id) => ({ id, ...dict.vehicles[id] }));

  return (
    <>
      <SiteHeader locale={locale} active="home" />
      <JsonLd data={localBusinessJsonLd(locale)} />

      <main id="contenu">
        {/* ── Hero + calculator ──────────────────────────────────────── */}
        <section className="bg-[linear-gradient(180deg,#FBF6ED_0%,#F6E9D8_100%)]">
          <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 pb-16 pt-[72px] lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="mb-5 inline-block rounded-full border border-line bg-surface px-4 py-[7px] text-[13px] font-extrabold text-brand">
                {home.badge}
              </div>
              <h1 className="m-0 mb-[18px] font-display text-[34px] leading-[1.15] sm:text-[46px]">
                {home.h1}
              </h1>
              <p className="m-0 mb-7 max-w-[520px] text-[18px] leading-[1.7] text-ink-soft">
                {home.lead}
              </p>
              <div className="mb-7 flex flex-wrap gap-3.5">
                <PrimaryLink href={path(locale, 'booking')}>{home.ctaPrimary}</PrimaryLink>
                <ExternalButton href={site.whatsappHref} variant="outline">
                  {home.ctaSecondary}
                </ExternalButton>
              </div>
              <div className="flex flex-wrap gap-6 text-sm font-bold text-ink-soft">
                {home.perks.map((perk) => (
                  <span key={perk}>✓ {perk}</span>
                ))}
              </div>
            </div>

            <PriceCalculator
              dict={dict}
              rates={rates}
              night={night}
              bookingHref={path(locale, 'booking')}
            />
          </div>
        </section>

        {/* ── Most requested routes ──────────────────────────────────── */}
        <section className="py-[72px]">
          <Container>
            <h2 className="m-0 mb-2 font-display text-[32px]">{home.routesTitle}</h2>
            <p className="m-0 mb-8 text-base text-ink-soft">{home.routesLead}</p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((route) => (
                <Link
                  key={route.slug}
                  href={routePath(locale, route.slug)}
                  className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-surface p-6 no-underline hover:border-brand hover:shadow-card"
                >
                  <div className="font-display text-xl text-ink">
                    {dict.zones[route.from]} ↔ {dict.zones[route.to]}
                  </div>
                  <div className="flex gap-3.5 text-sm font-bold text-ink-soft">
                    <span>🕐 {formatDuration(dict, route.durationMin)}</span>
                    <span>📍 {formatDistance(dict, route.distanceKm)}</span>
                  </div>
                  <div className="text-sm font-extrabold text-brand">{home.seeRoute}</div>
                </Link>
              ))}

              <Link
                href={path(locale, 'prices')}
                className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-surface p-6 no-underline hover:border-brand hover:shadow-card"
              >
                <div className="font-display text-xl text-ink">{home.excursionsCard.title}</div>
                <div className="flex gap-3.5 text-sm font-bold text-ink-soft">
                  <span>🕐 {home.excursionsCard.duration}</span>
                  <span>📍 {home.excursionsCard.note}</span>
                </div>
                <div className="text-sm font-extrabold text-brand">{home.seeRoute}</div>
              </Link>
            </div>
          </Container>
        </section>

        {/* ── Booking is simple ──────────────────────────────────────── */}
        <section className="border-y border-line bg-surface">
          <Container className="py-[72px]">
            <h2 className="m-0 mb-8 text-center font-display text-[32px]">{home.stepsTitle}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {home.steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center gap-2.5 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand font-display text-2xl text-brand">
                    {index + 1}
                  </div>
                  <div className="text-lg font-extrabold">{step.title}</div>
                  <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">{step.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Built for families ─────────────────────────────────────── */}
        <section className="py-[72px]">
          <Container className="grid items-center gap-14 lg:grid-cols-2">
            <PhotoPlaceholder label={home.familyPhoto} className="rounded-3xl" />
            <div>
              <h2 className="m-0 mb-6 font-display text-[32px]">{home.familyTitle}</h2>
              <div className="flex flex-col gap-4">
                {home.services.map((service, index) => (
                  <div key={service.title} className="flex items-start gap-3.5">
                    <div
                      aria-hidden
                      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-sand text-base"
                    >
                      {SERVICE_ICONS[index]}
                    </div>
                    <div>
                      <span className="font-extrabold">{service.title}</span>{' '}
                      <span className="text-ink-soft">— {service.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── Fleet ──────────────────────────────────────────────────── */}
        <section className="bg-sand">
          <Container className="py-[72px]">
            <h2 className="m-0 mb-2 font-display text-[32px]">{home.fleetTitle}</h2>
            <p className="m-0 mb-8 text-base text-ink-soft">{home.fleetLead}</p>
            <div className="grid gap-5 md:grid-cols-3">
              {fleet.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex flex-col gap-3 rounded-[18px] bg-surface p-6"
                >
                  <PhotoPlaceholder
                    label={fill(home.fleetPhoto, { vehicle: vehicle.short })}
                    aspect="aspect-[16/9]"
                    className="rounded-xl"
                  />
                  <div className="font-display text-xl">{vehicle.label}</div>
                  <div className="flex gap-3.5 text-sm font-bold text-ink-soft">
                    <span>👤 {vehicle.pax}</span>
                    <span>🧳 {vehicle.bags}</span>
                  </div>
                  <p className="m-0 text-sm leading-[1.6] text-ink-soft">{vehicle.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Reviews ────────────────────────────────────────────────── */}
        <section className="py-[72px]">
          <Container>
            <h2 className="m-0 mb-2 text-center font-display text-[32px]">{home.reviewsTitle}</h2>
            <p className="m-0 mb-8 text-center font-mono text-[15px] text-ink-soft">
              {home.reviewsNote}
            </p>
            <div className="grid gap-5 md:grid-cols-3">
              {home.reviews.map((review) => (
                <div
                  key={review.name}
                  className="flex flex-col gap-3 rounded-[18px] border border-line bg-surface p-6"
                >
                  <div aria-hidden className="text-base tracking-[2px] text-gold">
                    ★★★★★
                  </div>
                  <p className="m-0 text-[15px] italic leading-[1.6] text-ink-soft">{review.text}</p>
                  <div className="text-sm font-extrabold">{review.name}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <DarkCta title={home.finalTitle} lead={home.finalLead}>
          <ExternalButton href={path(locale, 'booking')} variant="gold">
            {home.finalBook}
          </ExternalButton>
          <ExternalButton href={site.phoneHref} variant="goldOutline">
            📞 {site.phoneDisplay}
          </ExternalButton>
        </DarkCta>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
