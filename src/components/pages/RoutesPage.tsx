import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/ui';
import { formatDistance, formatDuration, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { path, routePath } from '@/lib/i18n/routes';
import { ROUTE_PAGES } from '@/lib/prices';
import { site } from '@/lib/site';

/** Liste de tous les trajets — repris de `project/Trajets.dc.html`. */
export function RoutesPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} active="routes" />

      <main id="contenu">
        <PageHero title={dict.routes.h1} lead={dict.routes.lead} />

        <section className="mx-auto flex max-w-[1200px] flex-col gap-5 px-6 py-14">
          {ROUTE_PAGES.map((route) => (
            <div
              key={route.slug}
              className="grid items-center gap-6 rounded-[18px] border border-line bg-surface p-7 lg:grid-cols-[1.4fr_1fr_auto]"
            >
              <div>
                <h2 className="m-0 mb-2 font-display text-[22px]">
                  {dict.zones[route.from]} ↔ {dict.zones[route.to]}
                </h2>
                <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
                  {dict.routes.descriptions[route.slug]}
                </p>
              </div>

              <div className="flex gap-5 text-sm font-bold text-ink-soft">
                <span>🕐 {formatDuration(dict, route.durationMin)}</span>
                <span>📍 {formatDistance(dict, route.distanceKm)}</span>
              </div>

              <Link
                href={routePath(locale, route.slug)}
                className="whitespace-nowrap rounded-full bg-brand px-5 py-[11px] text-center text-sm font-extrabold text-surface no-underline hover:bg-brand-dark"
              >
                {dict.routes.see}
              </Link>
            </div>
          ))}

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
