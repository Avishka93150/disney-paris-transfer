import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/ui';
import { fill, formatDistance, formatDuration, getDictionary, routeDescription } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { path, routePath } from '@/lib/i18n/routes';
import { ROUTE_PAGES, startingPrice } from '@/lib/prices';
import { getRates } from '@/lib/db';
import { TransferPhoto } from '@/components/TransferPhoto';
import { site } from '@/lib/site';

/** Liste de tous les trajets — repris de `project/Trajets.dc.html`. */
export function RoutesPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const rates = getRates();

  return (
    <>
      <SiteHeader locale={locale} active="routes" />

      <main id="contenu">
        <PageHero title={dict.routes.h1} lead={dict.routes.lead} />

        <section className="mx-auto flex max-w-[1200px] flex-col gap-5 px-6 py-14">
          {ROUTE_PAGES.map((route) => {
            const fromName = dict.zones[route.from];
            const toName = dict.zones[route.to];
            const cheapest = startingPrice(route.from, route.to, rates);
            return (
              <article
                key={route.slug}
                className="grid overflow-hidden rounded-[18px] border border-line bg-surface lg:grid-cols-[220px_1fr_auto]"
              >
                <TransferPhoto
                  image={route.image}
                  alt={fill(dict.routeDetail.imageAlt, { from: fromName, to: toName })}
                  className="aspect-[16/10] min-h-[160px] lg:aspect-auto lg:min-h-full"
                />
                <div className="flex flex-col justify-center gap-2 p-6">
                  <h2 className="m-0 font-display text-[22px]">
                    {fromName} ↔ {toName}
                  </h2>
                  <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
                    {routeDescription(dict, route.slug, fromName, toName)}
                  </p>
                  <div className="flex flex-wrap gap-5 text-sm font-bold text-ink-soft">
                    <span>🕐 {formatDuration(dict, route.durationMin)}</span>
                    <span>📍 {formatDistance(dict, route.distanceKm)}</span>
                    {cheapest != null ? (
                      <span className="text-brand">
                        {dict.common.from} {cheapest} €
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center p-6">
                  <Link
                    href={routePath(locale, route.slug)}
                    className="whitespace-nowrap rounded-full bg-brand px-5 py-[11px] text-center text-sm font-extrabold text-surface no-underline hover:bg-brand-dark"
                  >
                    {dict.routes.see}
                  </Link>
                </div>
              </article>
            );
          })}

          <p className="mb-0 mt-4 text-center text-[15px] text-ink-soft">
            {dict.routes.otherLead}{' '}
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold"
            >
              {dict.routes.otherLink}
            </a>
          </p>

          <p className="m-0 text-center text-[15px]">
            <Link href={path(locale, 'prices')} className="font-extrabold">
              {dict.prices.h1}
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
