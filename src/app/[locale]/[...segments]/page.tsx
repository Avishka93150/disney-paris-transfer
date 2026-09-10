import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AboutPage } from '@/components/pages/AboutPage';
import { BookingPage } from '@/components/pages/BookingPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { FaqPage } from '@/components/pages/FaqPage';
import { PricesPage } from '@/components/pages/PricesPage';
import { RouteDetailPage } from '@/components/pages/RouteDetailPage';
import { RoutesPage } from '@/components/pages/RoutesPage';
import { getRates } from '@/lib/db';
import { fill, formatDuration, getDictionary } from '@/lib/i18n';
import { LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { PAGE_KEYS, SEGMENTS, type PageKey } from '@/lib/i18n/routes';
import { ROUTE_PAGES, findRoutePage, startingPrice, type RoutePage as RoutePageData } from '@/lib/prices';
import { pageMetadata } from '@/lib/seo';

type Params = { locale: string; segments: string[] };
type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Router for the public pages.
 *
 * URL segments are translated (`/en/prices`, `/es/precios`, `/ja/prices`),
 * which no static folder structure can express: this file maps them back using
 * the `SEGMENTS` table, the single source of truth.
 */
type Resolved =
  | { kind: 'page'; locale: Locale; page: PageKey }
  | { kind: 'route'; locale: Locale; route: RoutePageData };

function resolve(localeParam: string, segments: string[]): Resolved | null {
  if (!isLocale(localeParam)) return null;
  const locale = localeParam;

  const [first, second, ...extra] = segments;
  if (!first || extra.length > 0) return null;

  const page = PAGE_KEYS.find((key) => key !== 'home' && SEGMENTS[key][locale] === first);
  if (!page) return null;

  if (second === undefined) return { kind: 'page', locale, page };

  // Only route pages have a further level.
  if (page !== 'routes') return null;
  const route = findRoutePage(second);
  return route ? { kind: 'route', locale, route } : null;
}

export function generateStaticParams(): Params[] {
  const params: Params[] = [];

  for (const locale of LOCALES) {
    for (const page of PAGE_KEYS) {
      if (page === 'home') continue;
      params.push({ locale, segments: [SEGMENTS[page][locale]] });
    }
    for (const route of ROUTE_PAGES) {
      params.push({ locale, segments: [SEGMENTS.routes[locale], route.slug] });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, segments } = await params;
  const resolved = resolve(locale, segments);
  if (!resolved) return {};

  if (resolved.kind === 'page') {
    return pageMetadata({ locale: resolved.locale, page: resolved.page });
  }

  const dict = getDictionary(resolved.locale);
  const { route } = resolved;
  const values = {
    from: dict.zones[route.from],
    to: dict.zones[route.to],
    price: startingPrice(route.from, route.to, getRates()) ?? '—',
    duration: formatDuration(dict, route.durationMin).replace(`${dict.common.approx} `, ''),
  };

  return pageMetadata({
    locale: resolved.locale,
    page: 'routes',
    slug: route.slug,
    title: fill(dict.seo.routeDetail.title, values),
    description: fill(dict.seo.routeDetail.description, values),
  });
}

export default async function CatchAllPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale, segments } = await params;
  const resolved = resolve(locale, segments);
  if (!resolved) notFound();

  if (resolved.kind === 'route') {
    return <RouteDetailPage locale={resolved.locale} route={resolved.route} />;
  }

  switch (resolved.page) {
    case 'routes':
      return <RoutesPage locale={resolved.locale} />;
    case 'prices':
      return <PricesPage locale={resolved.locale} />;
    case 'about':
      return <AboutPage locale={resolved.locale} />;
    case 'faq':
      return <FaqPage locale={resolved.locale} />;
    case 'contact':
      return <ContactPage locale={resolved.locale} />;
    case 'booking':
      // The only page that reads the query string (pre-fill + return from
      // Stripe): `searchParams` is awaited in this branch only, so the other
      // pages stay statically rendered.
      return <BookingPage locale={resolved.locale} searchParams={await searchParams} />;
    default:
      notFound();
  }
}

/** Safety net for a cache invalidation that was missed. */
export const revalidate = 3600;
