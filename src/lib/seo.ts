import type { Metadata } from 'next';
import { getDictionary } from './i18n';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './i18n/config';
import { type PageKey, path } from './i18n/routes';
import { absoluteUrl, site } from './site';

/**
 * Metadata for a public page: title, description, canonical and `hreflang` to
 * the 6 other languages (that last part is what stops Google treating the
 * translated versions as duplicate content).
 */
export function pageMetadata({
  locale,
  page,
  slug,
  title,
  description,
}: {
  locale: Locale;
  page: PageKey;
  slug?: string;
  title?: string;
  description?: string;
}): Metadata {
  const dict = getDictionary(locale);
  const seo = dict.seo[page === 'home' ? 'home' : page];
  const rest = slug ? [slug] : [];

  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((code) => [code, absoluteUrl(path(code, page, ...rest))]),
  );
  languages['x-default'] = absoluteUrl(path(DEFAULT_LOCALE, page, ...rest));

  const resolvedTitle = title ?? seo.title;
  const resolvedDescription = description ?? seo.description;
  const canonical = absoluteUrl(path(locale, page, ...rest));

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: site.name,
      url: canonical,
      title: resolvedTitle,
      description: resolvedDescription,
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}

/** Business card, injected on the home page. */
export function localBusinessJsonLd(locale: Locale) {
  const dict = getDictionary(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#business`,
    name: site.name,
    description: dict.footer.blurb,
    url: absoluteUrl(path(locale, 'home')),
    telephone: site.phone,
    email: site.email,
    priceRange: '€€',
    areaServed: [
      { '@type': 'Place', name: 'Paris' },
      { '@type': 'Place', name: 'Disneyland Paris' },
      { '@type': 'Place', name: 'Île-de-France' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  url,
  price,
}: {
  name: string;
  description: string;
  url: string;
  price: number | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Airport transfer',
    name,
    description,
    url,
    provider: { '@type': 'LocalBusiness', '@id': `${site.url}/#business`, name: site.name },
    areaServed: { '@type': 'Place', name: 'Île-de-France' },
    ...(price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: String(price),
            priceCurrency: 'EUR',
            url,
          },
        }
      : {}),
  };
}
