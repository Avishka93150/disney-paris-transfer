import Link from 'next/link';
import { PriceCalculator } from '@/components/PriceCalculator';
import { RateTable } from '@/components/RateTable';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TransferPhoto } from '@/components/TransferPhoto';
import { Container, ExternalButton, JsonLd, PrimaryLink } from '@/components/ui';
import { getRates } from '@/lib/db';
import { fill, formatDistance, formatDuration, getDictionary, routeLead } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { path, routePath } from '@/lib/i18n/routes';
import {
  collapseTiers,
  findRate,
  relatedRoutes,
  startingPrice,
  transferImageSrc,
  type RoutePage as RoutePageData,
} from '@/lib/prices';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { getVehicleFleet, nightRule } from '@/lib/settings';
import { absoluteUrl, site, whatsappLink } from '@/lib/site';

/**
 * Dedicated SEO page for one priced connection: image, unique copy, live
 * price with departure and arrival already selected.
 */
export function RouteDetailPage({ locale, route }: { locale: Locale; route: RoutePageData }) {
  const dict = getDictionary(locale);
  const detail = dict.routeDetail;
  const rates = getRates();
  const night = nightRule();
  const vehicles = getVehicleFleet();

  const fromName = dict.zones[route.from];
  const toName = dict.zones[route.to];
  const title = fill(detail.h1, { from: fromName, to: toName });
  const lead = routeLead(dict, route.slug, fromName, toName);
  const imageAlt = fill(detail.imageAlt, { from: fromName, to: toName });

  const rate = findRate(route.from, route.to, rates);
  const rows = rate ? collapseTiers(rate) : [];
  const cheapest = startingPrice(route.from, route.to, rates);
  const related = relatedRoutes(route.slug);

  const isAirportPickup = route.from === 'cdg' || route.from === 'orly' || route.from === 'beauvais';
  const url = absoluteUrl(routePath(locale, route.slug));
  const bookingHref = `${path(locale, 'booking')}?from=${route.from}&to=${route.to}`;

  const steps = [
    {
      title: detail.stepPickupTitle,
      text: isAirportPickup ? detail.stepPickupAirport : detail.stepPickupCity,
    },
    { title: detail.stepDriveTitle, text: detail.stepDrive },
    {
      title: detail.stepArrivalTitle,
      text: route.to === 'disney' ? detail.stepArrivalDisney : detail.stepArrivalOther,
    },
    { title: detail.stepReturnTitle, text: detail.stepReturn },
  ];

  const stats = [
    { value: formatDuration(dict, route.durationMin), label: detail.statDuration },
    { value: formatDistance(dict, route.distanceKm), label: detail.statDistance },
    { value: detail.statHoursValue, label: detail.statHours },
    {
      value: cheapest != null ? `${dict.common.from} ${cheapest} €` : detail.statPriceValue,
      label: detail.statPrice,
    },
  ];

  return (
    <>
      <SiteHeader locale={locale} active="routes" />
      <JsonLd data={serviceJsonLd({ name: title, description: lead, url, price: cheapest, image: transferImageSrc(route.image) })} />
      <JsonLd data={faqJsonLd(detail.faq.map((item) => ({ q: fill(item.q, { from: fromName, to: toName }), a: item.a })))} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, url: absoluteUrl(path(locale, 'home')) },
          { name: detail.breadcrumb, url: absoluteUrl(path(locale, 'routes')) },
          { name: `${fromName} ↔ ${toName}`, url },
        ])}
      />

      <main id="contenu">
        <section className="relative min-h-[320px] overflow-hidden bg-ink sm:min-h-[420px]">
          <TransferPhoto
            image={route.image}
            alt={imageAlt}
            priority
            className="absolute inset-0 min-h-[320px] sm:min-h-[420px]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(58_46_36_/_0.15)_0%,rgb(58_46_36_/_0.72)_100%)]" />
          <div className="relative mx-auto max-w-[1200px] px-6 pb-12 pt-10 sm:pb-16 sm:pt-16">
            <div className="mb-3 text-[13px] font-bold text-cream-soft">
              <Link href={path(locale, 'routes')} className="text-cream-soft no-underline hover:text-gold">
                {detail.breadcrumb}
              </Link>
              {' '}
              › {fromName} ↔ {toName}
            </div>
            <h1 className="m-0 mb-3.5 max-w-[760px] font-display text-[32px] leading-tight text-surface sm:text-[44px]">
              {title}
            </h1>
            <p className="m-0 mb-6 max-w-[680px] text-[17px] leading-[1.7] text-line">{lead}</p>
            <div className="flex flex-wrap gap-3.5">
              <PrimaryLink href={bookingHref} className="!px-7 !py-3.5 !text-base">
                {detail.ctaBook}
              </PrimaryLink>
              <ExternalButton
                href={whatsappLink(fill(dict.prices.whatsappRoute, { from: fromName, to: toName }))}
                variant="goldOutline"
                className="!px-6 !py-3 !text-base"
              >
                {dict.common.whatsappQuote}
              </ExternalButton>
            </div>
          </div>
        </section>

        <Container className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line bg-surface p-5 text-center">
              <div className="font-display text-[26px] text-brand">{stat.value}</div>
              <div className="text-[13px] font-bold text-ink-soft">{stat.label}</div>
            </div>
          ))}
        </Container>

        <section className="border-y border-line bg-sand">
          <Container className="grid items-start gap-10 py-14 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <h2 className="m-0 mb-3 font-display text-[28px]">{detail.livePriceTitle}</h2>
              <p className="m-0 mb-6 text-[15px] leading-[1.7] text-ink-soft">{lead}</p>
              <div className="rounded-[18px] bg-surface p-6">
                <div className="mb-2.5 text-base font-extrabold">{detail.priceBoxTitle}</div>
                <div className="flex flex-col gap-2 text-sm text-ink-soft">
                  {detail.priceFactors.map((factor, index) => (
                    <span key={factor}>
                      {['👤', '🧳', '🚘'][index]} {factor}
                    </span>
                  ))}
                </div>
                <PrimaryLink href={bookingHref} className="mt-4 !px-[22px] !py-[11px] !text-sm">
                  {detail.priceBoxCta}
                </PrimaryLink>
              </div>
            </div>
            <PriceCalculator
              dict={dict}
              rates={rates}
              night={night}
              vehicles={vehicles}
              bookingHref={path(locale, 'booking')}
              initialFrom={route.from}
              initialTo={route.to}
            />
          </Container>
        </section>

        <Container className="grid gap-12 py-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="m-0 mb-4 font-display text-[28px]">{detail.howTitle}</h2>
            <div className="flex flex-col gap-[18px] text-[15px] leading-[1.7] text-ink-soft">
              {steps.map((step) => (
                <p key={step.title} className="m-0">
                  <strong className="text-ink">{step.title}</strong> — {step.text}
                </p>
              ))}
            </div>
          </div>
        </Container>

        {rows.length > 0 ? (
          <section className="border-y border-line bg-surface">
            <div className="mx-auto max-w-[900px] px-6 py-14">
              <h2 className="m-0 mb-6 font-display text-[28px]">
                {fill(detail.tableTitle, { from: fromName, to: toName })}
              </h2>
              <RateTable
                dict={dict}
                rows={rows}
                caption={`${fromName} ↔ ${toName}`}
                hrefFor={(row, trip) =>
                  `${path(locale, 'booking')}?from=${route.from}&to=${route.to}&pax=${row.pax}&trip=${trip}`
                }
              />
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="py-14">
            <Container>
              <h2 className="m-0 mb-6 font-display text-[28px]">{detail.relatedTitle}</h2>
              <div className="grid gap-5 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={routePath(locale, item.slug)}
                    className="overflow-hidden rounded-[18px] border border-line bg-surface no-underline hover:border-brand hover:shadow-card"
                  >
                    <TransferPhoto
                      image={item.image}
                      alt={fill(detail.imageAlt, { from: dict.zones[item.from], to: dict.zones[item.to] })}
                      className="aspect-[16/9]"
                    />
                    <div className="flex flex-col gap-1.5 p-5">
                      <div className="font-display text-lg text-ink">
                        {dict.zones[item.from]} ↔ {dict.zones[item.to]}
                      </div>
                      <div className="text-sm font-bold text-ink-soft">
                        {formatDuration(dict, item.durationMin)} · {formatDistance(dict, item.distanceKm)}
                      </div>
                      <div className="text-sm font-extrabold text-brand">{dict.routes.see}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <section className="bg-cream">
          <div className="mx-auto max-w-[900px] px-6 py-14">
            <h2 className="m-0 mb-6 font-display text-[28px]">
              {fill(detail.faqTitle, { from: fromName, to: toName })}
            </h2>
            <div className="flex flex-col gap-3">
              {detail.faq.map((item) => (
                <details key={item.q} className="rounded-[14px] border border-line bg-surface px-5 py-4">
                  <summary className="cursor-pointer text-base font-extrabold">
                    {fill(item.q, { from: fromName, to: toName })}
                  </summary>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-ink-soft">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3.5">
              <PrimaryLink href={bookingHref}>{detail.ctaBook}</PrimaryLink>
              <ExternalButton href={site.phoneHref} variant="outline">
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
