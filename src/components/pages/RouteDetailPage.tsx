import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Container, ExternalButton, JsonLd, PhotoPlaceholder, PrimaryLink } from '@/components/ui';
import { getRates } from '@/lib/db';
import { fill, formatDistance, formatDuration, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { path, routePath } from '@/lib/i18n/routes';
import { collapseTiers, findRate, startingPrice, type RoutePage as RoutePageData } from '@/lib/prices';
import { faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { absoluteUrl, site, whatsappLink } from '@/lib/site';

/**
 * SEO-optimised route page — carried over from
 * `project/TransfertCDGDisney.dc.html` and applied to every connection in
 * `ROUTE_PAGES`, as asked for during the design phase.
 */
export function RouteDetailPage({ locale, route }: { locale: Locale; route: RoutePageData }) {
  const dict = getDictionary(locale);
  const detail = dict.routeDetail;
  const rates = getRates();

  const fromName = dict.zones[route.from];
  const toName = dict.zones[route.to];
  const title = fill(detail.h1, { from: fromName, to: toName });
  const lead = detail.lead[route.slug] ?? dict.routes.descriptions[route.slug] ?? '';

  const rate = findRate(route.from, route.to, rates);
  const rows = rate ? collapseTiers(rate) : [];
  const cheapest = startingPrice(route.from, route.to, rates);

  const isAirportPickup = route.from === 'cdg' || route.from === 'orly' || route.from === 'beauvais';
  const url = absoluteUrl(routePath(locale, route.slug));

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
    { value: detail.statPriceValue, label: detail.statPrice },
  ];

  return (
    <>
      <SiteHeader locale={locale} active="routes" />
      <JsonLd
        data={serviceJsonLd({ name: title, description: lead, url, price: cheapest })}
      />
      <JsonLd data={faqJsonLd(detail.faq.map((item) => ({ q: fill(item.q, {}), a: item.a })))} />

      <main id="contenu">
        <section className="bg-sand px-6 py-14">
          <Container className="px-0">
            <div className="mb-3 text-[13px] font-bold text-ink-mute">
              <Link href={path(locale, 'routes')} className="text-ink-mute no-underline">
                {detail.breadcrumb}
              </Link>{' '}
              › {fromName} ↔ {toName}
            </div>
            <h1 className="m-0 mb-3.5 font-display text-[32px] leading-tight sm:text-[40px]">
              {title}
            </h1>
            <p className="m-0 mb-6 max-w-[680px] text-[17px] leading-[1.7] text-ink-soft">{lead}</p>
            <div className="flex flex-wrap gap-3.5">
              <PrimaryLink href={path(locale, 'booking')} className="!px-7 !py-3.5 !text-base">
                {detail.ctaBook}
              </PrimaryLink>
              <ExternalButton
                href={whatsappLink(
                  fill(dict.prices.whatsappRoute, { from: fromName, to: toName }),
                )}
                variant="outline"
                className="!px-6 !py-3 !text-base"
              >
                {dict.common.whatsappQuote}
              </ExternalButton>
            </div>
          </Container>
        </section>

        <Container className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-surface p-5 text-center"
            >
              <div className="font-display text-[26px] text-brand">{stat.value}</div>
              <div className="text-[13px] font-bold text-ink-soft">{stat.label}</div>
            </div>
          ))}
        </Container>

        <Container className="grid gap-12 pb-14 pt-6 lg:grid-cols-[1.3fr_1fr]">
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

          <div className="flex flex-col gap-4">
            <PhotoPlaceholder label={detail.photo} className="rounded-[18px]" />
            <div className="rounded-[18px] bg-sand p-6">
              <div className="mb-2.5 text-base font-extrabold">{detail.priceBoxTitle}</div>
              <div className="flex flex-col gap-2 text-sm text-ink-soft">
                {detail.priceFactors.map((factor, index) => (
                  <span key={factor}>
                    {['👤', '🧳', '🚘'][index]} {factor}
                  </span>
                ))}
              </div>
              <PrimaryLink
                href={path(locale, 'booking')}
                className="mt-4 !px-[22px] !py-[11px] !text-sm"
              >
                {detail.priceBoxCta}
              </PrimaryLink>
            </div>
          </div>
        </Container>

        {/* Grille tarifaire de la liaison, si elle figure au barème. */}
        {rows.length > 0 ? (
          <section className="border-y border-line bg-surface">
            <div className="mx-auto max-w-[900px] px-6 py-14">
              <h2 className="m-0 mb-6 font-display text-[28px]">
                {fill(detail.tableTitle, { from: fromName, to: toName })}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse overflow-hidden rounded-xl border border-line text-sm">
                  <thead>
                    <tr className="bg-sand text-left">
                      <th className="px-3.5 py-2.5 font-extrabold">{dict.prices.colPax}</th>
                      <th className="px-3.5 py-2.5 font-extrabold">{dict.prices.colOneWay}</th>
                      <th className="px-3.5 py-2.5 font-extrabold">{dict.prices.colRoundTrip}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.tier} className="border-t border-line-strong">
                        <td className="px-3.5 py-2 font-bold">{row.tier}</td>
                        <td className="px-3.5 py-2 font-extrabold text-brand">{row.ow} €</td>
                        <td className="px-3.5 py-2 font-bold text-ink-soft">{row.rt} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-cream">
          <div className="mx-auto max-w-[900px] px-6 py-14">
            <h2 className="m-0 mb-6 font-display text-[28px]">
              {fill(detail.faqTitle, { from: fromName, to: toName })}
            </h2>
            <div className="flex flex-col gap-3">
              {detail.faq.map((item) => (
                <details
                  key={item.q}
                  className="rounded-[14px] border border-line bg-surface px-5 py-4"
                >
                  <summary className="cursor-pointer text-base font-extrabold">{item.q}</summary>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-ink-soft">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3.5">
              <PrimaryLink href={path(locale, 'booking')}>{detail.ctaBook}</PrimaryLink>
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
