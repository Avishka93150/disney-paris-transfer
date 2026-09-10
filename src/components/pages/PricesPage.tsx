import Link from 'next/link';
import { PricesTables } from '@/components/PricesTables';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Container, ExternalButton, PageHero, PrimaryLink } from '@/components/ui';
import { getRates, listActiveExtras, listActivePackages } from '@/lib/db';
import { euros } from '@/lib/catalog';
import { fill, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { path } from '@/lib/i18n/routes';
import { TOUR_IDS, tourDestValue } from '@/lib/prices';
import { nightRule } from '@/lib/settings';
import { site, whatsappLink } from '@/lib/site';

/** Prices page — carried over from `project/Tarifs.dc.html`. */
export function PricesPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const rates = getRates();
  const packages = listActivePackages();
  const extras = listActiveExtras();
  const night = nightRule();

  return (
    <>
      <SiteHeader locale={locale} active="prices" />

      <main id="contenu">
        <PageHero title={dict.prices.h1} lead={dict.prices.lead} />

        <Container className="py-14">
          <PricesTables dict={dict} rates={rates} bookingHref={path(locale, 'booking')} />

          {night.enabled ? (
            <p className="mt-7 rounded-[14px] bg-sand px-5 py-4 text-[15px] font-bold text-ink-soft">
              🌙{' '}
              {fill(dict.pricing.nightNote, {
                percent: night.percent,
                start: night.start,
                end: night.end,
              })}
            </p>
          ) : null}
        </Container>

        {/* ── Packages, created by the admin ────────────────── */}
        {packages.length > 0 ? (
          <section className="bg-sand">
            <Container className="py-14">
              <h2 className="m-0 mb-2 font-display text-[30px]">{dict.pricing.packagesTitle}</h2>
              <p className="m-0 mb-7 max-w-[640px] text-base text-ink-soft">
                {dict.pricing.packagesLead}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {packages.map((item) => (
                  <Link
                    key={item.slug}
                    href={`${path(locale, 'booking')}?package=${encodeURIComponent(item.slug)}`}
                    className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5 text-ink no-underline hover:border-brand hover:shadow-card"
                  >
                    <div className="flex items-baseline justify-between gap-2.5">
                      <div className="text-base font-extrabold">{item.name}</div>
                      <div className="whitespace-nowrap font-display text-xl text-brand">
                        {euros(item.priceCents)}
                      </div>
                    </div>
                    {item.description ? (
                      <p className="m-0 text-sm leading-[1.6] text-ink-soft">{item.description}</p>
                    ) : null}
                    <div className="text-[13px] font-bold text-ink-mute">
                      {fill(dict.pricing.packageUpTo, { pax: item.maxPax })}
                    </div>
                    <span className="mt-auto rounded-full bg-brand px-5 py-2.5 text-center text-sm font-extrabold text-surface">
                      {dict.prices.bookThis}
                    </span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {/* ── Paid add-ons ─────────────────────────────── */}
        {extras.length > 0 ? (
          <Container className="py-14">
            <h2 className="m-0 mb-2 font-display text-[30px]">{dict.pricing.extrasTitle}</h2>
            <p className="m-0 mb-7 max-w-[640px] text-base text-ink-soft">
              {dict.pricing.extrasLead}
            </p>

            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {extras.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-baseline justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-3.5"
                >
                  <span className="text-[15px] font-bold">{item.label}</span>
                  <span className="whitespace-nowrap font-extrabold text-brand">
                    {euros(item.priceCents)}
                    {item.perUnit ? ` ${dict.pricing.extrasEach}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        ) : null}

        {/* ── Excursions, always on request ─────────────────────────── */}
        <section id="tours" className="border-y border-line bg-surface">
          <Container className="py-14">
            <h2 className="m-0 mb-2 font-display text-[30px]">{dict.prices.toursTitle}</h2>
            <p className="m-0 mb-7 max-w-[640px] text-base text-ink-soft">{dict.prices.toursLead}</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOUR_IDS.map((id) => {
                const tour = dict.tours[id];
                return (
                  <Link
                    key={id}
                    href={`${path(locale, 'booking')}?to=${encodeURIComponent(tourDestValue(id))}`}
                    className="flex flex-col gap-2 rounded-2xl border border-line bg-cream p-5 text-ink no-underline hover:border-brand hover:shadow-card"
                  >
                    <div className="flex items-baseline justify-between gap-2.5">
                      <div className="text-base font-extrabold">{tour.name}</div>
                      <div className="whitespace-nowrap rounded-full bg-sand px-2.5 py-[3px] text-xs font-extrabold text-brand">
                        {tour.dur}
                      </div>
                    </div>
                    <p className="m-0 text-sm leading-[1.6] text-ink-soft">{tour.desc}</p>
                    <span className="mt-auto rounded-full bg-brand px-5 py-2.5 text-center text-sm font-extrabold text-surface">
                      {dict.prices.bookThis}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ── Devis personnalisé, réponse sous 2 h ───────────────────── */}
        <section className="mx-auto max-w-[900px] px-6 py-14">
          <div className="rounded-3xl bg-ink px-8 py-11 text-center">
            <div className="mb-3.5 inline-block rounded-full bg-gold px-4 py-1.5 text-[13px] font-extrabold text-ink">
              {dict.prices.customBadge}
            </div>
            <h2 className="m-0 mb-3 font-display text-[28px] text-surface">
              {dict.prices.customTitle}
            </h2>
            <p className="m-0 mb-6 text-base leading-[1.7] text-cream-soft">
              {dict.prices.customLead}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ExternalButton
                href={whatsappLink(dict.prices.customTitle)}
                variant="gold"
                className="!px-7 !py-3.5 !text-base"
              >
                {dict.prices.customWhatsapp}
              </ExternalButton>
              <PrimaryLink
                href={path(locale, 'booking')}
                className="!border-2 !border-gold !bg-transparent !px-6 !py-3 !text-base !text-gold hover:!bg-ink-light"
              >
                {dict.prices.customForm}
              </PrimaryLink>
              <ExternalButton
                href={site.phoneHref}
                variant="goldOutline"
                className="!px-6 !py-3 !text-base"
              >
                📞 {site.phoneDisplay}
              </ExternalButton>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
